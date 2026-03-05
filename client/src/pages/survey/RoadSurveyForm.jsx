import * as Yup from "yup";
import { Box, Grid, InputAdornment, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import BasicButtons from "../../components/BasicButton";
import { useDispatch, useSelector } from "react-redux";
import { handleFormError } from "../../utils/handleFormError";
import { startLoading, stopLoading } from "../../redux/loadingSlice";
import { showAlert } from "../../redux/alertSlice";
import BasicSelect from "../../components/BasicSelect";
import { purposeLevels, proposalLevels } from "../../constants";
import BasicCheckbox from "../../components/BasicCheckbox";
import BasicInput from "../../components/BasicInput";
import {
  createSurvey,
  createSurveyPurpose,
  generateSurveyPurpose,
  getSurvey,
} from "../../services/surveyServices";
import AlertDialogSlide from "../../components/AlertDialogSlide";
import { IoIosArrowForward } from "react-icons/io";
import AdvancedAutoComplete from "../../components/AdvancedAutoComplete";
import SmallHeader from "../../components/SmallHeader";
import { FaCalendarAlt } from "react-icons/fa";

const alertData = {
  title: "Generate Proposal",
  description: "",
  content: "",
  cancelButtonText: "Cancel",
  submitButtonText: "Continue",
};

const inputDetails = [
  {
    label: "Project name*",
    name: "project",
    type: "text",
    for: "All",
  },
  {
    label: "Agreement no*",
    name: "agreementNo",
    type: "text",
    for: "Initial Level",
  },
  {
    label: "Category",
    name: "category",
    mode: "checkbox",
    hidden: false,
    for: "Initial Level",
    options: [
      {
        name: "publicProject",
        label: "Public project",
      },
      {
        name: "privateProject",
        label: "Private project",
      },
    ],
  },
  {
    label: "Contractor*",
    name: "contractor",
    type: "text",
    for: "Initial Level",
    size: 6,
  },
  {
    label: "Department*",
    name: "department",
    type: "text",
    for: "Initial Level",
    size: 6,
  },
  {
    label: "Division*",
    name: "division",
    type: "text",
    for: "Initial Level",
    size: 6,
  },
  {
    label: "Sub division*",
    name: "subDivision",
    type: "text",
    for: "Initial Level",
    size: 6,
  },
  {
    label: "Section*",
    name: "section",
    type: "text",
    for: "Initial Level",
  },
  {
    label: "Consultant*",
    name: "consultant",
    type: "text",
    for: "Initial Level",
    size: 6,
    hidden: true,
  },
  {
    label: "Client*",
    name: "client",
    type: "text",
    for: "Initial Level",
    hidden: true,
  },
  {
    label: "Select purpose*",
    name: "purpose",
    mode: "select",
    options: [{ label: "Initial Level", value: "Initial Level" }],
    for: "All",
  },
  {
    label: "Proposal*",
    name: "proposal",
    mode: "select",
    options: proposalLevels?.map((p) => ({ label: p, value: p })),
    for: "Proposed Level",
    size: 6,
    hidden: true,
  },
  {
    label: "Entry Type",
    name: "entryType",
    mode: "checkbox",
    hidden: true,
    for: "Proposed Level",
    options: [
      {
        name: "manualEntry",
        label: "Manual entry",
      },
      {
        name: "autoGenerate",
        label: "Auto Generate",
      },
    ],
  },
  {
    label: "Proposed level*",
    name: "proposedLevel",
    type: "number",
    for: "Proposed Level",
    hidden: true,
  },
  {
    label: "Quantity*",
    name: "quantity",
    type: "number",
    for: "Proposed Level",
    hidden: true,
  },
  {
    label: "Instrument number*",
    name: "instrumentNo",
    type: "text",
    for: "Initial Level",
  },
  {
    label: "Reduced level*",
    name: "reducedLevel",
    type: "number",
    for: "actual",
  },
  {
    label: "Back sight*",
    name: "backSight",
    type: "number",
    for: "actual",
  },
  {
    label: "Remark*",
    name: "remark",
    type: "text",
    for: "actual",
  },
  {
    label: "Set chainage multiple*",
    name: "chainageMultiple",
    mode: "solo-create",
    options: [5, 10, 20, 30, 50].map((n) => ({ label: n, value: n })),
    for: "Initial Level",
  },
  {
    label: "Select separator*",
    name: "separator",
    mode: "select",
    options: ["/", "+", ","].map((n) => ({ label: n, value: n })),
    for: "Initial Level",
  },
  {
    label: "Length*",
    name: "length",
    mode: "select",
    options: [{ label: "All", value: "All" }],
    hidden: true,
    for: "Proposed Level",
  },
  {
    label: "Formula*",
    name: "formula",
    mode: "select",
    options: [
      { label: "Default", value: "Default" },
      { label: "Interpolation", value: "Interpolation" },
    ],
    hidden: true,
    for: "Proposed Level",
  },
  // {
  //   label: '',
  //   name: 'lSection',
  //   type: 'number',
  //   hidden: true,
  //   for: 'Proposed Level',
  //   size: 6,
  // },
  // {
  //   label: '',
  //   name: 'lsSlop',
  //   type: 'number',
  //   hidden: true,
  //   for: 'Proposed Level',
  //   size: 6,
  // },
  {
    label: "Cross section type",
    name: "crossSectionType",
    mode: "checkbox",
    hidden: true,
    for: "Proposed Level",
    options: [
      {
        name: "camper",
        label: "Camper",
      },
      {
        name: "slop",
        label: "Slop",
      },
    ],
  },
  {
    label: "",
    name: "cSection",
    type: "number",
    hidden: true,
    for: "Proposed Level",
    size: 6,
  },
  {
    label: "",
    name: "csSlop",
    type: "number",
    hidden: true,
    for: "Proposed Level",
    size: 6,
  },
  {
    label: "Cross section camper",
    name: "csCamper",
    type: "text",
    hidden: true,
    for: "Proposed Level",
  },
  {
    label: "Engineer / Surveyor",
    name: "engineerSurveyor",
    type: "text",
    for: "Initial Level",
    size: 6,
  },
  {
    label: "Assistant 1",
    name: "assistant1",
    type: "text",
    for: "Initial Level",
    size: 6,
  },
  {
    label: "Assistant 2",
    name: "assistant2",
    type: "text",
    for: "Initial Level",
    size: 6,
  },
  {
    label: "Assistant 3",
    name: "assistant3",
    type: "text",
    for: "Initial Level",
    size: 6,
  },
  {
    label: "Assistant 4",
    name: "assistant4",
    type: "text",
    for: "Initial Level",
    size: 6,
  },
  {
    label: "Assistant 5",
    name: "assistant5",
    type: "text",
    for: "Initial Level",
    size: 6,
  },
];

const initialFormValues = {
  project: "",
  agreementNo: "",
  contractor: "",
  department: "",
  division: "",
  subDivision: "",
  section: "",
  consultant: "",
  client: "",
  purpose: "",
  proposal: "",
  instrumentNo: "",
  backSight: "",
  remark: "TBM - 1",
  reducedLevel: "",
  chainageMultiple: "",
  lSection: "",
  lsSlop: "",
  cSection: "",
  csSlop: "",
  csCamper: "",
  separator: "",
  scheduledDate: "",
  formula: "Default",
  engineerSurveyor: "",
  assistant1: "",
  assistant2: "",
  assistant3: "",
  assistant4: "",
  assistant5: "",
};

const RoadSurveyForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const didMount = useRef(false);

  const { global } = useSelector((state) => state.loading);

  const [inputData, setInputData] = useState(inputDetails);

  const [survey, setSurvey] = useState(null);

  const [type, setType] = useState(false);

  const [crossSection, setCrossSection] = useState("camper");

  const [entryType, setEntryType] = useState("manualEntry");

  const [category, setCategory] = useState("publicProject");

  const [formValues, setFormValues] = useState(initialFormValues);

  const [formErrors, setFormErrors] = useState(null);

  const [open, setOpen] = useState(false);

  const [scheduleProjectOpen, setScheduleProjectOpen] = useState(false);

  const [btnLoading, setBtnLoading] = useState(false);

  const schema = Yup.object().shape({
    project: Yup.string().required("Project name is required"),
    purpose: Yup.string().required("Purpose is required"),

    agreementNo: !id
      ? Yup.string().required("Agreement no is required")
      : Yup.string().nullable(),

    contractor: !id
      ? Yup.string().required("Contractor is required")
      : Yup.string().nullable(),

    department:
      !id && category === "publicProject"
        ? Yup.string().required("Department is required")
        : Yup.string().nullable(),

    division:
      !id && category === "publicProject"
        ? Yup.string().required("Division is required")
        : Yup.string().nullable(),

    subDivision:
      !id && category === "publicProject"
        ? Yup.string().required("Sub division is required")
        : Yup.string().nullable(),

    section:
      !id && category === "publicProject"
        ? Yup.string().required("Section is required")
        : Yup.string().nullable(),

    consultant:
      !id && category === "privateProject"
        ? Yup.string().required("Consultant is required")
        : Yup.string().nullable(),

    client:
      !id && category === "privateProject"
        ? Yup.string().required("Client is required")
        : Yup.string().nullable(),

    proposal: type
      ? Yup.string().required("Proposal is required")
      : Yup.string().nullable(),

    quantity:
      type && entryType === "autoGenerate"
        ? Yup.number()
            .typeError("Quantity is required")
            .required("Quantity is required")
        : Yup.string().nullable(),

    length:
      type && entryType === "autoGenerate"
        ? Yup.string().required("Length is required")
        : Yup.string().nullable(),

    formula:
      type && entryType === "autoGenerate"
        ? Yup.string().required("Formula is required")
        : Yup.string().nullable(),

    proposedLevel:
      type && entryType === "manualEntry"
        ? Yup.number()
            .typeError("Proposed Level is required")
            .required("Proposed Level is required")
        : Yup.string().nullable(),

    instrumentNo: !id
      ? Yup.string().required("Instrument number is required")
      : Yup.string().nullable(),

    backSight:
      !id || (id && !type)
        ? Yup.number()
            .typeError("Backsight is required")
            .required("Backsight is required")
        : Yup.string().nullable(),

    remark: !id
      ? Yup.string().required("Remark is required")
      : Yup.string().nullable(),

    reducedLevel:
      !id || (id && !type)
        ? Yup.number()
            .typeError("Reduced level is required")
            .required("Reduced level is required")
        : Yup.string().nullable(),
    chainageMultiple: !id
      ? Yup.number()
          .typeError("Chainage multiple must be a number")
          .required("Chainage multiple is required")
          .moreThan(0, "Chainage multiple must be greater than 0")
      : Yup.string().nullable(),
    separator: !id
      ? Yup.string()
          .required("Separator is required")
          .matches(/^[/+,]$/, "Only '/', '+', ',' are allowed")
      : Yup.string().nullable(),

    lSection: Yup.string().nullable(),
    lsSlop: Yup.string().nullable(),

    // lSection: type
    //   ? Yup.number()
    //       .typeError('Longitudinal section slop is required')
    //       .required('Longitudinal section slop is required')
    //   : Yup.string().nullable(),
    // lsSlop: type
    //   ? Yup.number()
    //       .typeError('Longitudinal section slop is required')
    //       .required('Longitudinal section slop is required')
    //   : Yup.string().nullable(),
    cSection:
      type && crossSection === "slop"
        ? Yup.number()
            .typeError("Cross section slop is required")
            .required("Cross section slop is required")
        : Yup.string().nullable(),

    csSlop:
      type && crossSection === "slop"
        ? Yup.number()
            .typeError("Cross section slop is required")
            .required("Cross section slop is required")
        : Yup.string().nullable(),
    csCamper:
      type && crossSection === "camper"
        ? Yup.string().required("Cross section camper is required")
        : Yup.string().nullable(),
    scheduledDate: Yup.string().nullable(),
    engineerSurveyor: Yup.string().nullable(),
    assistant1: Yup.string().nullable(),
    assistant2: Yup.string().nullable(),
    assistant3: Yup.string().nullable(),
    assistant4: Yup.string().nullable(),
    assistant5: Yup.string().nullable(),
  });

  const handleGoBack = () => navigate(-1);

  const handleChangeCategory = (name) => {
    setFormValues((prev) => ({ ...prev, category: name }));
  };

  const handleInputChange = async (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    try {
      await Yup.reach(schema, name).validate(value);

      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
      setFormErrors({ ...formErrors, [name]: error.message });
    }
  };

  const handleSubmit = async () => {
    setBtnLoading(true);

    try {
      await schema.validate(formValues, { abortEarly: false });

      const { data } = id
        ? entryType === "manualEntry"
          ? await createSurveyPurpose(id, formValues)
          : await generateSurveyPurpose(id, formValues)
        : await createSurvey(formValues);

      if (data.success) {
        const purposeId = data?.survey?.purposeId;
        const surveyStatus = data?.survey?.status;

        // const message =
        //   id && entryType === 'autoGenerate'
        //     ? `${formValues.proposal} generated successfully`
        //     : 'Form Submitted Successfully';

        const link =
          surveyStatus === "Scheduled"
            ? "/survey"
            : id && entryType === "autoGenerate"
              ? `/survey/${id}/report`
              : `/survey/road-survey/${purposeId}/rows`;

        // dispatch(
        //   showAlert({
        //     type: 'success',
        //     message,
        //   })
        // );

        dispatch(startLoading());

        navigate(link, {
          state: surveyStatus === "Scheduled" ? { tab: "todo" } : null,
        });
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error) {
      handleFormError(error, setFormErrors, dispatch, navigate);
    } finally {
      setOpen(false);
      setBtnLoading(false);
    }
  };

  const preSubmitCheck = () => {
    if (entryType === "autoGenerate") {
      setOpen(true);
    } else {
      handleSubmit();
    }
  };

  const fetchData = async () => {
    try {
      if (!global) dispatch(startLoading());

      const { data } = await getSurvey(id);

      if (data?.survey?.isSurveyFinish) {
        navigate("/survey");
        throw Error("The survey already completed");
      }

      const surveyDoc = data.survey;

      const initialLevel = surveyDoc.purposes?.find(
        (p) => p.type === "Initial Level",
      );

      const updatedFormValues = {
        ...formValues,
        project: surveyDoc?.project,
        reducedLevel: surveyDoc?.reducedLevel || "",
        backSight: initialLevel?.rows[0]?.backSight || "",
      };

      const completedLevels = surveyDoc?.purposes?.map((p) => p.type) || [];

      const completedPurposes = surveyDoc?.purposes
        ?.filter((p) => p.phase === "Proposal")
        .map((p) => p.type);

      updateInputData(completedLevels, completedPurposes);

      setFormValues(updatedFormValues);
      setSurvey(surveyDoc);
    } catch (error) {
      handleFormError(error, null, dispatch, navigate);
    } finally {
      dispatch(stopLoading());
    }
  };

  const updateInputData = (completedLevels, completedPurposes) => {
    setInputData((prev) =>
      prev.map((e) => {
        if (id) {
          if (e.for === "All") {
            if (e.name === "purpose") {
              return {
                ...e,
                hidden: false,
                options: type
                  ? [
                      completedPurposes.length
                        ? completedPurposes?.at(-1)
                        : "Initial Level",
                    ].map((p) => ({ label: p, value: p }))
                  : purposeLevels
                      ?.filter((p) => !completedLevels.includes(p))
                      .map((p) => ({ label: p, value: p })),
                size: type ? 6 : null,
              };
            }

            if (e.name === "project")
              return { ...e, hidden: false, disabled: true };

            return { ...e, hidden: false };
          }

          if (type && e.for === "Proposed Level") {
            if (e.name === "cSection" || e.name === "csSlop") {
              return { ...e, hidden: crossSection === "camper" };
            }

            if (e.name === "csCamper") {
              return { ...e, hidden: crossSection === "slop" };
            }

            if (e.name === "proposedLevel") {
              return { ...e, hidden: entryType === "autoGenerate" };
            }

            if (e.name === "quantity") {
              return { ...e, hidden: entryType === "manualEntry" };
            }

            if (e.name === "length" || e.name === "formula") {
              return { ...e, hidden: entryType === "manualEntry" };
            }

            return { ...e, hidden: false };
          }

          if (e.for === "actual" && !type) {
            return { ...e, hidden: false };
          }

          if (!type && e.for === "Rest") {
            return { ...e, hidden: false };
          }

          return { ...e, hidden: true };
        } else {
          if (e.for === "Initial Level") {
            if (
              e.name === "department" ||
              e.name === "division" ||
              e.name === "subDivision" ||
              e.name === "section"
            ) {
              return { ...e, hidden: category !== "publicProject" };
            }

            if (e.name === "consultant" || e.name === "client") {
              return { ...e, hidden: category !== "privateProject" };
            }
          }

          if (e.for === "actual") {
            return { ...e, hidden: false };
          }

          return e;
        }
      }),
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleScheduleProjectClose = () => {
    setScheduleProjectOpen(false);
  };

  const handleScheduleProjectSubmit = () => {
    const inpSchedule = document.getElementById("scheduledDate").value;
    if (!inpSchedule) {
      setFormErrors((prev) => ({
        ...prev,
        scheduledDate: "Scheduled date is required",
      }));
      return;
    } else {
      setFormErrors((prev) => ({
        ...prev,
        scheduledDate: "",
      }));
    }

    handleSubmit();
    setScheduleProjectOpen(false);
  };

  const scheduleProjectAlertData = {
    title: "Schedule Project",
    description: "",
    content: (
      <Box mt={2}>
        <BasicInput
          id="scheduledDate"
          type="date"
          name="scheduledDate"
          sx={{ width: "100%" }}
          value={formValues?.scheduledDate}
          error={(formErrors && formErrors.scheduledDate) || ""}
          onChange={(e) => handleInputChange(e)}
        />
      </Box>
    ),
    cancelButtonText: "Cancel",
    submitButtonText: "Continue",
  };

  useEffect(() => {
    if (didMount.current) {
      const completedLevels = survey?.purposes?.map((p) => p.type) || [];

      const completedPurposes = survey?.purposes
        ?.filter((p) => p.phase === "Proposal")
        .map((p) => p.type);

      updateInputData(completedLevels, completedPurposes);
    } else {
      didMount.current = true;
    }
  }, [type, crossSection, entryType, category]);

  useEffect(() => {
    if (!id) {
      setFormValues((prev) => ({ ...prev, purpose: "Initial Level" }));

      dispatch(stopLoading());
      return;
    }

    fetchData();
  }, [id]);

  return (
    <>
      <SmallHeader />

      <Box p={2} className="overlapping-header">
        <AlertDialogSlide
          {...alertData}
          description={`Are you sure you want to auto-generate the ${formValues?.proposal} for ${formValues.purpose} `}
          open={open}
          onCancel={handleClose}
          onSubmit={handleSubmit}
        />

        <AlertDialogSlide
          {...scheduleProjectAlertData}
          description={`Are you sure you want to schedule the ${formValues?.project || "Project"} `}
          open={scheduleProjectOpen}
          onCancel={handleScheduleProjectClose}
          onSubmit={handleScheduleProjectSubmit}
        />

        <Box
          sx={{
            border: "1px solid #EFEFEF",
            borderRadius: "9px",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleGoBack}
        >
          <MdArrowBackIosNew />
        </Box>

        <Stack alignItems={"center"} spacing={2}>
          <Stack alignItems={"center"}>
            <Typography
              variant="h6"
              fontSize={18}
              fontWeight={700}
              align="center"
            >
              Create New {id ? "Survey" : "Project"}
            </Typography>

            <Typography fontSize={13} fontWeight={400} color="#434343">
              Please Enter The Following Values
            </Typography>
          </Stack>

          <Stack width={"100%"} spacing={2} className="input-wrapper">
            {id && (
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"end"}
              >
                <Typography
                  variant="body2"
                  fontSize={"16px"}
                  fontWeight={600}
                  color="black"
                >
                  Proposal
                </Typography>
                <BasicCheckbox
                  checked={type || ""}
                  onChange={() => setType(!type)}
                />
              </Box>
            )}

            <Grid container spacing={3} columns={12} alignItems={"end"}>
              {inputData.map(
                ({ hidden, for: inputFor, mode, size, ...input }, index) =>
                  !hidden && (
                    <Grid
                      size={{
                        xs: size || 12,
                      }}
                      key={index}
                    >
                      {((type && input.name === "purpose") ||
                        input.name === "lSection" ||
                        input.name === "cSection") && (
                        <Typography
                          variant="body2"
                          fontSize={"16px"}
                          fontWeight={600}
                          color="black"
                        >
                          {input.name === "purpose"
                            ? "Proposal Between"
                            : input.name === "lSection"
                              ? "Longitudinal section slop"
                              : "Cross section slop"}
                          :
                        </Typography>
                      )}

                      {mode === "select" ? (
                        <BasicSelect
                          {...input}
                          value={formValues[input.name] || ""}
                          error={(formErrors && formErrors[input.name]) || ""}
                          sx={{ width: "100%" }}
                          onChange={(e) => handleInputChange(e)}
                        />
                      ) : mode === "solo-create" ? (
                        <AdvancedAutoComplete
                          {...input}
                          value={formValues[input.name] || ""}
                          error={(formErrors && formErrors[input.name]) || ""}
                          sx={{ width: "100%" }}
                          onChange={(e) => handleInputChange(e)}
                        />
                      ) : mode === "checkbox" ? (
                        <Stack direction={"row"}>
                          {input.options?.map((option, idx) => (
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              key={idx}
                            >
                              <Typography
                                variant="body2"
                                fontSize={"16px"}
                                fontWeight={600}
                                color="black"
                              >
                                {option.label}
                              </Typography>
                              <BasicCheckbox
                                checked={
                                  (input.name === "crossSectionType"
                                    ? crossSection
                                    : input.name === "category"
                                      ? category
                                      : entryType) === option.name
                                }
                                onChange={() =>
                                  input.name === "crossSectionType"
                                    ? setCrossSection(option.name)
                                    : input.name === "category"
                                      ? setCategory(option.name)
                                      : setEntryType(option.name)
                                }
                              />
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <BasicInput
                          {...input}
                          value={formValues[input.name] || ""}
                          error={(formErrors && formErrors[input.name]) || ""}
                          sx={{ width: "100%" }}
                          onChange={(e) => handleInputChange(e)}
                        />
                      )}
                    </Grid>
                  ),
              )}
            </Grid>
          </Stack>

          <Stack width={"100%"} gap={2} direction={{ md: "row" }}>
            {!id && (
              <BasicButtons
                value={
                  <Box display={"flex"} gap={1} alignItems={"center"}>
                    <Typography fontSize={"16px"} fontWeight={600}>
                      Schedule
                    </Typography>
                    <FaCalendarAlt fontSize={"20px"} />
                  </Box>
                }
                sx={{ backgroundColor: "#ff9800", height: "45px" }}
                fullWidth={true}
                onClick={() => setScheduleProjectOpen(true)}
                loading={btnLoading}
              />
            )}

            <BasicButtons
              value={
                <Box display={"flex"} gap={1} alignItems={"center"}>
                  <Typography fontSize={"16px"} fontWeight={600}>
                    Continue
                  </Typography>
                  <IoIosArrowForward fontSize={"20px"} />
                </Box>
              }
              sx={{ backgroundColor: "rgba(24, 195, 127, 1)", height: "45px" }}
              fullWidth={true}
              onClick={preSubmitCheck}
              loading={btnLoading}
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default RoadSurveyForm;
