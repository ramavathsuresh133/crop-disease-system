"use client"

import { useState, useMemo } from "react"
import { Map, List, Filter } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlertBanner } from "@/components/alert-banner"
import { FarmMap } from "@/components/farm-map"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockAlerts, cropTypes } from "@/lib/mock-data"

export default function AlertsPage() {
  const [cropFilter, setCropFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  const filteredAlerts = useMemo(() => {
    return mockAlerts.filter((alert) => {
      if (cropFilter !== "all" && alert.cropType !== cropFilter) return false
      if (severityFilter !== "all" && alert.severity !== severityFilter)
        return false
      return true
    })
  }, [cropFilter, severityFilter])

  const severityCounts = useMemo(() => {
    return {
      all: mockAlerts.length,
      high: mockAlerts.filter((a) => a.severity === "high").length,
      medium: mockAlerts.filter((a) => a.severity === "medium").length,
      low: mockAlerts.filter((a) => a.severity === "low").length,
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Disease Alerts
            </h1>
            <p className="mt-1 text-muted-foreground">
              Real-time disease reports from farmers in your region
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-destructive text-primary-foreground">
              {severityCounts.high} severe
            </Badge>
            <Badge className="bg-warning text-warning-foreground">
              {severityCounts.medium} moderate
            </Badge>
            <Badge className="bg-success text-success-foreground">
              {severityCounts.low} low
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="list" className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* View toggle */}
            <TabsList>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <Map className="h-4 w-4" />
                Map View
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={cropFilter} onValueChange={setCropFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Crops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  {cropTypes.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={severityFilter}
                onValueChange={setSeverityFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="high">Severe</SelectItem>
                  <SelectItem value="medium">Moderate</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              {(cropFilter !== "all" || severityFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCropFilter("all")
                    setSeverityFilter("all")
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* List view */}
          <TabsContent value="list">
            <div className="flex flex-col gap-3">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <AlertBanner key={alert.id} alert={alert} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16 text-center">
                  <p className="font-medium text-foreground">
                    No alerts match your filters
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting the crop type or severity filter
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Map view */}
          <TabsContent value="map">
            <FarmMap />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
