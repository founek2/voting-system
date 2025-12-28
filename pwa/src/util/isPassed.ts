import { addDays, isBefore } from "date-fns";


export interface IsPassedOptions {
    stillCurrentAfterDays?: number
}
export function isPassed(election: { finalResultsDate?: string | null }, { stillCurrentAfterDays = 0 }: IsPassedOptions = {}) {
    if (!election.finalResultsDate) return false;

    const end = new Date(election.finalResultsDate)

    // election has to bee displayed 15 days after it ended
    return isBefore(addDays(end, stillCurrentAfterDays), new Date());
}