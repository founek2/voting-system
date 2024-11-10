export function parseId(hydraId?: string): number | undefined {
    if (!hydraId) return;

    const parts = hydraId.split("/")

    if (parts.length == 0) return;

    return Number(parts[parts.length - 1])
}