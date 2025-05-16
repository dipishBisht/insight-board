import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashbaordSidebar from "@/components/dashboard/sidebar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-10">
            <SidebarProvider>
                <DashbaordSidebar />
                <div>
                    <SidebarTrigger />
                    {children}
                </div>
            </SidebarProvider>
        </div>
    )
}