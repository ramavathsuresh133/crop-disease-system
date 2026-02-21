"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pill, Leaf, CalendarCheck, CheckCircle, AlertTriangle, FlaskConical } from "lucide-react"
import { cropTypes, diseaseDatabase } from "@/lib/mock-data"

const diseases = Object.keys(diseaseDatabase).filter(d => d !== "Healthy")

interface ScheduleDay {
    day: string
    task: string
    note: string
}

function buildSchedule(disease: string, track: "organic" | "chemical"): ScheduleDay[] {
    const data = diseaseDatabase[disease]
    if (!data) return []
    const treatment = track === "organic" ? data.organic : data.chemical
    // Split the treatment text into 4 step chunks
    const steps = treatment.split(". ").filter(Boolean)
    const days = ["Day 1", "Day 3", "Day 7", "Day 14"]
    return days.map((day, i) => ({
        day,
        task: steps[i] ? steps[i] + "." : "Continue monitoring and repeat previous step if needed.",
        note: i === 0 ? "Start treatment immediately" : i === 3 ? "Final assessment — check for recovery" : "Follow-up application",
    }))
}

export default function TreatmentPage() {
    const [selectedCrop, setSelectedCrop] = useState("")
    const [selectedDisease, setSelectedDisease] = useState("")
    const [schedule, setSchedule] = useState<{ organic: ScheduleDay[]; chemical: ScheduleDay[] } | null>(null)

    function generate() {
        if (!selectedCrop || !selectedDisease) return
        setSchedule({
            organic: buildSchedule(selectedDisease, "organic"),
            chemical: buildSchedule(selectedDisease, "chemical"),
        })
    }

    const diseaseInfo = selectedDisease ? diseaseDatabase[selectedDisease] : null

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                        <FlaskConical className="h-7 w-7 text-primary" />
                        Treatment Planner
                    </h1>
                    <p className="mt-1 text-muted-foreground">Get a step-by-step treatment schedule for any crop disease</p>
                </div>

                {/* Selector */}
                <Card className="border-border mb-6">
                    <CardContent className="p-6 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Crop Type</Label>
                                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                                    <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                                    <SelectContent>
                                        {cropTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Disease Detected</Label>
                                <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                                    <SelectTrigger><SelectValue placeholder="Select disease" /></SelectTrigger>
                                    <SelectContent>
                                        {diseases.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            onClick={generate}
                            disabled={!selectedCrop || !selectedDisease}
                            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            size="lg"
                        >
                            <CalendarCheck className="h-4 w-4" />
                            Generate Treatment Schedule
                        </Button>
                    </CardContent>
                </Card>

                {/* Disease info */}
                {diseaseInfo && selectedDisease && (
                    <Card className="border-border mb-6">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                About {selectedDisease}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">{diseaseInfo.info}</p>
                            <div className="rounded-lg bg-muted/50 p-3">
                                <p className="text-xs font-medium text-foreground mb-1">Causes</p>
                                <p className="text-xs text-muted-foreground">{diseaseInfo.causes}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Schedule */}
                {schedule && selectedDisease && (
                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CalendarCheck className="h-4 w-4 text-primary" />
                                14-Day Treatment Plan
                                <Badge variant="outline" className="ml-auto">{selectedCrop} · {selectedDisease}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="organic">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="organic" className="gap-2">
                                        <Leaf className="h-3.5 w-3.5" /> Organic Track
                                    </TabsTrigger>
                                    <TabsTrigger value="chemical" className="gap-2">
                                        <Pill className="h-3.5 w-3.5" /> Chemical Track
                                    </TabsTrigger>
                                </TabsList>
                                {(["organic", "chemical"] as const).map(track => (
                                    <TabsContent key={track} value={track}>
                                        <div className="relative ml-4 border-l-2 border-primary/30 pl-6 space-y-6">
                                            {schedule[track].map((step, i) => (
                                                <div key={i} className="relative">
                                                    <div className="absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow">
                                                        {i + 1}
                                                    </div>
                                                    <div className="rounded-xl border border-border bg-card p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-semibold text-foreground text-sm">{step.day}</span>
                                                            <Badge variant="outline" className="text-[10px]">{step.note}</Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{step.task}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="relative">
                                                <div className="absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white shadow">
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                                <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/20 p-4">
                                                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Day 21 — Assessment Complete</p>
                                                    <p className="text-xs text-muted-foreground mt-1">If symptoms persist, consult a local agricultural extension officer. Consider resistant varieties for the next season.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </CardContent>
                    </Card>
                )}
            </main>
            <Footer />
        </div>
    )
}
