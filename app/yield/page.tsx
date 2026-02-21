"use client"

import { useState } from "react"
import { Calculator, TrendingUp, IndianRupee, Leaf, Info } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Yield data: [organicYield, conventionalYield] in quintals/acre, [minPrice, maxPrice] per quintal
const cropYieldData: Record<string, { organic: number; conventional: number; minPrice: number; maxPrice: number; season: string; unit: string }> = {
    "Wheat": { organic: 14, conventional: 20, minPrice: 2100, maxPrice: 2400, season: "Rabi (Oct–Mar)", unit: "quintal" },
    "Rice": { organic: 16, conventional: 24, minPrice: 1800, maxPrice: 2400, season: "Kharif (Jun–Nov)", unit: "quintal" },
    "Tomato": { organic: 80, conventional: 120, minPrice: 800, maxPrice: 2500, season: "Year-round", unit: "quintal" },
    "Potato": { organic: 60, conventional: 100, minPrice: 800, maxPrice: 1800, season: "Rabi (Oct–Mar)", unit: "quintal" },
    "Onion": { organic: 50, conventional: 80, minPrice: 1000, maxPrice: 2500, season: "Rabi (Oct–Mar)", unit: "quintal" },
    "Cotton": { organic: 6, conventional: 10, minPrice: 5800, maxPrice: 7200, season: "Kharif (Jun–Nov)", unit: "quintal" },
    "Sugarcane": { organic: 250, conventional: 400, minPrice: 280, maxPrice: 350, season: "Year-round (12 months)", unit: "quintal" },
    "Maize": { organic: 16, conventional: 24, minPrice: 1500, maxPrice: 2000, season: "Kharif (Jun–Sep)", unit: "quintal" },
    "Soybean": { organic: 8, conventional: 14, minPrice: 4000, maxPrice: 5000, season: "Kharif (Jun–Oct)", unit: "quintal" },
    "Mustard": { organic: 6, conventional: 10, minPrice: 4800, maxPrice: 5600, season: "Rabi (Oct–Mar)", unit: "quintal" },
    "Chickpea": { organic: 6, conventional: 10, minPrice: 4500, maxPrice: 5500, season: "Rabi (Oct–Mar)", unit: "quintal" },
    "Groundnut": { organic: 10, conventional: 16, minPrice: 5500, maxPrice: 6500, season: "Kharif (Jun–Oct)", unit: "quintal" },
    "Mango": { organic: 40, conventional: 60, minPrice: 3000, maxPrice: 6000, season: "Summer (Mar–Jun)", unit: "quintal" },
    "Banana": { organic: 120, conventional: 200, minPrice: 1000, maxPrice: 2000, season: "Year-round", unit: "quintal" },
    "Chilli": { organic: 15, conventional: 25, minPrice: 2500, maxPrice: 5000, season: "Year-round", unit: "quintal" },
    "Green Gram": { organic: 4, conventional: 7, minPrice: 6000, maxPrice: 8000, season: "Kharif/Rabi", unit: "quintal" },
    "Lemon": { organic: 30, conventional: 50, minPrice: 2500, maxPrice: 5000, season: "Year-round", unit: "quintal" },
    "Cauliflower": { organic: 60, conventional: 100, minPrice: 700, maxPrice: 1500, season: "Winter (Oct–Feb)", unit: "quintal" },
    "Cabbage": { organic: 70, conventional: 110, minPrice: 600, maxPrice: 1200, season: "Winter (Oct–Feb)", unit: "quintal" },
    "Sunflower": { organic: 7, conventional: 12, minPrice: 5000, maxPrice: 6000, season: "Rabi (Nov–Mar)", unit: "quintal" },
}

// Input costs ₹/acre
const inputCosts: Record<string, { organic: number; conventional: number }> = {
    "Wheat": { organic: 8000, conventional: 12000 },
    "Rice": { organic: 10000, conventional: 16000 },
    "Tomato": { organic: 25000, conventional: 40000 },
    "Potato": { organic: 20000, conventional: 30000 },
    "Onion": { organic: 18000, conventional: 28000 },
    "Cotton": { organic: 15000, conventional: 25000 },
    "Sugarcane": { organic: 20000, conventional: 32000 },
    "Maize": { organic: 8000, conventional: 13000 },
    "Soybean": { organic: 7000, conventional: 12000 },
    "Mustard": { organic: 6000, conventional: 10000 },
    "Chickpea": { organic: 6000, conventional: 10000 },
    "Groundnut": { organic: 10000, conventional: 18000 },
    "Mango": { organic: 12000, conventional: 20000 },
    "Banana": { organic: 22000, conventional: 35000 },
    "Chilli": { organic: 20000, conventional: 32000 },
    "Green Gram": { organic: 5000, conventional: 8000 },
    "Lemon": { organic: 12000, conventional: 20000 },
    "Cauliflower": { organic: 18000, conventional: 28000 },
    "Cabbage": { organic: 15000, conventional: 24000 },
    "Sunflower": { organic: 7000, conventional: 11000 },
}

function fmt(n: number) {
    return n.toLocaleString("en-IN")
}

export default function YieldCalculatorPage() {
    const [crop, setCrop] = useState("")
    const [area, setArea] = useState("")
    const [unit, setUnit] = useState("acre")
    const [method, setMethod] = useState("conventional")
    const [irrigation, setIrrigation] = useState("drip")
    const [result, setResult] = useState<null | {
        yieldQtl: number; minRevenue: number; maxRevenue: number
        inputCost: number; minProfit: number; maxProfit: number
        margin: number
    }>(null)

    function calculate() {
        if (!crop || !area || Number(area) <= 0) return
        const cropData = cropYieldData[crop]
        const costData = inputCosts[crop]
        if (!cropData || !costData) return

        let acres = parseFloat(area)
        if (unit === "hectare") acres *= 2.47
        if (unit === "bigha") acres *= 0.625

        const irrigBonus = irrigation === "drip" ? 1.1 : irrigation === "flood" ? 0.95 : 1.0
        const baseYield = method === "organic" ? cropData.organic : cropData.conventional
        const yieldQtl = Math.round(baseYield * acres * irrigBonus)
        const minRevenue = yieldQtl * cropData.minPrice
        const maxRevenue = yieldQtl * cropData.maxPrice
        const costPerAcre = method === "organic" ? costData.organic : costData.conventional
        const inputCost = Math.round(costPerAcre * acres)
        const minProfit = minRevenue - inputCost
        const maxProfit = maxRevenue - inputCost
        const margin = Math.round(((minProfit + maxProfit) / 2 / ((minRevenue + maxRevenue) / 2)) * 100)

        setResult({ yieldQtl, minRevenue, maxRevenue, inputCost, minProfit, maxProfit, margin })
    }

    const cropData = crop ? cropYieldData[crop] : null

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                        <Calculator className="h-7 w-7 text-primary" />
                        Yield Calculator
                    </h1>
                    <p className="mt-1 text-muted-foreground">Estimate expected crop yield and revenue for your farm</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Input Panel */}
                    <Card className="border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">Farm Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-1.5">
                                <Label>Crop *</Label>
                                <Select value={crop} onValueChange={setCrop}>
                                    <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(cropYieldData).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {cropData && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <Info className="h-3 w-3" /> Season: {cropData.season}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Land Area *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="e.g. 2.5"
                                        value={area}
                                        onChange={e => setArea(e.target.value)}
                                        className="flex-1"
                                        min="0.1"
                                        step="0.1"
                                    />
                                    <Select value={unit} onValueChange={setUnit}>
                                        <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="acre">Acres</SelectItem>
                                            <SelectItem value="hectare">Hectares</SelectItem>
                                            <SelectItem value="bigha">Bigha</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Farming Method</Label>
                                <Select value={method} onValueChange={setMethod}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="conventional">Conventional (Chemical)</SelectItem>
                                        <SelectItem value="organic">Organic / Natural</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Irrigation Type</Label>
                                <Select value={irrigation} onValueChange={setIrrigation}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="drip">Drip Irrigation (+10% yield)</SelectItem>
                                        <SelectItem value="sprinkler">Sprinkler (standard)</SelectItem>
                                        <SelectItem value="flood">Flood Irrigation (-5% yield)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full bg-primary text-primary-foreground gap-2"
                                onClick={calculate}
                                disabled={!crop || !area || Number(area) <= 0}
                            >
                                <Calculator className="h-4 w-4" /> Calculate Yield & Revenue
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Results Panel */}
                    <div className="space-y-4">
                        {result ? (
                            <>
                                <Card className="border-primary/20 bg-primary/5">
                                    <CardContent className="p-5">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Estimated Yield</p>
                                        <p className="text-4xl font-bold text-primary">{fmt(result.yieldQtl)} <span className="text-xl font-normal">quintals</span></p>
                                        <p className="text-sm text-muted-foreground mt-1">{crop} · {area} {unit} · {method}</p>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-2 gap-3">
                                    <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                                        <CardContent className="p-4">
                                            <p className="text-xs text-muted-foreground mb-1">Revenue Range</p>
                                            <p className="text-lg font-bold text-green-700 dark:text-green-400">₹{fmt(result.minRevenue)}</p>
                                            <p className="text-xs text-muted-foreground">to ₹{fmt(result.maxRevenue)}</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                                        <CardContent className="p-4">
                                            <p className="text-xs text-muted-foreground mb-1">Input Cost</p>
                                            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">₹{fmt(result.inputCost)}</p>
                                            <p className="text-xs text-muted-foreground">seeds, labor, inputs</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className={result.minProfit >= 0 ? "border-emerald-200 dark:border-emerald-800" : "border-red-200 dark:border-red-800"}>
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Estimated Net Profit</p>
                                                <p className={`text-2xl font-bold ${result.minProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600"}`}>
                                                    ₹{fmt(result.minProfit)} – ₹{fmt(result.maxProfit)}
                                                </p>
                                            </div>
                                            <Badge className={result.margin >= 30 ? "bg-emerald-600 text-white" : result.margin >= 10 ? "bg-yellow-500 text-white" : "bg-red-500 text-white"}>
                                                {result.margin}% margin
                                            </Badge>
                                        </div>
                                        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${result.margin >= 30 ? "bg-emerald-500" : result.margin >= 10 ? "bg-yellow-400" : "bg-red-400"}`}
                                                style={{ width: `${Math.max(5, Math.min(100, result.margin))}%` }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-border">
                                    <CardContent className="p-4">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">💡 Tips to Improve Yield</p>
                                        <ul className="text-sm text-foreground space-y-1">
                                            <li>• Switch to drip irrigation for 10–15% yield boost</li>
                                            <li>• Apply micronutrients (Zn, B) at flowering stage</li>
                                            <li>• Use certified high-yield variety seeds</li>
                                            <li>• Spray disease preventives before wet season</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-center">
                                <TrendingUp className="h-14 w-14 text-muted-foreground/30" />
                                <p className="mt-4 font-semibold text-foreground">Enter your farm details</p>
                                <p className="mt-1 text-sm text-muted-foreground">Fill in the form to calculate expected yield and profit</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Crop Reference Table */}
                <Card className="mt-8 border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Leaf className="h-4 w-4 text-primary" /> Crop Reference — Avg Yield per Acre
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-muted-foreground">
                                        <th className="pb-2 text-left font-medium">Crop</th>
                                        <th className="pb-2 text-right font-medium">Conventional (qtl)</th>
                                        <th className="pb-2 text-right font-medium">Organic (qtl)</th>
                                        <th className="pb-2 text-right font-medium">Price Range (₹/qtl)</th>
                                        <th className="pb-2 text-right font-medium hidden sm:table-cell">Season</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(cropYieldData).map(([name, d]) => (
                                        <tr key={name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                            <td className="py-2 font-medium">{name}</td>
                                            <td className="py-2 text-right">{d.conventional}</td>
                                            <td className="py-2 text-right text-green-600">{d.organic}</td>
                                            <td className="py-2 text-right">₹{fmt(d.minPrice)}–{fmt(d.maxPrice)}</td>
                                            <td className="py-2 text-right text-muted-foreground hidden sm:table-cell text-xs">{d.season}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            Prices are indicative market ranges. Actual yields vary by region, variety, and weather conditions.
                        </p>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
