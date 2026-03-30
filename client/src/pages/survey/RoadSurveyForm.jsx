import * as Yup from "yup";
import {
  Box,
  Grid,
  InputAdornment,
  Stack,
  Typography,
  Paper,
  Container,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
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
import { IoIosArrowForward, IoIosRemove } from "react-icons/io";
import AdvancedAutoComplete from "../../components/AdvancedAutoComplete";
import SmallHeader from "../../components/SmallHeader";
import { FaCalendarAlt } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";

const alertData = {
  title: "Generate Proposal",
  description: "",
  content: "",
  cancelButtonText: "Cancel",
  submitButtonText: "Continue",
};

const addButtonSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 1.5,
  py: 0.75,
  borderRadius: 2,
  bgcolor: "primary.50",
  color: "primary.main",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  transition: "all 0.2s",
  "&:hover": {
    bgcolor: "primary.100",
  },
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
        name: "autoGenerate",
        label: "Auto Generate",
      },
      {
        name: "manualEntry",
        label: "Manual entry",
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
    label: "Width*",
    name: "width",
    mode: "select",
    options: [
      { label: "Full width", value: "Full width" },
      { label: "Custom", value: "Custom" },
    ],
    hidden: true,
    for: "Proposed Level",
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

const initialRow = {
  from: "",
  to: "",
  width: "",
};

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
  width: "",
  remark: "TBM - 1",
  reducedLevel: "",
  chainageMultiple: "",
  lSection: "",
  lsSlop: "",
  cSection: "",
  csSlop: "",
  csCamper: "0",
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

  const [entryType, setEntryType] = useState("autoGenerate");

  const [category, setCategory] = useState("publicProject");

  const [formValues, setFormValues] = useState(initialFormValues);

  const [formErrors, setFormErrors] = useState(null);

  const [open, setOpen] = useState(false);

  const [scheduleProjectOpen, setScheduleProjectOpen] = useState(false);

  const [btnLoading, setBtnLoading] = useState(false);

  const [selectableItems, setSelectableItems] = useState([]);

  const [rows, setRows] = useState([initialRow]);

  const [selectedPurpose, setSelectedPurpose] = useState(null);

  const [openInterpolationSetup, setOpenInterpolationSetup] = useState(false);

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

    width:
      type && entryType === "autoGenerate"
        ? Yup.string().required("Width is required")
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

    if (id && name === "purpose") {
      const selected = survey?.purposes?.find((p) => p.type === value);
      const items =
        selected?.rows
          ?.filter((r) => r.type === "Chainage")
          ?.map((s) => ({
            label: s.chainage,
            value: s.chainage,
          })) || [];

      setSelectableItems(items);
      setSelectedPurpose(selected);
    }

    if (name === "width") {
      if (value !== "Custom") {
        setRows([initialRow]);
      }

      setOpenInterpolationSetup(value === "Custom");
    }

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
        ? entryType === "autoGenerate" && type === false
          ? await createSurveyPurpose(id, formValues)
          : await generateSurveyPurpose(id, {
              ...formValues,
              interpolation: rows,
            })
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
            : id && entryType === "autoGenerate" && type === true
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
    if (type && entryType === "autoGenerate") {
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

            if (
              e.name === "length" ||
              e.name === "width" ||
              e.name === "formula"
            ) {
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

  const handleCloseInterpolationSetup = () => {
    setOpenInterpolationSetup(false);
  };

  const getIndex = (value) =>
    selectableItems.findIndex((i) => i.value === value);

  const getFromOptions = (rowIndex) => {
    if (rowIndex === 0) return selectableItems;
    const prevTo = rows[rowIndex - 1]?.to;
    if (!prevTo) return [];
    const prevToIndex = getIndex(prevTo);
    return selectableItems.slice(prevToIndex);
  };

  const getToOptions = (rowIndex) => {
    const fromValue = rows[rowIndex]?.from;
    if (!fromValue) return [];
    const fromIndex = getIndex(fromValue);
    return selectableItems.slice(fromIndex + 1);
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const updatedRow = {
        ...prev[index],
        [field]: value,
        ...(field === "from" ? { to: "" } : {}),
      };

      if (!updatedRow.to) {
        return [...prev.slice(0, index), updatedRow];
      }

      const updatedToIndex = getIndex(updatedRow.to);

      const validNextRows = prev.slice(index + 1).filter((row) => {
        if (!row.from) return false;
        return getIndex(row.from) >= updatedToIndex;
      });

      return [...prev.slice(0, index), updatedRow, ...validNextRows];
    });
  };

  const handleAddRow = () => {
    setRows((prev) => {
      const lastRow = prev[prev.length - 1];
      return [
        ...prev,
        {
          from: lastRow.to || "",
          to: "",
          remark: "",
        },
      ];
    });
  };

  const handleRemoveRow = (index) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const interpolationSetupAlertData = {
    title: (
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        Interpolation Setup{" "}
        <Box sx={addButtonSx} onClick={handleAddRow}>
          <IoAdd size={18} />
          Add Range
        </Box>
      </Stack>
    ),
    description: "",
    content: (
      <Box mt={2}>
        {rows?.map((row, index) => (
          <Stack
            direction="row"
            spacing={2}
            alignItems="end"
            mb={2}
            key={index}
          >
            <BasicSelect
              label="From"
              value={row.from}
              options={getFromOptions(index)}
              onChange={(e) => handleRowChange(index, "from", e.target.value)}
            />

            <BasicSelect
              label="To"
              value={row.to}
              options={getToOptions(index)}
              onChange={(e) => handleRowChange(index, "to", e.target.value)}
            />

            <BasicInput
              label="Width"
              value={row.width}
              type="number"
              onChange={(e) => handleRowChange(index, "width", e.target.value)}
            />

            <Box onClick={() => handleRemoveRow(index)}>
              <IoIosRemove />
            </Box>
          </Stack>
        ))}
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
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pb: { xs: 8, md: 12 } }}>
      <SmallHeader />

      {/* Internal Modals */}
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

      <AlertDialogSlide
        {...interpolationSetupAlertData}
        open={openInterpolationSetup}
        onCancel={handleCloseInterpolationSetup}
        onSubmit={handleCloseInterpolationSetup}
      />

      {/* Main Form Layout Container */}
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: "28px",
            bgcolor: "#ffffff",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Decorative Gradient Header */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "linear-gradient(90deg, #4f46e5 0%, #0ea5e9 100%)",
            }}
          />

          <Stack direction="row" alignItems="center" mb={5} mt={1}>
            <IconButton
              onClick={handleGoBack}
              sx={{
                bgcolor: "#f1f5f9",
                color: "#475569",
                borderRadius: "16px",
                width: 48,
                height: 48,
                mr: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#e2e8f0",
                  color: "#1e293b",
                  transform: "translateX(-2px)",
                },
              }}
            >
              <MdArrowBackIosNew size={22} />
            </IconButton>

            <Box>
              <Typography
                variant="h4"
                fontWeight={900}
                color="#1e293b"
                sx={{
                  letterSpacing: "-0.02em",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Create New {id ? "Survey" : "Project"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
                mt={0.5}
              >
                Please fill in the required details accurately
              </Typography>
            </Box>
          </Stack>

          <Stack
            width={"100% !important"}
            spacing={4}
            className="input-wrapper"
          >
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

          <Stack
            width={"100%"}
            gap={2}
            direction={{ xs: "column", sm: "row" }}
            pt={3}
          >
            {!id && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: "100%" }}
              >
                <BasicButtons
                  value={
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        fontSize="1.05rem"
                        fontWeight={800}
                        letterSpacing="0.05em"
                      >
                        SCHEDULE
                      </Typography>
                      <FaCalendarAlt fontSize="20px" />
                    </Stack>
                  }
                  sx={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "white",
                    height: "60px",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                      boxShadow: "0 15px 30px -5px rgba(245, 158, 11, 0.5)",
                    },
                  }}
                  fullWidth={true}
                  onClick={() => setScheduleProjectOpen(true)}
                  loading={btnLoading}
                />
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: "100%" }}
            >
              <BasicButtons
                value={
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      fontSize="1.05rem"
                      fontWeight={800}
                      letterSpacing="0.05em"
                    >
                      CONTINUE
                    </Typography>
                    <IoIosArrowForward fontSize="22px" />
                  </Stack>
                }
                sx={{
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                  color: "white",
                  height: "60px",
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)",
                    boxShadow: "0 15px 30px -5px rgba(99, 102, 241, 0.5)",
                  },
                }}
                fullWidth={true}
                onClick={preSubmitCheck}
                loading={btnLoading}
              />
            </motion.div>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default RoadSurveyForm;
