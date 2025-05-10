"use client"
import { Container } from "@/components/shared/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function Preview() {
    return (
        <section className=" my-20">
            <Container>
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-deep">See InsightBoard in Action</h2>
                    <p className="text-lg text-slate-600">Explore some examples of what you can create with InsightBoard.</p>
                </div>

                <Card className="border-slate-100 shadow-sm">
                    <Tabs defaultValue="business" className="w-full">
                        <TabsList className="w-full justify-start border-b rounded-none h-auto bg-transparent">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-white rounded-none data-[state=active]:shadow-none"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {tabs.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-deep">{tab.title}</h3>
                                        <p className="text-slate-600 mb-6">{tab.description}</p>
                                        <Button asChild>
                                            <Link href="#get-started">Try It Yourself</Link>
                                        </Button>
                                    </div>

                                    <Card className="border-slate-100">
                                        <CardContent className="p-4">
                                            <img
                                                src={`/placeholder.svg?height=300&width=500&text=${encodeURIComponent(tab.label)}`}
                                                alt={`${tab.label} Preview`}
                                                className="w-full h-auto rounded"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </Card>
            </Container>
        </section>
    )
}

const tabs = [
    {
        value: "business",
        label: "Business Dashboard",
        title: "Business Analytics Dashboard",
        description: "Track KPIs, sales performance, and customer metrics in one comprehensive view.",
    },
    {
        value: "marketing",
        label: "Marketing Analytics",
        title: "Marketing Campaign Performance",
        description: "Analyze campaign effectiveness, channel performance, and conversion metrics.",
    },
    {
        value: "financial",
        label: "Financial Reports",
        title: "Financial Performance Tracking",
        description: "Monitor revenue, expenses, profit margins, and other financial metrics.",
    },
    {
        value: "project",
        label: "Project Management",
        title: "Project Progress Tracking",
        description: "Visualize project timelines, resource allocation, and milestone completion.",
    },
]
