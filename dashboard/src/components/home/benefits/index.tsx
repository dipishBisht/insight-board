import { Container } from "@/components/shared/container"
import { CheckCircle2 } from "lucide-react"

export default function Benefits() {
    return (
        <section className="py-20">
            <Container>
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-deep">Why Choose InsightBoard</h2>
                    <p className="text-lg text-slate-600">
                        InsightBoard gives you the tools to make better decisions faster, with less effort.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0">
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-deep">{benefit.title}</h3>
                                <p className="text-slate-600">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}

const benefits = [
    {
        title: "Save Time",
        description: "Automate your reporting process and get insights in seconds instead of hours or days.",
    },
    {
        title: "Improve Decision Making",
        description: "Make data-driven decisions with confidence using clear, accurate visualizations.",
    },
    {
        title: "Increase Collaboration",
        description: "Share insights across your organization to align teams and drive better outcomes.",
    },
    {
        title: "Reduce Complexity",
        description: "Turn complex data into simple, understandable visuals that anyone can interpret.",
    },
    {
        title: "Enhance Presentations",
        description: "Create professional, interactive presentations that engage your audience.",
    },
    {
        title: "Scale Effortlessly",
        description: "Handle growing data volumes without performance issues or additional resources.",
    },
]
