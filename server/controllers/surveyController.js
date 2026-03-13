import Survey from "../models/survey.js";
import SurveyPurpose from "../models/surveyPurpose.js";
import SurveyRow from "../models/surveyRows.js";
import History from "../models/history.js";
import Branch from "../models/branch.js";
import { isValidObjectId, calculateReducedLevel } from "../helper/index.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";

const checkSurveyExists = async (req, res, next) => {
  try {
    const survey = await Survey.findOne({
      isSurveyFinish: false,
      createdBy: req?.user?.userId,
    });

    res.status(200).json({
      success: true,
      message: `${survey ? "Active survey found" : "No active survey found"}`,
      survey,
    });
  } catch (err) {
    next(err);
  }
};

const getAllSurvey = async (req, res, next) => {
  try {
    const {
      user: { userId },
      query: { status, project, purpose, type, rootBranch },
    } = req;

    const filter = {
      createdBy: userId,
      deleted: false,
      "branchDetails.isBranch": false,
    };

    // 🔹 Flexible filters
    if (status === "active") filter.isSurveyFinish = false;
    else if (status === "finished") filter.isSurveyFinish = true;

    if (project) filter.project = project;
    if (type) filter.type = type;
    if (rootBranch) {
      filter["branchDetails.isBranch"] = true;
      filter["branchDetails.rootBranch"] = rootBranch;
    }

    const surveys = await Survey.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "purposes",
        match: { deleted: false },
        populate: {
          path: "rows",
          match: { deleted: false },
          options: { sort: { createdAt: 1 } },
        },
      })
      // .populate('createdBy', 'name email')
      .lean();

    res.status(200).json({
      success: true,
      count: surveys.length,
      message:
        surveys.length > 0
          ? `${surveys.length} survey${surveys.length > 1 ? "s" : ""} found`
          : "No surveys found",
      surveys,
    });
  } catch (err) {
    next(err);
  }
};

const createSurvey = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      user: { userId },
      body: {
        project,
        purpose,
        instrumentNo,
        reducedLevel,
        backSight,
        remark,
        chainageMultiple,
        separator,
        agreementNo,
        contractor,
        department,
        division,
        subDivision,
        section,
        consultant,
        client,
        scheduledDate,
        engineerSurveyor,
        assistant1,
        assistant2,
        assistant3,
        assistant4,
        assistant5,
      },
    } = req;

    // 🔹 Input validation
    if (
      !project ||
      !purpose ||
      !instrumentNo ||
      !reducedLevel ||
      !backSight ||
      !chainageMultiple ||
      !separator ||
      !agreementNo ||
      !contractor
    ) {
      throw createHttpError(
        400,
        "All fields (Project, Purpose, Instrument No, Reduced Level, Back Sight, Chainage Multiple, Agreement No, Contractor, department) are required",
      );
    }

    const isPublicProject =
      department !== undefined &&
      department !== null &&
      department !== "" &&
      division !== undefined &&
      division !== null &&
      division !== "" &&
      subDivision !== undefined &&
      subDivision !== null &&
      subDivision !== "" &&
      section !== undefined &&
      section !== null &&
      section !== "";

    const isPrivateProject =
      consultant !== undefined &&
      consultant !== null &&
      consultant !== "" &&
      client !== undefined &&
      client !== null &&
      client !== "";

    if (!isPublicProject && !isPrivateProject) {
      throw createHttpError(
        400,
        "Please provide either Administrative units or External parties",
      );
    }

    // 🔹 Create Survey
    const survey = await Survey.create(
      [
        {
          project,
          createdBy: userId,
          instrumentNo,
          chainageMultiple,
          separator,
          reducedLevel: Number(reducedLevel).toFixed(3),
          agreementNo,
          status: scheduledDate ? "Scheduled" : "Active",
          scheduledDate: scheduledDate || null,
          contractor,
          ...(isPublicProject
            ? { department, division, subDivision, section }
            : {}),
          ...(isPrivateProject ? { consultant, client } : {}),
          engineerSurveyor,
          assistant1,
          assistant2,
          assistant3,
          assistant4,
          assistant5,
        },
      ],
      { session },
    );

    const surveyDoc = survey[0];

    // 🔹 Create Purpose
    const purposeDoc = await SurveyPurpose.create(
      [
        {
          surveyId: surveyDoc._id,
          createdBy: userId,
          type: purpose,
          isSurveyFinish: false,
        },
      ],
      { session },
    );

    const purposeObj = purposeDoc[0];

    // 🔹 Create First Row (TBM)
    const row = await SurveyRow.create(
      [
        {
          surveyId: surveyDoc._id,
          purposeId: purposeObj._id,
          createdBy: userId,
          type: "Instrument setup",
          backSight: Number(backSight).toFixed(3),
          remarks: [remark || "TBM - 1"],
          reducedLevels: [Number(reducedLevel).toFixed(3)],
          heightOfInstrument: Number(
            Number(reducedLevel) + Number(backSight),
          ).toFixed(3),
        },
      ],
      { session },
    );

    // 🔹 Optionally create a History log
    await History.create(
      [
        {
          entityType: "Survey",
          entityId: surveyDoc._id,
          action: "Create",
          notes: `Survey created with purpose ${purpose}`,
          performedBy: userId,
        },
      ],
      { session },
    );

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Survey created successfully",
      survey: {
        ...surveyDoc.toObject(),
        purposeId: purposeObj._id,
        purposes: [
          {
            ...purposeObj.toObject(),
            rows: [row[0]],
          },
        ],
      },
    });
  } catch (err) {
    // ❌ Rollback if anything fails
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

const getSurvey = async (req, res, next) => {
  try {
    const {
      user: { userId },
      params: { id },
    } = req;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid survey ID",
      });
    }

    // Find active (non-deleted) survey
    const survey = await Survey.findOne({
      _id: id,
      deleted: false,
      createdBy: userId,
    }).populate({
      path: "purposes",
      match: { deleted: false },
      populate: {
        path: "rows",
        match: { deleted: false },
        options: { sort: { _id: 1, createdAt: 1 } },
      },
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found or has been deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Survey retrieved successfully",
      survey,
    });
  } catch (err) {
    next(err);
  }
};

const updateSurvey = () => {};
const deleteSurvey = async (req, res, next) => {
  try {
    const {
      user: { userId },
      params: { id },
    } = req;

    if (!isValidObjectId(id)) {
      throw createHttpError(400, "Invalid survey ID");
    }

    const survey = await Survey.findOne({
      _id: id,
      deleted: false,
      createdBy: userId,
    });

    if (!survey) {
      throw createHttpError(404, "Survey not found or has been deleted");
    }

    survey.status = "Deleted";
    survey.deleted = true;
    survey.deletedAt = new Date();
    survey.deletedBy = userId;
    await survey.save();

    res.status(200).json({
      success: true,
      message: "Survey deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const createSurveyRow = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      params: { id },
      user: { userId },
      body: {
        type,
        backSight,
        intermediateSight,
        foreSight,
        chainage,
        roadWidth,
        spacing,
        offsets,
        reducedLevels,
        remark,
      },
    } = req;

    // 🔹 Validate purpose
    if (!id) throw createHttpError(400, "Purpose ID is required");

    const purpose = await SurveyPurpose.findOne({ _id: id, deleted: false })
      .populate({
        path: "surveyId",
        match: { deleted: false },
        populate: {
          path: "purposes",
          match: { deleted: false },
          populate: {
            path: "rows",
            match: { deleted: false },
          },
        },
      })
      .populate({
        path: "rows",
        match: { deleted: false },
      })
      .session(session);

    if (!purpose) throw createHttpError(404, "Purpose not found");
    if (purpose.isPurposeFinish)
      throw createHttpError(409, `${purpose.type} already completed`);

    const survey = purpose.surveyId;
    if (survey.isSurveyFinish)
      throw createHttpError(409, "Survey is already finished");
    if (!survey || survey.deleted)
      throw createHttpError(404, "Survey not found or has been deleted");

    if (type === "Chainage") {
      const isChainageExist = await SurveyRow.findOne({
        purposeId: id,
        chainage: chainage?.trim(),
        deleted: false,
      });

      if (isChainageExist) throw createHttpError(409, "Chainage already exist");
    }

    const isProposal = purpose.phase === "Proposal";
    const isSurveyPaused = purpose.status === "Paused";
    let isLastReading = false;

    // 🔹 Validate type and required fields (same as before)
    const types = {
      Chainage: ["chainage", "roadWidth", "spacing", "offsets"],
      CP: ["foreSight", "backSight"],
      TBM: ["intermediateSight"],
    };

    types["Chainage"].push(isProposal ? "reducedLevels" : "intermediateSight");

    if (!type || !Object.keys(types).includes(type))
      throw createHttpError(400, `Invalid or missing row type: ${type}`);

    const missing = types[type].filter(
      (f) =>
        !req.body[f] || (Array.isArray(req.body[f]) && !req.body[f].length),
    );
    if (missing.length)
      throw createHttpError(
        400,
        `Missing required fields: ${missing.join(", ")}`,
      );

    // 🔹 Remarks logic
    const remarks = [];
    if (type === "Chainage") {
      remarks.push(...remark);
    } else {
      remarks.push(remark);
    }

    const initialSurvey = survey.purposes?.find(
      (p) => p.type === "Initial Level",
    );

    if (isProposal) {
      const filteredInitialSurvey =
        initialSurvey?.rows?.filter((entry) => entry.type === "Chainage") || [];

      const totalReadings = filteredInitialSurvey.length;
      const currentIndex = filteredInitialSurvey.findIndex(
        (entry) => entry.chainage === chainage,
      );

      if (currentIndex === -1) {
        throw new Error(`Chainage "${chainage}" not found in initial survey`);
      }

      if (currentIndex === totalReadings - 1) {
        isLastReading = true;
      }
    }

    const newReading = {
      type,
      purposeId: purpose._id,
      createdBy: userId,
      chainage: type === "Chainage" ? chainage : undefined,
      spacing: type === "Chainage" ? spacing : undefined,
      roadWidth: roadWidth ? Number(roadWidth).toFixed(3) : undefined,

      backSight: backSight ? Number(backSight).toFixed(3) : undefined,
      foreSight: foreSight ? Number(foreSight).toFixed(3) : undefined,

      reducedLevels: isProposal
        ? (reducedLevels || []).map((n) => Number(n).toFixed(3))
        : [],

      intermediateSight:
        type === "Chainage"
          ? (intermediateSight || []).map((n) => Number(n).toFixed(3))
          : intermediateSight
            ? [intermediateSight]
            : undefined,

      offsets: (offsets || []).map((n) => Number(n).toFixed(3)),

      remarks,
    };

    if (!isProposal) {
      const { hi, rl } = calculateReducedLevel(survey, newReading, purpose._id);

      newReading.reducedLevels = rl;
      newReading.heightOfInstrument = hi;
    }

    let newRow = null;

    if (isSurveyPaused) {
      const lastRow = purpose.rows[purpose.rows?.length - 1];

      if (lastRow.type !== "CP") {
        throw createHttpError(
          400,
          "Invalid state: last row must be CP when resuming a paused survey.",
        );
      }

      newRow = await SurveyRow.findByIdAndUpdate(
        lastRow._id,
        {
          backSight: backSight ? Number(backSight).toFixed(3) : undefined,
          foreSight: foreSight ? Number(foreSight).toFixed(3) : undefined,
          reducedLevels: newReading.reducedLevels,
          heightOfInstrument: newReading.heightOfInstrument,
          remarks,
        },
        { new: true, session },
      );

      if (!newRow) {
        throw createHttpError(
          500,
          "Failed to update CP row while resuming survey.",
        );
      }

      purpose.status = "Active";
      await purpose.save({ session });
    } else {
      // Create new row
      const rows = await SurveyRow.create([newReading], { session });
      newRow = rows[0];
    }

    if (isLastReading) {
      purpose.status = "Finished";
      purpose.isPurposeFinish = true;
      purpose.purposeFinishDate = new Date();

      await purpose.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    const plainPurpose = purpose.toObject();

    res.status(201).json({
      success: true,
      message: "Survey row added successfully",
      row: newRow,
      purpose: {
        ...plainPurpose,
        rows: [...plainPurpose.rows, newRow],
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

const getSurveyPurpose = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 🔹 Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid purpose ID",
      });
    }

    // 🔹 Find the specific survey purpose with related data
    const purpose = await SurveyPurpose.findOne({ _id: id, deleted: false })
      .populate({
        path: "surveyId",
        match: { deleted: false },
        populate: [
          {
            path: "purposes",
            match: { deleted: false },
            populate: {
              path: "rows",
              match: { deleted: false },
              options: { sort: { createdAt: 1 } },
            },
          },
          {
            path: "branchDetails.currentBranch",
            match: { deleted: false },
            populate: {
              path: "purposes",
              match: { deleted: false },
            },
          },
          {
            path: "parentBranch",
            match: { deleted: false },
          },
          {
            path: "rootBranch",
            match: { deleted: false },
            populate: [
              {
                path: "surveyId",
                match: { deleted: false },
              },
              {
                path: "purposes",
                match: { deleted: false },
                populate: {
                  path: "rows",
                  match: { deleted: false },
                  options: { sort: { createdAt: 1 } },
                },
              },
            ],
          },
        ],
      })
      .populate({
        path: "rows",
        match: { deleted: false },
        options: { sort: { createdAt: 1 } },
      });

    if (!purpose) {
      return res.status(404).json({
        success: false,
        message: "Survey purpose not found or has been deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Survey purpose retrieved successfully",
      purpose,
    });
  } catch (err) {
    next(err);
  }
};

const getFieldBook = async (req, res, next) => {
  try {
    const {
      params: { id },
      user: { userId },
    } = req;

    // 🔹 Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid purpose ID",
      });
    }

    const purpose = await SurveyPurpose.findOne({ _id: id, deleted: false });

    if (!purpose) {
      return res.status(404).json({
        success: false,
        message: "Survey purpose not found or has been deleted",
      });
    }

    const survey = await Survey.findOne({
      _id: purpose.surveyId,
      createdBy: userId,
      deleted: false,
    })
      .populate({
        path: "purposes",
        match: { deleted: false, type: purpose.type },
        populate: {
          path: "rows",
          match: { deleted: false },
          options: { sort: { createdAt: 1 } },
        },
      })
      .lean();

    const branches = await Branch.find({
      deleted: false,
      rootBranch: purpose.surveyId,
    })
      .populate({
        path: "purposes",
        match: { deleted: false, type: purpose.type },
        populate: {
          path: "rows",
          match: { deleted: false },
          options: { sort: { createdAt: 1 } },
        },
      })
      .lean();

    res.status(200).json({
      success: true,
      message: "Survey purpose retrieved successfully",
      survey: {
        ...survey,
        branches,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createSurveyPurpose = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      params: { surveyId },
      user: { userId },
      body: {
        purpose,
        proposal,
        proposedLevel,
        reducedLevel,
        backSight,
        // lSection,
        // lsSlop,
        cSection,
        csSlop,
        csCamper,
      },
    } = req;

    // 🔹 Basic validation
    if (!purpose || !surveyId) {
      throw createHttpError(400, "Purpose and surveyId are required");
    }

    // 🔹 Proposal field validation (if proposal mode)
    if (proposal) {
      const requiredFields = [proposedLevel];
      // const requiredFields = [proposedLevel, lSection, lsSlop];

      // Check if any of the always-required fields are missing
      const missingRequired = requiredFields.some(
        (field) => field === undefined || field === null || field === "",
      );

      if (missingRequired) {
        throw createHttpError(400, "Missing required fields for proposal");
      }

      // Conditional validation for cross-section inputs
      const hasCsPair =
        cSection !== undefined &&
        cSection !== null &&
        cSection !== "" &&
        csSlop !== undefined &&
        csSlop !== null &&
        csSlop !== "";

      const hasCsCamper =
        csCamper !== undefined && csCamper !== null && csCamper !== "";

      if (!hasCsPair && !hasCsCamper) {
        throw createHttpError(
          400,
          "Please provide either (Cross section slop) or Cross section camper",
        );
      }
    } else {
      const requiredFields = [reducedLevel, backSight];

      const missingRequired = requiredFields.some(
        (field) => field === undefined || field === null || field === "",
      );

      if (missingRequired) {
        throw createHttpError(400, "Missing required fields for proposal");
      }
    }

    const type = proposal ? proposal : purpose;

    // 🔹 Fetch active survey
    const survey = await Survey.findOne({
      _id: surveyId,
      isSurveyFinish: false,
      deleted: false,
    })
      .populate({
        path: "purposes",
        match: { deleted: false },
        populate: [
          { path: "rows", match: { deleted: false } },
          { path: "relation", match: { deleted: false } },
        ],
      })
      .session(session);

    if (!survey) {
      throw createHttpError(404, "Active survey not found");
    }

    let relation = null;

    // 🔹 Check if purpose already exists
    const isPurposeExist = survey.purposes?.find((p) => p.type === type);
    if (isPurposeExist) {
      throw createHttpError(409, `Purpose "${type}" already exists`);
    }

    // 🔹 Check for duplicate proposal relation
    if (proposal) {
      const existingProposal = survey.purposes?.find(
        (p) => p.relation?.type === purpose && p.type === proposal,
      );

      if (existingProposal) {
        throw createHttpError(
          409,
          `A proposal between "${purpose}" and "${proposal}" already exists`,
        );
      }

      const isPurposeExist = survey.purposes?.find((p) => p.type === purpose);
      if (!isPurposeExist) {
        throw createHttpError(409, `There is no survey found width ${purpose}`);
      }

      relation = isPurposeExist._id;
    }

    // 🔹 Create purpose document
    const [purposeDoc] = await SurveyPurpose.create(
      [
        {
          surveyId,
          type,
          createdBy: userId,
          phase: proposal ? "Proposal" : "Actual",
          ...(proposal && {
            proposedLevel,
            // lSection,
            // lsSlop,
            cSection,
            csSlop,
            csCamper,
            relation,
          }),
        },
      ],
      { session },
    );

    if (!proposal) {
      // 🔹 Create First Reading (TBM)
      await SurveyRow.create(
        [
          {
            surveyId: survey._id,
            purposeId: purposeDoc._id,
            createdBy: userId,
            type: "Instrument setup",
            backSight: Number(backSight).toFixed(3),
            remarks: ["TBM - 1"],
            reducedLevels: [Number(reducedLevel).toFixed(3)],
            heightOfInstrument: Number(
              Number(reducedLevel) + Number(backSight),
            ).toFixed(3),
          },
        ],
        { session },
      );
    }

    // 🔹 Commit transaction
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Survey purpose created successfully",
      survey: {
        ...survey.toObject(),
        purposeId: purposeDoc._id,
        purposes: [...survey.purposes.map((p) => p.toObject()), purposeDoc],
      },
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

const getAllSurveyPurpose = async (req, res, next) => {
  try {
    const purposes = await SurveyPurpose.find({ deleted: false })
      .populate({
        path: "surveyId",
        match: { deleted: false },
      })
      .populate({
        path: "rows",
        match: { deleted: false },
        options: { sort: { createdAt: 1 } },
      })
      .populate({
        path: "history",
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!purposes || purposes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No survey purposes found",
      });
    }

    res.status(200).json({
      success: true,
      count: purposes.length,
      message: `${purposes.length} survey purpose${
        purposes.length > 1 ? "s" : ""
      } found`,
      purposes,
    });
  } catch (err) {
    next(err);
  }
};

const endSurveyPurpose = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      params: { id },
      query: { finalForesight, pls },
    } = req;

    // 🔹 Step 1: Find the purpose
    const purpose = await SurveyPurpose.findById(id).session(session);
    if (!purpose || purpose.deleted)
      throw createHttpError(404, "Survey purpose not found");

    // 🔹 Step 2: Check if already finished
    if (purpose.isPurposeFinish)
      throw createHttpError(400, "Purpose is already finished");

    // 🔹 Step 3: Ensure its parent survey exists and is active
    const survey = await Survey.findById(purpose.surveyId).session(session);
    if (!survey || survey.deleted)
      throw createHttpError(404, "Parent survey not found");
    if (survey.isSurveyFinish)
      throw createHttpError(
        400,
        "Cannot finish purpose — survey already finished",
      );

    let parentBranch = null;

    if (purpose.phase === "Actual") {
      if (!finalForesight || !pls)
        throw createHttpError(400, "Missing required field");

      purpose.finalForesight = finalForesight;
      purpose.pls = pls;
    }

    // 🔹 Step 4: Mark purpose as finished
    purpose.status = "Finished";
    purpose.isPurposeFinish = true;
    purpose.purposeFinishDate = new Date();

    if (survey.branchDetails?.isBranch) {
      parentBranch = await Survey.findOne({
        _id: survey.branchDetails.parentBranch,
      })
        .populate("purposes")
        .session(session);

      if (!parentBranch || parentBranch.deleted)
        throw createHttpError(404, "Parent branch not found");

      if (
        String(survey.branchDetails.rootBranch) ===
        String(survey.branchDetails.parentBranch)
      ) {
        parentBranch.branchDetails.isBranchEnd = true;
        parentBranch.branchDetails.isBranchStart = false;
        parentBranch.branchDetails.branchStartedFrom = null;
        parentBranch.branchDetails.currentBranch = null;
      } else {
        await Survey.updateOne(
          {
            _id: survey.branchDetails.rootBranch,
          },
          {
            $set: {
              "branchDetails.currentBranch": survey.branchDetails.parentBranch,
            },
          },
          { session },
        );
      }

      const update = {
        $push: { finishedLevels: purpose.type },
      };

      if (purpose.type === "Initial Level") {
        update.$set = {
          isBranchEnd: true,
          endDate: new Date(),
        };
      }

      await Branch.updateOne({ surveyId: survey._id }, update, { session });

      await parentBranch.save({ session });
    }

    if (purpose.type === "Final Level") {
      survey.isSurveyFinish = true;
      survey.status = "Completed";
      survey.surveyFinishDate = new Date();

      await survey.save({ session });
    }

    await purpose.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Purpose ended successfully",
      purpose,
      parentBranch,
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

const endSurvey = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const survey = await Survey.findById(id).session(session);
    if (!survey || survey.deleted)
      throw createHttpError(404, "Survey not found");
    if (survey.isSurveyFinish)
      throw createHttpError(400, "Survey already finished");

    const pendingPurpose = await SurveyPurpose.findOne({
      surveyId: survey._id,
      isPurposeFinish: false,
      deleted: false,
    }).session(session);

    if (pendingPurpose) {
      throw createHttpError(
        400,
        `Cannot end survey — purpose "${pendingPurpose.type}" is still pending`,
      );
    }

    survey.isSurveyFinish = true;
    survey.status = "Completed";
    survey.surveyFinishDate = new Date();
    await survey.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Survey ended successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

const updateSurveyRow = async (req, res, next) => {
  try {
    const {
      params: { id, rowId },
      body: {
        type,
        chainage,
        intermediateSight,
        reducedLevels,
        offsets,
        foreSight,
        backSight,
        remark,
      },
    } = req;

    const isPurposeExist =
      await SurveyPurpose.findById(id).populate("surveyId");
    if (
      !isPurposeExist ||
      isPurposeExist?.deleted ||
      isPurposeExist?.surveyId?.deleted
    )
      throw createHttpError(404, "Purpose not found");

    const isRowExist = await SurveyRow.findById(rowId);
    if (!isRowExist || isRowExist?.deleted)
      throw createHttpError(404, "Reading not found");

    if (type === "Instrument setup") {
      isRowExist.backSight = Number(backSight).toFixed(3);
      isRowExist.heightOfInstrument = Number(
        Number(isRowExist.reducedLevels[0]) + Number(backSight),
      ).toFixed(3);

      isRowExist.remarks[0] = remark;
    }

    if (type === "TBM") {
      const prevIS = Number(isRowExist.intermediateSight?.[0] ?? 0);
      const prevRL = Number(isRowExist.reducedLevels?.[0] ?? 0);
      const newIS = Number(intermediateSight);

      const diff = prevIS - newIS;
      const newRL = prevRL + diff;

      isRowExist.reducedLevels[0] = newRL.toFixed(3);
      isRowExist.intermediateSight[0] = newIS.toFixed(3);
      isRowExist.remarks[0] = remark;
    }

    if (type === "CP") {
      const prevRL = Number(isRowExist.reducedLevels?.[0] ?? 0);
      const prevFS = Number(isRowExist.foreSight ?? 0);

      const prevRowHI = prevRL + prevFS;

      const newFS = Number(foreSight);
      const newBS = Number(backSight);

      const newRL = prevRowHI - newFS;
      const newHI = newRL + newBS;

      isRowExist.reducedLevels[0] = newRL.toFixed(3);
      isRowExist.heightOfInstrument = newHI.toFixed(3);
      isRowExist.backSight = newBS.toFixed(3);
      isRowExist.foreSight = newFS.toFixed(3);
      isRowExist.remarks[0] = remark;
    }

    if (type === "Chainage") {
      const prevRL = Number(isRowExist.reducedLevels?.[0] ?? 0);
      const prevIS = Number(isRowExist.intermediateSight?.[0] ?? 0);

      const prevRowHI = prevRL + prevIS;

      const isProposal = isPurposeExist.phase === "Proposal";

      isRowExist.chainage = chainage;

      isRowExist.reducedLevels = isProposal
        ? (reducedLevels || []).map((n) => Number(n).toFixed(3))
        : (intermediateSight || [])?.map((n) =>
            (Number(prevRowHI) - Number(n || 0)).toFixed(3),
          );

      isRowExist.intermediateSight = (intermediateSight || []).map((n) =>
        Number(n).toFixed(3),
      );

      isRowExist.offsets = (offsets || []).map((n) => Number(n).toFixed(3));

      isRowExist.remarks = remark;
    }

    await isRowExist.save();

    return res.status(200).json({
      success: true,
      row: isRowExist,
      message: "Row updated successfully",
    });
  } catch (err) {
    next(err);
  }
};
const deleteSurveyRow = async (req, res, next) => {
  try {
    const {
      params: { id, rowId },
    } = req;

    const isPurposeExist =
      await SurveyPurpose.findById(id).populate("surveyId");
    if (
      !isPurposeExist ||
      isPurposeExist?.deleted ||
      isPurposeExist?.surveyId?.deleted
    )
      throw createHttpError(404, "Purpose not found");

    const isRowExist = await SurveyRow.findById(rowId);
    if (!isRowExist || isRowExist?.deleted)
      throw createHttpError(404, "Reading not found");

    if (isRowExist.type === "Instrument setup")
      throw createHttpError(400, "You cannot delete the initial TBM");

    isRowExist.deleted = true;
    await isRowExist.save();

    return res.status(200).json({
      success: true,
      message: "Reading deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const pauseSurveyPurpose = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      params: { id },
      user: { userId },
      query: { foreSight, remark },
    } = req;

    if (!foreSight?.trim() || !remark?.trim()) {
      throw createHttpError(400, "Missing required fields");
    }

    // 1) Validate survey
    const survey = await SurveyPurpose.findById(id).session(session);
    if (!survey || survey.deleted) {
      throw createHttpError(404, "Survey not found.");
    }

    if (survey.isPurposeFinish) {
      throw createHttpError(
        400,
        "This survey has already been finished. Cannot pause.",
      );
    }

    if (survey.status === "Paused") {
      throw createHttpError(400, "This survey is already paused.");
    }

    if (survey.type !== "Initial Level") {
      throw createHttpError(
        400,
        "This operation is allowed only for Initial Level surveys.",
      );
    }

    // 2) Update survey status
    survey.status = "Paused";
    await survey.save({ session });

    // 3) Create CP row
    await SurveyRow.create(
      [
        {
          type: "CP",
          foreSight,
          remarks: [remark],
          createdBy: userId,
          purposeId: survey._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Survey purpose has been paused successfully.",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

const generateSurveyPurpose = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      params: { id },
      user: { userId },
      body: {
        purpose,
        proposal,
        quantity,
        length,
        // lSection,
        // lsSlop,
        cSection,
        csSlop,
        csCamper,
        formula,
        interpolation,
      },
    } = req;

    // 🔹 Basic validation
    if (!purpose || !id) {
      throw createHttpError(400, "Purpose and surveyId are required.");
    }

    // Required fields used for proposal generation
    // const requiredFields = [quantity, lSection, lsSlop, length];
    const requiredFields = [quantity, length];
    const missingRequired = requiredFields.some(
      (x) => x === undefined || x === null || x === "",
    );

    if (missingRequired) {
      throw createHttpError(
        400,
        "Missing required fields for proposal generation.",
      );
    }

    // Conditional validation for cross-section inputs
    const hasCsPair = cSection && csSlop && cSection !== "" && csSlop !== "";

    const hasCsCamper =
      csCamper !== undefined && csCamper !== null && csCamper !== "";

    if (!hasCsPair && !hasCsCamper) {
      throw createHttpError(
        400,
        "Please enter either both cross-section slope fields or a cross-section camber.",
      );
    }

    // 🔹 Fetch active survey
    const survey = await Survey.findOne({
      _id: id,
      isSurveyFinish: false,
      deleted: false,
    })
      .populate({
        path: "purposes",
        match: { deleted: false },
        populate: [
          { path: "rows", match: { deleted: false } },
          { path: "relation", match: { deleted: false } },
        ],
      })
      .session(session);

    if (!survey) {
      throw createHttpError(404, "Active survey not found.");
    }

    // 🔹 Does this proposal already exist?
    const isProposalExist = survey.purposes?.find((p) => p.type === proposal);

    if (isProposalExist) {
      throw createHttpError(
        409,
        `A survey with the name "${proposal}" already exists.`,
      );
    }

    // 🔹 Check if relationship already exists
    const existingProposal = survey.purposes?.find(
      (p) => p.relation?.type === purpose && p.type === proposal,
    );

    if (existingProposal) {
      throw createHttpError(
        409,
        `A proposal between "${purpose}" and "${proposal}" already exists.`,
      );
    }

    // 🔹 Check if the base purpose exists
    const basePurpose = survey.purposes?.find((p) => p.type === purpose);

    if (!basePurpose) {
      throw createHttpError(404, `Survey purpose "${purpose}" not found.`);
    }

    const relation = basePurpose._id;

    // 🔹 Filter chainage rows from base purpose
    const readingsToCreate = basePurpose.rows?.filter(
      (r) => r.type === "Chainage",
    );

    if (!readingsToCreate?.length) {
      throw createHttpError(
        409,
        `No chainage readings found to generate "${proposal}".`,
      );
    }

    const parseChainage = (str) => {
      const [km, m] = str.split(survey.separator).map(Number);
      return km * 1000 + m;
    };

    const ranges = interpolation.map((range) => ({
      start: parseChainage(range.from),
      end: parseChainage(range.to),
      width: range.width,
    }));

    const interpolationChainage = readingsToCreate.reduce((acc, item) => {
      const currentVal = parseChainage(item.chainage);

      const matchedRange = ranges.find(
        (r) => currentVal >= r.start && currentVal <= r.end,
      );

      if (matchedRange) {
        acc.push({
          chainage: item.chainage,
          width: matchedRange.width,
        });
      }

      return acc;
    }, []);

    const totalWidth = readingsToCreate.reduce((acc, curr) => {
      if (interpolation?.length) {
        const matchedItem = interpolationChainage.find(
          (item) => item.chainage === curr.chainage,
        );
        if (matchedItem) {
          return acc + (Number(matchedItem.width) || 0);
        }
      }

      return acc + (Number(curr.roadWidth) || 0);
    }, 0);

    const width = Number((totalWidth / readingsToCreate.length).toFixed(3));

    // 🔹 Create new proposal purpose
    const [purposeDoc] = await SurveyPurpose.create(
      [
        {
          surveyId: id,
          type: proposal,
          phase: "Proposal",
          createdBy: userId,
          quantity,
          length,
          width,
          // lSection,
          // lsSlop,
          cSection,
          csSlop,
          csCamper,
          relation,
          status: "Finished",
          isPurposeFinish: true,
          purposeFinishDate: new Date(),
        },
      ],
      { session },
    );

    // -----------------------------
    // 🔹 Bulk Insert Rows (FASTEST)
    // -----------------------------

    const roadWidth = Number(width);
    const safeQuantity = Number(quantity);
    const lastReading = readingsToCreate.at(-1);
    const doHaveCamper = csCamper > 0 ? Number(csCamper) : null;
    const limit =
      Number(lastReading?.chainage?.split(survey.separator || "/")?.[1]) || 0;

    const bulkOps = readingsToCreate.map((reading) => {
      const reducedLevels = [];
      const offsets = [];

      let isInterpolate = null;

      if (interpolation?.length) {
        isInterpolate = interpolationChainage.find(
          (item) => item.chainage === reading.chainage,
        );
      }

      if (isInterpolate) {
        const initialLevelMap = {};
        reading.offsets.forEach((o, idx) => {
          initialLevelMap[o] = reading.reducedLevels[idx];
        });

        const cropAndInterpolate = (targetWidth, sourceMap) => {
          const result = {};
          const width = Number(targetWidth);

          // 1. Get all original offsets as sorted numbers
          const originalOffsets = Object.keys(sourceMap)
            .map(Number)
            .sort((a, b) => a - b);

          const lowerBound = -width;
          const upperBound = width;

          // Helper to safely get value from map even if key format varies
          const getLevel = (num) => {
            // Try different common precisions or the raw string
            return (
              sourceMap[num.toFixed(3)] ||
              sourceMap[num.toFixed(2)] ||
              sourceMap[num.toFixed(1)] ||
              sourceMap[num.toString()]
            );
          };

          // 2. Add the NEW lower boundary (-2.8)
          result[lowerBound.toFixed(3)] = calculateInterpolation(
            lowerBound,
            originalOffsets,
            getLevel,
          );

          // 3. Keep all original points strictly INSIDE the range
          originalOffsets.forEach((offset) => {
            if (offset > lowerBound && offset < upperBound) {
              result[offset.toFixed(3)] = getLevel(offset);
            }
          });

          // 4. Add the NEW upper boundary (2.8)
          result[upperBound.toFixed(3)] = calculateInterpolation(
            upperBound,
            originalOffsets,
            getLevel,
          );

          return result;
        };

        const calculateInterpolation = (x, offsets, getLevelFn) => {
          let x1, x2;
          for (let i = 0; i < offsets.length - 1; i++) {
            if (x >= offsets[i] && x <= offsets[i + 1]) {
              x1 = offsets[i];
              x2 = offsets[i + 1];
              break;
            }
          }

          // If x is exactly an existing offset, just return that level
          if (x === x1) return getLevelFn(x1);
          if (x === x2) return getLevelFn(x2);

          if (x1 === undefined || x2 === undefined) return "0.000";

          const y1 = parseFloat(getLevelFn(x1));
          const y2 = parseFloat(getLevelFn(x2));

          // Formula: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
          const y = y1 + (x - x1) * ((y2 - y1) / (x2 - x1));

          return y.toFixed(3);
        };

        const finalMap = cropAndInterpolate(
          Number(isInterpolate.width / 2),
          initialLevelMap,
        );

        // 1. Get the values from the object as an array
        const values = Object.values(finalMap);

        // 2. Sum the values (converting strings to numbers)
        const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);

        // 3. Divide by the number of elements
        const avg = sum / values.length;

        const height = safeQuantity / (limit * roadWidth);

        let count = 0;

        for (const [offset, level] of Object.entries(finalMap)) {
          let value = avg + height;

          if (
            doHaveCamper &&
            (count === 0 || count === reading.reducedLevels.length - 1)
          ) {
            value -= (roadWidth / 2) * doHaveCamper;
          }

          const rounded = Math.round(value / 0.005) * 0.005;

          reducedLevels.push(rounded.toFixed(3));
          offsets.push(offset);

          count++;
        }
      } else {
        const totalReadingReducedLevel = reading.reducedLevels.reduce(
          (acc, curr) => acc + Number(curr),
          0,
        );

        const avgReadingReducedLevel =
          totalReadingReducedLevel / reading.reducedLevels.length;

        const height = safeQuantity / (limit * roadWidth);

        reading.reducedLevels.forEach((_, idx) => {
          let value = avgReadingReducedLevel + height;

          if (
            doHaveCamper &&
            (idx === 0 || idx === reading.reducedLevels.length - 1)
          ) {
            value -= (roadWidth / 2) * doHaveCamper;
          }

          const rounded = Math.round(value / 0.005) * 0.005;

          reducedLevels.push(rounded.toFixed(3));
        });

        offsets.push(...reading.offsets);
      }

      return {
        insertOne: {
          document: {
            surveyId: id,
            createdBy: userId,
            purposeId: purposeDoc._id,
            type: "Chainage",
            chainage: reading.chainage,
            spacing: reading.spacing,
            roadWidth: isInterpolate
              ? Number(isInterpolate.width)
              : reading.roadWidth,
            reducedLevels,
            heightOfInstrument: reading.heightOfInstrument,
            offsets,
            remarks: reading.remarks,
          },
        },
      };
    });
    return;
    if (bulkOps.length > 0) {
      await SurveyRow.bulkWrite(bulkOps, { session });
    } else {
      throw createHttpError(409, `Something went wrong!`);
    }

    // 🔹 Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: `Survey proposal "${proposal}" generated successfully.`,
      purpose: purposeDoc,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

const editSurveyPurpose = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      params: { id, purposeId },
      body: { updatedRows },
    } = req;

    const survey = await Survey.findById(id)
      .populate("purposes")
      .session(session);
    if (!survey) throw Error("Survey not found");

    // 1. get full list of rows in correct order
    const rows = await SurveyRow.find({ purposeId })
      .sort({ createdAt: 1 })
      .session(session);

    // 2. find which row changed
    const changedIndex = updatedRows[0].index;
    const changes = updatedRows[0].data;

    // 3. apply user edits to the changed row only (in-memory)
    Object.assign(rows[changedIndex], changes);

    // 4. get starting RL
    const startRl = rows.find((r) => r.type === "Instrument setup")
      ?.reducedLevels?.[0];

    if (!startRl) throw Error("Something went wrong!");

    // 5. sync survey reducedLevel if mismatched
    if (Number(survey.reducedLevel) !== Number(startRl)) {
      if (survey.purposes.length > 1)
        throw new Error(
          "Cannot update the survey reduced level because this survey has multiple purposes. " +
            "Reduced level can only be updated when the survey has a single purpose.",
        );

      survey.reducedLevel = Number(startRl);
      await survey.save({ session });
    }

    let hi = 0;
    let rl = Number(startRl);

    // 6. Recalculate all rows beginning from changedIndex
    for (let i = changedIndex; i < rows.length; i++) {
      const row = rows[i];

      switch (row.type) {
        case "Instrument setup":
          rl = Number(startRl);
          hi = rl + Number(row.backSight);
          row.reducedLevels = [rl.toFixed(3)];
          row.heightOfInstrument = hi.toFixed(3);
          break;

        case "Chainage":
        case "TBM":
          row.reducedLevels = row.intermediateSight.map((is) =>
            (hi - Number(is)).toFixed(3),
          );
          break;

        case "CP":
          rl = hi - Number(row.foreSight);
          hi = rl + Number(row.backSight);
          row.reducedLevels = [rl.toFixed(3)];
          row.heightOfInstrument = hi.toFixed(3);
          break;
      }
    }

    // 7. Write only rows from changedIndex
    const ops = rows.slice(changedIndex).map((r) => ({
      updateOne: {
        filter: { _id: r._id },
        update: {
          $set: {
            reducedLevels: r.reducedLevels,
            heightOfInstrument: r.heightOfInstrument,
            backSight: r.backSight,
            foreSight: r.foreSight,
            intermediateSight: r.intermediateSight,
            offsets: r.offsets,
            remarks: r.remarks,
          },
        },
      },
    }));

    if (ops.length) {
      await SurveyRow.bulkWrite(ops, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      updated: ops.length,
      message: "Rows recalculated and updated",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

const updateReducedLevels = async (req, res, next) => {
  try {
    const {
      params: { id },
      body: { payload },
    } = req;

    // 1️⃣ Validate parent survey
    const survey = await Survey.findOne({ _id: id, deleted: false });
    if (!survey) {
      throw createHttpError(404, "Parent survey not found");
    }

    // 2️⃣ Basic payload validation
    if (
      !payload ||
      !payload.chainage ||
      !Array.isArray(payload.series) ||
      payload.series.length === 0
    ) {
      throw createHttpError(400, "Missing required fields");
    }

    // 3️⃣ Collect row & purpose IDs
    const rowIds = payload.series.map((s) => s._id);
    const purposeIds = payload.series.map((s) => s.purpose);

    // 4️⃣ Validate purposes & rows existence
    const [purposesCount, rows] = await Promise.all([
      SurveyPurpose.countDocuments({
        _id: { $in: purposeIds },
        deleted: false,
      }),
      SurveyRow.find({
        _id: { $in: rowIds },
        deleted: false,
      }).select("_id reducedLevels intermediateSight"),
    ]);

    if (purposesCount !== new Set(purposeIds).size) {
      throw createHttpError(404, "One or more purposes not found");
    }

    if (rows.length !== rowIds.length) {
      throw createHttpError(404, "One or more survey readings not found");
    }

    // Create lookup map
    const rowMap = new Map(rows.map((r) => [String(r._id), r]));

    // 5️⃣ Prepare bulk updates with delta logic
    const bulkOps = [];

    for (const s of payload.series) {
      if (!Array.isArray(s.data)) {
        throw createHttpError(400, "Invalid reduced level data");
      }

      const existingRow = rowMap.get(String(s._id));
      if (!existingRow) {
        throw createHttpError(404, "Survey row not found");
      }

      const oldRL = existingRow.reducedLevels || [];
      const oldIS = existingRow.intermediateSight || [];

      const hasIntermediateSight = oldIS.length > 0;

      if (oldRL.length !== s.data.length) {
        throw createHttpError(400, "Reduced levels length mismatch");
      }

      if (hasIntermediateSight && oldIS.length !== s.data.length) {
        throw createHttpError(400, "Intermediate sight length mismatch");
      }

      const newReducedLevels = [];
      const newIntermediateSight = [];

      for (let i = 0; i < s.data.length; i++) {
        const newValue = s.data[i]?.y;

        if (newValue === "" || newValue === null || newValue === undefined) {
          throw createHttpError(400, "Reduced level cannot be empty");
        }

        const newRLNum = Number(newValue);
        const oldRLNum = Number(oldRL[i]);

        if (Number.isNaN(newRLNum) || Number.isNaN(oldRLNum)) {
          throw createHttpError(400, "Reduced level must be a valid number");
        }

        const delta = newRLNum - oldRLNum;

        newReducedLevels.push(newRLNum.toFixed(3));

        if (hasIntermediateSight) {
          const oldISNum = Number(oldIS[i]);

          if (Number.isNaN(oldISNum)) {
            throw createHttpError(
              400,
              "Intermediate sight must be a valid number",
            );
          }

          newIntermediateSight.push((oldISNum + delta).toFixed(3));
        }
      }

      bulkOps.push({
        updateOne: {
          filter: { _id: s._id, deleted: false },
          update: {
            $set: {
              reducedLevels: newReducedLevels,
              ...(hasIntermediateSight && {
                intermediateSight: newIntermediateSight,
              }),
            },
          },
        },
      });
    }

    // 6️⃣ Execute bulk update
    await SurveyRow.bulkWrite(bulkOps, { ordered: true });

    res.status(200).json({
      success: true,
      message: "Reduced levels and intermediate sights updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const createBranch = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      user: { userId },
      params: { surveyId },
      body: { name, foreSight, purposeId },
    } = req;

    if (!surveyId || !name?.trim()) {
      throw createHttpError(400, "Missing required fields");
    }

    if (foreSight && Number.isNaN(foreSight)) {
      throw createHttpError(400, "Foresight must be a valid number");
    }

    const parentSurvey = await Survey.findOne({
      _id: surveyId,
      deleted: false,
      status: "Active",
    });
    if (!parentSurvey) {
      throw createHttpError(404, "Parent survey not found");
    }

    const lastChainageReading = await SurveyRow.findOne({
      purposeId,
      type: "Chainage",
      deleted: false,
    }).sort({ createdAt: -1, _id: -1 });

    const lastReading = await SurveyRow.findOne({
      purposeId,
      deleted: false,
    }).sort({ createdAt: -1, _id: -1 });

    const lastCpReading = await SurveyRow.findOne({
      purposeId,
      type: "CP",
      deleted: false,
    }).sort({ createdAt: -1, _id: -1 });

    let reducedLevel = 0;

    if (lastCpReading) {
      reducedLevel = lastCpReading?.reducedLevels[0];
    } else {
      reducedLevel = parentSurvey.reducedLevel;
    }

    const rootBranch = parentSurvey.branchDetails?.rootBranch;
    const chainage =
      lastChainageReading?.chainage || `0${parentSurvey.separator || "/"}000`;

    // 🔹 Create Survey
    const survey = await Survey.create(
      [
        {
          project: name,
          createdBy: userId,
          instrumentNo: parentSurvey.instrumentNo,
          chainageMultiple: parentSurvey.chainageMultiple,
          separator: parentSurvey.separator,
          reducedLevel: Number(reducedLevel).toFixed(3),
          agreementNo: parentSurvey.agreementNo,
          contractor: parentSurvey.contractor,
          department: parentSurvey.department,
          division: parentSurvey.division,
          subDivision: parentSurvey.subDivision,
          section: parentSurvey.section,
          consultant: parentSurvey.consultant,
          client: parentSurvey.client,
          branchDetails: {
            isBranch: true,
            rootBranch: rootBranch || parentSurvey._id,
            parentBranch: parentSurvey._id,
          },
        },
      ],
      { session },
    );

    const surveyDoc = survey[0];

    if (rootBranch) {
      await Survey.updateOne(
        { _id: rootBranch },
        { $set: { "branchDetails.currentBranch": surveyDoc._id } },
        { session },
      );
    } else {
      parentSurvey.branchDetails.currentBranch = surveyDoc._id;
    }

    parentSurvey.branchDetails.hasBranching = true;
    parentSurvey.branchDetails.branchStartedFrom = chainage;
    parentSurvey.branchDetails.isBranchStart = true;
    await parentSurvey.save({ session });

    const newBranch = await Branch.create(
      [
        {
          name,
          surveyId: surveyDoc._id,
          createdBy: userId,
          branchStartedFrom: chainage,
          rootBranch: rootBranch || parentSurvey._id,
          parentBranch: parentSurvey._id,
          isBranchStart: true,
        },
      ],
      { session },
    );

    const newBranchDoc = newBranch[0];

    lastReading.upcomingBranches.push(newBranchDoc._id);
    await lastReading.save({ session });

    await Branch.updateOne(
      {
        _id: parentSurvey._id,
      },
      {
        $set: {
          hasBranching: true,
        },
      },
      { session },
    );

    // 🔹 Create Purpose
    const purposeDoc = await SurveyPurpose.create(
      [
        {
          surveyId: surveyDoc._id,
          createdBy: userId,
          type: "Initial Level",
          isSurveyFinish: false,
          status: foreSight ? "Paused" : "Active",
        },
      ],
      { session },
    );

    const purposeObj = purposeDoc[0];

    // 🔹 Create First Row (TBM)
    // await SurveyRow.create(
    //   [
    //     {
    //       surveyId: surveyDoc._id,
    //       purposeId: purposeObj._id,
    //       createdBy: userId,
    //       type: "Instrument setup",
    //       backSight: Number(backSight).toFixed(3),
    //       remarks: ["TBM"],
    //       reducedLevels: [Number(reducedLevel).toFixed(3)],
    //       heightOfInstrument: Number(
    //         Number(reducedLevel) + Number(backSight),
    //       ).toFixed(3),
    //     },
    //   ],
    //   { session },
    // );

    if (foreSight) {
      // 🔹 Create First Row (CP)
      await SurveyRow.create(
        [
          {
            type: "CP",
            foreSight,
            remarks: [],
            createdBy: userId,
            purposeId: purposeObj._id,
          },
        ],
        { session },
      );
    }

    // 🔹 Optionally create a History log
    await History.create(
      [
        {
          entityType: "Branch",
          entityId: surveyDoc._id,
          action: "Create",
          notes: "Branch created with purpose Initial Level",
          performedBy: userId,
        },
      ],
      { session },
    );

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      purposeId: purposeObj._id,
    });
  } catch (err) {
    // ❌ Rollback if anything fails
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

const enterBranch = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      user: { userId },
      params: { surveyId },
      body: {
        branchId,
        purposeId,
        phase,
        proposedLevel,
        reducedLevel,
        backSight,
        crossSectionType,
        crossSectionCamper,
        crossSectionSlop,
      },
    } = req;

    const isProposal = phase === "Proposal";

    if (!branchId) {
      throw Error("Branch id is required");
    }

    if (!purposeId) {
      throw Error("Purpose id is required");
    }

    if (isProposal) {
      if (proposedLevel === "" || proposedLevel === undefined) {
        throw Error("Proposed level is required");
      } else if (isNaN(Number(proposedLevel))) {
        throw Error("Proposed level must be a number");
      }

      if (!["Camper", "Slop"].includes(crossSectionType)) {
        throw Error("Invalid cross section type");
      }

      if (crossSectionType === "Camper" && !crossSectionCamper) {
        throw Error("Camper value is required");
      }

      if (crossSectionType === "Slop" && !crossSectionSlop) {
        throw Error("Slop value is required");
      }
    } else {
      /* ---------------- non-proposal phase ---------------- */
      if (reducedLevel === "" || reducedLevel === undefined) {
        throw Error("Reduced level is required");
      } else if (isNaN(Number(reducedLevel))) {
        throw Error("Reduced level must be a number");
      }

      if (backSight === "" || backSight === undefined) {
        throw Error("Back sight is required");
      } else if (isNaN(Number(backSight))) {
        throw Error("Back sight must be a number");
      }
    }

    const parentSurvey = await Survey.findOne({
      _id: surveyId,
      deleted: false,
      status: "Active",
    });
    if (!parentSurvey) throw Error("Parent survey not found");

    const survey = await Survey.findOne({
      _id: branchId,
      deleted: false,
      status: "Active",
    });
    if (!survey) throw Error("Survey not found");

    const purpose = await SurveyPurpose.findOne({
      _id: purposeId,
      deleted: false,
      status: "Active",
    });
    if (!purpose) throw Error("Purpose not found");

    const rootBranch = parentSurvey.branchDetails?.rootBranch;

    const [purposeDoc] = await SurveyPurpose.create(
      [
        {
          surveyId: branchId,
          type: purpose.type,
          createdBy: userId,
          phase: isProposal ? "Proposal" : "Actual",
          ...(isProposal && {
            proposedLevel,
            csCamper: crossSectionCamper,
            csSlop: crossSectionSlop,
          }),
        },
      ],
      { session },
    );

    if (!isProposal) {
      // 🔹 Create First Reading (TBM)
      await SurveyRow.create(
        [
          {
            surveyId: branchId,
            purposeId: purposeDoc._id,
            createdBy: userId,
            type: "Instrument setup",
            backSight: Number(backSight).toFixed(3),
            remarks: ["TBM - 1"],
            reducedLevels: [Number(reducedLevel).toFixed(3)],
            heightOfInstrument: Number(
              Number(reducedLevel) + Number(backSight),
            ).toFixed(3),
          },
        ],
        { session },
      );
    }

    if (rootBranch) {
      await Survey.updateOne(
        { _id: rootBranch },
        { $set: { "branchDetails.currentBranch": survey._id } },
        { session },
      );
    } else {
      parentSurvey.branchDetails.currentBranch = survey._id;
    }

    parentSurvey.branchDetails.hasBranching = true;
    parentSurvey.branchDetails.isBranchStart = true;

    await parentSurvey.save({ session });

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      purposeId: purposeDoc._id,
    });
  } catch (err) {
    // ❌ Rollback if anything fails
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

const createBreak = async (req, res, next) => {
  try {
    const {
      params: { id },
      user: { userId },
      body: { from, to, remark },
    } = req;

    // 🔹 Validate purpose
    if (!id) throw createHttpError(400, "Purpose ID is required");

    const purpose = await SurveyPurpose.findOne({
      _id: id,
      deleted: false,
    }).populate({
      path: "surveyId",
      match: { deleted: false },
    });

    if (!from || !to || !remark)
      throw createHttpError(409, "Missing required fields");

    if (!purpose) throw createHttpError(404, "Purpose not found");
    if (purpose.isPurposeFinish)
      throw createHttpError(409, `${purpose.type} already completed`);

    const survey = purpose.surveyId;
    if (survey.isSurveyFinish)
      throw createHttpError(409, "Survey is already finished");
    if (!survey || survey.deleted)
      throw createHttpError(404, "Survey not found or has been deleted");

    const isChainageExist = await SurveyRow.findOne({
      purposeId: id,
      $or: [{ chainage: from?.trim() }, { chainage: to?.trim() }],
      deleted: false,
    });

    if (isChainageExist) throw createHttpError(409, "Chainage already exist");

    const newRow = await SurveyRow.create({
      type: "Break",
      purposeId: purpose._id,
      createdBy: userId,
      remarks: [remark],
      from,
      to,
    });

    res.status(201).json({
      success: true,
      message: "Break added successfully",
      row: newRow,
    });
  } catch (err) {
    next(err);
  }
};

const deleteSurveyPurpose = async (req, res, next) => {
  try {
    const {
      params: { purposeId },
    } = req;

    const purpose = await SurveyPurpose.findOne({
      _id: purposeId,
      deleted: false,
    });

    if (!purpose) throw createHttpError(404, "Purpose not found");
    if (purpose.type === "Initial Level")
      throw createHttpError(409, `You cannot delete the Initial Level`);

    purpose.deleted = true;
    await purpose.save();

    res.status(200).json({
      success: true,
      message: "Survey purpose deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export {
  checkSurveyExists,
  getAllSurvey,
  createSurvey,
  getSurveyPurpose,
  getFieldBook,
  createSurveyPurpose,
  getAllSurveyPurpose,
  endSurveyPurpose,
  endSurvey,
  getSurvey,
  updateSurvey,
  deleteSurvey,
  createSurveyRow,
  updateSurveyRow,
  deleteSurveyRow,
  pauseSurveyPurpose,
  generateSurveyPurpose,
  editSurveyPurpose,
  updateReducedLevels,
  createBranch,
  enterBranch,
  createBreak,
  deleteSurveyPurpose,
};
