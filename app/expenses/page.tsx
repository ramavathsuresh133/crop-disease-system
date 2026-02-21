"use client"

import { useState, useEffect, useMemo } from "react"
import { Wallet, Plus, Trash2, Download, TrendingUp, TrendingDown, IndianRupee, ChevronDown, Search } from "lucide-react"
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

const STORE_KEY = "cropguard_expenses"

type EntryType = "income" | "expense"

const incomeCategories = ["Crop Sale", "Livestock Sale", "Govt Subsidy", "Insurance Claim", "Rental Income", "Other Income"]
const expenseCategories = ["Seeds", "Fertilizer", "Pesticide", "Labor", "Irrigation", "Machinery", "Fuel", "Land Rent", "Transport", "Storage", "Other"]

const categoryColors: Record<string, string> = {
    "Crop Sale": "bg-emerald-500", "Livestock Sale": "bg-green-600", "Govt Subsidy": "bg-teal-500",
    "Insurance Claim": "bg-cyan-500", "Rental Income": "bg-lime-600", "Other Income": "bg-green-400",
    "Seeds": "bg-orange-500", "Fertilizer": "bg-amber-500", "Pesticide": "bg-red-500",
    "Labor": "bg-rose-500", "Irrigation": "bg-blue-500", "Machinery": "bg-violet-500",
    "Fuel": "bg-yellow-600", "Land Rent": "bg-purple-500", "Transport": "bg-indigo-500",
    "Storage": "bg-pink-500", "Other": "bg-gray-500",
}

interface Entry {
    id: string; date: string; type: EntryType
    category: string; amount: number; note: string; crop: string
}

function fmt(n: number) { return n.toLocaleString("en-IN") }

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function ExpensesPage() {
    const [entries, setEntries] = useState<Entry[]>([])
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [filterMonth, setFilterMonth] = useState("all")
    const [filterType, setFilterType] = useState("all")
    const [form, setForm] = useState<Omit<Entry, "id">>({
        date: new Date().toISOString().slice(0, 10),
        type: "expense", category: "Seeds", amount: 0, note: "", crop: ""
    })

    useEffect(() => {
        const stored = localStorage.getItem(STORE_KEY)
        if (stored) setEntries(JSON.parse(stored))
    }, [])

    function save(data: Entry[]) {
        localStorage.setItem(STORE_KEY, JSON.stringify(data))
        setEntries(data)
    }

    function addEntry() {
        if (!form.amount || form.amount <= 0) { toast.error("Enter a valid amount"); return }
        const newEntry: Entry = { ...form, id: Date.now().toString() }
        save([newEntry, ...entries])
        setOpen(false)
        setForm({ date: new Date().toISOString().slice(0, 10), type: "expense", category: "Seeds", amount: 0, note: "", crop: "" })
        toast.success("Entry added!")
    }

    function deleteEntry(id: string) {
        save(entries.filter(e => e.id !== id))
        toast.success("Entry deleted")
    }

    function exportCSV() {
        const header = "Date,Type,Category,Crop,Amount,Note"
        const rows = entries.map(e => `${e.date},${e.type},${e.category},${e.crop || "-"},${e.amount},"${e.note}"`)
        const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" })
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "farm_expenses.csv"; a.click()
    }

    const filtered = useMemo(() => entries.filter(e => {
        const q = search.toLowerCase()
        const matchSearch = !q || e.category.toLowerCase().includes(q) || e.note.toLowerCase().includes(q) || e.crop.toLowerCase().includes(q)
        const matchMonth = filterMonth === "all" || new Date(e.date).getMonth().toString() === filterMonth
        const matchType = filterType === "all" || e.type === filterType
        return matchSearch && matchMonth && matchType
    }), [entries, search, filterMonth, filterType])

    const totalIncome = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0)
    const totalExpense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0)
    const netProfit = totalIncome - totalExpense

    // Category breakdown for expenses
    const expByCategory = useMemo(() => {
        const map: Record<string, number> = {}
        entries.filter(e => e.type === "expense").forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount })
        return Object.entries(map).sort((a, b) => b[1] - a[1])
    }, [entries])

    const categories = form.type === "income" ? incomeCategories : expenseCategories

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
                            <Wallet className="h-7 w-7 text-primary" /> Farm Expense Tracker
                        </h1>
                        <p className="mt-1 text-muted-foreground">Track income &amp; expenses to manage your farm finances</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" onClick={exportCSV} disabled={entries.length === 0}>
                            <Download className="h-4 w-4" /> Export CSV
                        </Button>
                        <Button className="gap-2" onClick={() => setOpen(true)}>
                            <Plus className="h-4 w-4" /> Add Entry
                        </Button>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm text-muted-foreground">Total Income</p>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-400">₹{fmt(totalIncome)}</p>
                            <p className="text-xs text-muted-foreground">{entries.filter(e => e.type === "income").length} entries</p>
                        </CardContent>
                    </Card>
                    <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm text-muted-foreground">Total Expenses</p>
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            </div>
                            <p className="text-2xl font-bold text-red-600">₹{fmt(totalExpense)}</p>
                            <p className="text-xs text-muted-foreground">{entries.filter(e => e.type === "expense").length} entries</p>
                        </CardContent>
                    </Card>
                    <Card className={cn("border", netProfit >= 0 ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20" : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20")}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm text-muted-foreground">Net Profit / Loss</p>
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className={cn("text-2xl font-bold", netProfit >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-600")}>
                                {netProfit >= 0 ? "+" : ""}₹{fmt(Math.abs(netProfit))}
                            </p>
                            <p className="text-xs text-muted-foreground">{totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0}% margin</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Entries list */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            <div className="relative flex-1 min-w-[160px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                            </div>
                            <Select value={filterMonth} onValueChange={setFilterMonth}>
                                <SelectTrigger className="w-[120px]"><SelectValue placeholder="Month" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Months</SelectItem>
                                    {MONTHS.map((m, i) => <SelectItem key={i} value={i.toString()}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[120px]"><SelectValue placeholder="Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16 text-center">
                                <Wallet className="h-12 w-12 text-muted-foreground/30" />
                                <p className="mt-4 font-medium">{entries.length === 0 ? "No entries yet" : "No matching entries"}</p>
                                {entries.length === 0 && <p className="mt-1 text-sm text-muted-foreground">Click &quot;Add Entry&quot; to start tracking</p>}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filtered.map(entry => (
                                    <div key={entry.id} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/30 transition-colors group">
                                        <div className={cn("h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold", categoryColors[entry.category] || "bg-gray-500")}>
                                            {entry.category.slice(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-sm">{entry.category}</span>
                                                {entry.crop && <Badge variant="outline" className="text-[10px] px-1.5">{entry.crop}</Badge>}
                                            </div>
                                            {entry.note && <p className="text-xs text-muted-foreground truncate">{entry.note}</p>}
                                            <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString("en-IN")}</p>
                                        </div>
                                        <p className={cn("font-semibold text-sm shrink-0", entry.type === "income" ? "text-green-600" : "text-red-500")}>
                                            {entry.type === "income" ? "+" : "−"}₹{fmt(entry.amount)}
                                        </p>
                                        <button onClick={() => deleteEntry(entry.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Breakdown sidebar */}
                    <div className="space-y-4">
                        <Card className="border-border">
                            <CardHeader className="pb-2"><CardTitle className="text-sm">Expense Breakdown</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {expByCategory.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">No expenses yet</p>
                                ) : expByCategory.map(([cat, amt]) => (
                                    <div key={cat}>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-foreground">{cat}</span>
                                            <span className="font-medium">₹{fmt(amt)}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                            <div className={cn("h-full rounded-full", categoryColors[cat] || "bg-gray-500")}
                                                style={{ width: `${Math.round((amt / totalExpense) * 100)}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Add Entry Dialog */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>Add Entry</DialogTitle></DialogHeader>
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                                {(["expense", "income"] as EntryType[]).map(t => (
                                    <button key={t} onClick={() => setForm(f => ({ ...f, type: t, category: t === "income" ? incomeCategories[0] : expenseCategories[0] }))}
                                        className={cn("rounded-lg py-1.5 text-sm font-medium capitalize transition-all", form.type === t ? "bg-background shadow text-foreground" : "text-muted-foreground")}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label>Date</Label>
                                    <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Amount (₹) *</Label>
                                    <Input type="number" placeholder="0" value={form.amount || ""} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} min="0" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Category</Label>
                                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Crop (optional)</Label>
                                <Input placeholder="e.g. Tomato, Wheat" value={form.crop} onChange={e => setForm(f => ({ ...f, crop: e.target.value }))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Notes (optional)</Label>
                                <Input placeholder="Any details..." value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button className="flex-1" onClick={addEntry}>Add Entry</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    )
}
