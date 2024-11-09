export function head<T>(data?: T[]): T | undefined {
    if (data === undefined || data.length === 0) return undefined;

    return data[0]
}