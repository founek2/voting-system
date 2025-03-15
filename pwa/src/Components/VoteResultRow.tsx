import React from "react";
import { Grid2, TextField, Typography } from "@mui/material";
import { Candidate_jsonld_candidate_read } from "../endpoints/types";
import { styled } from "@mui/system";
import { Control, FieldValues, UseFormRegister } from "react-hook-form";

const TextFieldStyled = styled(TextField)({ marginLeft: 20, width: 100 });

export interface FormType {
  candidates: {
    resultId: number;
    candidate: string;
    positiveVotes: number | string;
    negativeVotes: number | string;
    neutralVotes: number | string;
  }[];
}

interface VoteResultRowBase {
  result?: {
    positiveVotes?: number;
    negativeVotes?: number;
    neutralVotes?: number;
  };
  candidate: Candidate_jsonld_candidate_read;
}

type VoteResultRowProps<T extends FieldValues> =
  | (VoteResultRowBase & {
      edit?: false | undefined;
      register?: any;
      index?: any;
    })
  | (VoteResultRowBase & {
      edit: true;
      register: UseFormRegister<FormType>;
      index: number;
    });
export function VoteResultRow<T extends FieldValues>({
  result,
  candidate,
  edit,
  register,
  index,
}: VoteResultRowProps<T>) {
  const fullName = `${candidate?.appUser?.firstName} ${candidate?.appUser?.lastName}`;
  const opacity = {
    opacity: candidate?.withdrewAt ? 0.6 : undefined,
  };
  //   const useRegi

  return (
    <>
      <Grid2 size={{ xs: 12, md: 5 }}>
        <Typography sx={opacity}>{fullName}</Typography>
      </Grid2>
      <Grid2 size={{ xs: 3, md: 2 }} display="flex">
        <Typography sx={opacity}>
          Pro {!edit ? result?.positiveVotes : null}
        </Typography>
        {edit ? (
          <TextFieldStyled
            variant="standard"
            {...register(`candidates.${index}.positiveVotes`, {
              required: true,
              pattern: {
                value: /^[0-9]+$/,
                message: "Pouze pozitivní celá čísla jsou povolena",
              },
            })}
          />
        ) : null}
      </Grid2>
      <Grid2 size={{ xs: 6, md: 2 }} display="flex">
        <Typography sx={opacity}>
          Zdrželo se {!edit ? result?.neutralVotes : null}
        </Typography>
        {edit ? (
          <TextFieldStyled
            variant="standard"
            {...register(`candidates.${index}.neutralVotes`, {
              required: true,
              pattern: {
                value: /^[0-9]+$/,
                message: "Pouze pozitivní celá čísla jsou povolena",
              },
            })}
          />
        ) : null}
      </Grid2>
      <Grid2 size={{ xs: 3, md: 2 }} display="flex">
        <Typography sx={opacity}>
          Proti {!edit ? result?.negativeVotes : null}
        </Typography>
        {edit ? (
          <TextFieldStyled
            variant="standard"
            {...register(`candidates.${index}.negativeVotes`, {
              required: true,
              pattern: {
                value: /^[0-9]+$/,
                message: "Pouze pozitivní celá čísla jsou povolena",
              },
            })}
          />
        ) : null}
      </Grid2>
    </>
  );
}
