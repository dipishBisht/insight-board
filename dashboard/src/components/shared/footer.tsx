import { Github, Twitter, Mail, MapPin, Phone } from "lucide-react"
import Logo from "@/components/shared/logo"
import Link from "next/link"

export default function Footer() {
    return (
        <footer id="contact" className="bg-slate-900 text-slate-300">
            <div className="container-custom py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    <div className="space-y-4">
                        <Logo textColor="text-white" iconColor="text-primary" />
                        <p className="text-slate-400 max-w-xs">
                            Transform your data into actionable insights with powerful, intuitive dashboards.
                        </p>
                        <div className="flex gap-4">
                            <Link href="https://github.com" className="text-slate-400 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="https://twitter.com" className="text-slate-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="mailto:info@insightboard.com" className="text-slate-400 hover:text-white transition-colors">
                                <Mail className="h-5 w-5" />
                                <span className="sr-only">Email</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
                        <ul className="space-y-3">
                            {productLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="text-slate-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
                        <ul className="space-y-3">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="text-slate-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-2">
                                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>123 Analytics Street, Data City, 94107</span>
                            </li>
                            <li className="flex gap-2">
                                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex gap-2">
                                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>info@insightboard.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} InsightBoard. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="text-sm text-slate-500 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-slate-500 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

const productLinks = [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Tutorials", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "Documentation", href: "#" },
]

const companyLinks = [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Partners", href: "#" },
]
