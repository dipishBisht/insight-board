"use client";

import Link from "next/link";
import { BarChart2, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted/30 dark:bg-muted/10 pt-16 pb-12 border-t border-border">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-8 mb-12">
                    <div className="md:col-span-4 lg:col-span-4">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <BarChart2 className="h-8 w-8 text-primary" />
                            <span className="font-bold text-xl">InsightBoard</span>
                        </Link>

                        <p className="text-muted-foreground mb-6">
                            Transform your data into actionable insights with powerful, intuitive dashboards
                            that make decision-making simple.
                        </p>

                        <div className="flex gap-4">
                            <Button variant="ghost" size="icon">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Linkedin className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Github className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Mail className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-2">
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Changelog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Roadmap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 lg:col-span-2">
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Customers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-4">
                        <h3 className="font-semibold mb-4">Subscribe to our newsletter</h3>
                        <p className="text-muted-foreground mb-4">
                            Get the latest news, articles, and resources, sent to your inbox every month.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full"
                            />
                            <Button>
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                        © {currentYear} InsightBoard. All rights reserved.
                    </p>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}