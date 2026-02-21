"use client"

import { useState, useEffect, useMemo } from "react"
import { Droplets, Plus, Trash2, CheckCircle2, Clock, CalendarDays, Pencil } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const STORE_KEY = "cropguard_irrigation"

interface Field {
    id: string
    name: string
    crop: string
    area: string
    method: "drip" | "sprinkler" | "flood"
    frequencyDays: number
    waterPerSession: number // litres
    lastIrrigated: string // ISO date
    notes: string
}

const methodConfig = {
    drip: { label: "Drip", color: "bg-blue-500", efficiency: "90% efficient" },
    sprinkler: { label: "Sprinkler", color: "bg-cyan-500", efficiency: "75% efficient" },
    flood: { label: "Flood", color: "bg-indigo-500", efficiency: "60% efficient" },
}

const cropDefaults: Record<string, { freq: number; water: number }> = {
    "Tomato": { freq: 3, water: 500 }, "Potato": { freq: 4, water: 600 },
    "Wheat": { freq: 7, water: 700 }, "Rice": { freq: 2, water: 2000 },
    "Onion": { freq: 5, water: 400 }, "Cotton": { freq: 7, water: 800 },
    "Sugarcane": { freq: 7, water: 1500 }, "Maize": { freq: 5, water: 600 },
    "Chilli": { freq: 4, water: 400 }, "Mustard": { freq: 10, water: 500 },
    "Mango": { freq: 7, water: 1000 }, "Banana": { freq: 3, water: 900 },
}

function daysDiff(dateStr: string) {
    const last = new Date(dateStr).setHours(0, 0, 0, 0)
    const now = new Date().setHours(0, 0, 0, 0)
    return Math.floor((now - last) / 86400000)
}

function nextIrrigation(field: Field) {
    const sinceLastD = daysDiff(field.lastIrrigated)
    return field.frequencyDays - sinceLastD
}

function getStatus(field: Field): { label: string; color: string; urgent: boolean } {
    const daysLeft = nextIrrigation(field)
    if (daysLeft < 0) return { label: "Overdue", color: "text-red-600", urgent: true }
    if (daysLeft === 0) return { label: "Due Today", color: "text-orange-500", urgent: true }
    if (daysLeft === 1) return { label: "Due Tomorrow", color: "text-yellow-600", urgent: false }
    return { label: `In ${daysLeft} days`, color: "text-green-600", urgent: false }
}

const emptyForm: Omit<Field, "id"> = {
    name: "", crop: "Tomato", area: "", method: "drip",
    frequencyDays: 3, waterPerSession: 500, lastIrrigated: new Date().toISOString().slice(0, 10), notes: "",
}

export default function IrrigationPage() {
    const [fields, setFields] = useState<Field[]>([])
    const [open, setOpen] = useState(false)
    const [editField, setEditField] = useState<Field | null>(null)
    const [form, setForm] = useState<Omit<Field, "id">>(emptyForm)

    useEffect(() => {
        const stored = localStorage.getItem(STORE_KEY)
        if (stored) setFields(JSON.parse(stored))
    }, [])

    function saveToStore(data: Field[]) {
        localStorage.setItem(STORE_KEY, JSON.stringify(data))
        setFields(data)
    }

    function openAdd() {
        setEditField(null)
        setForm(emptyForm)
        setOpen(true)
    }

    function openEdit(f: Field) {
        setEditField(f)
        setForm({ name: f.name, crop: f.crop, area: f.area, method: f.method, frequencyDays: f.frequencyDays, waterPerSession: f.waterPerSession, lastIrrigated: f.lastIrrigated, notes: f.notes })
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

    function markDone(id: string) {
        saveToStore(fields.map(f => f.id === id ? { ...f, lastIrrigated: new Date().toISOString().slice(0, 10) } : f))
        toast.success("Irrigation logged for today!")
    }

    function deleteField(id: string) {
        saveToStore(fields.filter(f => f.id !== id))
        toast.success("Field removed")
    }

    function handleCropChange(crop: string) {
        const defaults = cropDefaults[crop]
        if (defaults) setForm(f => ({ ...f, crop, frequencyDays: defaults.freq, waterPerSession: defaults.water }))
        else setForm(f => ({ ...f, crop }))
    }

    const sorted = useMemo(() =>
        [...fields].sort((a, b) => nextIrrigation(a) - nextIrrigation(b)),
        [fields])

    const overdueCount = fields.filter(f => nextIrrigation(f) < 0).length
    const dueTodayCount = fields.filter(f => nextIrrigation(f) === 0).length
    const totalWaterToday = fields.filter(f => nextIrrigation(f) <= 0).reduce((s, f) => s + f.waterPerSession, 0)

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
                            <Droplets className="h-7 w-7 text-primary" /> Irrigation Scheduler
                        </h1>
                        <p className="mt-1 text-muted-foreground">Plan and track irrigation for each of your fields</p>
                    </div>
                    <Button className="gap-2 self-start" onClick={openAdd}>
                        <Plus className="h-4 w-4" /> Add Field
                    </Button>
                </div>

                {/* Summary */}
                {fields.length > 0 && (
                    <div className="mb-6 grid grid-cols-3 gap-3">
                        <Card className={cn("border", overdueCount > 0 ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20" : "border-border")}>
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
                                <p className="text-xs text-muted-foreground mt-1">Overdue</p>
                            </CardContent>
                        </Card>
                        <Card className={cn("border", dueTodayCount > 0 ? "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20" : "border-border")}>
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-orange-600">{dueTodayCount}</p>
                                <p className="text-xs text-muted-foreground mt-1">Due Today</p>
                            </CardContent>
                        </Card>
                        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{(totalWaterToday / 1000).toFixed(1)}K L</p>
                                <p className="text-xs text-muted-foreground mt-1">Water Needed Today</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Fields grid */}
                {sorted.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-24 text-center">
                        <Droplets className="h-14 w-14 text-muted-foreground/30" />
                        <p className="mt-4 font-semibold text-lg">No fields added yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">Add your farm fields to start scheduling irrigation</p>
                        <Button className="mt-6 gap-2" onClick={openAdd}><Plus className="h-4 w-4" /> Add First Field</Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sorted.map(field => {
                            const status = getStatus(field)
                            const mCfg = methodConfig[field.method]
                            const daysLeft = nextIrrigation(field)
                            const sinceLastD = daysDiff(field.lastIrrigated)
                            const progressPct = Math.min(100, Math.max(0, (sinceLastD / field.frequencyDays) * 100))
                            return (
                                <Card key={field.id} className={cn("border transition-colors", status.urgent ? "border-orange-300 dark:border-orange-800" : "border-border")}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-semibold text-sm">{field.name}</h3>
                                                <p className="text-xs text-muted-foreground">{field.crop}{field.area ? ` · ${field.area} acres` : ""}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => openEdit(field)} className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                                                <button onClick={() => deleteField(field.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 mb-3">
                                            <Badge className={cn("text-[10px]", mCfg.color, "text-white")}>{mCfg.label}</Badge>
                                            <Badge variant="outline" className="text-[10px]">{mCfg.efficiency}</Badge>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-muted-foreground">Irrigation cycle</span>
                                                <span className={status.color + " font-medium"}>{status.label}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                <div className={cn("h-full rounded-full transition-all", status.urgent ? "bg-red-500" : "bg-primary")} style={{ width: `${progressPct}%` }} />
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-xs text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Every {field.frequencyDays} days · {field.waterPerSession.toLocaleString()} L/session</div>
                                            <div className="flex items-center gap-1.5"><CalendarDays className="h-3 w-3" /> Last: {new Date(field.lastIrrigated).toLocaleDateString("en-IN")}</div>
                                        </div>
                                        {field.notes && <p className="text-xs text-muted-foreground italic mb-3 border-l-2 border-border pl-2">{field.notes}</p>}

                                        <Button size="sm" className="w-full gap-2" variant={status.urgent ? "default" : "outline"} onClick={() => markDone(field.id)}>
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Irrigated Today
                                        </Button>
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
                                <Input placeholder="e.g. North Plot, Field A" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label>Crop</Label>
                                    <Select value={form.crop} onValueChange={handleCropChange}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(cropDefaults).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Area (acres)</Label>
                                    <Input type="number" placeholder="e.g. 2.5" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} min="0" step="0.5" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Irrigation Method</Label>
                                <Select value={form.method} onValueChange={v => setForm(f => ({ ...f, method: v as Field["method"] }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(methodConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label} — {v.efficiency}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label>Frequency (days)</Label>
                                    <Input type="number" min="1" max="30" value={form.frequencyDays} onChange={e => setForm(f => ({ ...f, frequencyDays: Number(e.target.value) }))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Water/session (L)</Label>
                                    <Input type="number" min="100" step="100" value={form.waterPerSession} onChange={e => setForm(f => ({ ...f, waterPerSession: Number(e.target.value) }))} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Last Irrigated</Label>
                                <Input type="date" value={form.lastIrrigated} onChange={e => setForm(f => ({ ...f, lastIrrigated: e.target.value }))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Notes (optional)</Label>
                                <Input placeholder="Any special requirements..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
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
