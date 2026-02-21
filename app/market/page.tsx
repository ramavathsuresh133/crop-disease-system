"use client"

import { useState, useMemo } from "react"
import { TrendingUp, TrendingDown, Minus, Search, RefreshCw, IndianRupee } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts"
import { mockMarketPrices, type MarketPrice } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const trendConfig = {
    up: { icon: TrendingUp, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30", badge: "bg-green-600 text-white" },
    down: { icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/5", badge: "bg-destructive text-destructive-foreground" },
    stable: { icon: Minus, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/30", badge: "bg-yellow-500 text-white" },
}

function MiniSparkline({ data, trend }: { data: number[]; trend: MarketPrice["trend"] }) {
    const color = trend === "up" ? "#16a34a" : trend === "down" ? "#ef4444" : "#eab308"
    const points = data.map((v, i) => ({ v, i }))
    return (
        <ResponsiveContainer width={90} height={36}>
            <LineChart data={points} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
                <Tooltip
                    contentStyle={{ fontSize: 10, padding: "2px 6px", borderRadius: 4 }}
                    formatter={(v: number) => [`₹${v}`, "Price"]}
                    labelFormatter={() => ""}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default function MarketPage() {
    const [search, setSearch] = useState("")
    const [lastUpdated] = useState(() => new Date())

    const filtered = useMemo(() =>
        mockMarketPrices.filter(p => p.crop.toLowerCase().includes(search.toLowerCase())),
        [search]
    )

    const topGainers = [...mockMarketPrices].filter(p => p.trend === "up").sort((a, b) => b.change - a.change).slice(0, 3)
    const topLosers = [...mockMarketPrices].filter(p => p.trend === "down").sort((a, b) => a.change - b.change).slice(0, 3)

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                            <IndianRupee className="h-7 w-7 text-primary" />
                            Market Price Tracker
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Live mandi prices for major crops — updated daily from AGMARKNET
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Last updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                </div>

                {/* Top Gainers / Losers */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                    <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                                <TrendingUp className="h-4 w-4" /> Top Gainers Today
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {topGainers.map(p => (
                                <div key={p.crop} className="flex items-center justify-between">
                                    <span className="font-medium text-foreground text-sm">{p.crop}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-foreground">₹{p.price.toLocaleString()}</span>
                                        <Badge className="bg-green-600 text-white text-[10px]">+₹{p.change}</Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm text-destructive">
                                <TrendingDown className="h-4 w-4" /> Top Losers Today
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {topLosers.map(p => (
                                <div key={p.crop} className="flex items-center justify-between">
                                    <span className="font-medium text-foreground text-sm">{p.crop}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-foreground">₹{p.price.toLocaleString()}</span>
                                        <Badge className="bg-destructive text-destructive-foreground text-[10px]">₹{p.change}</Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search crop (Wheat, Tomato, Cotton…)"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Price Table */}
                <Card className="border-border">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-4 py-3 text-left font-semibold text-foreground">Crop</th>
                                        <th className="px-4 py-3 text-right font-semibold text-foreground">Price</th>
                                        <th className="px-4 py-3 text-center font-semibold text-foreground">Change</th>
                                        <th className="px-4 py-3 text-center font-semibold text-foreground hidden sm:table-cell">7-Day Trend</th>
                                        <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">Market</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((p, idx) => {
                                        const cfg = trendConfig[p.trend]
                                        const Icon = cfg.icon
                                        return (
                                            <tr
                                                key={p.crop}
                                                className={cn(
                                                    "border-b border-border transition-colors hover:bg-muted/40",
                                                    idx === filtered.length - 1 && "border-b-0"
                                                )}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-foreground">{p.crop}</span>
                                                        <span className="text-xs text-muted-foreground hidden sm:inline">{p.unit}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="font-bold text-foreground">₹{p.price.toLocaleString()}</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Icon className={cn("h-4 w-4", cfg.color)} />
                                                        <Badge className={cn("text-[10px]", cfg.badge)}>
                                                            {p.change > 0 ? `+₹${p.change}` : p.change === 0 ? "Stable" : `₹${p.change}`}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 hidden sm:table-cell">
                                                    <div className="flex justify-center">
                                                        <MiniSparkline data={p.history} trend={p.trend} />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    <span className="text-xs text-muted-foreground">{p.market}</span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-16 text-center text-muted-foreground">
                                                No crops found for "{search}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-4 text-xs text-muted-foreground text-center">
                    * Prices are indicative mock data based on AGMARKNET. For real-time prices, visit{" "}
                    <span className="font-medium">agmarknet.gov.in</span>.
                </p>
            </main>
            <Footer />
        </div>
    )
}
