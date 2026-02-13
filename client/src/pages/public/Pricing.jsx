import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Grid,
  Paper,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop";

// --- Icons ---
const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6366f1"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const PricingCard = ({
  tier,
  price,
  duration,
  features,
  highlighted = false,
  buttonText = "Get Started",
}) => (
  <motion.div
    whileHover={{ y: -10 }}
    transition={{ type: "spring", stiffness: 300 }}
    style={{ height: "100%" }}
  >
    <Paper
      elevation={0}
      sx={{
        p: 5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 6,
        border: "1px solid",
        borderColor: highlighted ? "#6366f1" : "rgba(0,0,0,0.08)",
        bgcolor: highlighted ? "#fff" : "rgba(255,255,255,0.6)",
        position: "relative",
        overflow: "hidden",
        boxShadow: highlighted
          ? "0 30px 60px rgba(99, 102, 241, 0.15)"
          : "none",
      }}
    >
      {highlighted && (
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: -35,
            bgcolor: "#6366f1",
            color: "white",
            px: 6,
            py: 0.5,
            transform: "rotate(45deg)",
            fontSize: "0.75rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Most Popular
        </Box>
      )}

      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "#111" }}>
        {tier}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "baseline", mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: "#000" }}>
          ₹{price}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", ml: 1 }}>
          /{duration}
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ mb: 5, flexGrow: 1 }}>
        {features.map((feature, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <CheckIcon />
            <Typography variant="body2" sx={{ color: "#444", fontWeight: 500 }}>
              {feature}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Button
        variant={highlighted ? "contained" : "outlined"}
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 700,
          fontSize: "1rem",
          bgcolor: highlighted ? "#6366f1" : "transparent",
          color: highlighted ? "#fff" : "#111",
          borderColor: highlighted ? "#6366f1" : "rgba(0,0,0,0.2)",
          "&:hover": {
            bgcolor: highlighted ? "#4f46e5" : "rgba(0,0,0,0.05)",
            borderColor: highlighted ? "#4f46e5" : "#000",
          },
        }}
      >
        {buttonText}
      </Button>
    </Paper>
  </motion.div>
);

const FAQItem = ({ question, answer }) => (
  <Accordion
    elevation={0}
    disableGutters
    sx={{
      bgcolor: "transparent",
      "&:before": { display: "none" },
      borderBottom: "1px solid rgba(0,0,0,0.06)",
    }}
  >
    <AccordionSummary expandIcon={<ChevronDownIcon />} sx={{ px: 0, py: 1 }}>
      <Typography sx={{ fontWeight: 700, color: "#111" }}>
        {question}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ px: 0, pb: 3 }}>
      <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
        {answer}
      </Typography>
    </AccordionDetails>
  </Accordion>
);

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      tier: "Professionals",
      price: billingCycle === "monthly" ? "7500" : "4500",
      duration: billingCycle === "monthly" ? "mo" : "yr",
      features: [
        "Single User Access",
        "Online training ",
        "Priority email support ",
        "Community Access",
        "Export to .pdf, .csv, .dwg, .xlsx formats",
      ],
    },
    {
      tier: "Institutions",
      price: billingCycle === "monthly" ? "79" : "720",
      duration: billingCycle === "monthly" ? "mo" : "yr",
      highlighted: true,
      features: [
        "Up to 5 Team Members",
        "Advanced Terrain Modeling",
        "Unlimited Cloud Storage",
        "Priority Email Support",
        "High-Res Render Exports",
        "API Access",
      ],
    },
    {
      tier: "Students",
      price: "Custom",
      duration: "org",
      buttonText: "Contact Sales",
      features: [
        "Unlimited Users",
        "Dedicated Account Manager",
        "SLA Guarantee",
        "Custom Feature Development",
        "SSO & Security Controls",
        "On-site Training",
      ],
    },
  ];

  return (
    <>
      <ScrollToTop />
      <Box
        sx={{ bgcolor: "#fcfcfd", minHeight: "100vh", py: { xs: 8, md: 12 } }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography
              sx={{
                color: "#6366f1",
                fontWeight: 800,
                letterSpacing: 1.5,
                fontSize: "0.9rem",
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              Pricing Plans
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 900,
                mb: 3,
                color: "#000",
                letterSpacing: "-0.02em",
              }}
            >
              Pricing for every stage <br /> of your career.
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: billingCycle === "monthly" ? "#000" : "text.secondary",
                }}
              >
                Monthly
              </Typography>
              <Switch
                checked={billingCycle === "yearly"}
                onChange={() =>
                  setBillingCycle(
                    billingCycle === "monthly" ? "yearly" : "monthly",
                  )
                }
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#6366f1" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#6366f1",
                  },
                }}
              />
              <Typography
                sx={{
                  fontWeight: 600,
                  color: billingCycle === "yearly" ? "#000" : "text.secondary",
                }}
              >
                Yearly{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#10b981",
                    ml: 1,
                    fontSize: "0.8rem",
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  Save 20%
                </Box>
              </Typography>
            </Stack>
          </Box>

          {/* Cards */}
          <Grid container spacing={4} sx={{ mb: 15 }}>
            {plans.map((plan, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <PricingCard {...plan} />
              </Grid>
            ))}
          </Grid>

          {/* FAQ Section */}
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mb: 6, textAlign: "center" }}
            >
              Frequently Asked Questions
            </Typography>
            <Stack spacing={1}>
              <FAQItem
                question="Can I upgrade or downgrade my plan later?"
                answer="Yes, you can change your plan at any time. If you upgrade, the price difference will be prorated. If you downgrade, you'll receive credit towards your next billing cycle."
              />
              <FAQItem
                question="Is there a free trial available?"
                answer="We offer a 14-day free trial on our Individual and Professional plans. No credit card is required to start your trial."
              />
              <FAQItem
                question="Do you offer discounts for educational institutions?"
                answer="Absolutely. We have special pricing for universities and non-profit organizations. Contact our sales team to learn more about our Academic Partnership program."
              />
              <FAQItem
                question="What happens to my data if I cancel?"
                answer="Your data is yours. If you cancel your subscription, you'll have 30 days to export your projects before they are moved to our archival storage."
              />
            </Stack>
          </Box>

          {/* Final CTA */}
          <Paper
            elevation={0}
            sx={{
              mt: 15,
              p: { xs: 4, md: 8 },
              bgcolor: "#000",
              color: "#fff",
              borderRadius: 8,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Still have questions?
            </Typography>
            <Typography
              sx={{
                opacity: 0.7,
                mb: 4,
                maxWidth: 600,
                mx: "auto",
                fontSize: "1.1rem",
              }}
            >
              Our team is here to help you find the right plan for your specific
              surveying and CAD needs.
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#fff",
                color: "#000",
                px: 6,
                py: 2,
                borderRadius: 3,
                fontWeight: 800,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": { bgcolor: "#f0f0f0" },
              }}
            >
              Chat with an Expert
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Pricing;
