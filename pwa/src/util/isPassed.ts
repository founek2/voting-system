import { isBefore } from "date-fns";
import { Election } from "../types";


export function isPassed(election: { finalResultsDate?: string | null }) {
    if (!election.finalResultsDate) return false;

    const end = new Date(election.finalResultsDate)

    return isBefore(end, new Date());
}