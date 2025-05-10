"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

export default function CTA() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Check if section is visible in viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section
            id="get-started"
            className="bg-primary w-full text-primary-foreground py-12 mt-16 mb-32 relative overflow-hidden"
            ref={sectionRef}
        >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-foreground/5 blur-3xl" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-foreground/5 blur-3xl" />
            </div>

            <Container className="relative z-10">
                <div className={cn(
                    "text-center transition-all duration-1000 transform",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>
                    <div className="inline-block mx-auto mb-6 rounded-full bg-primary-foreground/20 px-4 py-1.5">
                        <p className="text-sm font-medium">
                            14-day free trial • No credit card required
                        </p>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Ready to Transform Your Data into Actionable Insights?
                    </h2>

                    <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto">
                        Join thousands of companies using InsightBoard to make better decisions with their data.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 group"
                        >
                            Start Your Free Trial
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8"
                        >
                            Schedule a Demo
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}