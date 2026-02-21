"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, BellOff, CheckCheck, AlertTriangle, Lightbulb, Info, Trash2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockNotifications, type Notification } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

const NOTIF_KEY = "cropguard_notifications_read"

const typeConfig = {
    alert: {
        label: "Alert",
        color: "bg-destructive text-destructive-foreground",
        iconColor: "text-destructive",
        bg: "bg-destructive/5 border-destructive/20",
        Icon: AlertTriangle,
    },
    tip: {
        label: "Tip",
        color: "bg-green-600 text-white",
        iconColor: "text-green-600",
        bg: "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
        Icon: Lightbulb,
    },
    system: {
        label: "System",
        color: "bg-blue-600 text-white",
        iconColor: "text-blue-600",
        bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
        Icon: Info,
    },
}

export default function NotificationsPage() {
    const router = useRouter()
    const { user, hydrated } = useAuth()
    const [readIds, setReadIds] = useState<Set<string>>(new Set())
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

    useEffect(() => {
        if (hydrated && !user) router.replace("/login")
    }, [user, hydrated, router])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]")
        setReadIds(new Set(stored))
    }, [])

    function markRead(id: string) {
        setReadIds(prev => {
            const next = new Set(prev)
            next.add(id)
            localStorage.setItem(NOTIF_KEY, JSON.stringify([...next]))
            return next
        })
    }

    function markAllRead() {
        const allIds = notifications.map(n => n.id)
        setReadIds(new Set(allIds))
        localStorage.setItem(NOTIF_KEY, JSON.stringify(allIds))
        toast.success("All notifications marked as read")
    }

    function deleteNotification(id: string) {
        setNotifications(prev => prev.filter(n => n.id !== id))
        markRead(id)
        toast.success("Notification removed")
    }

    if (!hydrated || !user) return null

    const unreadCount = notifications.filter(n => !readIds.has(n.id)).length

    function NotifCard({ n }: { n: Notification }) {
        const cfg = typeConfig[n.type]
        const Icon = cfg.Icon
        const isRead = readIds.has(n.id)
        return (
            <Card
                className={cn(
                    "border transition-all cursor-pointer",
                    !isRead ? `${cfg.bg}` : "border-border bg-card opacity-70"
                )}
                onClick={() => markRead(n.id)}
            >
                <CardContent className="flex gap-4 p-4">
                    <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", !isRead ? "bg-card shadow" : "bg-muted")}>
                        <Icon className={cn("h-4 w-4", !isRead ? cfg.iconColor : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-2 mb-1">
                            <span className={cn("font-semibold text-sm", !isRead ? "text-foreground" : "text-muted-foreground")}>
                                {n.title}
                            </span>
                            {!isRead && (
                                <span className="ml-auto flex h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{n.message}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <Badge className={cn("text-[10px]", cfg.color)}>{cfg.label}</Badge>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={e => { e.stopPropagation(); deleteNotification(n.id) }}
                        className="ml-1 shrink-0 rounded p-1 text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                        title="Remove notification"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </CardContent>
            </Card>
        )
    }

    const alerts = notifications.filter(n => n.type === "alert")
    const tips = notifications.filter(n => n.type === "tip")
    const system = notifications.filter(n => n.type === "system")

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                            <Bell className="h-7 w-7 text-primary" />
                            Notifications
                            {unreadCount > 0 && (
                                <Badge className="bg-destructive text-destructive-foreground">{unreadCount} new</Badge>
                            )}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Disease alerts, tips, and system updates
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
                            <CheckCheck className="h-4 w-4" />
                            Mark All Read
                        </Button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-24 text-center">
                        <BellOff className="h-14 w-14 text-muted-foreground/30" />
                        <p className="mt-4 font-semibold text-foreground">No notifications</p>
                        <p className="mt-1 text-sm text-muted-foreground">You're all caught up!</p>
                    </div>
                ) : (
                    <Tabs defaultValue="all">
                        <TabsList className="mb-6">
                            <TabsTrigger value="all">
                                All
                                <Badge variant="outline" className="ml-2">{notifications.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="alerts">
                                Alerts
                                {alerts.length > 0 && <Badge variant="outline" className="ml-2">{alerts.length}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="tips">
                                Tips
                                {tips.length > 0 && <Badge variant="outline" className="ml-2">{tips.length}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="system">
                                System
                                {system.length > 0 && <Badge variant="outline" className="ml-2">{system.length}</Badge>}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="flex flex-col gap-3">
                            {notifications.map(n => <NotifCard key={n.id} n={n} />)}
                        </TabsContent>
                        <TabsContent value="alerts" className="flex flex-col gap-3">
                            {alerts.length === 0
                                ? <p className="py-12 text-center text-muted-foreground">No alerts</p>
                                : alerts.map(n => <NotifCard key={n.id} n={n} />)}
                        </TabsContent>
                        <TabsContent value="tips" className="flex flex-col gap-3">
                            {tips.length === 0
                                ? <p className="py-12 text-center text-muted-foreground">No tips</p>
                                : tips.map(n => <NotifCard key={n.id} n={n} />)}
                        </TabsContent>
                        <TabsContent value="system" className="flex flex-col gap-3">
                            {system.length === 0
                                ? <p className="py-12 text-center text-muted-foreground">No system messages</p>
                                : system.map(n => <NotifCard key={n.id} n={n} />)}
                        </TabsContent>
                    </Tabs>
                )}
            </main>
            <Footer />
        </div>
    )
}
