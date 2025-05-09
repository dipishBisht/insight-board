import { MousePointer, Sliders, PanelLeft, Share } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Container } from "@/components/shared/container"

export default function Usage() {
    return (
        <section className="bg-slate-50 py-20">
            <Container>
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-deep">How to Use InsightBoard</h2>
                    <p className="text-lg text-slate-600">
                        Getting started with InsightBoard is simple. Follow these easy steps to create your first dashboard.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="space-y-8">
                            {usageSteps.map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <step.icon className="h-5 w-5 text-primary" />
                                            <h3 className="text-lg font-semibold text-deep">{step.title}</h3>
                                        </div>
                                        <p className="text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <Card className="border-slate-100 shadow-sm">
                            <CardContent className="p-6">
                                <img
                                    src="/placeholder.svg?height=400&width=600"
                                    alt="InsightBoard Usage Example"
                                    className="w-full h-auto rounded"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Container>
        </section>
    )
}

const usageSteps = [
    {
        title: "Select Your Data Source",
        description: "Choose from various data sources including spreadsheets, databases, or API connections.",
        icon: MousePointer,
    },
    {
        title: "Customize Your Visualizations",
        description: "Select chart types and customize colors, labels, and other visual elements to match your needs.",
        icon: Sliders,
    },
    {
        title: "Arrange Your Dashboard",
        description: "Drag and drop visualizations to create the perfect layout for your dashboard.",
        icon: PanelLeft,
    },
    {
        title: "Share With Your Team",
        description: "Generate shareable links or embed your dashboard in other applications.",
        icon: Share,
    },
]
