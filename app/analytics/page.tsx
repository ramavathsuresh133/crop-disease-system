"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { BarChart2, TrendingUp, Leaf, ShieldAlert, CheckCircle, ScanLine } from "lucide-react"
import { analyticsMonthly, analyticsByDisease, analyticsByCrop } from "@/lib/mock-data"

const totalScans = analyticsMonthly.reduce((s, m) => s + m.scans, 0)
const totalHealthy = analyticsMonthly.reduce((s, m) => s + m.healthy, 0)
const totalDiseased = analyticsMonthly.reduce((s, m) => s + m.diseased, 0)
const healthyPct = Math.round((totalHealthy / totalScans) * 100)

const statCards = [
    { label: "Total Scans", value: totalScans, icon: ScanLine, color: "text-primary" },
    { label: "Healthy Crops", value: `${healthyPct}%`, icon: CheckCircle, color: "text-green-600" },
    { label: "Disease Cases", value: totalDiseased, icon: ShieldAlert, color: "text-destructive" },
    { label: "Crops Monitored", value: analyticsByCrop.length, icon: Leaf, color: "text-yellow-600" },
]

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                        <BarChart2 className="h-7 w-7 text-primary" />
                        Crop Health Analytics
                    </h1>
                    <p className="mt-1 text-muted-foreground">Disease trends, scan history and crop performance overview</p>
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {statCards.map((s) => {
                        const Icon = s.icon
                        return (
                            <Card key={s.label} className="border-border">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                        <Icon className={`h-6 w-6 ${s.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                        <p className="text-xs text-muted-foreground">{s.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="grid gap-8 lg:grid-cols-2 mb-8">
                    {/* Monthly scan trends line chart */}
                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Monthly Scan Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={analyticsMonthly} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
                                    <Legend iconType="circle" iconSize={10} />
                                    <Line type="monotone" dataKey="scans" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} name="Total Scans" />
                                    <Line type="monotone" dataKey="healthy" stroke="#4ade80" strokeWidth={2} dot={{ r: 4 }} name="Healthy" />
                                    <Line type="monotone" dataKey="diseased" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Diseased" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Scans per crop bar chart */}
                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Leaf className="h-4 w-4 text-primary" />
                                Scans by Crop Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={analyticsByCrop} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
                                    <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} name="Scans" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Disease breakdown pie + list */}
                <Card className="border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ShieldAlert className="h-4 w-4 text-primary" />
                            Disease Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-8 lg:flex-row">
                            <ResponsiveContainer width="100%" height={280} className="lg:max-w-xs">
                                <PieChart>
                                    <Pie data={analyticsByDisease} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                        {analyticsByDisease.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-1 flex-col gap-2 w-full">
                                {analyticsByDisease.map((d) => (
                                    <div key={d.name} className="flex items-center justify-between rounded-lg border border-border px-4 py-2">
                                        <div className="flex items-center gap-3">
                                            <span className="h-3 w-3 rounded-full" style={{ background: d.fill }} />
                                            <span className="text-sm font-medium text-foreground">{d.name}</span>
                                        </div>
                                        <Badge variant="outline">{d.count} cases</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
