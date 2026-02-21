"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Leaf,
  Menu,
  X,
  LayoutDashboard,
  Upload,
  Bell,
  LogIn,
  UserPlus,
  CalendarDays,
  BookOpen,
  History,
  User,
  ChevronDown,
  Sun,
  Cloud,
  Wind,
  AlertTriangle,
  CheckCircle,
  BarChart2,
  Sparkles,
  FlaskConical,
  CloudSun,
  Users,
  MoreHorizontal,
  IndianRupee,
  BookMarked,
  Calculator,
  Landmark,
  Wallet,
  Droplets,
  Map,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/history", label: "History", icon: History },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/encyclopedia", label: "Encyclopedia", icon: BookOpen },
]

const moreLinks = [
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/advisor", label: "AI Advisor", icon: Sparkles },
  { href: "/treatment", label: "Treatment Planner", icon: FlaskConical },
  { href: "/forecast", label: "Disease Forecast", icon: CloudSun },
  { href: "/community", label: "Community", icon: Users },
  { href: "/market", label: "Market Prices", icon: IndianRupee },
  { href: "/journal", label: "Farm Journal", icon: BookMarked },
  { href: "/yield", label: "Yield Calculator", icon: Calculator },
  { href: "/schemes", label: "Govt Schemes", icon: Landmark },
  { href: "/expenses", label: "Expense Tracker", icon: Wallet },
  { href: "/irrigation", label: "Irrigation Scheduler", icon: Droplets },
  { href: "/fields", label: "Field Map", icon: Map },
]

const weatherScenarios = [
  { temp: 28, humidity: 82, wind: 12, rain: 70, condition: "Cloudy" },
  { temp: 33, humidity: 45, wind: 18, rain: 10, condition: "Sunny" },
  { temp: 22, humidity: 91, wind: 8, rain: 85, condition: "Rainy" },
  { temp: 26, humidity: 68, wind: 14, rain: 40, condition: "Partly Cloudy" },
  { temp: 30, humidity: 55, wind: 22, rain: 20, condition: "Windy" },
]

function getDiseaseRisk(humidity: number, temp: number, rain: number) {
  const score =
    (humidity > 80 ? 3 : humidity > 60 ? 1 : 0) +
    (temp >= 18 && temp <= 28 ? 2 : 0) +
    (rain > 60 ? 2 : rain > 30 ? 1 : 0)
  if (score >= 5) return { level: "High Risk", color: "bg-destructive text-destructive-foreground", Icon: AlertTriangle }
  if (score >= 3) return { level: "Med Risk", color: "bg-yellow-500 text-white", Icon: AlertTriangle }
  return { level: "Low Risk", color: "bg-green-600 text-white", Icon: CheckCircle }
}

function WeatherNavBadge() {
  const [weather, setWeather] = useState(weatherScenarios[0])
  useEffect(() => {
    setWeather(weatherScenarios[Math.floor(Math.random() * weatherScenarios.length)])
  }, [])
  const risk = getDiseaseRisk(weather.humidity, weather.temp, weather.rain)
  const RiskIcon = risk.Icon
  const WeatherIcon = weather.condition === "Sunny" ? Sun : weather.condition === "Windy" ? Wind : Cloud
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs">
      <WeatherIcon className="h-3.5 w-3.5 text-yellow-500" />
      <span className="font-semibold text-foreground">{weather.temp}°C</span>
      <span className="text-muted-foreground hidden lg:inline">{weather.condition}</span>
      <span className="mx-0.5 text-border">|</span>
      <RiskIcon className="h-3 w-3" style={{ color: risk.level === "High Risk" ? "#ef4444" : risk.level === "Med Risk" ? "#eab308" : "#16a34a" }} />
      <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", risk.color)}>{risk.level}</span>
    </div>
  )
}

const NOTIF_KEY = "cropguard_notifications_read"
const TOTAL_NOTIFS = 10 // matches mockNotifications.length

function NotifBadge() {
  const [unread, setUnread] = useState(0)
  useEffect(() => {
    const readIds: string[] = JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]")
    setUnread(Math.max(0, TOTAL_NOTIFS - readIds.length))
  }, [])
  if (unread === 0) return null
  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
      {unread > 9 ? "9+" : unread}
    </span>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const isAppPage = pathname !== "/" && pathname !== "/login" && pathname !== "/register"
  const isLoggedIn = !!user
  const showNavLinks = isLoggedIn || isAppPage

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const isMoreActive = moreLinks.some(l => l.href === pathname)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            CropGuard
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {showNavLinks &&
            navLinks.map((link) => {
              const Icon = link.icon
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      active && "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    {link.label === "Alerts" && (
                      <Badge className="ml-1 h-5 bg-destructive text-destructive-foreground px-1.5 text-[10px]">
                        3
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}

          {/* More dropdown */}
          {showNavLinks && (
            <div className="relative" ref={moreRef}>
              <Button
                variant={isMoreActive ? "secondary" : "ghost"}
                size="sm"
                className={cn("gap-1.5", isMoreActive && "bg-primary/10 text-primary")}
                onClick={() => setMoreOpen(o => !o)}
              >
                <MoreHorizontal className="h-4 w-4" />
                More
                <ChevronDown className={cn("h-3 w-3 transition-transform", moreOpen && "rotate-180")} />
              </Button>
              {moreOpen && (
                <div className="absolute left-0 top-full mt-1 w-52 rounded-lg border border-border bg-card shadow-xl z-50 py-1">
                  {moreLinks.map((link) => {
                    const Icon = link.icon
                    const active = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted",
                          active ? "text-primary font-medium bg-primary/5" : "text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Weather badge (desktop) */}
        {showNavLinks && (
          <div className="hidden md:flex items-center gap-2">
            <WeatherNavBadge />
            {/* Notifications icon */}
            {isLoggedIn && (
              <Link href="/notifications" className="relative">
                <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <NotifBadge />
                </button>
              </Link>
            )}
          </div>
        )}

        {/* Auth buttons / user */}
        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn && user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card shadow-lg z-50">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors rounded-t-lg"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    Profile & Settings
                  </Link>
                  <div className="border-t border-border" />
                  <button
                    onClick={() => { logout(); setProfileOpen(false) }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors rounded-b-lg"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {showNavLinks && (
              <div className="mb-2 flex justify-center">
                <WeatherNavBadge />
              </div>
            )}
            {showNavLinks &&
              navLinks.map((link) => {
                const Icon = link.icon
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button
                      variant={active ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2",
                        active && "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}

            {/* More links in mobile */}
            {showNavLinks && (
              <>
                <div className="mt-1 mb-1 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">More Features</div>
                {moreLinks.map((link) => {
                  const Icon = link.icon
                  const active = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        variant={active ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-2",
                          active && "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Button>
                    </Link>
                  )
                })}
              </>
            )}

            <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
              {isLoggedIn ? (
                <>
                  <Link href="/notifications" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Profile & Settings
                    </Button>
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false) }} className="w-full">
                    <Button variant="ghost" className="w-full justify-start text-destructive">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
