"use client"

import { useMemo } from "react"
import { ShieldCheck, ShieldAlert, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockDetections, mockAlerts } from "@/lib/mock-data"

function calcScore(): number {
    const total = mockDetections.length
    if (total === 0) return 75
    const healthy = mockDetections.filter(d => d.diseaseName === "Healthy").length
    const highSev = mockAlerts.filter(a => a.severity === "high").length
    const baseScore = (healthy / total) * 100
    const penalty = Math.min(highSev * 4, 25)
    return Math.round(Math.max(10, Math.min(100, baseScore - penalty + 40)))
}

export function HealthScoreCard() {
    const score = useMemo(calcScore, [])

    const isGood = score >= 75
    const isMedium = score >= 50 && score < 75

    const color = isGood ? "#16a34a" : isMedium ? "#eab308" : "#ef4444"
    const trackColor = isGood
        ? "rgba(22,163,74,0.15)"
        : isMedium
            ? "rgba(234,179,8,0.15)"
            : "rgba(239,68,68,0.15)"

    const label = isGood ? "Excellent" : isMedium ? "Fair" : "At Risk"
    const badgeClass = isGood
        ? "bg-green-600 text-white"
        : isMedium
            ? "bg-yellow-500 text-white"
            : "bg-destructive text-destructive-foreground"

    // SVG arc parameters
    const r = 52
    const cx = 64
    const cy = 64
    const circumference = 2 * Math.PI * r
    const dash = (score / 100) * circumference

    return (
        <Card className="border-border mt-6">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    {isGood
                        ? <ShieldCheck className="h-4 w-4 text-green-600" />
                        : <ShieldAlert className="h-4 w-4 text-yellow-500" />}
                    Farm Health Score
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-4">
                    {/* Circular gauge */}
                    <div className="relative">
                        <svg width="128" height="128" viewBox="0 0 128 128">
                            {/* Track */}
                            <circle
                                cx={cx} cy={cy} r={r}
                                fill="none"
                                stroke={trackColor}
                                strokeWidth="10"
                            />
                            {/* Score arc */}
                            <circle
                                cx={cx} cy={cy} r={r}
                                fill="none"
                                stroke={color}
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={`${dash} ${circumference}`}
                                strokeDashoffset={circumference / 4}
                                style={{ transition: "stroke-dasharray 0.8s ease" }}
                            />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize="24" fontWeight="700" fill={color}>
                                {score}
                            </text>
                            <text x="50%" y="68%" textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#888">
                                out of 100
                            </text>
                        </svg>
                    </div>
                    <div className="text-center">
                        <Badge className={badgeClass}>{label}</Badge>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Based on recent detections &amp; active alerts
                        </p>
                    </div>
                    {/* Mini breakdown */}
                    <div className="w-full space-y-1.5 border-t border-border pt-3">
                        {[
                            { label: "Healthy scans", value: `${mockDetections.filter(d => d.diseaseName === "Healthy").length}/${mockDetections.length}`, good: true },
                            { label: "Active high alerts", value: `${mockAlerts.filter(a => a.severity === "high").length}`, good: mockAlerts.filter(a => a.severity === "high").length === 0 },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{item.label}</span>
                                <span className={item.good ? "font-semibold text-green-600" : "font-semibold text-destructive"}>
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 text-primary" />
                        Updated today
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
