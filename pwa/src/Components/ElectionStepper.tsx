import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Election } from "../types";
import { isAfter, isBefore, subDays } from "date-fns";
import { SxProps } from "@mui/system";
import { Tooltip } from "@mui/material";
import { dateToString } from "../util/dateToString";
import { Link } from "react-router-dom";
import { RawText } from "./RawText";
import { useTranslation, } from "react-i18next";
import { TFunction, TFunctionStrict } from "i18next";
import { DefaultNS, LocalizedLabelKey } from "../locales/i18n";

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
  if (election.stage == "counting_votes") return 7;
  if (election.stage == "final_results") return 8;

  return 0;
}

type StepType = {
  label: (election: Election) => LocalizedLabelKey;
  date: (election: Election) => string;
  description: LocalizedLabelKey;
  action?: (election: Election) => JSX.Element;
};

// type G = Parameters<TFunctionStrict<DefaultNS>>
// const a: G[0]  =  'step0'

const steps: readonly StepType[] = [
  {
    label: (election: Election) => 'stepper.step0.label',
    date: (election: Election) => `${dateToString(election.announcementDate)} - 
          ${dateToString(election.registrationOfCandidatesDate, {
      subDays: 1,
    })}`,
    description: 'stepper.step0.description',
  },
  {
    label: (election: Election) => 'stepper.step1.label',
    date: (election: Election) =>
      `${dateToString(election.registrationOfCandidatesDate)} - ${dateToString(
        election.campaignDate,
        {
          subDays: 1,
        }
      )}`,
    description: 'stepper.step1.description',
    action: (election: Election) => (
      <Link to={`/auth/user/elections/${election.id}/candidates/create`}>
        <Button color="primary"><RawText textKey="common.actionCandidate" /></Button>
      </Link>
    ),
  },
  {
    label: (election: Election) => 'stepper.step2.label',
    date: (election: Election) =>
      `${dateToString(election.campaignDate)} - ${dateToString(
        election.electronicVotingDate,
        {
          subDays: 1,
        }
      )}`,
    description: 'stepper.step2.description',
  },
  {
    label: (election: Election) => 'stepper.step3.label',
    date: (election: Election) =>
      `${dateToString(election.electronicVotingDate)} - ${dateToString(
        election.ballotVotingDate,
        {
          subDays: 1,
        }
      )}`,
    description: 'stepper.step3.description',
    action: (election: Election) => (
      <Link to={`/auth/user/vote`}>
        <Button color="primary"><RawText textKey="common.actionVote" /></Button>
      </Link>
    ),
  },
  {
    label: (election: Election) => 'stepper.step4.label',
    date: (election: Election) =>
      `${dateToString(election.ballotVotingDate)} - ${dateToString(
        election.preliminaryResultsDate,
        {
          subDays: 1,
        }
      )}`,
    description: 'stepper.step4.description',
    action: (election: Election) => (
      <>
        {election.mediaResolutions?.map((resolution) => (
          <MuiLink
            underline="none"
            target="_blank"
            href={`${resolution.contentUrl}`}
            key={resolution["@id"]}
          >
            <Button><RawText textKey="common.actionResolution" /></Button>
          </MuiLink>
        ))}
      </>
    ),
  },
  {
    label: (election: Election) => 'stepper.step5.label',
    date: (election: Election) =>
      `${dateToString(election.preliminaryResultsDate)}`,
    description: 'stepper.step5.description',
  },
  {
    label: (election: Election) => 'stepper.step6.label',
    date: (election: Election) =>
      `${dateToString(election.complaintsDeadlineDate)}`,
    description: 'stepper.step6.description',
  },
  {
    label: (election: Election) => 'stepper.step7.label',
    date: (election: Election) => `${dateToString(election.countingVotesDate)}`,
    description: 'stepper.step7.description',
  },
  {
    label: (election: Election) => 'stepper.step8.label',
    date: (election: Election) => `${dateToString(election.finalResultsDate)}`,
    description: 'stepper.step8.description',
    action: (election: Election) => (
      <>
        {election.mediaReports?.map((report) => (
          <MuiLink
            underline="none"
            target="_blank"
            href={`${report.contentUrl}`}
            key={report["@id"]}
          >
            <Button><RawText textKey="common.actionFinalReport" /></Button>
          </MuiLink>
        ))}
      </>
    ),
  },
]

function AddTooltip({
  step,
  currentStep,
  children,
  title,
}: {
  step: number;
  currentStep: number;
  children: JSX.Element;
  title?: string | JSX.Element;
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
  const activeStep = getStep(election);
  const { t } = useTranslation()

  return (
    <Stepper activeStep={activeStep} orientation="vertical" sx={sx}>
      {steps.map((step, index) => (
        <Step key={index}>
          <AddTooltip
            title={t(step.description)}
            step={index}
            currentStep={activeStep}
          >
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">
                    Volby byly ukončeny.
                  </Typography>
                ) : null
              }
            >
              <Typography variant="h6" pr={2}>
                {t(step.label(election))}
              </Typography>
              <Typography component="span" color="textSecondary">
                {step.date ? step.date(election) : null}
              </Typography>
            </StepLabel>
          </AddTooltip>
          <StepContent>
            <Typography color="textSecondary">{t(step.description)}</Typography>
            {step.action ? <Box pt={2}>{step.action(election)}</Box> : null}
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}
