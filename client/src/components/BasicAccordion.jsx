import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

const BasicAccordion = ({ summary, details, expandIcon, sx = {} }) => {
  return (
    <Accordion sx={sx}>
      <AccordionSummary
        expandIcon={expandIcon}
        sx={{
          padding: 0,
          minWidth: 0,
          overflow: "hidden",
          "& .MuiAccordionSummary-content": {
            minWidth: 0,
            overflow: "hidden",
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            flexShrink: 0,
          },
        }}
      >
        {summary}
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>{details}</AccordionDetails>
    </Accordion>
  );
};

export default BasicAccordion;
