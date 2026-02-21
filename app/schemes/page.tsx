"use client"

import { useState, useEffect, useMemo } from "react"
import { Landmark, Star, Search, ExternalLink, BadgeIndianRupee, ShieldCheck, Tractor, Wheat, Droplets } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const FAV_KEY = "cropguard_scheme_favs"

interface Scheme {
    id: string; name: string; ministry: string
    category: "subsidy" | "insurance" | "loan" | "equipment" | "training" | "market"
    benefit: string; eligibility: string
    state: "central" | "maharashtra" | "punjab" | "up" | "telangana" | "karnataka" | "gujarat"
    deadline: string; link: string; description: string; highlight: string
}

const schemes: Scheme[] = [
    { id: "pmkisan", name: "PM-KISAN", ministry: "Ministry of Agriculture", category: "subsidy", benefit: "₹6,000/year in 3 installments", eligibility: "All landowner farmer families", state: "central", deadline: "Ongoing", link: "https://pmkisan.gov.in", description: "Direct income support of ₹6,000 per year paid in 3 installments of ₹2,000 directly to bank accounts.", highlight: "₹6,000/year direct bank transfer" },
    { id: "pmfby", name: "PMFBY — Fasal Bima Yojana", ministry: "Ministry of Agriculture", category: "insurance", benefit: "Crop insurance at 2% premium (Kharif) / 1.5% (Rabi)", eligibility: "All farmers growing notified crops", state: "central", deadline: "Seasonal enrollment", link: "https://pmfby.gov.in", description: "Crop insurance covering pre-sowing to post-harvest losses at very low premium rates subsidized by govt.", highlight: "Crop insurance from 1.5–2% premium" },
    { id: "kcc", name: "Kisan Credit Card (KCC)", ministry: "Ministry of Agriculture / Banks", category: "loan", benefit: "Credit up to ₹3 lakh at 4% interest", eligibility: "Farmers, sharecroppers, oral lessees", state: "central", deadline: "Ongoing", link: "https://agricoop.nic.in", description: "Revolving credit for agricultural operations and allied activities at just 4% interest per annum.", highlight: "4% interest rate with govt subsidy" },
    { id: "smam", name: "SMAM — Farm Mechanization", ministry: "Ministry of Agriculture", category: "equipment", benefit: "40–80% subsidy on machinery", eligibility: "Small & marginal farmers; SC/ST get higher subsidy", state: "central", deadline: "Ongoing", link: "https://farmer.gov.in", description: "40–50% subsidy for general category, up to 80% for SC/ST farmers on tractors, harvesters & equipment.", highlight: "Up to 80% subsidy on machinery" },
    { id: "pkvy", name: "PKVY — Organic Farming", ministry: "Ministry of Agriculture", category: "training", benefit: "₹50,000/hectare over 3 years", eligibility: "Farmers shifting to organic farming", state: "central", deadline: "Ongoing", link: "https://farmer.gov.in", description: "Cluster-based organic farming promotion. ₹50,000/ha for 3 years covering training, certification & market linkage.", highlight: "₹50,000/ha for organic transition" },
    { id: "soil", name: "Soil Health Card Scheme", ministry: "Ministry of Agriculture", category: "subsidy", benefit: "Free soil testing + fertilizer advice", eligibility: "All farmers", state: "central", deadline: "Ongoing", link: "https://soilhealth.dac.gov.in", description: "Free soil health cards with crop-wise nutrient recommendations to reduce input costs and improve productivity.", highlight: "Free soil testing for all farmers" },
    { id: "pdmc", name: "Per Drop More Crop (PMKSY)", ministry: "Jal Shakti Ministry", category: "equipment", benefit: "55% subsidy on drip/sprinkler systems", eligibility: "All farmers; 45% for large farmers", state: "central", deadline: "Ongoing", link: "https://jalshakti-dowr.gov.in", description: "Promotes micro-irrigation to enhance water use efficiency with subsidized drip and sprinkler equipment.", highlight: "55% drip/sprinkler subsidy" },
    { id: "enam", name: "e-NAM — National Agriculture Market", ministry: "Ministry of Agriculture", category: "market", benefit: "Online trading for better prices", eligibility: "All farmers with produce", state: "central", deadline: "Ongoing", link: "https://enam.gov.in", description: "Pan-India electronic trading platform integrating 1000+ mandis — sell to highest bidder nationally.", highlight: "Online mandi — sell nationally" },
    { id: "kvm", name: "Kisan Vikas Patra", ministry: "Ministry of Finance", category: "loan", benefit: "Money doubles in ~124 months at 7.5% p.a.", eligibility: "Any Indian citizen", state: "central", deadline: "Ongoing", link: "https://www.indiapost.gov.in", description: "Fixed income savings scheme available at post offices. Minimum ₹1,000. Guaranteed doubling of investment.", highlight: "₹1,000 minimum, money doubles" },
    { id: "maandhan", name: "Kisan Maandhan Pension Yojana", ministry: "Ministry of Agriculture", category: "subsidy", benefit: "₹3,000/month pension after 60", eligibility: "Small/marginal farmers aged 18–40", state: "central", deadline: "Ongoing", link: "https://maandhan.in", description: "Voluntary pension scheme providing ₹3,000/month after age 60 as social security for small farmers.", highlight: "₹3,000/month farmer pension" },
    { id: "shetkari", name: "Shetkari Samman Nidhi (Maharashtra)", ministry: "Govt of Maharashtra", category: "subsidy", benefit: "₹12,000/year income support", eligibility: "Maharashtra landowner farmers", state: "maharashtra", deadline: "Ongoing", link: "https://mahadbt.maharashtra.gov.in", description: "Additional ₹12,000/year above PM-KISAN for Maharashtra farmers, directly credited to bank accounts.", highlight: "₹12,000/year — Maharashtra only" },
    { id: "polyhouse", name: "Polyhouse Subsidy (Maharashtra)", ministry: "Maharashtra Horticulture Dept", category: "equipment", benefit: "50% subsidy on polyhouse construction", eligibility: "Maharashtra horticulture farmers", state: "maharashtra", deadline: "Apply before March 31", link: "https://mahadbt.maharashtra.gov.in", description: "Subsidy for protected cultivation structures (polyhouses/net houses) for vegetables and flowers.", highlight: "50% polyhouse construction subsidy" },
    { id: "rythu", name: "Rythu Bharosa (Telangana)", ministry: "Govt of Telangana", category: "subsidy", benefit: "₹10,000/acre per season", eligibility: "Telangana landowner farmers", state: "telangana", deadline: "Seasonal", link: "https://agriculture.telangana.gov.in", description: "₹10,000 per acre per season (Kharif & Rabi) deposited before crop season under the Telangana Rythu Bharosa scheme.", highlight: "₹10,000/acre each season" },
    { id: "rkvy", name: "RKVY — Agriculture Development", ministry: "Ministry of Agriculture", category: "training", benefit: "Grants for agri-infrastructure & startups", eligibility: "State govts & farmer groups", state: "central", deadline: "Ongoing", link: "https://agricoop.nic.in", description: "Incentives for states to invest in cold storage, processing, farmer training, and agri-startup incubation.", highlight: "Infrastructure grants & training" },
    { id: "namo", name: "Namo Shetkari Maha Samman (MH)", ministry: "Govt of Maharashtra", category: "insurance", benefit: "Free crop insurance (Govt pays premium)", eligibility: "PMFBY enrolled Maharashtra farmers", state: "maharashtra", deadline: "Seasonal", link: "https://mahadbt.maharashtra.gov.in", description: "State pays farm share of PMFBY premium — making crop insurance completely free for Maharashtra farmers.", highlight: "Free crop insurance — Maharashtra" },
]

const categoryConfig = {
    subsidy: { label: "Subsidy", color: "bg-green-600 text-white", Icon: BadgeIndianRupee },
    insurance: { label: "Insurance", color: "bg-blue-600 text-white", Icon: ShieldCheck },
    loan: { label: "Loan", color: "bg-purple-600 text-white", Icon: Landmark },
    equipment: { label: "Equipment", color: "bg-orange-500 text-white", Icon: Tractor },
    training: { label: "Training", color: "bg-cyan-600 text-white", Icon: Wheat },
    market: { label: "Market", color: "bg-rose-600 text-white", Icon: Droplets },
}

const stateLabels: Record<string, string> = {
    central: "All States (Central)", maharashtra: "Maharashtra",
    telangana: "Telangana", karnataka: "Karnataka", punjab: "Punjab", up: "Uttar Pradesh", gujarat: "Gujarat",
}

export default function SchemesPage() {
    const [favs, setFavs] = useState<string[]>([])
    const [search, setSearch] = useState("")
    const [catFilter, setCatFilter] = useState("all")
    const [stateFilter, setStateFilter] = useState("all")
    const [showFavOnly, setShowFavOnly] = useState(false)

    useEffect(() => {
        setFavs(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"))
    }, [])

    function toggleFav(id: string) {
        setFavs(prev => {
            const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
            localStorage.setItem(FAV_KEY, JSON.stringify(next))
            toast.success(prev.includes(id) ? "Removed from saved" : "Scheme saved!")
            return next
        })
    }

    const filtered = useMemo(() =>
        schemes.filter(s => {
            const q = search.toLowerCase()
            const matchSearch = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.benefit.toLowerCase().includes(q)
            const matchCat = catFilter === "all" || s.category === catFilter
            const matchState = stateFilter === "all" || s.state === stateFilter
            const matchFav = !showFavOnly || favs.includes(s.id)
            return matchSearch && matchCat && matchState && matchFav
        }), [search, catFilter, stateFilter, showFavOnly, favs])

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
                        <Landmark className="h-7 w-7 text-primary" /> Government Schemes
                    </h1>
                    <p className="mt-1 text-muted-foreground">Central &amp; state agricultural subsidies, insurance, loans, and support programs</p>
                </div>

                {/* Category quick-filter tiles */}
                <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {Object.entries(categoryConfig).map(([key, cfg]) => {
                        const Icon = cfg.Icon
                        const count = schemes.filter(s => s.category === key).length
                        return (
                            <button key={key} onClick={() => setCatFilter(catFilter === key ? "all" : key)}
                                className={cn("flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all hover:border-primary/50", catFilter === key ? "border-primary bg-primary/5" : "border-border")}>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-bold">{count}</span>
                                <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search schemes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={stateFilter} onValueChange={setStateFilter}>
                        <SelectTrigger className="w-[200px]"><SelectValue placeholder="All States" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All States</SelectItem>
                            {Object.entries(stateLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button variant={showFavOnly ? "default" : "outline"} className="gap-2 shrink-0" onClick={() => setShowFavOnly(p => !p)}>
                        <Star className="h-4 w-4" /> Saved ({favs.length})
                    </Button>
                </div>

                <p className="mb-4 text-sm text-muted-foreground">{filtered.length} scheme{filtered.length !== 1 ? "s" : ""} found</p>

                <div className="grid gap-4 sm:grid-cols-2">
                    {filtered.length === 0 ? (
                        <div className="col-span-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-20 text-center">
                            <Landmark className="h-12 w-12 text-muted-foreground/30" />
                            <p className="mt-4 font-medium">No schemes match your filters</p>
                        </div>
                    ) : filtered.map(scheme => {
                        const cfg = categoryConfig[scheme.category]
                        const Icon = cfg.Icon
                        const isFav = favs.includes(scheme.id)
                        return (
                            <Card key={scheme.id} className="border-border hover:border-primary/40 transition-colors">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className={cn("text-[10px]", cfg.color)}><Icon className="h-2.5 w-2.5 mr-1" />{cfg.label}</Badge>
                                            <Badge variant="outline" className="text-[10px]">{stateLabels[scheme.state] ?? scheme.state}</Badge>
                                        </div>
                                        <button onClick={() => toggleFav(scheme.id)} className={cn("shrink-0 rounded-full p-1 transition-colors", isFav ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500")}>
                                            <Star className={cn("h-4 w-4", isFav && "fill-yellow-400")} />
                                        </button>
                                    </div>
                                    <h3 className="font-semibold text-sm leading-snug mb-2">{scheme.name}</h3>
                                    <div className="rounded-lg bg-primary/5 border border-primary/10 px-3 py-2 mb-3">
                                        <p className="text-xs font-semibold text-primary">{scheme.highlight}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{scheme.description}</p>
                                    <div className="space-y-1 text-xs mb-3">
                                        <div className="flex gap-2"><span className="font-medium min-w-[80px]">Benefit:</span><span className="text-muted-foreground">{scheme.benefit}</span></div>
                                        <div className="flex gap-2"><span className="font-medium min-w-[80px]">Eligible:</span><span className="text-muted-foreground">{scheme.eligibility}</span></div>
                                        <div className="flex gap-2"><span className="font-medium min-w-[80px]">Deadline:</span><span className={scheme.deadline === "Ongoing" ? "text-green-600" : "text-orange-500"}>{scheme.deadline}</span></div>
                                    </div>
                                    <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium">
                                        Apply / Learn More <ExternalLink className="h-3 w-3" />
                                    </a>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
                <p className="mt-6 text-center text-xs text-muted-foreground">Scheme details are informational. Verify eligibility at official government portals.</p>
            </main>
            <Footer />
        </div>
    )
}
