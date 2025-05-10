import { LineChart, PieChart, BarChart } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/shared/container"

export default function About() {
    return (
        <section className="mb-20">
            <Container>
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-deep">What is InsightBoard?</h2>
                    <p className="text-lg text-slate-600">
                        InsightBoard is a powerful data visualization platform that transforms complex data into clear, actionable
                        insights. Whether you're tracking business metrics, analyzing trends, or presenting findings to
                        stakeholders, InsightBoard makes it simple to understand and communicate your data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-slate-100 transition-all duration-300 hover:shadow-sm">
                            <CardContent className="pt-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl mb-2 text-deep">{feature.title}</CardTitle>
                                <p className="text-slate-600">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    )
}

const features = [
    {
        title: "Interactive Dashboards",
        description: "Create stunning, interactive dashboards that update in real-time and respond to user input.",
        icon: LineChart,
    },
    {
        title: "Data Integration",
        description: "Connect to multiple data sources and combine information for comprehensive analysis.",
        icon: PieChart,
    },
    {
        title: "Customizable Reports",
        description: "Generate and share customized reports with your team or clients in just a few clicks.",
        icon: BarChart,
    },
]
