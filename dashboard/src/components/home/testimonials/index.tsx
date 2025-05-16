"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const testimonials = [
        {
            name: "Sarah Johnson",
            title: "Data Analyst at TechCorp",
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            quote: "InsightBoard has completely transformed how we visualize and share data within our organization. The interactive dashboards have made it so much easier to communicate complex insights to non-technical stakeholders.",
            rating: 5,
        },
        {
            name: "Michael Chen",
            title: "Marketing Director at GrowthLabs",
            image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            quote: "We've tried several data visualization tools, but InsightBoard is by far the most intuitive and powerful. The ability to connect to all our data sources and create beautiful reports in minutes has been a game-changer for our marketing team.",
            rating: 5,
        },
        {
            name: "Jessica Rodriguez",
            title: "CEO at StartupVision",
            image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            quote: "As a startup CEO, I need to make data-driven decisions quickly. InsightBoard gives me the insights I need at a glance, without having to wait for our analytics team to create reports. It's become an essential tool for our executive team.",
            rating: 4,
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

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    // Auto-rotate through testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            id="testimonials"
            className="bg-background py-24"
            ref={sectionRef}
        >
            <Container>
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className={cn(
                        "text-3xl md:text-4xl font-bold tracking-tight mb-6 transition-all duration-1000 transform",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}>
                        What Our Customers Say
                    </h2>
                    <p className={cn(
                        "text-lg text-muted-foreground transition-all duration-1000 delay-150 transform",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}>
                        Join thousands of businesses that use InsightBoard to make better decisions.
                    </p>
                </div>

                <div className="relative">
                    <div className={cn(
                        "max-w-4xl mx-auto transition-all duration-1000 delay-300 transform",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    )}>
                        <div className="relative">
                            <Quote className="absolute -top-8 left-0 h-16 w-16 text-primary/10" />

                            <div className="relative overflow-hidden">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                                >
                                    {testimonials.map((testimonial, index) => (
                                        <div
                                            key={index}
                                            className="w-full flex-shrink-0 px-4"
                                        >
                                            <Card className="border-none shadow-none">
                                                <CardContent className="p-0">
                                                    <blockquote className="text-xl md:text-2xl font-medium text-center mb-8 italic">
                                                        &quot;{testimonial.quote}&quot;
                                                    </blockquote>

                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-primary">
                                                            <img
                                                                src={testimonial.image}
                                                                alt={testimonial.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        <div className="flex mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={cn(
                                                                        "h-5 w-5",
                                                                        i < testimonial.rating
                                                                            ? "text-yellow-500 fill-yellow-500"
                                                                            : "text-muted"
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>

                                                        <p className="font-semibold text-lg">{testimonial.name}</p>
                                                        <p className="text-muted-foreground">{testimonial.title}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center mt-8 gap-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-300",
                                            index === activeIndex
                                                ? "bg-primary w-8"
                                                : "bg-muted"
                                        )}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <div className="flex justify-center gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePrev}
                                    aria-label="Previous testimonial"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNext}
                                    aria-label="Next testimonial"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cn(
                    "mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-500 transform",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>
                    <div className="flex flex-col items-center">
                        <p className="text-4xl md:text-5xl font-bold mb-2 text-primary">500+</p>
                        <p className="text-center text-muted-foreground">Companies</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-4xl md:text-5xl font-bold mb-2 text-primary">10k+</p>
                        <p className="text-center text-muted-foreground">Active Users</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-4xl md:text-5xl font-bold mb-2 text-primary">25k+</p>
                        <p className="text-center text-muted-foreground">Dashboards Created</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-4xl md:text-5xl font-bold mb-2 text-primary">99%</p>
                        <p className="text-center text-muted-foreground">Satisfaction Rate</p>
                    </div>
                </div>
            </Container>
        </section>
    );
}