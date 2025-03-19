import { Candidate } from "../types";

export function getCandidateOpacity(candidate: Candidate): number | undefined {
    return candidate?.withdrewAt || candidate.rejectedAt ? 0.6 : undefined
}

export function getCandidateStyle(candidate: Candidate): { opacity?: number } {
    return { opacity: getCandidateOpacity(candidate) }
}