"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { navigation } from "@/data/dashboard";
import { BarChart2, Settings } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function DashbaordSidebar() {

    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div>
            <Sidebar>
                <SidebarHeader>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <BarChart2 className="h-8 w-8 text-primary" />
                        <span className="font-bold text-xl">InsightBoard</span>
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    <div className="flex flex-1 flex-col overflow-y-auto py-5 px-4">
                        <nav className="flex-1 space-y-1">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${item.current
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 ${item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                                            }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </SidebarContent>
                <SidebarFooter className="flex-row pb-5 items-center">
                    <Avatar className="size-10">
                        <AvatarImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" className="object-cover size-10" />
                        <AvatarFallback>HS</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">John Doe</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <button onClick={handleLogout}>logout</button>
                    <Settings className="ml-auto mr-2" />
                </SidebarFooter>
            </Sidebar>
        </div>
    )
}