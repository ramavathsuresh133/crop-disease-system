"use client"

import { useState } from "react"
import { CalendarDays, Leaf, Sprout, Wheat, AlertTriangle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cropTypes } from "@/lib/mock-data"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Activity types: plant, grow, harvest, risk, rest
type Activity = "plant" | "grow" | "harvest" | "risk" | "rest"

interface CropCalendarData {
    months: Activity[]
    diseaseRiskMonths: number[]
    notes: string
    growDays: string
}

const cropCalendars: Record<string, CropCalendarData> = {
    Tomato: { months: ["rest", "rest", "plant", "grow", "grow", "grow", "harvest", "harvest", "plant", "grow", "grow", "rest"], diseaseRiskMonths: [5, 6, 7, 8], notes: "Susceptible to Early & Late Blight during monsoon. Ensure good drainage.", growDays: "60-80 days" },
    Potato: { months: ["rest", "plant", "grow", "grow", "harvest", "rest", "rest", "plant", "grow", "grow", "harvest", "rest"], diseaseRiskMonths: [3, 4, 8, 9], notes: "Late Blight risk high during cool humid periods. Avoid waterlogging.", growDays: "70-120 days" },
    Wheat: { months: ["rest", "rest", "rest", "rest", "rest", "rest", "rest", "rest", "rest", "plant", "grow", "grow"], diseaseRiskMonths: [9, 10], notes: "Powdery Mildew and Rust common in Oct-Nov. Use resistant varieties.", growDays: "110-130 days" },
    Rice: { months: ["rest", "rest", "rest", "rest", "rest", "plant", "grow", "grow", "harvest", "rest", "plant", "grow"], diseaseRiskMonths: [6, 7, 8], notes: "Blast disease peaks in monsoon. Maintain proper water level management.", growDays: "90-120 days" },
    Corn: { months: ["rest", "rest", "plant", "grow", "grow", "harvest", "rest", "plant", "grow", "harvest", "rest", "rest"], diseaseRiskMonths: [4, 5, 8, 9], notes: "Grey Leaf Spot risk in humid conditions. Rotate crops annually.", growDays: "60-100 days" },
    Mango: { months: ["rest", "rest", "plant", "grow", "grow", "harvest", "harvest", "rest", "rest", "rest", "rest", "rest"], diseaseRiskMonths: [2, 3, 4], notes: "Anthracnose peaks during flowering. Spray copper fungicide.", growDays: "3-5 years (tree)" },
    Sugarcane: { months: ["plant", "grow", "grow", "grow", "grow", "grow", "grow", "grow", "grow", "grow", "harvest", "harvest"], diseaseRiskMonths: [6, 7, 8, 9], notes: "Red Rot disease risk in monsoon. Plant disease-free setts.", growDays: "10-12 months" },
    Cotton: { months: ["rest", "rest", "rest", "plant", "grow", "grow", "grow", "harvest", "harvest", "rest", "rest", "rest"], diseaseRiskMonths: [7, 8, 9], notes: "Fusarium Wilt peaks in rainy season. Use resistant varieties.", growDays: "150-180 days" },
    Onion: { months: ["plant", "grow", "grow", "harvest", "rest", "rest", "rest", "rest", "rest", "plant", "grow", "grow"], diseaseRiskMonths: [0, 1, 9, 10], notes: "Purple Blotch risk in humid weather. Avoid excess moisture.", growDays: "90-120 days" },
    Mustard: { months: ["rest", "rest", "rest", "rest", "rest", "rest", "rest", "rest", "rest", "plant", "grow", "grow"], diseaseRiskMonths: [9, 10], notes: "White Rust common in cool weather. Apply metalaxyl-based fungicide.", growDays: "80-100 days" },
    Chickpea: { months: ["rest", "rest", "rest", "rest", "rest", "rest", "rest", "rest", "rest", "plant", "grow", "grow"], diseaseRiskMonths: [10, 11], notes: "Ascochyta Blight risk in wet winters. Use treated seeds.", growDays: "95-105 days" },
    Soybean: { months: ["rest", "rest", "rest", "rest", "rest", "plant", "grow", "grow", "harvest", "rest", "rest", "rest"], diseaseRiskMonths: [6, 7, 8], notes: "Root Rot risk in waterlogged soil. Ensure proper field drainage.", growDays: "90-120 days" },
    Sunflower: { months: ["rest", "plant", "grow", "grow", "harvest", "rest", "plant", "grow", "grow", "harvest", "rest", "rest"], diseaseRiskMonths: [3, 4, 7, 8], notes: "Downy Mildew common in humid conditions. Use certified seeds.", growDays: "80-100 days" },
    "Green Chilli": { months: ["rest", "rest", "plant", "grow", "grow", "grow", "harvest", "harvest", "plant", "grow", "grow", "rest"], diseaseRiskMonths: [5, 6, 7], notes: "Bacterial Wilt and Powdery Mildew common in monsoon. Ensure drainage.", growDays: "65-80 days" },
}

const activityConfig: Record<Activity, { label: string; bg: string; text: string; icon: React.ElementType }> = {
    plant: { label: "Planting", bg: "bg-emerald-500", text: "text-white", icon: Sprout },
    grow: { label: "Growing", bg: "bg-green-400", text: "text-white", icon: Leaf },
    harvest: { label: "Harvest", bg: "bg-amber-500", text: "text-white", icon: Wheat },
    risk: { label: "High Risk", bg: "bg-red-500", text: "text-white", icon: AlertTriangle },
    rest: { label: "Off Season", bg: "bg-muted", text: "text-muted-foreground", icon: CalendarDays },
}

export default function CalendarPage() {
    const [selectedCrop, setSelectedCrop] = useState("Tomato")

    const cal = cropCalendars[selectedCrop] ?? cropCalendars["Tomato"]
    const calWithRisk = cal.months.map((act, i) =>
        act !== "rest" && cal.diseaseRiskMonths.includes(i) ? "risk" as Activity : act
    )

    const availableCrops = cropTypes.filter(c => cropCalendars[c])

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                            <CalendarDays className="h-7 w-7 text-primary" />
                            Crop Calendar
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Seasonal planting guide with disease risk periods for each crop
                        </p>
                    </div>
                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableCrops.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Crop Summary */}
                <Card className="mb-6 border-border">
                    <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-lg font-semibold text-foreground">{selectedCrop}</p>
                            <p className="text-sm text-muted-foreground">{cal.notes}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {cal.growDays}
                            </Badge>
                            <Badge className="bg-red-500 text-white gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {cal.diseaseRiskMonths.length} risk months
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Calendar Grid */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-base text-foreground">Annual Activity Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
                            {MONTHS.map((month, i) => {
                                const activity = calWithRisk[i]
                                const cfg = activityConfig[activity]
                                const Icon = cfg.icon
                                return (
                                    <div key={month} className="flex flex-col items-center gap-1">
                                        <span className="text-xs font-medium text-muted-foreground">{month}</span>
                                        <div className={`flex h-16 w-full flex-col items-center justify-center rounded-lg ${cfg.bg} transition-transform hover:scale-105`}>
                                            <Icon className={`h-5 w-5 ${cfg.text}`} />
                                            <span className={`mt-1 text-[10px] font-medium ${cfg.text} text-center leading-tight`}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            {Object.entries(activityConfig).map(([key, cfg]) => {
                                const Icon = cfg.icon
                                return (
                                    <div key={key} className="flex items-center gap-2">
                                        <div className={`flex h-5 w-5 items-center justify-center rounded ${cfg.bg}`}>
                                            <Icon className={`h-3 w-3 ${cfg.text}`} />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{cfg.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly tips */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {MONTHS.map((month, i) => {
                        const activity = calWithRisk[i]
                        if (activity === "rest") return null
                        const cfg = activityConfig[activity]
                        const Icon = cfg.icon
                        return (
                            <div key={month} className="flex items-start gap-3 rounded-lg border border-border p-3">
                                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${cfg.bg}`}>
                                    <Icon className={`h-4 w-4 ${cfg.text}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{month} — {cfg.label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {activity === "plant" && `Best time to sow ${selectedCrop}. Prepare beds and ensure good soil nutrients.`}
                                        {activity === "grow" && `${selectedCrop} in active growth. Water consistently, apply fertilizer.`}
                                        {activity === "harvest" && `Time to harvest ${selectedCrop}. Pick at peak ripeness for best yield.`}
                                        {activity === "risk" && `High disease risk for ${selectedCrop}. ${cal.notes}`}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>
            <Footer />
        </div>
    )
}
