import { ReactNode } from "react"
import { motion } from "framer-motion"

interface PageLayoutProps {
    children: ReactNode
    title?: string
    description?: string
    className?: string
}

export function PageLayout({
    children,
    title,
    description,
    className = "",
}: PageLayoutProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`container mx-auto px-4 py-8 ${className}`}
        >
            {(title || description) && (
                <div className="mb-8 space-y-2">
                    {title && (
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    )}
                    {description && (
                        <p className="text-muted-foreground">{description}</p>
                    )}
                </div>
            )}
            {children}
        </motion.div>
    )
} 