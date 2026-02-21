"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { mapMarkers } from "@/lib/mock-data"

const severityColors = {
  low: "#16a34a",
  medium: "#ca8a04",
  high: "#dc2626",
}

export function FarmMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    // Dynamically load Leaflet
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = () => {
      if (!mapRef.current) return

      const L = (window as unknown as { L: typeof import("leaflet") }).L

      const map = L.map(mapRef.current).setView([28.6139, 77.209], 10)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      mapMarkers.forEach((marker) => {
        const color = severityColors[marker.severity]
        const isHealthy = marker.disease === "Healthy"

        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${color};
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ${!isHealthy ? "animation: pulse 2s infinite;" : ""}
          "></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        L.marker([marker.lat, marker.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: Inter, sans-serif; min-width: 180px;">
              <p style="font-weight: 600; font-size: 14px; margin: 0 0 4px;">${marker.disease}</p>
              <p style="font-size: 12px; color: #666; margin: 0 0 8px;">Crop: ${marker.crop}</p>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                <span style="
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: ${color};
                "></span>
                <span style="font-size: 12px; text-transform: capitalize;">${marker.severity} Severity</span>
              </div>
              <p style="font-size: 11px; color: #999; margin: 4px 0 0;">
                Reported by ${marker.farmer}<br/>${marker.date}
              </p>
            </div>`
          )
      })

      // Add CSS animation for pulsing markers
      const style = document.createElement("style")
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        .custom-marker { background: transparent !important; border: none !important; }
      `
      document.head.appendChild(style)

      mapInstance.current = map
    }
    document.head.appendChild(script)

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <Card className="overflow-hidden border-border">
      <CardContent className="p-0">
        <div ref={mapRef} className="h-[500px] w-full" />
      </CardContent>
      {/* Legend */}
      <div className="flex items-center gap-6 border-t border-border px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">
          Legend:
        </span>
        {[
          { color: "#16a34a", label: "Healthy / Low" },
          { color: "#ca8a04", label: "Moderate" },
          { color: "#dc2626", label: "Severe" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
