import { subDays } from "date-fns";
import i18next from "i18next";

export function dateToString(date?: string | Date | null, options?: { subDays?: number }) {
    if (!date) return "";

    const d = new Date(date);
    return subDays(d, options?.subDays || 0).toLocaleDateString(i18next.language)
}