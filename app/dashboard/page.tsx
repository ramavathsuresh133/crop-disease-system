"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Upload, ArrowRight, Bell, Lightbulb } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StatsCards } from "@/components/stats-cards"
import { DiseaseCard } from "@/components/disease-card"
import { AlertBanner } from "@/components/alert-banner"
import { WeatherWidget } from "@/components/weather-widget"
import { HealthScoreCard } from "@/components/health-score-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  mockDetections,
  mockAlerts,
  type Alert,
} from "@/lib/mock-data"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

const dailyTips = [
  "🌿 Rotate your crops every season to break soil-borne disease cycles and improve yield.",
  "💧 Use drip irrigation instead of overhead spraying to keep leaves dry and reduce fungal risks.",
  "🔬 Inspect crop roots and lower leaves during morning hours when symptoms are most visible.",
  "🛡️ Apply preventive copper-based fungicide spray before the rainy season begins.",
  "🌱 Maintain proper plant spacing to allow airflow and reduce humidity between rows.",
  "📸 Upload crop images weekly for early disease detection — catching it early saves 80% more yield.",
  "🐛 Integrate Trichoderma biocontrol agents in soil to suppress Fusarium and Pythium.",
]
const todayTip = dailyTips[new Date().getDay() % dailyTips.length]

export default function DashboardPage() {
  const router = useRouter()
  const { user, hydrated } = useAuth()
  const [liveAlerts, setLiveAlerts] = useState<Alert[]>(mockAlerts.slice(0, 5))

  // Redirect to login if not authenticated (wait for hydration first)
  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login")
    }
  }, [user, hydrated, router])

  // Simulate incoming real-time alerts — randomized pool
  useEffect(() => {
    if (!user) return

    const alertPool: Omit<Alert, "id" | "createdAt">[] = [
      { diseaseName: "Late Blight", cropType: "Potato", region: "North India", severity: "high", reportedBy: "System Alert", location: { lat: 28.55, lng: 77.25 } },
      { diseaseName: "Early Blight", cropType: "Tomato", region: "Punjab", severity: "high", reportedBy: "System Alert", location: { lat: 30.73, lng: 76.78 } },
      { diseaseName: "Powdery Mildew", cropType: "Wheat", region: "Haryana", severity: "medium", reportedBy: "System Alert", location: { lat: 29.06, lng: 76.08 } },
      { diseaseName: "Rust", cropType: "Wheat", region: "Rajasthan", severity: "medium", reportedBy: "System Alert", location: { lat: 26.91, lng: 75.78 } },
      { diseaseName: "Bacterial Spot", cropType: "Pepper", region: "Gujarat", severity: "medium", reportedBy: "System Alert", location: { lat: 23.02, lng: 72.57 } },
      { diseaseName: "Anthracnose", cropType: "Mango", region: "Maharashtra", severity: "low", reportedBy: "System Alert", location: { lat: 19.07, lng: 72.87 } },
      { diseaseName: "Fusarium Wilt", cropType: "Cotton", region: "Andhra Pradesh", severity: "high", reportedBy: "System Alert", location: { lat: 15.91, lng: 79.74 } },
      { diseaseName: "Downy Mildew", cropType: "Grape", region: "Karnataka", severity: "medium", reportedBy: "System Alert", location: { lat: 15.31, lng: 75.71 } },
      { diseaseName: "Leaf Mold", cropType: "Tomato", region: "Uttar Pradesh", severity: "low", reportedBy: "System Alert", location: { lat: 26.85, lng: 80.95 } },
      { diseaseName: "Root Rot", cropType: "Soybean", region: "Madhya Pradesh", severity: "medium", reportedBy: "System Alert", location: { lat: 23.25, lng: 77.41 } },
    ]

    let alertIndex = 0

    const fire = () => {
      const pick = alertPool[alertIndex % alertPool.length]
      alertIndex++
      const newAlert: Alert = {
        ...pick,
        id: `live-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setLiveAlerts((prev) => [newAlert, ...prev.slice(0, 4)])
      toast.warning(`New Disease Alert: ${pick.diseaseName} detected on ${pick.cropType} in ${pick.region}!`)
    }

    // First alert after 5s, then every 8s
    const first = setTimeout(() => {
      fire()
    }, 5000)
    const interval = setInterval(fire, 8000)

    return () => {
      clearTimeout(first)
      clearInterval(interval)
    }
  }, [user])

  // Show nothing while hydrating or unauthenticated
  if (!hydrated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Tip of the Day */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground"><span className="font-semibold text-primary">Tip of the Day: </span>{todayTip}</p>
        </div>

        {/* Welcome banner */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Welcome back, {user.name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {user.region} &middot; Growing{" "}
              {user.cropTypes.join(", ")}
            </p>
          </div>
          <Link href="/upload">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="h-4 w-4" />
              Quick Upload
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Main grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Recent detections */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Detections
              </h2>
              <Link href="/upload">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {mockDetections.slice(0, 4).map((detection) => (
                <DiseaseCard key={detection.id} detection={detection} />
              ))}
            </div>
          </div>

          {/* Live alerts sidebar */}
          <div>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <Bell className="h-4 w-4 text-primary" />
                    Live Alerts
                  </CardTitle>
                  <Badge className="bg-destructive text-primary-foreground">
                    {liveAlerts.length} new
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ScrollArea className="h-[520px] pr-2">
                  <div className="flex flex-col gap-3">
                    {liveAlerts.map((alert) => (
                      <AlertBanner key={alert.id} alert={alert} />
                    ))}
                  </div>
                </ScrollArea>
                <Link href="/alerts" className="mt-4 block">
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-sm"
                    size="sm"
                  >
                    View All Alerts
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Weather Widget */}
            <WeatherWidget />
            {/* Health Score */}
            <HealthScoreCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
