import * as Yup from "yup";
import { useState } from "react";
import AlertDialogSlide from "../../../components/AlertDialogSlide";
import { handleFormError } from "../../../utils/handleFormError";
import { Box, Stack } from "@mui/material";
import BasicInput from "../../../components/BasicInput";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBranch, createBreak } from "../../../services/surveyServices";
import { useEffect } from "react";

const schema = Yup.object().shape({
  from: Yup.string()
    .required("From is required")
    .matches(
      /^\d+(\/|\+|,)\d+(\.\d{1,3})?$/,
      "Invalid chainage format. Use ####/###.### or '####+###.###' or '####,###.###'",
    ),
  to: Yup.string()
    .required("To is required")
    .matches(
      /^\d+(\/|\+|,)\d+(\.\d{1,3})?$/,
      "Invalid chainage format. Use ####/###.### or '####+###.###' or '####,###.###'",
    ),
  remark: Yup.string().required("Remark is required"),
});

const initialFormValues = {
  from: "",
  to: "",
  remark: "",
};

const AddBreak = ({ open, handleClose, purposeId, chainage }) => {
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

      const { data } = await createBreak(purposeId, formValues);

      if (data.success) {
        setFormValues(initialFormValues);
        handleClose();

        navigate(`/survey/road-survey/${purposeId}/rows`, {
          state: { refresh: Date.now() },
        });
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error) {
      handleFormError(error, setFormErrors, dispatch, navigate);
    }
  };

  const alertData = {
    title: "Add Break",
    description: "",
    content: (
      <Stack spacing={2}>
        <Stack direction={"row"} spacing={2}>
          <BasicInput
            label="From*"
            name="from"
            value={formValues.from}
            onChange={handleInputChange}
            error={formErrors.from}
          />
          <BasicInput
            label="To*"
            name="to"
            value={formValues.to}
            onChange={handleInputChange}
            error={formErrors.to}
          />
        </Stack>

        <BasicInput
          label="Remark"
          name="remark"
          type="text"
          value={formValues.remark}
          onChange={handleInputChange}
          error={formErrors.remark}
        />
      </Stack>
    ),
    cancelButtonText: "Cancel",
    submitButtonText: "Submit",
  };

  useEffect(() => {
    setFormValues((prev) => ({ ...prev, from: chainage }));
  }, [chainage]);

  return (
    <AlertDialogSlide
      {...alertData}
      open={open}
      onCancel={handleClose}
      onSubmit={handleSubmit}
    />
  );
};

export default AddBreak;
