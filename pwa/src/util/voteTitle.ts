import { User_jsonld_vote_read, Vote_jsonld_vote_read } from "../endpoints/types";
import { Candidate } from "../types";


export function voteTitle(user: User_jsonld_vote_read) {
    return `${user.firstName} ${user.lastName}`
}