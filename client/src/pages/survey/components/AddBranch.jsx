import * as Yup from "yup";
import { useState } from "react";
import AlertDialogSlide from "../../../components/AlertDialogSlide";
import { handleFormError } from "../../../utils/handleFormError";
import { Box, Stack } from "@mui/material";
import BasicInput from "../../../components/BasicInput";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBranch } from "../../../services/surveyServices";

const schema = Yup.object().shape({
  name: Yup.string().required("Branch name is required"),
  reducedLevel: Yup.number().required("Reduced level is required"),
  backSight: Yup.number().required("Back sight is required"),
});

const initialFormValues = {
  name: "",
  reducedLevel: "",
  backSight: "",
};

const AddBranch = ({ open, handleClose, surveyId, purposeId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});

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
    try {
      await schema.validate(formValues, { abortEarly: false });

      const { data } = await createBranch(surveyId, {
        ...formValues,
        purposeId,
      });

      if (data.success) {
        setFormValues(initialFormValues);
        handleClose();

        navigate(`/survey/road-survey/${data.purposeId}/rows`);
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error) {
      handleFormError(error, setFormErrors, dispatch, navigate);
    }
  };

  const alertData = {
    title: "Add Branch",
    description: "",
    content: (
      <Stack spacing={2}>
        <BasicInput
          label="Branch name"
          name="name"
          value={formValues.name}
          onChange={handleInputChange}
          error={formErrors.name}
        />

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

export default AddBranch;
