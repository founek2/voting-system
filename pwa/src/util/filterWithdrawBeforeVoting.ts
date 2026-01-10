import { isAfter } from "date-fns"

export function filterWithdrawBeforeVoting(election?: { electronicVotingDate?: string | null }) {
    return (candidate: { withdrewAt?: string | null }) => {
        return candidate.withdrewAt && election?.electronicVotingDate
            ? isAfter(new Date(candidate.withdrewAt), new Date(election.electronicVotingDate))
            : true
    }
}