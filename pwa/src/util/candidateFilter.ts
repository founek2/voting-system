import { Candidate_jsonld_candidate_read } from "../endpoints/types";

export function filterActive(candidates: Candidate_jsonld_candidate_read[]) {
    return candidates.filter(c => !c.withdrewAt && !c.rejectedAt)
}