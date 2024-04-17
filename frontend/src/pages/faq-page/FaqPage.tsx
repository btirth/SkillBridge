import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  faqContentAbout,
  faqContentContact,
  faqContentGetStarted,
} from "./faqContent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FaqPage = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      event.stopPropagation();
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Grid component="main" xs={12}>
      <Typography variant="h5">Frequently Asked Questions</Typography>

      <Typography variant="h6" mt="20px" mb="10px">
        Get started
      </Typography>
      {faqContentGetStarted.map((faq, index) => {
        return (
          <Accordion
            key={"faq-started" + index}
            expanded={expanded === `faq-started${index}`}
            onChange={handleChange(`faq-started${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id={`faq-started${index}-header`}
            >
              <Typography fontWeight={500}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ whiteSpace: "pre-line" }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}

      <Typography variant="h6" mt="20px" mb="10px">
        Contact
      </Typography>
      {faqContentContact.map((faq, index) => {
        return (
          <Accordion
            key={"faq-contact" + index}
            expanded={expanded === `faq-contact${index}`}
            onChange={handleChange(`faq-contact${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id={`faq-contact${index}-header`}
            >
              <Typography fontWeight={500}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}

      <Typography variant="h6" mt="20px" mb="10px">
        About us
      </Typography>
      {faqContentAbout.map((faq, index) => {
        return (
          <Accordion
            key={"faq-about" + index}
            expanded={expanded === `faq-about${index}`}
            onChange={handleChange(`faq-about${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id={`faq-about${index}-header`}
            >
              <Typography fontWeight={500}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Grid>
  );
};

export default FaqPage;
