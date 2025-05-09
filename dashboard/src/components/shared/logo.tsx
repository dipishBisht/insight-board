import { BarChart3 } from "lucide-react"
import Link from "next/link"

interface LogoProps {
    className?: string
    textColor?: string
    iconColor?: string
    size?: "sm" | "md" | "lg"
}

export default function Logo({
    className = "",
    textColor = "text-deep",
    iconColor = "text-primary",
    size = "md",
}: LogoProps) {
    const sizeClasses = {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl",
    }

    const iconSizes = {
        sm: 20,
        md: 24,
        lg: 28,
    }

    return (
        <Link href="/" className={`flex items-center gap-2 font-bold ${sizeClasses[size]} ${textColor} ${className}`}>
            <BarChart3 className={`${iconColor}`} size={iconSizes[size]} />
            <span>InsightBoard</span>
        </Link>
    )
}
