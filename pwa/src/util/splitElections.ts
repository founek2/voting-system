import { isPassed } from "./isPassed";


export function splitElections<T extends {
    finalResultsDate?: string | null;
}>(elections: T[]): { passed?: T[], current?: T[] } {
    return Object.groupBy(elections, (election) =>
        isPassed(election) ? "passed" : "current"
    );
}