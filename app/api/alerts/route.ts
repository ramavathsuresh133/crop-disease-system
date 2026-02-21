import { NextRequest, NextResponse } from "next/server"
import { mockAlerts } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const crop = searchParams.get("crop")
  const severity = searchParams.get("severity")
  const region = searchParams.get("region")

  let alerts = [...mockAlerts]

  if (crop && crop !== "all") {
    alerts = alerts.filter((a) => a.cropType === crop)
  }
  if (severity && severity !== "all") {
    alerts = alerts.filter((a) => a.severity === severity)
  }
  if (region) {
    alerts = alerts.filter((a) => a.region === region)
  }

  return NextResponse.json({
    success: true,
    alerts,
    total: alerts.length,
  })
}
