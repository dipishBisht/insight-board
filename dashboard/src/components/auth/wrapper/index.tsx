"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";

const publicRoutes = ["/login", "/"];
const protectedRoutes = ["/dashboard"];

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        if (user && publicRoutes.includes(pathname)) {
            router.push("/dashboard");
        }

        if (!user && protectedRoutes.includes(pathname)) {
            router.push("/login");
        }
    }, [user, loading, pathname, router]);

    return <>{children}</>;
}
