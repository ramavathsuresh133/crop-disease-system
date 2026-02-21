import { NextResponse } from "next/server"
import { mockDetections } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json({
    success: true,
    detections: mockDetections,
    total: mockDetections.length,
  })
}
