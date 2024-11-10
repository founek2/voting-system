export function dateToString(date?: string | Date | null) {
    if (!date) return "";

    return (new Date(date)).toLocaleDateString()
}