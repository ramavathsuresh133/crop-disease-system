import { Leaf } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">CropGuard</span>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <Link href="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/upload" className="transition-colors hover:text-foreground">
              Upload
            </Link>
            <Link href="/alerts" className="transition-colors hover:text-foreground">
              Alerts
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            Built with AI to protect farmers worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
}
