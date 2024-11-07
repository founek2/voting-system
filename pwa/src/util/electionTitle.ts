import { format } from "date-fns";
import { Election } from "../types";


export function electionTitle(election: Election) {
    const start = new Date(election.announcementDate || "").toLocaleDateString()
    const end = new Date(election.finalResultsDate || "").toLocaleDateString()

    return `${start} - ${end}`
}