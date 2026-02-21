"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UploadForm } from "@/components/upload-form"
import { DetectionResult } from "@/components/detection-result"
import { DiseaseCard } from "@/components/disease-card"
import { mockDetections } from "@/lib/mock-data"
import { saveDetectionToHistory } from "@/app/history/page"
import { toast } from "sonner"

const possibleResults = [
  {
    diseaseName: "Early Blight",
    confidence: 94.5,
    severity: "high" as const,
    treatment:
      "Apply copper-based fungicide immediately. Remove affected leaves and ensure proper plant spacing for airflow.",
    cropType: "",
  },
  {
    diseaseName: "Late Blight",
    confidence: 89.2,
    severity: "high" as const,
    treatment:
      "Apply metalaxyl-based fungicide. Remove and destroy all infected plant parts. Avoid overhead watering.",
    cropType: "",
  },
  {
    diseaseName: "Powdery Mildew",
    confidence: 86.3,
    severity: "medium" as const,
    treatment:
      "Apply sulfur-based fungicide or neem oil. Improve air circulation between rows.",
    cropType: "",
  },
  {
    diseaseName: "Leaf Mold",
    confidence: 91.1,
    severity: "medium" as const,
    treatment:
      "Reduce humidity in growing area. Apply chlorothalonil fungicide. Remove affected foliage.",
    cropType: "",
  },
  {
    diseaseName: "Healthy",
    confidence: 97.8,
    severity: "low" as const,
    treatment:
      "No treatment needed. Your crop looks healthy. Continue regular monitoring and good agricultural practices.",
    cropType: "",
  },
]


// Returns validation result with reason
function analyzeImageColors(file: File): Promise<{ valid: boolean; reason: string }> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const SIZE = 150
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, SIZE, SIZE)
      const { data } = ctx.getImageData(0, 0, SIZE, SIZE)
      let skinPixels = 0
      let strictGreenPixels = 0
      const total = SIZE * SIZE

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]

        // Skin tone detection (covers all skin tones: light to dark)
        // Key properties: Red dominates, not too blue, not too grey, warm range
        const isSkin =
          r > 60 && g > 30 && b > 10 &&     // not too dark
          r > g && r > b &&                   // red dominates
          (r - g) > 10 &&                     // not grey
          r < 250 &&                          // not white/blown out
          Math.abs(r - g) < 100 &&            // not overly saturated
          b < 180                             // not too blue

        // Strict plant green: green strongly dominates both R and B
        // Blurry background greens won't pass because they're desaturated
        const isStrictGreen =
          g > r + 25 &&     // green clearly beats red (stricter than before)
          g > b + 20 &&     // green clearly beats blue
          g > 70 &&         // not too dark
          g < 240           // not overexposed

        if (isSkin) skinPixels++
        if (isStrictGreen) strictGreenPixels++
      }
      URL.revokeObjectURL(url)

      const skinRatio = skinPixels / total
      const greenRatio = strictGreenPixels / total

      // Reject if very significant skin tones detected (human/person photo)
      // Threshold increased from 0.10 to 0.35 to avoid flagging brown diseased areas as skin
      if (skinRatio > 0.35) {
        resolve({ valid: false, reason: "Human or person detected in the image. Please upload a crop or plant leaf photo only." })
        return
      }
      // Require at least 5% strong plant-green pixels (decreased from 20%)
      // This allows for fruits, soil, or heavily diseased plants that aren't mostly green
      if (greenRatio < 0.05) {
        resolve({ valid: false, reason: "The image doesn't appear to contain sufficient crop or plant content. Please upload a clear photo of a crop leaf or plant." })
        return
      }
      resolve({ valid: true, reason: "" })
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve({ valid: false, reason: "Could not read the image file." }) }
    img.src = url
  })
}

export default function UploadPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<(typeof possibleResults)[0] | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleAnalyze(_file: File, crop: string) {
    setIsAnalyzing(true)
    setResult(null)
    setValidationError(null)

    // Step 1: Image content validation
    const { valid, reason } = await analyzeImageColors(_file)
    if (!valid) {
      setIsAnalyzing(false)
      setValidationError(reason)
      toast.error("Invalid image: " + reason)
      return
    }

    // Step 2: Simulate AI analysis on valid plant image
    setTimeout(() => {
      const randomResult =
        possibleResults[Math.floor(Math.random() * possibleResults.length)]
      const finalResult = { ...randomResult, cropType: crop }
      setResult(finalResult)
      setIsAnalyzing(false)
      setValidationError(null)

      // Save to history
      saveDetectionToHistory({
        cropType: finalResult.cropType,
        diseaseName: finalResult.diseaseName,
        confidence: finalResult.confidence,
        severity: finalResult.severity,
        treatment: finalResult.treatment,
      })

      if (finalResult.severity === "high") {
        toast.error(`Disease detected: ${finalResult.diseaseName} on ${crop}`)
      } else if (finalResult.severity === "medium") {
        toast.warning(
          `Moderate issue: ${finalResult.diseaseName} found on ${crop}`
        )
      } else {
        toast.success(`Good news! Your ${crop} appears healthy.`)
      }
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Upload & Detect
          </h1>
          <p className="mt-1 text-muted-foreground">
            Upload a crop or leaf image for instant AI-powered disease detection
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload form */}
          <div className="flex flex-col gap-6">
            <UploadForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          </div>

          {/* Result */}
          <div>
            {result ? (
              <DetectionResult result={result} />
            ) : validationError ? (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-destructive/40 bg-destructive/5 p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-destructive">Invalid Image Detected</h3>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">{validationError}</p>
                <div className="mt-4 rounded-lg bg-muted/60 px-4 py-3 text-left text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">✅ Valid image examples:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Close-up of crop leaves</li>
                    <li>Plant showing disease symptoms</li>
                    <li>Field crop images (wheat, rice, cotton, etc.)</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <svg
                    className="h-8 w-8 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  Awaiting Analysis
                </h3>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  Upload a crop image and select the crop type to start the
                  AI-powered disease detection
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Past detections */}
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Recent Detection History
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockDetections.map((detection) => (
              <DiseaseCard key={detection.id} detection={detection} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
