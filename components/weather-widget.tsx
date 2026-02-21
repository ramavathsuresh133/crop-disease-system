"use client"

import { useState, useEffect } from "react"
import { Cloud, Droplets, Wind, Thermometer, AlertTriangle, CheckCircle, Sun } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const weatherScenarios = [
    { temp: 28, humidity: 82, wind: 12, rain: 70, condition: "Cloudy", icon: "cloud" },
    { temp: 33, humidity: 45, wind: 18, rain: 10, condition: "Sunny", icon: "sun" },
    { temp: 22, humidity: 91, wind: 8, rain: 85, condition: "Rainy", icon: "rain" },
    { temp: 26, humidity: 68, wind: 14, rain: 40, condition: "Partly Cloudy", icon: "cloud" },
    { temp: 30, humidity: 55, wind: 22, rain: 20, condition: "Windy", icon: "wind" },
]

function getDiseaseRisk(humidity: number, temp: number, rain: number) {
    const score = (humidity > 80 ? 3 : humidity > 60 ? 1 : 0)
        + (temp >= 18 && temp <= 28 ? 2 : 0)
        + (rain > 60 ? 2 : rain > 30 ? 1 : 0)

    if (score >= 5) return { level: "High", color: "bg-destructive text-destructive-foreground", icon: AlertTriangle, tip: "Avoid overhead irrigation. Inspect crops daily for early symptoms." }
    if (score >= 3) return { level: "Medium", color: "bg-yellow-500 text-white", icon: AlertTriangle, tip: "Monitor closely. Ensure good air circulation between rows." }
    return { level: "Low", color: "bg-green-600 text-white", icon: CheckCircle, tip: "Conditions are generally favorable. Maintain regular monitoring." }
}

export function WeatherWidget() {
    const [weather, setWeather] = useState(weatherScenarios[0])
    const [location] = useState("North India")

    useEffect(() => {
        const idx = Math.floor(Math.random() * weatherScenarios.length)
        setWeather(weatherScenarios[idx])
    }, [])

    const risk = getDiseaseRisk(weather.humidity, weather.temp, weather.rain)
    const RiskIcon = risk.icon

    return (
        <Card className="border-border">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base text-foreground">
                    <span className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        Weather & Disease Risk
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">{location}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Main weather */}
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div>
                        <p className="text-3xl font-bold text-foreground">{weather.temp}°C</p>
                        <p className="text-sm text-muted-foreground">{weather.condition}</p>
                    </div>
                    <Cloud className="h-12 w-12 text-primary/60" />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-md bg-muted/40 p-2">
                        <Droplets className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                        <p className="text-sm font-semibold text-foreground">{weather.humidity}%</p>
                        <p className="text-[10px] text-muted-foreground">Humidity</p>
                    </div>
                    <div className="rounded-md bg-muted/40 p-2">
                        <Wind className="mx-auto mb-1 h-4 w-4 text-teal-500" />
                        <p className="text-sm font-semibold text-foreground">{weather.wind} km/h</p>
                        <p className="text-[10px] text-muted-foreground">Wind</p>
                    </div>
                    <div className="rounded-md bg-muted/40 p-2">
                        <Thermometer className="mx-auto mb-1 h-4 w-4 text-orange-500" />
                        <p className="text-sm font-semibold text-foreground">{weather.rain}%</p>
                        <p className="text-[10px] text-muted-foreground">Rain</p>
                    </div>
                </div>

                {/* Disease risk */}
                <div className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Disease Risk Today</span>
                        <Badge className={risk.color}>
                            <RiskIcon className="mr-1 h-3 w-3" />
                            {risk.level}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{risk.tip}</p>
                </div>
            </CardContent>
        </Card>
    )
}
