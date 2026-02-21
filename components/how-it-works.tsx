import { Upload, Cpu, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: Upload,
    title: "Upload Image",
    description:
      "Take a photo of your crop leaf and upload it to CropGuard. Our system accepts any common image format.",
    step: "01",
  },
  {
    icon: Cpu,
    title: "AI Detects Disease",
    description:
      "Our TensorFlow-powered AI model analyzes the image and identifies the disease with confidence scores and severity levels.",
    step: "02",
  },
  {
    icon: Bell,
    title: "Get Alerts & Treatment",
    description:
      "Receive instant treatment recommendations and nearby farmers growing the same crop are alerted in real-time.",
    step: "03",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three steps to protect your crops
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            CropGuard makes it simple for any farmer to identify crop diseases
            and take action before it spreads.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <Card
              key={step.step}
              className="group relative overflow-hidden border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="absolute right-4 top-4 text-6xl font-black text-primary/5">
                {step.step}
              </div>
              <CardContent className="relative p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
