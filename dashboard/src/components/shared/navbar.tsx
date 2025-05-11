"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { BarChart2, ChevronDown, Menu, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [user] = useAuthState(auth);
    console.log(user);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm py-3" : "bg-transparent py-5"
                }`}
        >
            <Container>
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <BarChart2 className="h-8 w-8 text-primary" />
                        <span className="font-bold text-xl">InsightBoard</span>
                    </Link>

                    {!user && (
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="#features"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Features
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                How It Works
                            </Link>
                            <Link
                                href="#testimonials"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Testimonials
                            </Link>
                        </div>
                    )}

                    <div className="hidden md:flex items-center gap-4">
                        <ModeToggle />
                        <div>
                            {
                                user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="outline-none flex gap-2 cursor-pointer">
                                            <span>Resources</span>
                                            <ChevronDown />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>Features</DropdownMenuItem>
                                            <DropdownMenuItem>How it works</DropdownMenuItem>
                                            <DropdownMenuItem>Testimonials</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) :
                                    <Button size="sm">Get Started</Button>
                            }
                        </div>
                        <div>
                            {
                                user ? (
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={"/images/user"} />
                                        <AvatarFallback className="text-lg">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                ) :
                                    <Link href="/login" className="cursor-pointer">
                                        <Button variant="outline" size="sm">
                                            Login
                                        </Button>
                                    </Link>
                            }
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ModeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ?
                                <X className="h-5 w-5" /> :
                                <Menu className="h-5 w-5" />
                            }
                        </Button>
                    </div>
                </div>
            </Container>

            {/* Mobile Menu */}
            {
                isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-background shadow-md py-4 animate-in slide-in-from-top-5 duration-300">
                        <Container>
                            <nav className="flex flex-col gap-4">
                                <Link
                                    href="#features"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Features
                                </Link>
                                <Link
                                    href="#how-it-works"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    How It Works
                                </Link>
                                <Link
                                    href="#testimonials"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Testimonials
                                </Link>
                                <Link
                                    href="#pricing"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Pricing
                                </Link>
                                <div className="flex flex-col gap-2 pt-2">
                                    <Button variant="outline" className="w-full justify-center">
                                        Login
                                    </Button>
                                    <Button className="w-full justify-center">
                                        Get Started
                                    </Button>
                                </div>
                            </nav>
                        </Container>
                    </div>
                )
            }
        </nav >
    );
}