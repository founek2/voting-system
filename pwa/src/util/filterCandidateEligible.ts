export function filterCandidateEligible(candidate: { withdrewAt?: string | null; rejectedAt?: string | null }) {
    return !candidate.withdrewAt && !candidate.rejectedAt;
}