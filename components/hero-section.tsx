import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ScanLine, Bell, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-crop.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
            <ScanLine className="h-4 w-4" />
            AI-Powered Crop Protection
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Detect Crop Diseases{" "}
            <span className="text-primary">Instantly</span>
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-primary-foreground/80">
            Upload a photo of your crop and get AI-powered disease detection in
            seconds. Receive real-time alerts when diseases are found in your
            region. Protect your harvest with CropGuard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/upload">
              <Button
                size="lg"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Upload Crop Image
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                Join as Farmer
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { icon: ScanLine, label: "12,400+", sub: "Scans Completed" },
              { icon: Bell, label: "3,200+", sub: "Alerts Sent" },
              { icon: Shield, label: "8,500+", sub: "Farmers Protected" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-primary-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs text-primary-foreground/60">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
