import { isPassed } from "./isPassed";


export function splitElections<T extends {
    id?: number
    finalResultsDate?: string | null;
}>(elections: T[]): { passed?: T[], current?: T[] } {
    const result = Object.groupBy(elections, (election) =>
        isPassed(election) ? "passed" : "current"
    );

    // Newer election should be first
    result.current?.sort((a, b) => {
        return b.id! - a.id!
    })

    return result
}