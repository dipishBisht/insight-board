import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface UsageDoc {
  userId: string;
  date: string;
  totalTime: number;
  sites: Record<string, number>;
}

interface DailyData {
  date: string;
  value: number;
  sites: Record<string, number>;
}

interface ActivityItem {
  time: string;
  title: string;
  description: string;
}

interface SiteUsageItem {
  name: string;
  value: number;
}

interface TopSite {
  name: string;
  totalTime: number;
  daysActive: number;
  avgTime: number;
}

interface Stats {
  averageTime: number;
  mostActiveDay: string;
  mostVisitedSite: string;
  totalTime: number;
}

export interface ResponseData {
  activity: ActivityItem[];
  dailyUsage: { date: string; value: number }[];
  siteUsage: SiteUsageItem[];
  stats: Stats;
  topSites: TopSite[];
}

export const fetchAllUserUsage = async (uid: string): Promise<ResponseData> => {
  const usageCollection = collection(db, 'usage');
  const q = query(usageCollection, where('userId', '==', uid));
  const snapshot = await getDocs(q);

  const allData: DailyData[] = [];
  const siteTotals: Record<string, number> = {};
  let totalTime = 0;
  let mostActiveDay = { date: '', totalTime: 0 };

  for (const doc of snapshot.docs) {
    const data = doc.data() as UsageDoc;
    if (!data?.sites || !data?.date) continue;

    const dayTime = data.totalTime;
    totalTime += dayTime;

    allData.push({ date: data.date, value: dayTime, sites: data.sites });

    if (dayTime > mostActiveDay.totalTime) {
      mostActiveDay = { date: data.date, totalTime: dayTime };
    }

    for (const site in data.sites) {
      siteTotals[site] = (siteTotals[site] || 0) + data.sites[site];
    }
  }

  const numDays = allData.length;
  const averageTime = numDays ? totalTime / numDays : 0;

  const topSites: TopSite[] = Object.entries(siteTotals)
    .map(([name, total]) => {
      const daysActive = allData.filter(day => day.sites[name] != null).length;
      return {
        name,
        totalTime: total,
        daysActive,
        avgTime: daysActive ? total / daysActive : 0,
      };
    })
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, 10);

  const siteUsage: SiteUsageItem[] = Object.entries(siteTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const mostVisitedSite = topSites.length ? topSites[0].name : 'N/A';

  const activity: ActivityItem[] = allData
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(day => {
      const topSite = Object.entries(day.sites || {})
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      return {
        time: day.date,
        title: `Tracked ${Math.round(day.value / 60)} mins`,
        description: `Most used site: ${topSite}`,
      };
    });

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
