"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, BarChart3, Share2, ArrowRight, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const steps = [
        {
            title: "Connect Your Data",
            description: "Upload your data or connect to your existing data sources with our simple integration tools. We support CSV, Excel, SQL databases, APIs, and more.",
            icon: Upload,
            color: "bg-blue-500/10 text-blue-500",
            detailedSteps: [
                "Choose from 30+ data source connectors",
                "Set up automated data refresh schedules",
                "Map and transform your data for analysis",
                "Secure your connection with end-to-end encryption"
            ]
        },
        {
            title: "Create Visualizations",
            description: "Use our intuitive drag-and-drop interface to build beautiful charts, graphs, and dashboards without any coding knowledge.",
            icon: BarChart3,
            color: "bg-purple-500/10 text-purple-500",
            detailedSteps: [
                "Select from 50+ chart types and visualizations",
                "Customize colors, labels, and interactions",
                "Apply filters and create interactive elements",
                "Use AI-assisted recommendations for best visualizations"
            ]
        },
        {
            title: "Share and Collaborate",
            description: "Share your insights with your team or embed them in your applications and websites with just a few clicks.",
            icon: Share2,
            color: "bg-green-500/10 text-green-500",
            detailedSteps: [
                "Set granular permissions for team members",
                "Generate shareable links or embed codes",
                "Schedule automated report delivery",
                "Collaborate in real-time with comments and annotations"
            ]
        },
    ];

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

    // Auto-rotate through the steps
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <section
            id="how-it-works"
            className="bg-muted/30 dark:bg-muted/10 py-24 relative overflow-hidden"
            ref={sectionRef}
        >
            {/* Background decoration */}
            <div className="absolute top-0 inset-0 opacity-30 dark:opacity-10">
                <div className="absolute -top-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl" />
            </div>

            <Container className="relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className={cn(
                        "text-3xl md:text-4xl font-bold tracking-tight mb-6 transition-all duration-1000 transform",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}>
                        How InsightBoard Works
                    </h2>
                    <p className={cn(
                        "text-lg text-muted-foreground transition-all duration-1000 delay-150 transform",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}>
                        Get started in minutes with our simple three-step process. No complex setup required.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className={cn(
                        "transition-all duration-1000 delay-300 transform",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    )}>
                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "transition-all duration-500",
                                        activeStep === index
                                            ? "scale-105 transform origin-left"
                                            : "opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <Card
                                        className={cn(
                                            "cursor-pointer border border-border overflow-hidden",
                                            activeStep === index && "shadow-md"
                                        )}
                                        onClick={() => setActiveStep(index)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className={cn(
                                                    "flex items-center justify-center w-12 h-12 rounded-lg",
                                                    step.color
                                                )}>
                                                    <step.icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium mr-3">
                                                                {index + 1}
                                                            </div>
                                                            <h3 className="text-xl font-semibold">
                                                                {step.title}
                                                            </h3>
                                                        </div>
                                                        <ChevronRight className={cn(
                                                            "h-5 w-5 text-muted-foreground transition-transform duration-300",
                                                            activeStep === index && "rotate-90"
                                                        )} />
                                                    </div>
                                                    <p className="text-muted-foreground mt-2 pl-11">
                                                        {step.description}
                                                    </p>

                                                    {activeStep === index && (
                                                        <div className="mt-4 pl-11 pt-4 border-t border-border animate-in slide-in-from-top duration-500">
                                                            <ul className="space-y-2">
                                                                {step.detailedSteps.map((detailStep, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-sm">
                                                                        <span className="text-primary mt-0.5">•</span>
                                                                        <span>{detailStep}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center lg:justify-start">
                            <Button
                                size="lg"
                                className="group"
                            >
                                Start Your Free Trial
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>

                    <div className={cn(
                        "relative transition-all duration-1000 delay-500 transform",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                    )}>
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl border-8 border-background">
                            <img
                                src={activeStep === 0
                                    ? "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                    : activeStep === 1
                                        ? "https://images.pexels.com/photos/7567460/pexels-photo-7567460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                        : "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                }
                                alt={steps[activeStep].title}
                                className="w-full h-full object-cover transition-all duration-500"
                            />

                            {/* Step indicator */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {steps.map((_, index) => (
                                    <button
                                        key={index}
                                        className={cn(
                                            "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                            activeStep === index
                                                ? "bg-white w-8"
                                                : "bg-white/50 hover:bg-white/80"
                                        )}
                                        onClick={() => setActiveStep(index)}
                                        aria-label={`Go to step ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-primary/10 rounded-full blur-2xl -z-10" />
                        <div className="absolute -left-8 -top-8 w-40 h-40 bg-primary/5 rounded-full blur-xl -z-10" />
                    </div>
                </div>
            </Container>
        </section>
    );
}