"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { History, Search, Download, Trash2, Filter, Calendar } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export interface DetectionRecord {
    id: string
    cropType: string
    diseaseName: string
    confidence: number
    severity: "low" | "medium" | "high"
    treatment: string
    detectedAt: string
}

const HISTORY_KEY = "cropguard_detection_history"

export function saveDetectionToHistory(record: Omit<DetectionRecord, "id" | "detectedAt">) {
    const existing: DetectionRecord[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")
    const newRecord: DetectionRecord = {
        ...record,
        id: `det-${Date.now()}`,
        detectedAt: new Date().toISOString(),
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify([newRecord, ...existing].slice(0, 100)))
}

const severityBadge: Record<string, string> = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-yellow-500 text-white",
    low: "bg-green-600 text-white",
}

export default function HistoryPage() {
    const router = useRouter()
    const { user, hydrated } = useAuth()
    const [records, setRecords] = useState<DetectionRecord[]>([])
    const [search, setSearch] = useState("")
    const [severityFilter, setSeverityFilter] = useState("all")
    const [cropFilter, setCropFilter] = useState("all")

    useEffect(() => {
        if (hydrated && !user) router.replace("/login")
    }, [user, hydrated, router])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")
        setRecords(stored)
    }, [])

    const uniqueCrops = useMemo(() => [...new Set(records.map(r => r.cropType))], [records])

    const filtered = useMemo(() =>
        records.filter(r => {
            const matchSearch =
                r.cropType.toLowerCase().includes(search.toLowerCase()) ||
                r.diseaseName.toLowerCase().includes(search.toLowerCase())
            const matchSeverity = severityFilter === "all" || r.severity === severityFilter
            const matchCrop = cropFilter === "all" || r.cropType === cropFilter
            return matchSearch && matchSeverity && matchCrop
        }),
        [records, search, severityFilter, cropFilter]
    )

    function handleClear() {
        if (!confirm("Clear all detection history?")) return
        localStorage.removeItem(HISTORY_KEY)
        setRecords([])
        toast.success("History cleared")
    }

    function handleExportCSV() {
        if (filtered.length === 0) { toast.error("No records to export"); return }
        const headers = ["Date", "Crop", "Disease", "Confidence", "Severity", "Treatment"]
        const rows = filtered.map(r => [
            new Date(r.detectedAt).toLocaleString(),
            r.cropType,
            r.diseaseName,
            `${r.confidence}%`,
            r.severity,
            `"${r.treatment.replace(/"/g, '""')}"`,
        ])
        const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `cropguard-history-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast.success(`Exported ${filtered.length} records`)
    }

    if (!hydrated || !user) return null

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                            <History className="h-7 w-7 text-primary" />
                            Detection History
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            All your past crop disease detections ({records.length} total)
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                        {records.length > 0 && (
                            <Button variant="outline" size="sm" onClick={handleClear} className="gap-2 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search crop or disease..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Filter className="mt-2.5 h-4 w-4 text-muted-foreground" />
                        <Select value={cropFilter} onValueChange={setCropFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Crops" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Crops</SelectItem>
                                {uniqueCrops.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={severityFilter} onValueChange={setSeverityFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Severity</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Records */}
                {filtered.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {filtered.map(record => (
                            <Card key={record.id} className="border-border">
                                <CardContent className="flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-semibold text-foreground">{record.diseaseName}</span>
                                            <Badge className={severityBadge[record.severity]}>{record.severity}</Badge>
                                            <Badge variant="outline" className="gap-1 text-xs">
                                                <span className="text-primary">●</span> {record.cropType}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{record.treatment}</p>
                                    </div>
                                    <div className="flex items-center gap-3 text-right">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{record.confidence.toFixed(1)}%</p>
                                            <p className="text-[10px] text-muted-foreground">confidence</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(record.detectedAt).toLocaleDateString()} {new Date(record.detectedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : records.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-24 text-center">
                        <History className="h-14 w-14 text-muted-foreground/30" />
                        <p className="mt-4 font-semibold text-foreground">No detection history yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">Upload a crop image on the Upload page to get started</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-20 text-center">
                        <Search className="h-10 w-10 text-muted-foreground/40" />
                        <p className="mt-4 font-medium text-foreground">No records match your filters</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
