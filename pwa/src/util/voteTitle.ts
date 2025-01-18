import { Vote_jsonld_vote_read } from "../endpoints/types";
import { Candidate } from "../types";


export function voteTitle(vote: Vote_jsonld_vote_read) {
    return `${vote.appUser?.firstName} ${vote.appUser?.lastName}`
}