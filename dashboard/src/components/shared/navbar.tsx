import { Button } from "../ui/button";
import Logo from "./logo";
import { Container } from "./container";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky bg-white w-full inset-0 z-10 py-4">
            <Container className="flex justify-between items-center">
                <Logo size="lg" />
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="#how-it-works">How it works</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="#contact">Contact</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="#get-started">Get Started</Link>
                    </Button>
                </div>
            </Container>
        </nav>
    )
}