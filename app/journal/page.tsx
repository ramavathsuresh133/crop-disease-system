"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Plus, Trash2, Download, Search, Filter, Sprout, CloudRain, FlaskConical, Eye, Calendar } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { cropTypes } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const JOURNAL_KEY = "cropguard_journal"

export interface JournalEntry {
    id: string
    date: string
    category: "observation" | "treatment" | "weather"
    crop: string
    notes: string
    createdAt: string
}

const categoryConfig = {
    observation: { label: "Observation", Icon: Eye, color: "bg-blue-600 text-white", border: "border-blue-200 dark:border-blue-800" },
    treatment: { label: "Treatment Applied", Icon: FlaskConical, color: "bg-purple-600 text-white", border: "border-purple-200 dark:border-purple-800" },
    weather: { label: "Weather Note", Icon: CloudRain, color: "bg-cyan-600 text-white", border: "border-cyan-200 dark:border-cyan-800" },
}

const SEED_ENTRIES: JournalEntry[] = [
    {
        id: "j-seed-1",
        date: "2026-02-18",
        category: "observation",
        crop: "Tomato",
        notes: "Noticed yellowing on the lower leaves of 4 tomato plants in row 3. Spots have dark concentric rings — possibly Early Blight. About 10% of plants show symptoms.",
        createdAt: "2026-02-18T09:00:00Z",
    },
    {
        id: "j-seed-2",
        date: "2026-02-17",
        category: "treatment",
        crop: "Potato",
        notes: "Applied metalaxyl-based fungicide (Ridomil Gold) at 2g/L on all potato rows. Coverage: 0.5 acres. Late Blight preventive spray before forecast humid weather.",
        createdAt: "2026-02-17T07:30:00Z",
    },
    {
        id: "j-seed-3",
        date: "2026-02-16",
        category: "weather",
        crop: "Wheat",
        notes: "Heavy rain last night — about 28mm. Field waterlogged near the eastern boundary. Checked drainage channel — partially blocked. Cleared it today. Will monitor for Root Rot signs.",
        createdAt: "2026-02-16T14:00:00Z",
    },
]

export default function JournalPage() {
    const router = useRouter()
    const { user, hydrated } = useAuth()
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [search, setSearch] = useState("")
    const [catFilter, setCatFilter] = useState("all")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editEntry, setEditEntry] = useState<JournalEntry | null>(null)
    const [form, setForm] = useState({
        date: new Date().toISOString().slice(0, 10),
        category: "observation" as JournalEntry["category"],
        crop: "",
        notes: "",
    })

    useEffect(() => {
        if (hydrated && !user) router.replace("/login")
    }, [user, hydrated, router])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(JOURNAL_KEY) || "null")
        if (stored === null) {
            localStorage.setItem(JOURNAL_KEY, JSON.stringify(SEED_ENTRIES))
            setEntries(SEED_ENTRIES)
        } else {
            setEntries(stored)
        }
    }, [])

    function saveEntries(updated: JournalEntry[]) {
        setEntries(updated)
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated))
    }

    function openAdd() {
        setEditEntry(null)
        setForm({ date: new Date().toISOString().slice(0, 10), category: "observation", crop: "", notes: "" })
        setDialogOpen(true)
    }

    function openEdit(entry: JournalEntry) {
        setEditEntry(entry)
        setForm({ date: entry.date, category: entry.category, crop: entry.crop, notes: entry.notes })
        setDialogOpen(true)
    }

    function handleSubmit() {
        if (!form.crop || !form.notes.trim()) { toast.error("Please fill in all fields"); return }
        if (editEntry) {
            const updated = entries.map(e => e.id === editEntry.id ? { ...editEntry, ...form } : e)
            saveEntries(updated)
            toast.success("Journal entry updated")
        } else {
            const newEntry: JournalEntry = {
                id: `j-${Date.now()}`,
                createdAt: new Date().toISOString(),
                ...form,
            }
            saveEntries([newEntry, ...entries])
            toast.success("Journal entry added")
        }
        setDialogOpen(false)
    }

    function handleDelete(id: string) {
        if (!confirm("Delete this journal entry?")) return
        saveEntries(entries.filter(e => e.id !== id))
        toast.success("Entry deleted")
    }

    function exportCSV() {
        if (filtered.length === 0) { toast.error("No entries to export"); return }
        const headers = ["Date", "Category", "Crop", "Notes"]
        const rows = filtered.map(e => [
            e.date,
            categoryConfig[e.category].label,
            e.crop,
            `"${e.notes.replace(/"/g, '""')}"`,
        ])
        const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url; a.download = `farm-journal-${Date.now()}.csv`; a.click()
        URL.revokeObjectURL(url)
        toast.success(`Exported ${filtered.length} entries`)
    }

    const filtered = useMemo(() =>
        entries
            .filter(e => {
                const matchCat = catFilter === "all" || e.category === catFilter
                const matchSearch = !search ||
                    e.crop.toLowerCase().includes(search.toLowerCase()) ||
                    e.notes.toLowerCase().includes(search.toLowerCase())
                return matchCat && matchSearch
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [entries, catFilter, search]
    )

    if (!hydrated || !user) return null

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                            <BookOpen className="h-7 w-7 text-primary" />
                            Farm Journal
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Log observations, treatments, and weather notes ({entries.length} entries)
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={exportCSV}>
                            <Download className="h-4 w-4" /> Export CSV
                        </Button>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={openAdd}>
                                    <Plus className="h-4 w-4" /> Add Entry
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{editEntry ? "Edit Journal Entry" : "New Journal Entry"}</DialogTitle>
                                </DialogHeader>
                                {/*
                                  IMPORTANT: Form is inlined here intentionally — do NOT extract this
                                  into an inner component like `const EntryForm = () => ...`.
                                  Doing so causes React to unmount+remount it on every render,
                                  which breaks textarea focus (you can't type).
                                */}
                                <div className="flex flex-col gap-4 mt-2">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label>Date *</Label>
                                            <Input
                                                type="date"
                                                value={form.date}
                                                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Category *</Label>
                                            <Select
                                                value={form.category}
                                                onValueChange={v => setForm(f => ({ ...f, category: v as JournalEntry["category"] }))}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(categoryConfig).map(([key, cfg]) => (
                                                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Crop *</Label>
                                        <Select
                                            value={form.crop}
                                            onValueChange={v => setForm(f => ({ ...f, crop: v }))}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                                            <SelectContent>
                                                {cropTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Notes *</Label>
                                        <Textarea
                                            placeholder="Describe what you observed, treatment applied, or weather conditions..."
                                            rows={4}
                                            value={form.notes}
                                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                        />
                                    </div>
                                    <Button onClick={handleSubmit} className="gap-2 bg-primary text-primary-foreground">
                                        <Plus className="h-4 w-4" />
                                        {editEntry ? "Update Entry" : "Add Entry"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search notes or crop..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={catFilter} onValueChange={setCatFilter}>
                            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {Object.entries(categoryConfig).map(([key, cfg]) => (
                                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Entries */}
                {filtered.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {filtered.map(entry => {
                            const cfg = categoryConfig[entry.category]
                            const Icon = cfg.Icon
                            return (
                                <Card key={entry.id} className={cn("border", cfg.border)}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <Badge className={cn("text-[10px]", cfg.color)}>{cfg.label}</Badge>
                                                    <Badge variant="outline" className="gap-1 text-xs">
                                                        <Sprout className="h-2.5 w-2.5 text-primary" />{entry.crop}
                                                    </Badge>
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground leading-relaxed">{entry.notes}</p>
                                            </div>
                                            <div className="flex flex-col gap-1 ml-2">
                                                <button
                                                    onClick={() => openEdit(entry)}
                                                    className="rounded p-1.5 text-muted-foreground hover:text-primary hover:bg-muted transition-colors text-xs"
                                                >Edit</button>
                                                <button
                                                    onClick={() => handleDelete(entry.id)}
                                                    className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-24 text-center">
                        <BookOpen className="h-14 w-14 text-muted-foreground/30" />
                        <p className="mt-4 font-semibold text-foreground">No journal entries yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">Click "Add Entry" to start logging your farm activity</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16 text-center">
                        <Search className="h-10 w-10 text-muted-foreground/40" />
                        <p className="mt-4 font-medium text-foreground">No entries match your filters</p>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}
