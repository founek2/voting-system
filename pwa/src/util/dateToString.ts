import { subDays } from "date-fns";

export function dateToString(date?: string | Date | null, options?: { subDays?: number }) {
    if (!date) return "";

    const d = new Date(date);
    return subDays(d, options?.subDays || 0).toLocaleDateString()
}