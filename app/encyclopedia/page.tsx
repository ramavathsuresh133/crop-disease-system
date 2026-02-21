"use client"

import { useState, useMemo } from "react"
import { Search, BookOpen, Leaf, Beaker, FlaskConical, Info, ShieldAlert } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { diseaseDatabase } from "@/lib/mock-data"

const riskMeta: Record<string, { level: "high" | "medium" | "low"; color: string; affected: string[] }> = {
    "Early Blight": { level: "high", color: "bg-destructive text-destructive-foreground", affected: ["Tomato", "Potato"] },
    "Late Blight": { level: "high", color: "bg-destructive text-destructive-foreground", affected: ["Tomato", "Potato"] },
    "Leaf Mold": { level: "medium", color: "bg-yellow-500 text-white", affected: ["Tomato"] },
    "Bacterial Spot": { level: "medium", color: "bg-yellow-500 text-white", affected: ["Tomato", "Pepper"] },
    "Powdery Mildew": { level: "medium", color: "bg-yellow-500 text-white", affected: ["Wheat", "Grape", "Cucumber"] },
    "Rust": { level: "high", color: "bg-destructive text-destructive-foreground", affected: ["Wheat", "Corn", "Soybean"] },
    "Anthracnose": { level: "medium", color: "bg-yellow-500 text-white", affected: ["Mango", "Grape", "Strawberry"] },
    "Downy Mildew": { level: "medium", color: "bg-yellow-500 text-white", affected: ["Grape", "Cucumber", "Spinach"] },
    "Fusarium Wilt": { level: "high", color: "bg-destructive text-destructive-foreground", affected: ["Tomato", "Banana", "Cotton"] },
    "Root Rot": { level: "high", color: "bg-destructive text-destructive-foreground", affected: ["Soybean", "Corn", "Wheat"] },
    "Healthy": { level: "low", color: "bg-green-600 text-white", affected: [] },
}

export default function EncyclopediaPage() {
    const [search, setSearch] = useState("")
    const [riskFilter, setRiskFilter] = useState("all")

    const diseases = useMemo(() => {
        return Object.entries(diseaseDatabase)
            .filter(([name]) => name !== "Healthy")
            .filter(([name, data]) => {
                const meta = riskMeta[name]
                const matchSearch =
                    name.toLowerCase().includes(search.toLowerCase()) ||
                    data.causes.toLowerCase().includes(search.toLowerCase()) ||
                    data.info.toLowerCase().includes(search.toLowerCase())
                const matchRisk = riskFilter === "all" || meta?.level === riskFilter
                return matchSearch && matchRisk
            })
    }, [search, riskFilter])

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                        <BookOpen className="h-7 w-7 text-primary" />
                        Disease Encyclopedia
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Browse and search all known crop diseases — causes, treatments, and prevention
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search diseases, causes, symptoms..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Tabs value={riskFilter} onValueChange={setRiskFilter}>
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="high">High Risk</TabsTrigger>
                            <TabsTrigger value="medium">Medium</TabsTrigger>
                            <TabsTrigger value="low">Low</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Stats bar */}
                <div className="mb-6 flex gap-3 flex-wrap">
                    <Badge variant="outline">{diseases.length} diseases found</Badge>
                    <Badge className="bg-destructive text-destructive-foreground">
                        {Object.values(riskMeta).filter(m => m.level === "high").length - 1} High Risk
                    </Badge>
                    <Badge className="bg-yellow-500 text-white">
                        {Object.values(riskMeta).filter(m => m.level === "medium").length} Medium Risk
                    </Badge>
                </div>

                {/* Disease Grid */}
                {diseases.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {diseases.map(([name, data]) => {
                            const meta = riskMeta[name]
                            return (
                                <Card key={name} className="border-border flex flex-col">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="flex items-center gap-2 text-base text-foreground">
                                                <ShieldAlert className="h-4 w-4 text-primary shrink-0" />
                                                {name}
                                            </CardTitle>
                                            {meta && (
                                                <Badge className={`${meta.color} shrink-0 text-xs capitalize`}>
                                                    {meta.level} risk
                                                </Badge>
                                            )}
                                        </div>
                                        {meta && meta.affected.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {meta.affected.map(crop => (
                                                    <Badge key={crop} variant="outline" className="text-[10px] py-0">
                                                        <Leaf className="mr-1 h-2.5 w-2.5" />{crop}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3 flex-1">
                                        {/* Info */}
                                        <div className="rounded-md bg-muted/50 p-3">
                                            <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-foreground uppercase tracking-wide">
                                                <Info className="h-3 w-3" /> About
                                            </p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{data.info}</p>
                                        </div>
                                        {/* Causes */}
                                        <div>
                                            <p className="mb-1 text-xs font-semibold text-foreground uppercase tracking-wide">Causes</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{data.causes}</p>
                                        </div>
                                        {/* Treatments */}
                                        <div className="mt-auto grid grid-cols-2 gap-2">
                                            <div className="rounded-md border border-green-500/30 bg-green-500/5 p-2">
                                                <p className="mb-1 flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                                                    <Leaf className="h-2.5 w-2.5" /> Organic
                                                </p>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed">{data.organic}</p>
                                            </div>
                                            <div className="rounded-md border border-blue-500/30 bg-blue-500/5 p-2">
                                                <p className="mb-1 flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase">
                                                    <Beaker className="h-2.5 w-2.5" /> Chemical
                                                </p>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed">{data.chemical}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-20 text-center">
                        <FlaskConical className="h-12 w-12 text-muted-foreground/40" />
                        <p className="mt-4 font-medium text-foreground">No diseases found</p>
                        <p className="mt-1 text-sm text-muted-foreground">Try a different search term or filter</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
