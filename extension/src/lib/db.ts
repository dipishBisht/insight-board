import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const userId = 'some-unique-id';

// Function to sync current day's usage to Firestore
const syncToFirebase = async () => {
    const todayKey = `usage-${new Date().toISOString().split('T')[0]}`;

    chrome.storage.local.get([todayKey], async (result) => {
        const usageData = result[todayKey];

        if (!usageData) return;

        try {
            await setDoc(doc(db, 'users', userId, 'usage', todayKey), {
                ...usageData,
                syncedAt: new Date().toISOString()
            });
            console.log('[InsightBoard] Synced usage to Firebase');
        } catch (err) {
            console.error('[InsightBoard] Sync failed:', err);
        }
    });
};

// Sync every 60 seconds
setInterval(() => {
    syncToFirebase();
}, 60000);