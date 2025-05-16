"use client";

import { useState, useRef, useEffect } from "react";
import {
  Clock, BarChart2, Activity, Zap, Lock,
  Tag, Settings,
  LucideIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

export default function Features() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      title: "Automatic Time Tracking",
      description: "Effortlessly track time spent on different websites and applications with automatic categorization and idle detection.",
      icon: Clock,
      color: "bg-chart-1/10 text-chart-1",
      image: "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Productivity Analytics",
      description: "Get detailed insights into your digital habits with comprehensive analytics, trends, and productivity scores.",
      icon: BarChart2,
      color: "bg-chart-2/10 text-chart-2",
      image: "https://images.pexels.com/photos/7567460/pexels-photo-7567460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Smart Categories",
      description: "Automatically categorize websites and apps as productive or distracting, with custom rules and manual overrides.",
      icon: Tag,
      color: "bg-chart-3/10 text-chart-3",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Focus Mode",
      description: "Block distracting sites, set focus timers, and track your deep work sessions for maximum productivity.",
      icon: Activity,
      color: "bg-chart-4/10 text-chart-4",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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

  // Auto-rotate through the features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section id="features" className="bg-background py-24" ref={sectionRef}>
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold tracking-tight mb-6 transition-all duration-1000 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Take Control of Your Digital Life
          </h2>
          <p className={cn(
            "text-lg text-muted-foreground transition-all duration-1000 delay-150 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            InsightBoard helps you understand and optimize your online time with powerful
            features designed for modern digital life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={cn(
            "order-2 lg:order-1 transition-all duration-1000 delay-300 transform",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
              <img
                src={features[activeTab].image}
                alt={features[activeTab].title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent flex items-end p-6">
                <h3 className="text-xl font-semibold text-white">
                  {features[activeTab].title}
                </h3>
              </div>
            </div>
          </div>

          <div className={cn(
            "order-1 lg:order-2 transition-all duration-1000 delay-300 transform",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}>
            <div className="space-y-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className={cn(
                    "cursor-pointer transition-all duration-300",
                    activeTab === i
                      ? "scale-105 transform origin-left"
                      : "opacity-70 hover:opacity-100"
                  )}
                  onClick={() => setActiveTab(i)}
                >
                  <Card className={cn(
                    "border border-border overflow-hidden",
                    activeTab === i && "shadow-md"
                  )}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center",
                          feature.color
                        )}>
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 transition-all duration-1000 delay-500 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <FeatureCard
            icon={Zap}
            title="Instant Insights"
            description="Get real-time updates on your productivity and digital habits with our lightning-fast tracking engine."
            iconColor="bg-yellow-500/10 text-yellow-500"
          />
          <FeatureCard
            icon={Lock}
            title="Privacy First"
            description="Your data stays local by default, with optional encrypted cloud sync for backup and cross-device access."
            iconColor="bg-green-500/10 text-green-500"
          />
          <FeatureCard
            icon={Settings}
            title="Fully Customizable"
            description="Customize tracking rules, categories, and notifications to match your unique workflow and needs."
            iconColor="bg-blue-500/10 text-blue-500"
          />
        </div>
      </Container>
    </section>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
}

function FeatureCard({ icon: Icon, title, description, iconColor }: FeatureCardProps) {
  return (
    <Card className="border border-border h-full transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6 flex flex-col h-full">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
          iconColor
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}