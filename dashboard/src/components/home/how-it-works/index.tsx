import { ArrowRight, Upload, BarChart3, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Container } from "@/components/shared/container"

export default function HowItWorks() {
    return (
        <section className="bg-slate-50 py-20">
            <Container>
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-deep">How InsightBoard Works</h2>
                    <p className="text-lg text-slate-600">
                        Get started in minutes with our simple three-step process. No complex setup required.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <Card className="border-slate-100 h-full">
                                <CardContent className="pt-6 flex flex-col h-full">
                                    <div className="w-12 h-12 bg-deep rounded-full flex items-center justify-center mb-6 text-white font-bold text-xl">
                                        {index + 1}
                                    </div>
                                    <div className="w-14 h-14 bg-primary/10 rounded-md flex items-center justify-center mb-6">
                                        <step.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-deep">{step.title}</h3>
                                    <p className="text-slate-600 flex-grow">{step.description}</p>
                                </CardContent>
                            </Card>

                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                                    <ArrowRight className="h-6 w-6 text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}

const steps = [
    {
        title: "Connect Your Data",
        description: "Upload your data or connect to your existing data sources with our simple integration tools.",
        icon: Upload,
    },
    {
        title: "Create Visualizations",
        description: "Use our intuitive drag-and-drop interface to build beautiful charts, graphs, and dashboards.",
        icon: BarChart3,
    },
    {
        title: "Share and Collaborate",
        description: "Share your insights with your team or embed them in your applications and websites.",
        icon: Share2,
    },
]
