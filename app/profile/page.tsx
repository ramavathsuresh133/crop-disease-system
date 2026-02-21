"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, MapPin, Leaf, Moon, Sun, Save, CheckCircle, Bell } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useAuth } from "@/lib/auth-context"
import { cropTypes } from "@/lib/mock-data"
import { toast } from "sonner"

export default function ProfilePage() {
    const router = useRouter()
    const { user, hydrated, updateUser } = useAuth()
    const { theme, setTheme } = useTheme()
    const [name, setName] = useState("")
    const [region, setRegion] = useState("")
    const [selectedCrops, setSelectedCrops] = useState<string[]>([])
    const [saved, setSaved] = useState(false)
    const [notifPrefs, setNotifPrefs] = useState({
        diseaseAlerts: true,
        communityReports: true,
        forecastTips: true,
    })

    useEffect(() => {
        if (hydrated && !user) router.replace("/login")
        if (user) {
            setName(user.name)
            setRegion(user.region)
            setSelectedCrops(user.cropTypes)
        }
        const storedPrefs = localStorage.getItem("cropguard_notif_prefs")
        if (storedPrefs) setNotifPrefs(JSON.parse(storedPrefs))
    }, [user, hydrated, router])

    if (!hydrated || !user) return null

    function toggleCrop(crop: string) {
        setSelectedCrops(prev =>
            prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
        )
    }

    function toggleNotif(key: keyof typeof notifPrefs) {
        setNotifPrefs(prev => {
            const next = { ...prev, [key]: !prev[key] }
            localStorage.setItem("cropguard_notif_prefs", JSON.stringify(next))
            return next
        })
    }

    function handleSave() {
        if (!name.trim()) { toast.error("Name cannot be empty"); return }
        if (!region.trim()) { toast.error("Region cannot be empty"); return }
        if (selectedCrops.length === 0) { toast.error("Select at least one crop"); return }
        updateUser({ name: name.trim(), region: region.trim(), cropTypes: selectedCrops })
        setSaved(true)
        toast.success("Profile updated successfully!")
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                        <User className="h-7 w-7 text-primary" />
                        Profile & Settings
                    </h1>
                    <p className="mt-1 text-muted-foreground">Manage your account information and preferences</p>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Personal Info */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4 text-primary" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    {name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{user.email}</p>
                                    <p className="text-sm text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="region">
                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Region</span>
                                    </Label>
                                    <Input id="region" value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g. North India" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Crop selection */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Leaf className="h-4 w-4 text-primary" />
                                My Crops
                                <Badge variant="outline" className="ml-auto">{selectedCrops.length} selected</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-3 text-sm text-muted-foreground">Select the crops you grow on your farm</p>
                            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
                                {cropTypes.map(crop => {
                                    const active = selectedCrops.includes(crop)
                                    return (
                                        <button
                                            key={crop}
                                            onClick={() => toggleCrop(crop)}
                                            className={`rounded-full border px-3 py-1 text-sm transition-all ${active
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-background text-foreground hover:border-primary/50"
                                                }`}
                                        >
                                            {active && <CheckCircle className="mr-1 inline h-3 w-3" />}
                                            {crop}
                                        </button>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Preferences */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Bell className="h-4 w-4 text-primary" />
                                Notification Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">Choose which notifications you want to receive</p>
                            {([
                                { key: "diseaseAlerts" as const, label: "Disease Alerts", desc: "Get notified about new disease outbreaks in your region" },
                                { key: "communityReports" as const, label: "Community Reports", desc: "Be alerted when farmers submit new disease sightings" },
                                { key: "forecastTips" as const, label: "Weekly Tips & Forecasts", desc: "Receive weekly crop care tips and disease forecast reminders" },
                            ]).map(item => (
                                <div key={item.key} className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleNotif(item.key)}
                                        className={`relative flex h-6 w-11 shrink-0 items-center rounded-full border-2 transition-colors focus:outline-none ${notifPrefs[item.key]
                                                ? "border-primary bg-primary"
                                                : "border-muted-foreground/30 bg-muted"
                                            }`}
                                        role="switch"
                                        aria-checked={notifPrefs[item.key]}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${notifPrefs[item.key] ? "translate-x-5" : "translate-x-0.5"
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Theme */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                {theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                                Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-3 text-sm text-muted-foreground">Choose your preferred theme</p>
                            <div className="flex gap-3">
                                {(["light", "dark", "system"] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t)}
                                        className={`flex-1 rounded-lg border p-3 text-center text-sm font-medium capitalize transition-all ${theme === t
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border text-foreground hover:border-primary/50"
                                            }`}
                                    >
                                        {t === "light" && <Sun className="mx-auto mb-1 h-5 w-5" />}
                                        {t === "dark" && <Moon className="mx-auto mb-1 h-5 w-5" />}
                                        {t === "system" && <div className="mx-auto mb-1 h-5 w-5 rounded-full border-2 border-current" />}
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save */}
                    <Button onClick={handleSave} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                        <Save className="h-4 w-4" />
                        {saved ? "Saved!" : "Save Changes"}
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    )
}
