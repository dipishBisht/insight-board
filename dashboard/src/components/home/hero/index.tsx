import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Container } from "@/components/shared/container"

export default function Hero() {
    return (
        <header className="relative w-full bg-white overflow-hidden">
            <Container>
                <div className="relative pt-20 pb-24 md:pt-28 md:pb-32">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <div className="animate-fade-in">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-deep">
                                Transform Your Data Into <span className="text-primary">Actionable Insights</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
                                Visualize, analyze, and share your data with powerful, intuitive dashboards that make decision-making
                                simple.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" asChild>
                                    <Link href="#get-started">Get Started Free</Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild className="group">
                                    <Link href="#how-it-works" className="flex items-center">
                                        See How It Works
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="mt-16 w-full max-w-5xl mx-auto rounded-lg shadow-md border border-slate-100 overflow-hidden animate-slide-up">
                            <div className="bg-deep p-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                </div>
                            </div>
                            <div className="bg-white p-4">
                                <img
                                    src="/placeholder.svg?height=600&width=1000"
                                    alt="InsightBoard Dashboard Preview"
                                    className="w-full h-auto rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </header>
    )
}
