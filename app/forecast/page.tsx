"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CloudSun, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Lightbulb, Calendar } from "lucide-react"
import { seasonalForecast } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const riskConfig = {
    high: { label: "High Risk", color: "bg-destructive text-destructive-foreground", border: "border-destructive/30 bg-destructive/5", icon: AlertTriangle, dot: "bg-destructive" },
    medium: { label: "Medium Risk", color: "bg-yellow-500 text-white", border: "border-yellow-300/40 bg-yellow-50/50 dark:bg-yellow-950/20", icon: AlertTriangle, dot: "bg-yellow-500" },
    low: { label: "Low Risk", color: "bg-green-600 text-white", border: "border-green-300/40 bg-green-50/50 dark:bg-green-950/20", icon: CheckCircle, dot: "bg-green-500" },
}

export default function ForecastPage() {
    const [expanded, setExpanded] = useState<number>(0)

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                        <CloudSun className="h-7 w-7 text-primary" />
                        Seasonal Disease Forecast
                    </h1>
                    <p className="mt-1 text-muted-foreground">4-week disease risk outlook for your region</p>
                </div>

                {/* Season badge */}
                <div className="mb-6 flex items-center gap-3">
                    <Badge className="gap-1.5 bg-primary/10 text-primary border border-primary/20">
                        <Calendar className="h-3 w-3" />
                        Rabi Season (Oct – Mar)
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground">North India Region</Badge>
                </div>

                <div className="flex flex-col gap-4">
                    {seasonalForecast.map((week, i) => {
                        const isOpen = expanded === i
                        const highCount = week.risks.filter(r => r.level === "high").length
                        return (
                            <Card key={i} className={cn("border-border overflow-hidden transition-all", i === 0 && "ring-2 ring-primary/30")}>
                                <button
                                    className="w-full text-left"
                                    onClick={() => setExpanded(isOpen ? -1 : i)}
                                >
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center justify-between text-base">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold", i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                                                    W{i + 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">{week.week}</p>
                                                    <p className="text-xs font-normal text-muted-foreground">{week.dateRange}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {highCount > 0 && (
                                                    <Badge className="bg-destructive text-destructive-foreground">{highCount} High Risk</Badge>
                                                )}
                                                {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                </button>

                                {isOpen && (
                                    <CardContent className="pt-0 space-y-4">
                                        {/* Risk rows */}
                                        <div className="flex flex-col gap-2">
                                            {week.risks.map((risk, j) => {
                                                const cfg = riskConfig[risk.level]
                                                const RiskIcon = cfg.icon
                                                return (
                                                    <div key={j} className={cn("flex items-center justify-between rounded-lg border px-4 py-2.5", cfg.border)}>
                                                        <div className="flex items-center gap-3">
                                                            <span className={cn("h-2.5 w-2.5 rounded-full", cfg.dot)} />
                                                            <div>
                                                                <p className="text-sm font-medium text-foreground">{risk.disease}</p>
                                                                <p className="text-xs text-muted-foreground">on {risk.crop}</p>
                                                            </div>
                                                        </div>
                                                        <Badge className={cfg.color}>
                                                            <RiskIcon className="mr-1 h-3 w-3" />
                                                            {cfg.label}
                                                        </Badge>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Tip */}
                                        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                                            <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-primary mb-1">This Week&apos;s Tip</p>
                                                <p className="text-sm text-muted-foreground">{week.tip}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4 rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-xs font-medium text-foreground w-full">Risk Level Legend:</p>
                    {Object.entries(riskConfig).map(([level, cfg]) => (
                        <div key={level} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className={cn("h-2.5 w-2.5 rounded-full", cfg.dot)} />
                            {cfg.label}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}
