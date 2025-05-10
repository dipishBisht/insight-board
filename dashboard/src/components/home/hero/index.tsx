"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Clock, BarChart2, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

export default function Hero() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <header
            id="home"
            className="relative w-full bg-gradient-to-b from-primary/5 via-background to-background dark:from-primary/10 dark:via-background/95 dark:to-background pt-24 pb-16 md:pt-32 md:pb-24"
        >
            <div className="absolute inset-0">
                <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
            </div>

            <Container className="relative z-10">
                <div className="flex flex-col items-center text-center">
                    <div className={cn(
                        "transition-all duration-1000 transform",
                        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            Take Control of Your Digital Time
                        </span>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                            Understand Your Online Time,{" "}
                            <span className="text-primary relative">
                                Boost Productivity
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 5.5C47.6667 2.16666 94.3333 1.99999 141 5C187.667 8 187.667 -0.99998 194.5 1.49998"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary/30" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Track your online activity, visualize your digital habits, and optimize your
                            productivity with powerful, intuitive analytics.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="relative overflow-hidden group"
                            >
                                <span className="relative z-10">Start Tracking Free</span>
                                <span className="absolute inset-0 bg-primary/90 transform transition-transform duration-300 group-hover:translate-y-full"></span>
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="group"
                            >
                                <span>View Demo</span>
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>

                    <div className={cn(
                        "mt-16 w-full mx-auto transition-all duration-1000 transform",
                        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16",
                        "delay-300"
                    )}>
                        <div className="w-full max-w-5xl mx-auto bg-card rounded-xl shadow-xl overflow-hidden border border-border relative">
                            <div className="bg-muted/50 p-3 flex items-center justify-between border-b border-border">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-destructive/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Clock className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <BarChart2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <LineChart className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="relative bg-card p-4">
                                <img
                                    src="https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                    alt="InsightBoard Dashboard Preview"
                                    className="w-full h-auto rounded-md shadow-sm object-cover"
                                />

                                <div className="absolute top-8 left-8 right-8 flex justify-between">
                                    <div className="bg-background/90 backdrop-blur-sm rounded-md p-3 w-1/3 shadow-sm">
                                        <div className="h-4 w-2/3 bg-primary/20 rounded-full mb-2"></div>
                                        <div className="h-10 w-full bg-chart-1/30 rounded-md"></div>
                                    </div>

                                    <div className="bg-background/90 backdrop-blur-sm rounded-md p-3 w-1/3 shadow-sm ml-4">
                                        <div className="h-4 w-2/3 bg-primary/20 rounded-full mb-2"></div>
                                        <div className="h-10 w-full bg-chart-2/30 rounded-md"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </header>
    );
}