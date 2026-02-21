"use client"

import { useState, useEffect, useMemo } from "react"
import { Map, Plus, Trash2, Pencil, Leaf, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const STORE_KEY = "cropguard_fields"

type HealthStatus = "healthy" | "at-risk" | "diseased" | "harvested" | "fallow"

interface FarmField {
    id: string
    name: string
    crop: string
    area: string
    unit: "acre" | "hectare" | "bigha"
    plantedDate: string
    health: HealthStatus
    notes: string
    soilType: string
}

const healthConfig: Record<HealthStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
    healthy: { label: "Healthy", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800", Icon: CheckCircle },
    "at-risk": { label: "At Risk", color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800", Icon: AlertTriangle },
    diseased: { label: "Diseased", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800", Icon: AlertTriangle },
    harvested: { label: "Harvested", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800", Icon: Leaf },
    fallow: { label: "Fallow", color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-700", Icon: Clock },
}

const growthStages: { maxDays: number; label: string; emoji: string }[] = [
    { maxDays: 15, label: "Germination", emoji: "🌱" },
    { maxDays: 40, label: "Vegetative", emoji: "🌿" },
    { maxDays: 70, label: "Flowering", emoji: "🌸" },
    { maxDays: 100, label: "Fruiting", emoji: "🍅" },
    { maxDays: 130, label: "Maturity", emoji: "🌾" },
    { maxDays: Infinity, label: "Overdue", emoji: "⏳" },
]

function getGrowthStage(plantedDate: string, health: HealthStatus) {
    if (health === "harvested") return { label: "Harvested", emoji: "✅" }
    if (health === "fallow") return { label: "Fallow Land", emoji: "🟫" }
    const days = Math.floor((Date.now() - new Date(plantedDate).getTime()) / 86400000)
    const stage = growthStages.find(s => days <= s.maxDays)
    return { label: stage?.label || "Mature", emoji: stage?.emoji || "🌾", days }
}

const crops = [
    "Tomato", "Potato", "Wheat", "Rice", "Cotton", "Onion", "Maize", "Corn",
    "Mango", "Banana", "Chilli", "Pepper", "Soybean", "Chickpea", "Mustard",
    "Groundnut", "Sugarcane", "Cauliflower", "Cabbage", "Lemon", "Other",
]

const soilTypes = ["Loamy", "Sandy Loam", "Clay Loam", "Black Cotton", "Red Laterite", "Alluvial", "Sandy", "Silty"]

const emptyForm: Omit<FarmField, "id"> = {
    name: "", crop: "Wheat", area: "", unit: "acre",
    plantedDate: new Date().toISOString().slice(0, 10),
    health: "healthy", notes: "", soilType: "Loamy",
}

export default function FieldsPage() {
    const [fields, setFields] = useState<FarmField[]>([])
    const [open, setOpen] = useState(false)
    const [editField, setEditField] = useState<FarmField | null>(null)
    const [form, setForm] = useState<Omit<FarmField, "id">>(emptyForm)
    const [filterHealth, setFilterHealth] = useState<HealthStatus | "all">("all")

    useEffect(() => {
        const stored = localStorage.getItem(STORE_KEY)
        if (stored) setFields(JSON.parse(stored))
    }, [])

    function saveToStore(data: FarmField[]) {
        localStorage.setItem(STORE_KEY, JSON.stringify(data))
        setFields(data)
    }

    function openAdd() { setEditField(null); setForm(emptyForm); setOpen(true) }
    function openEdit(f: FarmField) {
        setEditField(f)
        const { id, ...rest } = f
        setForm(rest)
        setOpen(true)
    }

    function handleSubmit() {
        if (!form.name.trim()) { toast.error("Enter field name"); return }
        if (editField) {
            saveToStore(fields.map(f => f.id === editField.id ? { ...form, id: editField.id } : f))
            toast.success("Field updated!")
        } else {
            saveToStore([{ ...form, id: Date.now().toString() }, ...fields])
            toast.success("Field added!")
        }
        setOpen(false)
    }

    function deleteField(id: string) { saveToStore(fields.filter(f => f.id !== id)); toast.success("Field removed") }

    function quickHealth(id: string, health: HealthStatus) {
        saveToStore(fields.map(f => f.id === id ? { ...f, health } : f))
        toast.success(`Updated to ${healthConfig[health].label}`)
    }

    const filtered = useMemo(() =>
        filterHealth === "all" ? fields : fields.filter(f => f.health === filterHealth),
        [fields, filterHealth])

    const counts = useMemo(() => {
        const map: Record<string, number> = {}
        fields.forEach(f => { map[f.health] = (map[f.health] || 0) + 1 })
        return map
    }, [fields])

    const totalArea = useMemo(() =>
        fields.reduce((s, f) => s + (parseFloat(f.area) || 0), 0).toFixed(1), [fields])

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
                            <Map className="h-7 w-7 text-primary" /> Field Map Manager
                        </h1>
                        <p className="mt-1 text-muted-foreground">Track all your farm plots — crops, growth stage, and health status</p>
                    </div>
                    <Button className="gap-2 self-start" onClick={openAdd}><Plus className="h-4 w-4" /> Add Field</Button>
                </div>

                {/* Summary */}
                {fields.length > 0 && (
                    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
                        <div className="col-span-2 sm:col-span-1 rounded-xl border border-border p-4 text-center">
                            <p className="text-2xl font-bold text-primary">{fields.length}</p>
                            <p className="text-xs text-muted-foreground">Total Fields</p>
                            <p className="text-xs text-muted-foreground">{totalArea} acres total</p>
                        </div>
                        {(Object.keys(healthConfig) as HealthStatus[]).map(h => {
                            const cfg = healthConfig[h]
                            const Icon = cfg.Icon
                            return (
                                <button key={h} onClick={() => setFilterHealth(filterHealth === h ? "all" : h)}
                                    className={cn("rounded-xl border p-4 text-center transition-all hover:border-primary/50", filterHealth === h ? "border-primary bg-primary/5" : "border-border")}>
                                    <p className={cn("text-2xl font-bold", cfg.color)}>{counts[h] || 0}</p>
                                    <p className="text-xs text-muted-foreground">{cfg.label}</p>
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Field Cards */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-24 text-center">
                        <Map className="h-14 w-14 text-muted-foreground/30" />
                        <p className="mt-4 font-semibold text-lg">{fields.length === 0 ? "No fields added yet" : "No fields match filter"}</p>
                        {fields.length === 0 && (
                            <>
                                <p className="mt-1 text-sm text-muted-foreground">Add your farm plots to track them</p>
                                <Button className="mt-6 gap-2" onClick={openAdd}><Plus className="h-4 w-4" /> Add First Field</Button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map(field => {
                            const hCfg = healthConfig[field.health]
                            const HIcon = hCfg.Icon
                            const stage = getGrowthStage(field.plantedDate, field.health)
                            const daysSincePlanted = Math.floor((Date.now() - new Date(field.plantedDate).getTime()) / 86400000)
                            return (
                                <Card key={field.id} className={cn("border transition-all hover:-translate-y-0.5", hCfg.bg)}>
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-base">{field.name}</h3>
                                                <p className="text-sm text-muted-foreground">{field.crop}{field.area ? ` · ${field.area} ${field.unit}` : ""}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => openEdit(field)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-background/50 hover:text-foreground transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                                                <button onClick={() => deleteField(field.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-background/50 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                            </div>
                                        </div>

                                        {/* Stage badge */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-2xl">{stage.emoji}</span>
                                            <div>
                                                <p className="text-sm font-medium">{stage.label}</p>
                                                {typeof stage.days !== "undefined" && (
                                                    <p className="text-xs text-muted-foreground">Day {daysSincePlanted} of growth</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Health */}
                                        <div className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 mb-3 bg-background/60")}>
                                            <HIcon className={cn("h-4 w-4", hCfg.color)} />
                                            <span className={cn("text-sm font-medium", hCfg.color)}>{hCfg.label}</span>
                                        </div>

                                        {/* Meta */}
                                        <div className="space-y-1 text-xs text-muted-foreground mb-3">
                                            <p>🗓️ Planted: {new Date(field.plantedDate).toLocaleDateString("en-IN")}</p>
                                            <p>🪨 Soil: {field.soilType}</p>
                                        </div>

                                        {field.notes && <p className="text-xs text-muted-foreground italic border-l-2 border-border pl-2 mb-3">{field.notes}</p>}

                                        {/* Quick health update */}
                                        <div className="flex gap-1 flex-wrap">
                                            {(Object.keys(healthConfig) as HealthStatus[]).filter(h => h !== field.health).map(h => (
                                                <button key={h} onClick={() => quickHealth(field.id, h)}
                                                    className="text-[10px] rounded-full border border-border px-2 py-0.5 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">
                                                    → {healthConfig[h].label}
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}

                {/* Dialog */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>{editField ? "Edit Field" : "Add Field"}</DialogTitle></DialogHeader>
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="space-y-1.5">
                                <Label>Field Name *</Label>
                                <Input placeholder="e.g. North Block, Field 2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label>Crop</Label>
                                    <Select value={form.crop} onValueChange={v => setForm(f => ({ ...f, crop: v }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{crops.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Area</Label>
                                    <div className="flex gap-1">
                                        <Input type="number" placeholder="e.g. 2" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} min="0.1" step="0.5" className="flex-1" />
                                        <Select value={form.unit} onValueChange={v => setForm(f => ({ ...f, unit: v as FarmField["unit"] }))}>
                                            <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="acre">Acre</SelectItem>
                                                <SelectItem value="hectare">Ha</SelectItem>
                                                <SelectItem value="bigha">Bigha</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label>Planting Date</Label>
                                    <Input type="date" value={form.plantedDate} onChange={e => setForm(f => ({ ...f, plantedDate: e.target.value }))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Soil Type</Label>
                                    <Select value={form.soilType} onValueChange={v => setForm(f => ({ ...f, soilType: v }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{soilTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Health Status</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(Object.keys(healthConfig) as HealthStatus[]).map(h => {
                                        const cfg = healthConfig[h]
                                        return (
                                            <button key={h} onClick={() => setForm(f => ({ ...f, health: h }))}
                                                className={cn("rounded-xl border py-2 px-2 text-xs font-medium transition-all", form.health === h ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50")}>
                                                {cfg.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Notes (optional)</Label>
                                <Textarea placeholder="Observations, treatments applied, etc." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button className="flex-1" onClick={handleSubmit}>{editField ? "Save Changes" : "Add Field"}</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    )
}
