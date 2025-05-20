// shared.ts - Create this new file to share code between components

/**
 * Gets the current date in the local timezone formatted as YYYY-MM-DD
 * @returns A string in format YYYY-MM-DD representing today's date in local timezone
 */
export const getLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Gets the storage key for today's usage data
 * @returns Today's storage key in format: usage-YYYY-MM-DD
 */
export const getTodayKey = (): string => {
    return `usage-${getLocalDate()}`;
};

/**
 * Gets the Firestore document ID for today's usage data
 * @param userId The user's UID
 * @returns Document ID in format: userId_YYYY-MM-DD
 */
export const getTodayDocId = (userId: string): string => {
    return `${userId}_${getLocalDate()}`;
};

/**
 * Formats a date for display
 * @param dateKey A storage key in format usage-YYYY-MM-DD
 * @returns Formatted date string like "May 21, 2025"
 */
export const formatDisplayDate = (dateKey: string): string => {
    const datePart = dateKey.replace('usage-', '');
    const [year, month, day] = datePart.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Calculate milliseconds until next midnight in local timezone
 * @returns Milliseconds until midnight
 */
export const getMillisToMidnight = (): number => {
    const now = new Date();
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
    );
    return midnight.getTime() - now.getTime();
};

/**
 * Message types for extension communication
 */
export const MessageType = {
    TOGGLE_PAUSE: 'togglePause',
    FORCE_SYNC: 'forceSync',
    USER_LOGGED_IN: 'userLoggedIn',
    DAY_CHANGED: 'dayChanged',
    SYNC_COMPLETE: 'syncComplete'
};