"use client"

import {
  AlertTriangle,
  CheckCircle2,
  Beaker,
  Leaf,
  Info,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { diseaseDatabase } from "@/lib/mock-data"

interface DetectionResultProps {
  result: {
    diseaseName: string
    confidence: number
    severity: "low" | "medium" | "high"
    treatment: string
    cropType: string
  }
}

const severityConfig = {
  low: {
    label: "Healthy",
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    badgeClass: "bg-success text-success-foreground",
  },
  medium: {
    label: "Moderate",
    icon: AlertTriangle,
    color: "text-warning-foreground",
    bg: "bg-warning/10",
    badgeClass: "bg-warning text-warning-foreground",
  },
  high: {
    label: "Severe",
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    badgeClass: "bg-destructive text-primary-foreground",
  },
}

export function DetectionResult({ result }: DetectionResultProps) {
  const severity = severityConfig[result.severity]
  const SeverityIcon = severity.icon
  const diseaseInfo = diseaseDatabase[result.diseaseName]

  return (
    <div className="flex flex-col gap-4">
      {/* Main result card */}
      <Card className="overflow-hidden border-border">
        <div
          className={cn(
            "h-2",
            result.severity === "high" && "bg-destructive",
            result.severity === "medium" && "bg-warning",
            result.severity === "low" && "bg-success"
          )}
        />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  severity.bg
                )}
              >
                <SeverityIcon className={cn("h-6 w-6", severity.color)} />
              </div>
              <div>
                <CardTitle className="text-xl text-foreground">
                  {result.diseaseName}
                </CardTitle>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Detected on {result.cropType}
                </p>
              </div>
            </div>
            <Badge className={severity.badgeClass}>{severity.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Confidence */}
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Detection Confidence
              </span>
              <span className="font-bold text-foreground">
                {result.confidence.toFixed(1)}%
              </span>
            </div>
            <Progress value={result.confidence} className="mt-2 h-3" />
          </div>

          <Separator />

          {/* Quick treatment */}
          <div>
            <p className="text-sm font-medium text-foreground">
              Recommended Action
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {result.treatment}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed disease info */}
      {diseaseInfo && (
        <Card className="border-border">
          <CardContent className="p-0">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between p-5 hover:bg-transparent"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Info className="h-4 w-4 text-primary" />
                    Disease Details & Treatment Guide
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform [[data-state=open]>&]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-5 px-5 pb-5">
                  <Separator />

                  {/* Info */}
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        About This Disease
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {diseaseInfo.info}
                      </p>
                    </div>
                  </div>

                  {/* Causes */}
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                      <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Causes
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {diseaseInfo.causes}
                      </p>
                    </div>
                  </div>

                  {/* Organic treatment */}
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/10">
                      <Leaf className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Organic Treatment
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {diseaseInfo.organic}
                      </p>
                    </div>
                  </div>

                  {/* Chemical treatment */}
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Beaker className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Chemical Treatment
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {diseaseInfo.chemical}
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
