import { enqueueSnackbar } from "notistack";
import React from "react";
import ElectionForm from "../Components/ElectionForm";
import {
  useAddElectionMutation,
  useGetElectionQuery,
} from "../endpoints/elections";
import {
  Candidate_candidate_write,
  Election_election_write,
} from "../endpoints/types";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddCandidateMutation,
  useGetUserCandidatesQuery,
} from "../endpoints/candidates";
import { useAppSelector } from "../hooks/app";
import CandidateForm from "../Components/CandidateForm";
import Loader from "../Components/Loader";
import { Button, Typography } from "@mui/material";
import { handleError } from "../util/handleError";
import { Link } from "react-router-dom";

export default function CandidateCreatePage() {
  const user = useAppSelector((state) => state.authorization.currentUser);
  const params = useParams<{ electionId: string }>();
  const {
    data: election,
    isLoading: isLoading,
    isError,
  } = useGetElectionQuery(Number(params.electionId!));
  const [createCandidate, { isLoading: isMutation }] =
    useAddCandidateMutation();
  const {
    data: existingCandidate,
    isLoading: loadingExistingCandidate,
    isError: errorExistingCandidate,
  } = useGetUserCandidatesQuery(
    { userId: user?.id!, electionIds: [election?.["@id"]!] },
    { skip: !election || !user }
  );
  const navigate = useNavigate();

  async function onSubmit(data: Candidate_candidate_write) {
    const { error } = await createCandidate({ userId: user?.id!, body: data });
    if (error) {
      handleError(error);
    } else {
      navigate("/auth/user");
    }
  }

  if (isLoading || loadingExistingCandidate) return <Loader />;
  if (isError || errorExistingCandidate)
    return <Typography>Nastala chyba</Typography>;

  const existingValidCandidate =
    existingCandidate?.member.some((t) => !t.withdrewAt) || false;

  if (existingValidCandidate)
    return (
      <Typography color="textPrimary">
        Pro zvolené volby již máte kandidátku podanou. Vaše kandidátky můžete
        spravovat na{" "}
        <Link to="/auth/user">
          <Button>Přehledu</Button>
        </Link>
      </Typography>
    );

  return (
    <CandidateForm
      onSubmit={onSubmit}
      disabled={isMutation}
      election={election!}
    />
  );
}
