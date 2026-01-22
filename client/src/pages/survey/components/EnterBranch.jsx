import * as Yup from "yup";
import { useState } from "react";
import AlertDialogSlide from "../../../components/AlertDialogSlide";
import { handleFormError } from "../../../utils/handleFormError";
import { Stack, Typography } from "@mui/material";
import BasicInput from "../../../components/BasicInput";
import BasicCheckbox from "../../../components/BasicCheckbox";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enterBranch } from "../../../services/surveyServices";
import BasicAutocomplete from "../../../components/BasicAutocomplete";

const initialFormValues = {
  name: "",
  branchId: "",
  proposedLevel: "",
  crossSectionType: "Camper",
  crossSectionCamper: "",
  crossSectionSlop: "",
  reducedLevel: "",
  backSight: "",
};

const numberField = () =>
  Yup.number()
    .transform((v, o) => (o === "" ? undefined : v))
    .typeError("Must be a number");

const EnterBranch = ({
  phase,
  open,
  handleClose,
  surveyId,
  purposeId,
  branches,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});

  const isProposal = phase === "Proposal";

  const schema = Yup.object().shape({
    branchId: Yup.string().required("Branch name is required"),

    proposedLevel: numberField().when("$isProposal", {
      is: true,
      then: (s) => s.required("Proposed level is required"),
      otherwise: (s) => s.notRequired(),
    }),

    reducedLevel: numberField().when("$isProposal", {
      is: false,
      then: (s) => s.required("Reduced level is required"),
      otherwise: (s) => s.notRequired(),
    }),

    backSight: numberField().when("$isProposal", {
      is: false,
      then: (s) => s.required("Back sight is required"),
      otherwise: (s) => s.notRequired(),
    }),

    crossSectionCamper: Yup.string().when(["$isProposal", "crossSectionType"], {
      is: (isProposal, type) => isProposal && type === "Camper",
      then: (s) => s.required("Camper value is required"),
      otherwise: (s) => s.notRequired(),
    }),

    crossSectionSlop: Yup.string().when(["$isProposal", "crossSectionType"], {
      is: (isProposal, type) => isProposal && type === "Slop",
      then: (s) => s.required("Slop value is required"),
      otherwise: (s) => s.notRequired(),
    }),
  });

  /* ------------------ change handler ------------------ */
  const handleInputChange = async (event, newValue, isAutocomplete) => {
    const { name, value, type } = event.target;

    const autoComplete = isAutocomplete === "autocomplete";

    if (autoComplete) {
      setFormValues((prev) => ({
        ...prev,
        name: newValue,
        branchId: newValue?.value,
      }));
    } else {
      const isCheckBox = type === "checkbox";

      setFormValues((prev) => ({
        ...prev,
        [isCheckBox ? "crossSectionType" : name]: isCheckBox ? name : value,
      }));
    }

    try {
      await Yup.reach(schema, autoComplete ? "branchId" : name).validate(
        autoComplete ? newValue?.value : value,
        {
          context: { isProposal },
        },
      );

      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: error.message,
      }));
    }
  };

  /* ------------------ submit ------------------ */
  const handleSubmit = async () => {
    try {
      await schema.validate(formValues, {
        abortEarly: false,
        context: { isProposal },
      });

      const { data } = await enterBranch(surveyId, {
        ...formValues,
        purposeId,
        phase,
      });

      if (!data.success) throw new Error("Something went wrong");

      setFormValues(initialFormValues);
      handleClose();
      navigate(`/survey/road-survey/${data.purposeId}/rows`);
    } catch (error) {
      handleFormError(error, setFormErrors, dispatch, navigate);
    }
  };

  /* ------------------ dialog ------------------ */
  const alertData = {
    title: "Enter Branch",
    description: "",
    content: (
      <Stack spacing={2}>
        <BasicAutocomplete
          label={"Select Branch"}
          options={
            branches?.length
              ? branches?.map((s) => ({ label: s.name, value: s.surveyId }))
              : []
          }
          value={formValues.name}
          onChange={(e, newValue) =>
            handleInputChange(e, newValue, "autocomplete")
          }
          placeholder={"Select..."}
          error={formErrors.branchId}
        />

        {isProposal ? (
          <>
            <BasicInput
              label="Proposed level"
              name="proposedLevel"
              type="number"
              value={formValues.proposedLevel}
              onChange={handleInputChange}
              error={formErrors.proposedLevel}
            />

            {/* Cross Section Type */}
            <Stack direction="row" spacing={2}>
              {["Camper", "Slop"].map((type) => (
                <Stack key={type} direction="row" alignItems="center">
                  <Typography fontWeight={600}>{type}</Typography>

                  <BasicCheckbox
                    name={type}
                    checked={formValues.crossSectionType === type}
                    onChange={handleInputChange}
                  />
                </Stack>
              ))}
            </Stack>

            {formValues.crossSectionType === "Camper" ? (
              <BasicInput
                label="Cross section camper"
                name="crossSectionCamper"
                value={formValues.crossSectionCamper}
                onChange={handleInputChange}
                error={formErrors.crossSectionCamper}
              />
            ) : (
              <BasicInput
                label="Cross section slop"
                name="crossSectionSlop"
                value={formValues.crossSectionSlop}
                onChange={handleInputChange}
                error={formErrors.crossSectionSlop}
              />
            )}
          </>
        ) : (
          <>
            <BasicInput
              label="Reduced level"
              name="reducedLevel"
              type="number"
              value={formValues.reducedLevel}
              onChange={handleInputChange}
              error={formErrors.reducedLevel}
            />

            <BasicInput
              label="Back sight"
              name="backSight"
              type="number"
              value={formValues.backSight}
              onChange={handleInputChange}
              error={formErrors.backSight}
            />
          </>
        )}
      </Stack>
    ),
    cancelButtonText: "Cancel",
    submitButtonText: "Submit",
  };

  return (
    <AlertDialogSlide
      {...alertData}
      open={open}
      onCancel={handleClose}
      onSubmit={handleSubmit}
    />
  );
};

export default EnterBranch;
