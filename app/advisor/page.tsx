"use client"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, User, Sparkles } from "lucide-react"
import { diseaseDatabase } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    role: "user" | "bot"
    text: string
}

const suggestedQuestions = [
    "What causes early blight?",
    "How to treat powdery mildew?",
    "What is late blight?",
    "How to prevent root rot?",
    "Organic treatment for rust?",
    "What is fusarium wilt?",
]

const cropAdvice: Record<string, string> = {
    lemon: "🍋 **Lemon Growing Tips:**\n\n• **Small fruit size** is usually caused by lack of potassium or water stress. Apply K₂SO₄ (potassium sulphate) at 200g/tree.\n• Water deeply 2–3 times/week during fruiting season — irregular watering causes small, dry fruits.\n• Thin out excess fruitlets early (keep 1 fruit per 3–4 leaves) so the tree's energy focuses on fewer, larger fruits.\n• Spray 0.5% zinc sulphate + 0.25% boric acid during flowering for better fruit set.\n• Ensure full sun (6+ hours/day) and well-drained slightly acidic soil (pH 5.5–6.5).",
    tomato: "🍅 **Tomato Growing Tips:**\n\n• Space plants 45–60 cm apart for good airflow, reducing fungal risks.\n• Use calcium-rich fertilizers to prevent blossom end rot.\n• Stake or cage plants early — unsupported plants are prone to stem diseases.\n• Remove suckers (side shoots) weekly to focus energy on fruits.\n• Water consistently at the base — wet foliage causes Early & Late Blight.",
    potato: "🥔 **Potato Growing Tips:**\n\n• Plant certified seed potatoes to avoid soil-borne diseases.\n• Hill soil around stems as plants grow to prevent tuber greening.\n• Most common diseases: Late Blight (use Mancozeb spray), Early Blight, and Common Scab.\n• Harvest when foliage turns yellow — wait 2 weeks before digging for tougher skin.",
    wheat: "🌾 **Wheat Growing Tips:**\n\n• Optimum sowing time: Nov 1–25 for North India (rabi season).\n• Apply 120 kg N/ha in split doses — half at sowing, half at first irrigation.\n• Watch for Yellow Rust (Stripe Rust) in Feb–March; spray Propiconazole at first sign.\n• Ensure adequate boron and zinc micronutrients for good grain filling.",
    rice: "🌾 **Rice Growing Tips:**\n\n• Transplant seedlings 20–25 days old; maintain 2–3 cm standing water during vegetative stage.\n• Apply nitrogen in 3 splits: at transplanting, tillering, and panicle initiation.\n• Common threats: Blast disease (spray Tricyclazole), Brown Plant Hopper — monitor regularly.\n• Drain field 10 days before harvest for uniform ripening.",
    cotton: "🪴 **Cotton Growing Tips:**\n\n• Sow after soil temp reaches 20°C; use BT hybrid varieties for bollworm resistance.\n• Apply phosphorus at sowing and potassium during boll development.\n• Inspect for Whitefly and Bollworm weekly; excessive pesticide use causes resistance.\n• Avoid waterlogging — it causes root rot and wilting.",
    onion: "🧅 **Onion Growing Tips:**\n\n• Thrips is the main pest — spray Spinosad or Fipronil at first sign.\n• Apply potassium 3–4 weeks before harvest for larger, harder bulbs.\n• Reduce irrigation in final 2 weeks to prevent fungal neck rot.\n• Cure onions in shade with good airflow for 10–15 days before storage.",
    mango: "🥭 **Mango Growing Tips:**\n\n• Prune after harvest to maintain open canopy and reduce Anthracnose risk.\n• Spray KNO₃ (13:0:45) at 3% to induce uniform flowering in off-season.\n• Control Mango Hopper by spraying Imidacloprid at panicle emergence.\n• For small fruit, apply micronutrient sprays (Zn + B) at fruit set stage.",
    banana: "🍌 **Banana Growing Tips:**\n\n• Panama Wilt (Fusarium) is the biggest threat — use resistant varieties like Grand Naine.\n• Apply 200g K + 100g N per plant every 2 months.\n• Maintain proper drainage — banana is highly susceptible to root rot in waterlogged soil.\n• Remove old leaves and prop up bunches to prevent stem breakage.",
    sugarcane: "🎋 **Sugarcane Growing Tips:**\n\n• Use disease-free, healthy sets (setts) for planting.\n• Apply 250 kg N, 60 kg P, 60 kg K per hectare in split doses.\n• Control Top Borer by releasing Trichogramma parasitoid cards at 50,000/ha.\n• Harvest at 10–12 months when brix (sugar content) is maximum.",
    chilli: "🌶️ **Chilli / Green Chilli Growing Tips:**\n\n• Fruit set fails in temps above 35°C or below 15°C — time planting accordingly.\n• Thrips cause curling leaves; spray Spinosad or Acephate at first sign.\n• Anthracnose (red rot on fruits) — spray Carbendazim + Mancozeb combination.\n• Use drip irrigation with fertigation — reduces viral disease spread by insects.",
    mustard: "🌻 **Mustard Growing Tips:**\n\n• Sow by mid-October for Rabi season in North India.\n• White Rust is the main disease — spray Metalaxyl-Mancozeb at rosette stage.\n• Aphids attack in Jan–Feb; spray Dimethoate 30 EC at 1 ml/L water.\n• Ensure sulphur application (20 kg/ha) for oil content and flowering.",
    soybean: "🫘 **Soybean Growing Tips:**\n\n• Inoculate seeds with Rhizobium culture to fix nitrogen naturally.\n• Common diseases: Rust (spray Propiconazole), Bacterial Pustule, and Pod Borer.\n• Avoid early planting in wet soils — increases Pythium damping-off risk.\n• Harvest when 95% of pods turn brown.",
    maize: "🌽 **Maize (Corn) Growing Tips:**\n\n• Fall Armyworm is now a major threat — inspect whorl leaves and apply Chlorpyrifos.\n• Apply nitrogen in 3 splits for best yield; respond quickly to pale green color (N deficiency).\n• Water critical at tasseling and silking stages — drought then causes poor grain fill.\n• Downy Mildew: use metalaxyl-treated seed for prevention.",
    groundnut: "🥜 **Groundnut / Peanut Growing Tips:**\n\n• Leaf Spot and Rust are major diseases — spray Chlorothalonil at 45 and 65 days.\n• Aflatoxin contamination: harvest on time, dry quickly to below 9% moisture.\n• Apply gypsum (500 kg/ha) at pegging stage for good pod filling.\n• Inoculate with Rhizobium for nitrogen fixation.",
}

const symptomResponses: Array<{ keywords: string[]; response: string }> = [
    {
        keywords: ["small", "fruit", "size", "tiny", "little", "grow well", "growing well", "not growing", "small size"],
        response: "🔍 **Small Fruit Size — Common Causes & Fixes:**\n\n1. **Nutrient deficiency** — Lack of potassium (K) is the #1 cause. Apply potassium sulphate (SOP) at recommended dose.\n2. **Water stress** — Irregular watering during fruit development causes small, deformed fruits. Water consistently.\n3. **Overcrowding** — Too many fruits on the plant compete for nutrients. Thin out 20–30% of young fruits.\n4. **Poor pollination** — Hot, windy, or very cold weather can reduce pollinator activity.\n5. **Root problems** — Waterlogging or root rot limits nutrient uptake.\n\n💡 Tip: Tell me which crop you're growing (e.g. 'small lemon fruits') for crop-specific advice!"
    },
    {
        keywords: ["yellow", "yellowing", "pale", "light green", "chlorosis"],
        response: "🟡 **Yellowing Leaves — Diagnosis Guide:**\n\n• **Whole leaf yellow (older leaves first)** → Nitrogen deficiency. Apply urea/DAP immediately.\n• **Yellow between green veins (younger leaves)** → Iron or Manganese deficiency. Spray FeSO₄ or MnSO₄.\n• **Yellow with brown patches + wet weather** → Early Blight or Septoria Leaf Spot. Spray Mancozeb.\n• **Yellowing + wilting + vascular browning** → Fusarium/Verticillium Wilt — no chemical cure, remove infected plants.\n• **Pale yellow all over + stunted** → Root rot. Check drainage, treat with Metalaxyl.\n\n💡 Which crop and which leaves (old/new/all) are yellowing?"
    },
    {
        keywords: ["wilt", "wilting", "drooping", "droop", "falling", "collapse"],
        response: "🥀 **Wilting Crops — Possible Causes:**\n\n• **Midday temporary wilt** → Normal in heat. If plants recover by evening, they're fine — water in the morning.\n• **Permanent wilt (all day)** → Root rot from overwatering/poor drainage — treat with Metalaxyl drench.\n• **Sudden wilt + brown stem inside** → Fusarium Wilt or Bacterial Wilt — remove and destroy infected plants immediately.\n• **Leaves wilting + stem lesions** → Stem rot (Sclerotinia). Improve ventilation, spray Carbendazim.\n\n🔑 Key test: Cut the stem — if you see brown discoloration inside, it's a vascular disease."
    },
    {
        keywords: ["spot", "spots", "lesion", "lesions", "patch", "patches", "mark", "marks"],
        response: "🔵 **Leaf Spots — Identification Guide:**\n\n• **Brown spots with yellow halo (any crop)** → Early Blight (Alternaria). Spray Mancozeb 75 WP.\n• **Water-soaked dark spots, spreads fast in rain** → Late Blight. Spray Cymoxanil + Mancozeb immediately.\n• **White powdery patches** → Powdery Mildew. Spray Sulfur or Triadimefon.\n• **Orange/rust-colored pustules under leaf** → Rust disease. Spray Propiconazole.\n• **Tiny dark specks + yellowing** → Spider mites. Spray Abamectin or neem oil.\n\n💡 Share the crop name for more specific diagnosis!"
    },
    {
        keywords: ["curl", "curling", "curl up", "rolled", "rolling", "cupped"],
        response: "🌀 **Curling Leaves — Causes:**\n\n• **Upward rolling + silvery sheen** → Thrips damage. Spray Spinosad or Fipronil.\n• **Downward curling + sticky residue** → Aphid or Whitefly infestation. Spray Imidacloprid.\n• **Mosaic pattern + curling** → Viral disease (often spread by whiteflies). Remove affected plants.\n• **Curling in heat** → Drought stress. Water immediately and mulch to retain moisture.\n• **Curling new growth only** → Herbicide drift or copper/boron deficiency.\n\n🛡️ Early action on sucking pests prevents virus spread!"
    },
    {
        keywords: ["rot", "rotting", "decay", "black stem", "stem rot", "root rot", "collar rot"],
        response: "🍂 **Rot Diseases — Guide:**\n\n• **Root Rot (Pythium/Phytophthora)** → Caused by overwatering or poor drainage. Treat with Metalaxyl drench. Improve drainage.\n• **Stem/Collar Rot (Sclerotinia)** → White cottony growth at base. Apply Carbendazim + sand mixture at collar.\n• **Fruit Rot (Botrytis gray mold)** → Remove infected fruits immediately. Spray Iprodione.\n• **Storage Rot** → Harvest on time, cure properly, store in cool dry conditions.\n\n💧 Prevention: Never let water pool around plant bases!"
    },
    {
        keywords: ["pest", "insect", "bug", "worm", "caterpillar", "aphid", "whitefly", "mite", "thrips", "borer", "fly"],
        response: "🐛 **Pest Management Guide:**\n\n• **Aphids** (clusters of tiny insects) → Spray Imidacloprid 0.3 ml/L or neem oil 5 ml/L\n• **Whiteflies** (tiny white flies under leaves) → Yellow sticky traps + Thiamethoxam spray\n• **Thrips** (silvery streaks on leaves) → Spinosad 0.3 ml/L, remove crop debris\n• **Caterpillars/Borers** → BT (Bacillus thuringiensis) spray for organic; Chlorpyrifos for severe cases\n• **Spider Mites** (fine webbing, tiny dots) → Abamectin 1 ml/L or Dicofol spray\n• **Stem Borers** → Carbofuran granules in whorl (maize/sugarcane)\n\n🌿 Integrated Pest Management (IPM): Use pheromone traps, beneficial insects, and pesticides only when needed."
    },
    {
        keywords: ["fertiliz", "nutrient", "npk", "nitrogen", "phosphorus", "potassium", "urea", "dap", "feed", "manure"],
        response: "🌱 **Crop Fertilization Guide:**\n\n• **NPK basics:** N (nitrogen) = leaf/stem growth; P (phosphorus) = root & flower; K (potassium) = fruit size & resistance\n• **Deficiency signs:** Pale yellow plant = N; Purple tint = P; Leaf edge scorch = K\n• **General schedule:**\n  - At planting: Full P + K dose + 1/3 N\n  - 30 days: 1/3 N top-dress\n  - Flowering/fruiting: Final 1/3 N + extra K\n• **Micronutrients:** Spray Zinc (ZnSO₄ 0.5%), Boron (Borax 0.2%), Iron (FeSO₄ 0.5%) as foliar spray\n• **Organic:** FYM (Farm Yard Manure) 10 t/ha + Vermicompost 2 t/ha improves soil structure\n\n💡 Tell me your specific crop for tailored fertilizer recommendations!"
    },
    {
        keywords: ["ph", "acidic", "alkaline", "soil", "sandy", "clay", "loam", "drainage"],
        response: "🪨 **Soil Health Guide:**\n\n• **Ideal pH for most crops:** 6.0–7.0\n  - Acidic soil (pH < 6): Add agricultural lime (CaCO₃) — 1–2 t/ha\n  - Alkaline soil (pH > 7.5): Add gypsum or sulphur — 200 kg/ha\n• **Sandy soil:** Add organic matter (compost/FYM) to improve water retention\n• **Clay soil:** Add gypsum + sand to improve drainage and aeration\n• **Waterlogged fields:** Create raised beds or install drainage channels\n• **Saline soil:** Flood-leach with excess water, plant tolerant varieties\n\n🧪 Tip: Get a soil test every 2 years from your nearest Krishi Vigyan Kendra (KVK)!"
    },
    {
        keywords: ["weather", "rain", "humid", "humidity", "fog", "frost", "heat", "temperature", "cold", "winter", "summer"],
        response: "🌤️ **Weather & Crop Management:**\n\n• **After heavy rain:** Spray protective fungicide (Mancozeb) within 24 hours — humidity triggers fungal diseases\n• **Frost risk:** Cover young plants with straw/polythene; spray water just before frost to release latent heat\n• **High heat (35°C+):** Mulch soil to retain moisture; irrigate in evening; fruit set may fail above 38°C\n• **Fog/dew season:** Powdery Mildew and Late Blight risk spikes — increase monitoring\n• **Post-monsoon:** Drain waterlogged fields immediately to prevent root rot\n\n📅 Always check your local agro-advisory for crop-specific alerts!"
    },
    {
        keywords: ["harvest", "when to harvest", "ready", "ripe", "maturity", "picking"],
        response: "🌾 **Harvest Timing Guide:**\n\n• **Tomato:** Harvest when 70–80% red (ripen off vine if needed)\n• **Potato:** When foliage turns yellow; wait 2 weeks after vine death for skin set\n• **Onion:** When 50–60% tops fall naturally; cure for 15 days in shade\n• **Wheat/Rice:** When 85–90% grains are golden; cut at moisture 20–22%\n• **Chilli:** Green harvest at 65–70 days; red harvest at 90–100 days\n• **Mango:** Pressing the fruit — slightly soft with full color and fragrance\n\n💡 Harvesting too early or late reduces quality and shelf life!"
    },
    {
        keywords: ["organic", "natural", "bio", "neem", "home remedy", "without chemical", "eco"],
        response: "🌿 **Organic Farming Solutions:**\n\n• **Neem oil (5 ml/L):** Controls aphids, whiteflies, mites, and early fungal infections\n• **Trichoderma viride:** Mix in soil at 2.5 kg/ha — controls root rot, Fusarium, and damping-off\n• **Pseudomonas fluorescens:** Foliar spray for bacterial diseases\n• **Jeevamrit:** 10L cow dung + 10L cow urine + 2 kg jaggery + 2 kg gram flour in 200L water — activates soil microbes\n• **Panchagavya (3%):** Improves plant immunity and promotes growth\n• **Cow urine spray (10%):** Natural pesticide and growth promoter\n• **Sticky traps:** Yellow (whitefly, aphids), Blue (thrips), Pheromone (fruit flies)\n\n🌱 Organic methods work best when started early — prevention is better than cure!"
    },
]

function generateResponse(input: string): string {
    const q = input.toLowerCase().trim()

    // 1. Greetings
    if (/^(hello|hi|hey|hii|helo|namaste|good morning|good evening|good afternoon|how are you|what can you do|who are you)\b/.test(q)) {
        return "👋 **Hello! I'm CropGuard AI Advisor.**\n\nI can help you with:\n• 🌿 Crop-specific growing advice (tomato, lemon, wheat, rice, etc.)\n• 🔬 Disease diagnosis and treatment\n• 🐛 Pest identification and control\n• 💧 Irrigation and soil health\n• 🌾 Fertilizer and nutrition tips\n\nJust describe your problem naturally — like \"my tomato leaves are yellowing\" or \"lemon fruits are very small\" — and I'll help!"
    }

    // 2. Thanks / compliments
    if (/\b(thank|thanks|good|great|helpful|nice|awesome|perfect)\b/.test(q)) {
        return "😊 Happy to help! Feel free to ask any other farming question — I'm here whenever you need crop advice."
    }

    // 3. Crop-specific context + symptom (e.g., "lemon are very small growing well")
    for (const [cropKey, advice] of Object.entries(cropAdvice)) {
        if (q.includes(cropKey)) {
            // Check for any symptom keyword too
            const symptomMatch = symptomResponses.find(s =>
                s.keywords.some(k => q.includes(k))
            )
            if (symptomMatch) {
                // Give both: symptom answer + crop-specific tip
                return symptomMatch.response + `\n\n---\n${advice}`
            }
            // Just crop name mentioned — give the full crop guide
            return advice
        }
    }

    // 4. Symptom-only match (no specific crop named)
    for (const symptom of symptomResponses) {
        if (symptom.keywords.some(k => q.includes(k))) {
            return symptom.response
        }
    }

    // 5. Disease database match
    for (const [disease, data] of Object.entries(diseaseDatabase)) {
        const key = disease.toLowerCase()
        if (q.includes(key) || key.split(" ").some(w => w.length > 3 && q.includes(w))) {
            if (q.includes("cause") || q.includes("why") || q.includes("reason")) {
                return `🔬 **${disease} — Causes:**\n\n${data.causes}`
            }
            if (q.includes("organic") || q.includes("natural") || q.includes("home")) {
                return `🌿 **${disease} — Organic Treatment:**\n\n${data.organic}`
            }
            if (q.includes("chemical") || q.includes("fungicide") || q.includes("spray") || q.includes("pesticide")) {
                return `💊 **${disease} — Chemical Treatment:**\n\n${data.chemical}`
            }
            if (q.includes("treat") || q.includes("cure") || q.includes("fix") || q.includes("control") || q.includes("prevent")) {
                return `💊 **${disease} — Treatment Options:**\n\n🌿 **Organic:** ${data.organic}\n\n💊 **Chemical:** ${data.chemical}`
            }
            return `ℹ️ **${disease}:**\n\n${data.info}\n\n**Causes:** ${data.causes}\n\n💊 **Treatment:** ${data.chemical}`
        }
    }

    // 6. General topic catch-alls
    if (/\b(water|irrigat|drip|sprinkler)\b/.test(q)) {
        return "💧 **Irrigation Guide:**\n\nAvoid overhead irrigation — wet foliage promotes fungal diseases like Blight and Mildew.\n\n• **Drip irrigation** is best for vegetables — delivers water at root zone\n• Water early morning so leaves dry by afternoon\n• Waterlogged soil causes Root Rot — ensure proper drainage\n• During fruiting, keep consistent moisture to prevent blossom-end rot and cracking\n\n💡 Mulching with straw or plastic reduces water needs by 30–40%."
    }
    if (/\b(spray|spraying|schedule|program)\b/.test(q)) {
        return "📅 **Spray Schedule for Healthy Crops:**\n\n• **Preventive:** Spray Mancozeb or Copper Oxychloride every 10–14 days in humid/rainy season\n• **After rain:** Always spray fungicide within 24–48 hours of heavy rain\n• **Insecticide:** Rotate between chemical classes to prevent resistance\n• **Avoid spraying:** In midday heat (causes leaf burn), or just before rain\n• **Best time to spray:** Early morning or evening when temperature is below 30°C\n\n🌿 Switch to neem oil (5 ml/L) every 3rd spray to reduce pesticide load."
    }

    // 7. Catch-all — extract any crop/keyword from the question and give a helpful answer
    const knownCrops = ["tomato", "potato", "wheat", "rice", "cotton", "onion", "maize", "corn", "mango", "banana",
        "lemon", "orange", "chilli", "pepper", "soybean", "chickpea", "mustard", "groundnut", "sugarcane"]
    const foundCrop = knownCrops.find(c => q.includes(c))
    if (foundCrop && cropAdvice[foundCrop]) {
        return cropAdvice[foundCrop]
    }

    return "🤔 **I need a bit more detail to help you.**\n\nHere are some ways to ask me questions:\n\n• **Disease:** 'What is late blight?' or 'How to treat powdery mildew?'\n• **Symptom:** 'My tomato leaves are yellowing' or 'Wheat has orange spots'\n• **Crop advice:** 'How to grow lemons?' or 'Potato growing tips'\n• **Pests:** 'How to control aphids on chilli?'\n• **Soil/Water:** 'How often to water tomatoes?'\n\nDescribe what you're seeing in your field and I'll do my best to diagnose it!"
}


export default function AdvisorPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "init",
            role: "bot",
            text: "👋 Hi! I'm the CropGuard AI Advisor. Ask me anything about crop diseases, symptoms, treatments, or prevention!\n\nTry one of the quick questions below or type your own.",
        },
    ])
    const [input, setInput] = useState("")
    const [typing, setTyping] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, typing])

    function sendMessage(text: string) {
        if (!text.trim()) return
        const userMsg: Message = { id: Date.now().toString(), role: "user", text }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setTyping(true)
        setTimeout(() => {
            const botMsg: Message = { id: (Date.now() + 1).toString(), role: "bot", text: generateResponse(text) }
            setMessages(prev => [...prev, botMsg])
            setTyping(false)
        }, 900)
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
                <div className="mb-6">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                        <Sparkles className="h-7 w-7 text-primary" />
                        Expert AI Advisor
                    </h1>
                    <p className="mt-1 text-muted-foreground">Ask questions about crop diseases, treatments, and prevention</p>
                </div>

                <Card className="border-border mb-4">
                    <CardHeader className="pb-2 border-b border-border">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Bot className="h-4 w-4 text-primary" />
                            CropGuard AI Advisor
                            <Badge className="ml-auto bg-green-600 text-white text-[10px]">Online</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Chat window */}
                        <div className="flex flex-col gap-3 h-[420px] overflow-y-auto p-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={cn("flex gap-2 max-w-[85%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}>
                                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", msg.role === "bot" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                        {msg.role === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                    </div>
                                    <div className={cn("rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap", msg.role === "bot" ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm")}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {typing && (
                                <div className="flex gap-2 max-w-[85%]">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Suggested questions */}
                        <div className="border-t border-border px-4 py-3">
                            <p className="mb-2 text-xs text-muted-foreground font-medium">Suggested questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedQuestions.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => sendMessage(q)}
                                        className="rounded-full border border-border px-3 py-1 text-xs text-foreground hover:bg-muted hover:border-primary/50 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="border-t border-border p-4 flex gap-2">
                            <Input
                                placeholder="Type your question here..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                                className="flex-1"
                            />
                            <Button onClick={() => sendMessage(input)} disabled={!input.trim() || typing} size="icon" className="bg-primary text-primary-foreground shrink-0">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
