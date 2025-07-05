import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ErrorStateProps {
    title?: string
    message?: string
    retry?: () => void
    className?: string
}

export function ErrorState({
    title = "Something went wrong",
    message = "An error occurred while loading the content.",
    retry,
    className,
}: ErrorStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center",
                className
            )}
        >
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-destructive">{title}</h3>
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            {retry && (
                <Button variant="outline" onClick={retry}>
                    Try again
                </Button>
            )}
        </div>
    )
} 