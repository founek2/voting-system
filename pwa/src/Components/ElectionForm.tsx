import { Button, Grid2, Typography } from "@mui/material";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { FormStatus } from "../Components/FormStatus";
import { MyDatePicker } from "../Components/MyDatePicker";
import { Election } from "../endpoints/types";

interface ElectionFormProps {
  defaultValues?: Election;
  onSubmit: SubmitHandler<Election>;
}
export default function ElectionForm({
  defaultValues,
  onSubmit,
}: ElectionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Election>({ defaultValues });

  const handleOnSubmit = handleSubmit(onSubmit);

  return (
    <Grid2 component="form" container spacing={2} onSubmit={handleOnSubmit}>
      <Grid2 size={12}>
        <FormStatus errors={errors} />
      </Grid2>

      <Grid2 size={12}>
        <Typography variant="h4">Datumy:</Typography>
      </Grid2>

      <Grid2 size={3}>
        <MyDatePicker
          label="Vyhlášení voleb"
          {...register("announcementDate", { required: true })}
        />
      </Grid2>

      <Grid2 size={3}>
        <MyDatePicker
          label="Přihlašování kandidátů"
          {...register("registrationOfCandidatesDate", { required: true })}
        />
      </Grid2>

      <Grid2 size={3}>
        <MyDatePicker
          label="Volební kampaň"
          {...register("campaignDate", { required: true })}
        />
      </Grid2>

      <Grid2 size={3}>
        <MyDatePicker
          label="Elektronické hlasování"
          {...register("electronicVotingDate", { required: true })}
        />
      </Grid2>

      <Grid2 size={3}>
        <MyDatePicker
          label="Urnové hlasování"
          {...register("ballotVotingDate", { required: true })}
        />
      </Grid2>

      <Grid2 size={3}>
        <MyDatePicker
          label="Vyhlášení předběžných výsledků"
          {...register("preliminaryResultsDate", { required: true })}
        />
      </Grid2>

      <Grid2 size={3}>
        <MyDatePicker
          label="Uzávěr podávání stížností"
          {...register("complaintsDeadlineDate", { required: true })}
        />
      </Grid2>

      <Grid2 size={3}>
        <MyDatePicker
          label="Vyhlášení konečních výsledků"
          {...register("finalResultsDate", { required: true })}
        />
      </Grid2>

      <Grid2 size={12}>
        <Button type="submit">Uložit</Button>
      </Grid2>
    </Grid2>
  );
}
