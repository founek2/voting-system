import { addDays, isBefore } from "date-fns";
import { Election } from "../types";


export function isPassed(election: { finalResultsDate?: string | null }) {
    if (!election.finalResultsDate) return false;

    const end = new Date(election.finalResultsDate)

    // election has to bee displayed 15 days after it ended
    return isBefore(addDays(end, 15), new Date());
}