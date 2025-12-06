import { Candidate_jsonld_candidate_read } from "../endpoints/types";

export function groupByPosition(candidates: Candidate_jsonld_candidate_read[]) {
    return Object.groupBy(candidates, (candidate) => candidate.position.name!) as Record<string, Candidate_jsonld_candidate_read[]>;
}