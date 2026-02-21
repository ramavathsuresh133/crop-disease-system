"use client"

import { formatDistanceToNow } from "date-fns"
import { AlertTriangle, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Alert } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const severityConfig = {
  low: { label: "Low", className: "bg-success/10 text-success border-success/20" },
  medium: { label: "Medium", className: "bg-warning/10 text-warning-foreground border-warning/20" },
  high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
}

export function AlertBanner({ alert }: { alert: Alert }) {
  const severity = severityConfig[alert.severity]

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all",
        severity.className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">
              {alert.diseaseName}
            </p>
            <Badge
              variant="outline"
              className="shrink-0 text-[10px]"
            >
              {alert.severity.toUpperCase()}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs opacity-80">
            {alert.cropType} &middot; Reported by {alert.reportedBy}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs opacity-70">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {alert.region}
            </span>
            <span>
              {formatDistanceToNow(new Date(alert.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
