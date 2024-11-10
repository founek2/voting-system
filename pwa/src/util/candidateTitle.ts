import { Candidate } from "../types";


export function candidateTitle(candidate: Candidate) {
    return `${candidate.position?.name}`
}