import { useGetElectionBallotResultQuery } from "../endpoints/ballotResult";
import { useGetElectionElectronicResultQuery } from "../endpoints/elections";
import { ElectionResultResource_jsonld_candidate_read } from "../endpoints/types";
import { Election } from "../types";

export function useTotalElectionResults(election: Election) {
  const {
    data: electronicResult,
    isError: isErrorElectronic,
    isLoading: isLoadingElectronic,
  } = useGetElectionElectronicResultQuery(election?.id!);
  const {
    data: ballotResults,
    isError: isErrorBallot,
    isLoading: isLoadingBallot,
  } = useGetElectionBallotResultQuery(election?.id!);

  if (!electronicResult) {
    return {
      isError: isErrorElectronic || isErrorBallot,
      isLoading: isLoadingElectronic || isLoadingBallot,
    };
  }

  const result: ElectionResultResource_jsonld_candidate_read = {
    ...electronicResult,
    candidates: electronicResult?.candidates?.map((electronic) => {
      const ballot = ballotResults?.member.find(
        (b) => b.candidate?.["@id"] == electronic.candidate?.["@id"]
      );

      return {
        candidate: electronic.candidate,
        positiveVotes:
          (electronic.positiveVotes || 0) + (ballot?.positiveVotes || 0),
        negativeVotes:
          (electronic.negativeVotes || 0) + (ballot?.negativeVotes || 0),
        neutralVotes:
          (electronic.neutralVotes || 0) + (ballot?.neutralVotes || 0),
      };
    }),
  };

  return {
    isError: isErrorElectronic || isErrorBallot,
    isLoading: isLoadingElectronic || isLoadingBallot,
    data: result,
  };
}
