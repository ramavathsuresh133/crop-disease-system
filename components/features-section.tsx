import {
  ScanLine,
  Bell,
  Map,
  Stethoscope,
  Zap,
  Shield,
} from "lucide-react"

const features = [
  {
    icon: ScanLine,
    title: "AI Disease Detection",
    description:
      "Powered by TensorFlow, trained on 38+ plant disease classes from the PlantVillage dataset.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description:
      "Instant notifications sent to all farmers in your region growing the same crop type.",
  },
  {
    icon: Map,
    title: "Disease Map",
    description:
      "Interactive map showing where diseases have been reported, color-coded by severity.",
  },
  {
    icon: Stethoscope,
    title: "Treatment Advice",
    description:
      "Get organic and chemical treatment recommendations tailored to each detected disease.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Upload an image and receive detailed analysis results in under 3 seconds.",
  },
  {
    icon: Shield,
    title: "Farmer Network",
    description:
      "Join a community of farmers working together to protect crops across your region.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to protect your harvest
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
