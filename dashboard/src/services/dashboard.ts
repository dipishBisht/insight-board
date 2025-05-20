import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const fetchAllUserUsage = async (uid: string) => {
    const usageCollection = collection(db, 'usage');
    const q = query(usageCollection, where('userId', '==', uid));

    const snapshot = await getDocs(q);

    const allData: any[] = [];
    const siteTotals: Record<string, number> = {};
    let totalTime = 0;
    let mostActiveDay = { date: '', totalTime: 0 };

    for (const doc of snapshot.docs) {
        const data = doc.data();
        if (!data?.sites || !data?.date) continue;

        const sites = data.sites;
        const dayTime = data.totalTime;

        allData.push({ date: data.date, value: dayTime });

        totalTime += dayTime;

        if (dayTime > mostActiveDay.totalTime) {
            mostActiveDay = { date: data.date, totalTime: dayTime };
        }

        // Aggregate time per site
        for (const site in sites) {
            siteTotals[site] = (siteTotals[site] || 0) + sites[site];
        }
    }

    const numDays = allData.length;
    const averageTime = numDays ? totalTime / numDays : 0;

    const topSites = Object.entries(siteTotals)
        .map(([name, total]) => {
            const daysActive = allData.filter(day => day.sites?.[name]).length;
            return {
                name,
                totalTime: total,
                daysActive,
                avgTime: daysActive ? total / daysActive : 0,
            };
        })
        .sort((a, b) => b.totalTime - a.totalTime)
        .slice(0, 10);

    const siteUsage = Object.entries(siteTotals)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    const mostVisitedSite = topSites.length ? topSites[0].name : 'N/A';

    const activity = allData
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(day => ({
            time: day.date,
            title: `Tracked ${Math.round(day.value / 60)} mins`,
            description: `Most used site: ${Object.entries(day.sites || {}).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A'}`,
        }));

    return {
        stats: {
            totalTime,
            averageTime,
            mostActiveDay: mostActiveDay.date,
            mostVisitedSite,
        },
        dailyUsage: allData.map(d => ({ date: d.date, value: d.value })),
        siteUsage,
        activity,
        topSites,
    };
};
