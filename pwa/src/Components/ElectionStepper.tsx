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
import { dateToString } from "../util/dateToString";
import { Link } from "react-router-dom";

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
  if (election.stage == "announcement") return 0;
  if (election.stage == "registration_of_candidates") return 1;
  if (election.stage == "campaign") return 2;
  if (election.stage == "electronic_voting") return 3;
  if (election.stage == "ballot_voting") return 4;
  if (election.stage == "preliminary_results") return 5;
  if (election.stage == "complaints") return 6;
  if (election.stage == "final_results") return 7;

  return 0;
}

const steps = [
  {
    label: (election: Election) =>
      `Vyhlášení voleb ${dateToString(election.announcementDate)}`,
    description: `Volby vyhlašuje volební komise.`,
  },
  {
    label: (election: Election) =>
      `Přihlašování kandidátů ${dateToString(
        election.registrationOfCandidatesDate
      )}`,
    description: `Kandidovat do představenstva klubu může pouze člen SH, který není zároveň členem volební komise. Kandidovat lze současně pouze na jednu pozici.
    Přihlašuje se elektronicky na e-mail volební komise volby@sh.cvut.cz z klubové e-mailové adresy. Tou se rozumí adresa v doméně siliconhill.cz nebo sh.cvut.cz.`,
    action: (election: Election) => (
      <Link to={`/auth/user/elections/${election.id}/candidates/create`}>
        <Button color="primary">Chci kandidovat</Button>
      </Link>
    ),
  },
  {
    label: (election: Election) =>
      `Volební kampaň ${dateToString(election.campaignDate)}`,
    description: `Volební kampaní se rozumí jakákoliv propagace kandidáta nebo volební agitace ve
prospěch kandidáta.`,
  },
  {
    label: (election: Election) =>
      `Elektronické hlasování ${dateToString(election.electronicVotingDate)}`,
    description: "Hlasovat můžete na adrese volby.sh.cvut.cz",
  },
  {
    label: (election: Election) =>
      `Urnové hlasování ${dateToString(election.ballotVotingDate)}`,
    description: "Hlasovat fyzicky je možné pouze ve stanovenou dobu.",
  },
  { label: (election: Election) => "Vyhlášení předběžných výsledků" },
  { label: (election: Election) => "Uzávěrka podávání stížností" },
  { label: (election: Election) => "Vyhlášení konečných výsledků" },
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
        <Step key={step.label(election)}>
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
              {step.label(election)}
            </StepLabel>
          </AddTooltip>
          <StepContent>
            <Typography color="textSecondary">{step.description}</Typography>
            {step.action ? <Box pt={2}>{step.action(election)}</Box> : null}
          </StepContent>
        </Step>
      ))}
    </Stepper>
    // </Box>
  );
}
