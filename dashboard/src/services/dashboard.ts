// services/fetchDashboardData.ts
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export async function fetchDashboardData(userId: string) {
    // Create a query to find documents in the usage collection with the matching userId field
    // OR find the most recent document that starts with the userId
    const usageCollection = collection(db, "usage");
    const userIdQuery = query(
        usageCollection,
        where("userId", "==", userId),
        // Optional: If you want the most recent document
        orderBy("userId", "desc"),
        limit(1)
    );

    const querySnapshot = await getDocs(userIdQuery);
    
    if (querySnapshot.empty) {
        // If no documents found with userId field, try searching by document ID pattern
        // This is a fallback approach
        const dateString = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const todayDocId = `${userId}_${dateString}`;
        
        console.log("Looking for document with ID:", todayDocId);
        
        // You might need to fetch documents and filter client-side
        // Or construct a query with startsWith if your Firestore rules allow it
        const startWithUserIdQuery = query(
            usageCollection,
            orderBy("__name__"),
            where("__name__", ">=", userId),
            where("__name__", "<=", userId + "\uf8ff"),
            limit(1)
        );
        
        const altQuerySnapshot = await getDocs(startWithUserIdQuery);
        
        if (altQuerySnapshot.empty) {
            throw new Error("No dashboard usage data found for user");
        }
        
        return altQuerySnapshot.docs[0].data();
    }

    return querySnapshot.docs[0].data();
}