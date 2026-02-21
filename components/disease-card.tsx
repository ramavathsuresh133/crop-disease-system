"use client"

import { format } from "date-fns"
import { Calendar, Crosshair } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Detection } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const severityConfig = {
  low: { label: "Healthy", className: "bg-success text-success-foreground" },
  medium: { label: "Moderate", className: "bg-warning text-warning-foreground" },
  high: { label: "Severe", className: "bg-destructive text-primary-foreground" },
}

export function DiseaseCard({ detection }: { detection: Detection }) {
  const severity = severityConfig[detection.severity]

  return (
    <Card className="overflow-hidden border-border transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        {/* Color bar at top */}
        <div
          className={cn(
            "h-1.5",
            detection.severity === "high" && "bg-destructive",
            detection.severity === "medium" && "bg-warning",
            detection.severity === "low" && "bg-success"
          )}
        />
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-foreground">
                {detection.diseaseName}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {detection.cropType}
              </p>
            </div>
            <Badge className={cn("shrink-0", severity.className)}>
              {severity.label}
            </Badge>
          </div>

          {/* Confidence bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium text-foreground">
                {detection.confidence.toFixed(1)}%
              </span>
            </div>
            <Progress value={detection.confidence} className="mt-1.5 h-2" />
          </div>

          {/* Treatment */}
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {detection.treatment}
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(detection.createdAt), "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Crosshair className="h-3 w-3" />
              {detection.location.lat.toFixed(2)}, {detection.location.lng.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
