import { isPassed } from "./isPassed";


export function splitElections<T extends {
    id?: number
    finalResultsDate?: string | null;
}>(elections: T[]): { passed?: T[], current?: T[] } {
    const result = Object.groupBy(elections, (election) =>
        isPassed(election) ? "passed" : "current"
    );

    // Sort by some magical
    result.current?.sort((a, b) => {
        return a.id! - b.id!
    })

    return result
}