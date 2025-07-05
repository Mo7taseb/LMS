import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps {
    icon?: LucideIcon
    title?: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
}

export function EmptyState({
    icon: Icon,
    title = "No items found",
    description = "There are no items to display at the moment.",
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center",
                className
            )}
        >
            {Icon && <Icon className="h-12 w-12 text-muted-foreground" />}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {action && (
                <Button variant="outline" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    )
} 