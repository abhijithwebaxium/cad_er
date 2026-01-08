import { Box, Stack } from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";
import BasicInput from "../../../components/BasicInput";
import BasicButton from "../../../components/BasicButton";
import { handleFormError } from "../../../utils/handleFormError";

const schema = Yup.object().shape({
  id: Yup.string().required("Required"),
});

const validCertificate = "CADER-CERT-2025-0012";

const ValidateCertificate = ({ onCancel }) => {
  const [formValues, setFormValues] = useState({ id: "CADER-CERT-" });

  const [formErrors, setFormErrors] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

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

      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        if (formValues.id === validCertificate) {
          setResult({
            name: "John Doe",
            education: "B.Tech",
            courseStarted: "12/11/2025",
            courseCompleted: "12/12/2025",
            certificateId: formValues.id,
          });
        } else {
          setResult("not_found");
        }

        setLoading(false);
      }, 800);
    } catch (error) {
      handleFormError(error, setFormErrors, dispatch, navigate);
    }
  };

  const handleReset = () => {
    setFormValues({ id: "CADER-CERT-" });
    setFormErrors(null);
    setResult(null);
  };

  return (
    <Box mt={2}>
      {/* ================= STUDENT FOUND ================= */}
      {result && result !== "not_found" ? (
        <Box
          sx={{
            maxWidth: 500,
            mx: "auto",
            mt: { xs: 2, sm: 3 },
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            border: "2px solid #1976d2",
            position: "relative",
            background: "linear-gradient(135deg, #f9fbff, #eef3ff)",
            boxShadow: 3,
          }}
        >
          {/* Watermark */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: { xs: 40, sm: 80 },
              fontWeight: 700,
              color: "rgba(25, 118, 210, 0.06)",
              userSelect: "none",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            VERIFIED
          </Box>

          {/* Header */}
          <Box textAlign="center" mb={{ xs: 1.5, sm: 2 }}>
            <Box
              component="h2"
              sx={{
                m: 0,
                color: "#1976d2",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              Certificate of Verification
            </Box>
            <Box
              component="p"
              sx={{
                m: 0,
                color: "#555",
                fontSize: { xs: "0.85rem", sm: "1rem" },
              }}
            >
              This certifies that the following details are valid
            </Box>
          </Box>

          {/* Details */}
          <Box mt={{ xs: 2, sm: 3 }}>
            {[
              ["Name", result.name],
              ["Education", result.education],
              ["Course Started", result.courseStarted],
              ["Course Completed", result.courseCompleted],
              ["Certificate ID", result.certificateId],
            ].map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0.5, sm: 1 },
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    fontWeight: 600,
                    minWidth: 120,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >
                  {label}:
                </Box>
                <Box
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    wordBreak: "break-word",
                  }}
                >
                  {value}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Button */}
          <Box mt={{ xs: 2, sm: 3 }} textAlign="center">
            <BasicButton
              variant="text"
              color="primary"
              value="Check Another"
              onClick={handleReset}
            />
          </Box>
        </Box>
      ) : (
        <>
          {/* ================= FORM ================= */}
          <BasicInput
            name="id"
            label="Certificate ID"
            value={formValues.id}
            onChange={handleInputChange}
            error={formErrors?.id}
            sx={{
              "& .MuiInputBase-input": { textTransform: "uppercase" },
            }}
          />

          {result === "not_found" && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 1.5,
                backgroundColor: "#fff5f5",
                border: "1px solid #ffcdd2",
                color: "#c62828",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>❌</span>
              No student found for this certificate ID.
            </Box>
          )}

          <Stack direction="row" justifyContent="end" gap={0.2} mt={2}>
            <BasicButton
              variant="text"
              color="primary"
              value="Cancel"
              onClick={onCancel}
            />
            <BasicButton
              variant="text"
              color="primary"
              value={loading ? "Checking..." : "Validate"}
              onClick={handleSubmit}
              disabled={formErrors?.id || loading}
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default ValidateCertificate;
