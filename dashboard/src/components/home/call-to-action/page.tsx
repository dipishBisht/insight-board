import { Container } from "@/components/shared/container"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CallToAction() {
    return (
        <section className="text-white my-20">
            <Container>
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                        Ready to Transform Your Data Experience?
                    </h2>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of data professionals who are already using InsightBoard to make better decisions faster.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" asChild>
                            <Link href="#get-started">Start Your Free Trial</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" asChild>
                            <Link href="#get-started">Schedule a Demo</Link>
                        </Button>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-primary">
                                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
                            </svg>
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-primary">
                                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
                            </svg>
                            <span>14-day free trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-primary">
                                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
                            </svg>
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
