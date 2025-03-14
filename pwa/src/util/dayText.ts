
export function dayText(days: number) {
    if (days >= 5) return "dnů";
    if (days >= 2) return "dny";
    if (days >= 1) return "den";
    return "dnů";
}