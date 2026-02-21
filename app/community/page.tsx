"use client"

import React, { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Users, ThumbsUp, MapPin, Plus, Filter, ArrowUpDown, AlertTriangle, CheckCircle } from "lucide-react"
import { mockCommunityReports, cropTypes, CommunityReport } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

const severityConfig: Record<"low" | "medium" | "high", { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
    high: { label: "Severe", color: "bg-destructive text-destructive-foreground", icon: AlertTriangle },
    medium: { label: "Moderate", color: "bg-yellow-500 text-white", icon: AlertTriangle },
    low: { label: "Low", color: "bg-green-600 text-white", icon: CheckCircle },
}

export default function CommunityPage() {
    const [reports, setReports] = useState<CommunityReport[]>(mockCommunityReports)
    const [upvoted, setUpvoted] = useState<Set<string>>(new Set())
    const [cropFilter, setCropFilter] = useState("all")
    const [severityFilter, setSeverityFilter] = useState("all")
    const [sortBy, setSortBy] = useState<"latest" | "helpful">("latest")
    const [dialogOpen, setDialogOpen] = useState(false)

    // Form state
    const [form, setForm] = useState({
        farmer: "", region: "", cropType: "", diseaseName: "",
        severity: "medium" as "low" | "medium" | "high", description: "",
    })

    const filtered = useMemo(() => {
        let list = [...reports]
        if (cropFilter !== "all") list = list.filter(r => r.cropType === cropFilter)
        if (severityFilter !== "all") list = list.filter(r => r.severity === severityFilter)
        if (sortBy === "helpful") list.sort((a, b) => b.upvotes - a.upvotes)
        else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        return list
    }, [reports, cropFilter, severityFilter, sortBy])

    function toggleUpvote(id: string) {
        setUpvoted(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
                setReports(r => r.map(x => x.id === id ? { ...x, upvotes: x.upvotes - 1 } : x))
            } else {
                next.add(id)
                setReports(r => r.map(x => x.id === id ? { ...x, upvotes: x.upvotes + 1 } : x))
            }
            return next
        })
    }

    function submitReport() {
        if (!form.farmer || !form.cropType || !form.diseaseName || !form.description) {
            toast.error("Please fill in all required fields")
            return
        }
        const newReport: CommunityReport = {
            id: `cr-${Date.now()}`,
            farmer: form.farmer,
            region: form.region || "Unknown Region",
            cropType: form.cropType,
            diseaseName: form.diseaseName,
            severity: form.severity,
            description: form.description,
            upvotes: 0,
            createdAt: new Date().toISOString(),
        }
        setReports(prev => [newReport, ...prev])
        setDialogOpen(false)
        setForm({ farmer: "", region: "", cropType: "", diseaseName: "", severity: "medium", description: "" })
        toast.success("Report submitted successfully! Thank you for helping the community.")
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                            <Users className="h-7 w-7 text-primary" />
                            Community Reports
                        </h1>
                        <p className="mt-1 text-muted-foreground">Disease sightings shared by farmers in your region</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                <Plus className="h-4 w-4" />
                                Submit Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Submit a Disease Report</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 mt-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label>Your Name *</Label>
                                        <Input placeholder="e.g. Ramesh Kumar" value={form.farmer} onChange={e => setForm(f => ({ ...f, farmer: e.target.value }))} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Region</Label>
                                        <Input placeholder="e.g. Punjab" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label>Crop Type *</Label>
                                        <Select value={form.cropType} onValueChange={v => setForm(f => ({ ...f, cropType: v }))}>
                                            <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                                            <SelectContent>{cropTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Disease Name *</Label>
                                        <Input placeholder="e.g. Early Blight" value={form.diseaseName} onChange={e => setForm(f => ({ ...f, diseaseName: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label>Severity</Label>
                                    <Select value={form.severity} onValueChange={v => setForm(f => ({ ...f, severity: v as "low" | "medium" | "high" }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High (Severe)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Description *</Label>
                                    <Textarea placeholder="Describe what you observed — symptoms, spread, treatment tried..." rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                </div>
                                <Button onClick={submitReport} className="gap-2 bg-primary text-primary-foreground">
                                    <Plus className="h-4 w-4" />
                                    Submit Report
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters + sort */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={cropFilter} onValueChange={setCropFilter}>
                        <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Crops" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Crops</SelectItem>
                            {cropTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                        <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Severity" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Severity</SelectItem>
                            <SelectItem value="high">Severe</SelectItem>
                            <SelectItem value="medium">Moderate</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="ml-auto flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        <Button variant={sortBy === "latest" ? "secondary" : "ghost"} size="sm" onClick={() => setSortBy("latest")}>Latest</Button>
                        <Button variant={sortBy === "helpful" ? "secondary" : "ghost"} size="sm" onClick={() => setSortBy("helpful")}>Most Helpful</Button>
                    </div>
                </div>

                {/* Report cards */}
                <div className="flex flex-col gap-4">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">No reports match your filters.</div>
                    ) : filtered.map(report => {
                        const cfg = severityConfig[report.severity]
                        const SevIcon = cfg.icon
                        const hasUpvoted = upvoted.has(report.id)
                        return (
                            <Card key={report.id} className="border-border">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="font-semibold text-foreground">{report.farmer}</span>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    {report.region}
                                                </div>
                                                <span className="text-xs text-muted-foreground">·</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <Badge variant="outline">{report.cropType}</Badge>
                                                <Badge variant="outline" className="font-medium">{report.diseaseName}</Badge>
                                                <Badge className={cn("gap-1", cfg.color)}>
                                                    <SevIcon className="h-3 w-3" />
                                                    {cfg.label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{report.description}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleUpvote(report.id)}
                                            className={cn(
                                                "flex flex-col items-center gap-1 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all shrink-0",
                                                hasUpvoted
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                                            )}
                                        >
                                            <ThumbsUp className={cn("h-4 w-4", hasUpvoted && "fill-primary")} />
                                            {report.upvotes}
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </main>
            <Footer />
        </div>
    )
}
