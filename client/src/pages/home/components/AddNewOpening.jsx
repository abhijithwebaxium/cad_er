import * as Yup from "yup";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleFormError } from "../../../utils/handleFormError";
import { Button, Grid, Stack } from "@mui/material";
import BasicInput from "../../../components/BasicInput";
import BasicSelect from "../../../components/BasicSelect";
import { createOpening } from "../../../services/openingServices";
import { showAlert } from "../../../redux/alertSlice";

const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  location: Yup.string().required("Location is required"),
  stipend: Yup.string().required("Stipend is required"),
  deadline: Yup.string().required("Deadline is required"),
  tags: Yup.string().required("Tags is required"),
  description: Yup.string().required("Description is required"),
});

const initialFormValues = {
  title: "",
  location: "",
  stipend: "",
  deadline: "",
  tags: "",
  description: "",
};

const AddNewOpening = ({ onClose }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(initialFormValues);

  const [formErrors, setFormErrors] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      await schema.validate(formValues, { abortEarly: false });

      const { data } = await createOpening(formValues);

      setFormValues(initialFormValues);

      dispatch(
        showAlert({
          type: "success",
          message: "Opening created successfully",
        }),
      );

      onClose(data.opening);
    } catch (error) {
      handleFormError(error, setFormErrors, dispatch, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  const inputDetails = [
    {
      label: "Title",
      name: "title",
      value: formValues.title,
      onChange: handleInputChange,
      error: !!formErrors?.title,
      helperText: formErrors?.title,
    },
    {
      label: "Location",
      name: "location",
      value: formValues.location,
      onChange: handleInputChange,
      error: !!formErrors?.location,
      helperText: formErrors?.location,
    },
    {
      label: "Stipend",
      name: "stipend",
      value: formValues.stipend,
      onChange: handleInputChange,
      error: !!formErrors?.stipend,
      helperText: formErrors?.stipend,
    },
    {
      label: "Deadline",
      name: "deadline",
      type: "date",
      value: formValues.deadline,
      onChange: handleInputChange,
      error: !!formErrors?.deadline,
      helperText: formErrors?.deadline,
    },
    {
      label: "Tags",
      name: "tags",
      mode: "select",
      value: formValues.tags,
      onChange: handleInputChange,
      error: !!formErrors?.tags,
      helperText: formErrors?.tags,
      options: ["Immediate Start", "Housing"],
    },
    {
      label: "Description",
      name: "description",
      value: formValues.description,
      onChange: handleInputChange,
      error: !!formErrors?.description,
      helperText: formErrors?.description,
    },
  ];

  return (
    <Stack spacing={2} mt={2}>
      <Grid container spacing={2}>
        {inputDetails.map((input, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6 }}>
            {input.mode === "select" ? (
              <BasicSelect
                label={input.label}
                name={input.name}
                value={input.value}
                options={input.options}
                onChange={input.onChange}
                error={input.error}
                helperText={input.helperText}
              />
            ) : (
              <BasicInput
                label={input.label}
                name={input.name}
                value={input.value}
                type={input.type || "text"}
                onChange={input.onChange}
                error={input.error}
                helperText={input.helperText}
              />
            )}
          </Grid>
        ))}
      </Grid>

      <Stack direction={"row"} spacing={2} justifyContent="flex-end">
        {!isLoading && (
          <Button onClick={onClose} sx={{ p: 0 }}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} sx={{ p: 0 }} loading={isLoading}>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddNewOpening;
