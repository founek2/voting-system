import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Election } from "../types";
import { isAfter, isBefore } from "date-fns";
import { SxProps } from "@mui/system";
import { Tooltip } from "@mui/material";

// announcementDate?: string;
// registrationOfCandidatesDate?: string | null;
// campaignDate?: string | null;
// electronicVotingDate?: string | null;
// ballotVotingDate?: string | null;
// preliminaryResultsDate?: string | null;
// complaintsDeadlineDate?: string | null;
// finalResultsDate?: string | null;
// candidates?: Array<Candidate_jsonld_election_read>;

function hasPassed(date?: string | Date) {
  if (!date) return false;

  return isBefore(new Date(date), new Date());
}

function isFuture(date?: string | Date | null) {
  if (!date) return true;

  return isAfter(new Date(date), new Date());
}

function getStep(election: Election) {
  if (isFuture(election.announcementDate)) return 0;
  if (isFuture(election.registrationOfCandidatesDate)) return 1;
  if (isFuture(election.campaignDate)) return 2;
  if (isFuture(election.electronicVotingDate)) return 3;
  if (isFuture(election.ballotVotingDate)) return 4;
  if (isFuture(election.preliminaryResultsDate)) return 5;
  if (isFuture(election.complaintsDeadlineDate)) return 6;
  if (isFuture(election.finalResultsDate)) return 7;

  return 0;
}

const steps = [
  {
    label: "Vyhlášení voleb",
    description: `Volby vyhlašuje volební komise.`,
  },
  {
    label: "Přihlašování kandidátů",
    description: `Kandidovat do představenstva klubu může pouze člen SH, který není zároveň členem volební komise. Kandidovat lze současně pouze na jednu pozici.
    Přihlašuje se elektronicky na e-mail volební komise volby@sh.cvut.cz z klubové e-mailové adresy. Tou se rozumí adresa v doméně siliconhill.cz nebo sh.cvut.cz.`,
  },
  {
    label: "Volební kampaň",
    description: `Volební kampaní se rozumí jakákoliv propagace kandidáta nebo volební agitace ve
prospěch kandidáta.`,
  },
  {
    label: "Elektronické hlasování",
    description: "Hlasovat můžete na adrese volby.sh.cvut.cz",
  },
  {
    label: "Urnové hlasování",
    description: "Hlasovat fyzicky je možné pouze ve stanovenou dobu.",
  },
  { label: "Vyhlášení výsledků" },
  { label: "Vyhlášení předběžných výsledků" },
  { label: "Uzávěrka podávání stížností" },
  { label: "Vyhlášení konečných výsledků" },
];

function AddTooltip({
  step,
  currentStep,
  children,
  title,
}: {
  step: number;
  currentStep: number;
  children: JSX.Element;
  title?: string;
}) {
  if (step === currentStep) return children;

  return <Tooltip title={title}>{children}</Tooltip>;
}

interface ElectionStepperProps {
  election: Election;
  sx?: SxProps;
}
export default function ElectionStepper({
  election,
  sx,
}: ElectionStepperProps) {
  const [activeStep, setActiveStep] = React.useState(getStep(election));

  return (
    // <Box sx={{ maxWidth: 400 }}>
    <Stepper activeStep={activeStep} orientation="vertical" sx={sx}>
      {steps.map((step, index) => (
        <Step key={step.label}>
          <AddTooltip
            title={step.description}
            step={index}
            currentStep={activeStep}
          >
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Poslední krok</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
          </AddTooltip>
          <StepContent>
            <Typography>{step.description}</Typography>
          </StepContent>
        </Step>
      ))}
    </Stepper>
    // </Box>
  );
}
