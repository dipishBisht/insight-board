/**
 * Formats milliseconds into a human-readable hours and minutes format
 * @param ms Milliseconds to format
 * @returns Formatted time string (e.g. "2h 30m")
 */
export function formatTime(ms: number): string {
    const mins = Math.floor(ms / 60000);
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;

    // For times less than an hour, show only minutes
    if (hrs === 0) {
        return `${rem}m`;
    }

    return `${hrs}h ${rem}m`;
}
