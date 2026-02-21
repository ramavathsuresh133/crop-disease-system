import { NextRequest, NextResponse } from "next/server"

const diseases = [
  {
    disease: "Early Blight",
    confidence: 94.5,
    severity: "high",
    treatment:
      "Apply copper-based fungicide immediately. Remove affected leaves. Ensure proper spacing between plants for better air circulation.",
  },
  {
    disease: "Late Blight",
    confidence: 89.2,
    severity: "high",
    treatment:
      "Apply metalaxyl-based fungicide. Remove and destroy all infected plant material. Avoid overhead irrigation.",
  },
  {
    disease: "Powdery Mildew",
    confidence: 86.3,
    severity: "medium",
    treatment:
      "Apply sulfur-based or neem oil fungicide. Improve air circulation. Remove infected leaves.",
  },
  {
    disease: "Leaf Mold",
    confidence: 91.1,
    severity: "medium",
    treatment:
      "Reduce humidity. Apply chlorothalonil or copper fungicide. Ensure proper ventilation.",
  },
  {
    disease: "Bacterial Spot",
    confidence: 82.7,
    severity: "medium",
    treatment:
      "Apply copper hydroxide spray. Use disease-free seeds. Remove heavily infected plants.",
  },
  {
    disease: "Healthy",
    confidence: 97.8,
    severity: "low",
    treatment:
      "No treatment needed. Your crop appears healthy. Continue regular monitoring.",
  },
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File | null
    const cropType = formData.get("cropType") as string | null

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      )
    }

    if (!cropType) {
      return NextResponse.json(
        { error: "No crop type specified" },
        { status: 400 }
      )
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Return a random prediction (in production this would call a real ML model)
    const prediction = diseases[Math.floor(Math.random() * diseases.length)]

    return NextResponse.json({
      success: true,
      prediction: {
        ...prediction,
        cropType,
        timestamp: new Date().toISOString(),
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    )
  }
}
