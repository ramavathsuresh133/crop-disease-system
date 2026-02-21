export interface User {
  id: string
  name: string
  email: string
  location: { lat: number; lng: number }
  cropTypes: string[]
  region: string
  createdAt: string
}

export interface Detection {
  id: string
  userId: string
  imageUrl: string
  cropType: string
  diseaseName: string
  confidence: number
  severity: "low" | "medium" | "high"
  treatment: string
  location: { lat: number; lng: number }
  createdAt: string
}

export interface Alert {
  id: string
  diseaseName: string
  cropType: string
  region: string
  severity: "low" | "medium" | "high"
  reportedBy: string
  location: { lat: number; lng: number }
  imageUrl?: string
  createdAt: string
}

export const currentUser: User = {
  id: "u1",
  name: "Rajesh Kumar",
  email: "rajesh@cropguard.com",
  location: { lat: 28.6139, lng: 77.209 },
  cropTypes: ["Tomato", "Potato", "Wheat"],
  region: "North India",
  createdAt: "2025-06-15T10:00:00Z",
}

export const cropTypes = [
  // Vegetables
  "Tomato",
  "Potato",
  "Pepper",
  "Eggplant",
  "Onion",
  "Garlic",
  "Cabbage",
  "Cauliflower",
  "Spinach",
  "Brinjal",
  "Okra",
  "Green Chilli",
  "Bitter Gourd",
  "Bottle Gourd",
  "Ridge Gourd",
  "Pumpkin",
  // Grains & Cereals
  "Wheat",
  "Rice",
  "Corn",
  "Maize",
  "Barley",
  "Sorghum",
  "Millet",
  "Oats",
  // Fruits
  "Apple",
  "Grape",
  "Strawberry",
  "Mango",
  "Banana",
  "Orange",
  "Lemon",
  "Papaya",
  "Guava",
  "Pomegranate",
  "Watermelon",
  "Cucumber",
  // Pulses & Legumes
  "Soybean",
  "Chickpea",
  "Lentil",
  "Black Gram",
  "Green Gram",
  "Pigeon Pea",
  "Peanut",
  // Cash Crops
  "Sugarcane",
  "Cotton",
  "Jute",
  "Tobacco",
  "Tea",
  "Coffee",
  // Oilseeds
  "Mustard",
  "Sunflower",
  "Sesame",
  "Castor",
]

export const diseaseDatabase: Record<
  string,
  { causes: string; organic: string; chemical: string; info: string }
> = {
  "Early Blight": {
    causes:
      "Caused by the fungus Alternaria solani. Thrives in warm, humid conditions with temperatures between 24-29 C.",
    organic:
      "Apply neem oil spray weekly. Use copper-based fungicides. Practice crop rotation with non-solanaceous crops.",
    chemical:
      "Apply chlorothalonil or mancozeb-based fungicides at 7-10 day intervals. Azoxystrobin can also be effective.",
    info: "Early blight affects leaves, stems, and fruit. Look for dark, concentric ring-shaped lesions on lower leaves first.",
  },
  "Late Blight": {
    causes:
      "Caused by the oomycete Phytophthora infestans. Spreads rapidly in cool, wet weather (10-25 C).",
    organic:
      "Remove and destroy infected plants immediately. Apply copper hydroxide sprays. Ensure good air circulation.",
    chemical:
      "Use metalaxyl or dimethomorph-based fungicides. Apply preventively before symptoms appear in favorable conditions.",
    info: "Late blight can destroy entire fields within days. It caused the Irish Potato Famine. Water-soaked lesions appear on leaves.",
  },
  "Leaf Mold": {
    causes:
      "Caused by the fungus Passalora fulva (formerly Cladosporium fulvum). Favored by high humidity (>85%) and warm temperatures.",
    organic:
      "Improve ventilation in greenhouses. Remove infected leaves. Apply Bacillus subtilis-based biocontrol agents.",
    chemical:
      "Apply chlorothalonil or copper-based fungicides. Rotate fungicide classes to prevent resistance.",
    info: "Leaf mold primarily affects greenhouse tomatoes. Pale green to yellow spots appear on upper leaf surfaces.",
  },
  "Bacterial Spot": {
    causes:
      "Caused by Xanthomonas species bacteria. Spreads through contaminated seeds, transplants, and splashing water.",
    organic:
      "Use disease-free seeds and transplants. Apply copper sprays at first sign. Remove heavily infected plants.",
    chemical:
      "Copper hydroxide + mancozeb provides good control. Streptomycin can be used on seedlings.",
    info: "Bacterial spot causes small, water-soaked spots on leaves, stems, and fruit. It reduces marketable yield significantly.",
  },
  "Powdery Mildew": {
    causes:
      "Caused by various fungal species. Unlike most fungi, thrives in dry conditions with moderate temperatures.",
    organic:
      "Apply milk spray (1:10 ratio) or baking soda solution. Improve air circulation. Remove infected leaves.",
    chemical:
      "Apply sulfur-based fungicides or myclobutanil. Trifloxystrobin is effective for severe cases.",
    info: "White powdery coating appears on leaf surfaces. It reduces photosynthesis and can lead to premature leaf drop.",
  },
  Healthy: {
    causes: "No disease detected. Your crop appears healthy.",
    organic:
      "Continue good agricultural practices. Maintain proper irrigation and nutrition.",
    chemical:
      "No chemical treatment needed. Consider preventive applications during high-risk seasons.",
    info: "Regular monitoring helps catch diseases early. Keep inspecting your crops weekly for any signs of stress.",
  },
  "Rust": {
    causes:
      "Caused by various Puccinia fungal species. Spreads through wind-borne spores. Thrives in warm temperatures (15-25°C) with high humidity.",
    organic:
      "Remove infected plant parts immediately. Apply sulfur-based fungicides. Use neem oil spray as a preventive measure.",
    chemical:
      "Apply propiconazole or tebuconazole-based fungicides. Repeat applications every 10-14 days during high-risk periods.",
    info: "Rust appears as orange, yellow, brown, or reddish pustules on leaves and stems. Severely affects wheat, corn, and soybean yields.",
  },
  "Anthracnose": {
    causes:
      "Caused by Colletotrichum species fungi. Favored by warm (25-30°C), humid conditions. Spreads through infected plant debris and splashing water.",
    organic:
      "Remove and destroy infected plant debris. Apply copper-based fungicides. Use hot-water seed treatment before planting.",
    chemical:
      "Apply mancozeb or azoxystrobin-based fungicides. Treat seeds with thiram before planting.",
    info: "Anthracnose causes dark, sunken lesions on leaves, stems, fruits, and seeds. It is a major post-harvest disease affecting mango, grapes, and strawberries.",
  },
  "Downy Mildew": {
    causes:
      "Caused by oomycete pathogens like Plasmopara and Peronospora species. Thrives in cool, wet conditions with temperatures between 15-20°C.",
    organic:
      "Improve air circulation. Remove infected plants. Apply copper hydroxide sprays. Avoid overhead irrigation.",
    chemical:
      "Use metalaxyl, mefenoxam, or cymoxanil-based fungicides. Apply as a preventive spray during cool, wet weather.",
    info: "Downy mildew produces a grayish-purple fuzzy growth on the underside of leaves. It can destroy entire grape vineyards and cucumber crops within a week.",
  },
  "Fusarium Wilt": {
    causes:
      "Caused by Fusarium oxysporum soil-borne fungi. Enters through roots and spreads through the vascular system. Survives in soil for years.",
    organic:
      "Use resistant varieties. Solarize soil before planting. Apply Trichoderma-based biocontrol agents. Practice long crop rotations.",
    chemical:
      "Drench soil with fungicide before planting. Apply carbendazim or thiophanate-methyl. Note: no cure once plant is infected.",
    info: "Fusarium Wilt causes yellowing and wilting of leaves, often on one side first. It blocks water transport in the plant. Major threat to tomatoes, bananas, and cotton.",
  },
  "Root Rot": {
    causes:
      "Caused by multiple pathogens (Pythium, Phytophthora, Rhizoctonia). Associated with waterlogged, poorly drained soil and excessive moisture.",
    organic:
      "Improve soil drainage. Avoid overwatering. Apply Trichoderma viride to soil. Use raised beds in susceptible areas.",
    chemical:
      "Apply metalaxyl or mefenoxam drenches. Treat seeds with captan or thiram before planting.",
    info: "Root rot causes stunted growth, yellowing leaves, and rotted brown roots. It is most destructive in waterlogged soils and affects nearly all crops.",
  },
}

export const mockDetections: Detection[] = [
  {
    id: "d1",
    userId: "u1",
    imageUrl: "/placeholder-tomato-leaf.jpg",
    cropType: "Tomato",
    diseaseName: "Early Blight",
    confidence: 94.5,
    severity: "high",
    treatment:
      "Apply copper-based fungicide. Remove affected leaves. Ensure proper spacing.",
    location: { lat: 28.6139, lng: 77.209 },
    createdAt: "2026-02-17T14:30:00Z",
  },
  {
    id: "d2",
    userId: "u1",
    imageUrl: "/placeholder-potato-leaf.jpg",
    cropType: "Potato",
    diseaseName: "Late Blight",
    confidence: 89.2,
    severity: "high",
    treatment:
      "Apply metalaxyl-based fungicide immediately. Remove and destroy infected plants.",
    location: { lat: 28.5355, lng: 77.391 },
    createdAt: "2026-02-16T09:15:00Z",
  },
  {
    id: "d3",
    userId: "u1",
    imageUrl: "/placeholder-tomato-healthy.jpg",
    cropType: "Tomato",
    diseaseName: "Healthy",
    confidence: 97.8,
    severity: "low",
    treatment: "No treatment needed. Continue regular monitoring.",
    location: { lat: 28.6139, lng: 77.209 },
    createdAt: "2026-02-15T11:45:00Z",
  },
  {
    id: "d4",
    userId: "u1",
    imageUrl: "/placeholder-wheat-leaf.jpg",
    cropType: "Wheat",
    diseaseName: "Powdery Mildew",
    confidence: 86.3,
    severity: "medium",
    treatment:
      "Apply sulfur-based fungicide. Improve air circulation between rows.",
    location: { lat: 28.7041, lng: 77.1025 },
    createdAt: "2026-02-14T16:20:00Z",
  },
  {
    id: "d5",
    userId: "u1",
    imageUrl: "/placeholder-tomato-leaf-2.jpg",
    cropType: "Tomato",
    diseaseName: "Leaf Mold",
    confidence: 91.1,
    severity: "medium",
    treatment:
      "Reduce humidity in greenhouse. Apply chlorothalonil fungicide.",
    location: { lat: 28.4595, lng: 77.0266 },
    createdAt: "2026-02-13T08:00:00Z",
  },
]

export const mockAlerts: Alert[] = [
  {
    id: "a1",
    diseaseName: "Early Blight",
    cropType: "Tomato",
    region: "North India",
    severity: "high",
    reportedBy: "Rajesh Kumar",
    location: { lat: 28.6139, lng: 77.209 },
    createdAt: "2026-02-17T14:30:00Z",
  },
  {
    id: "a2",
    diseaseName: "Late Blight",
    cropType: "Potato",
    region: "North India",
    severity: "high",
    reportedBy: "Priya Sharma",
    location: { lat: 28.5355, lng: 77.391 },
    createdAt: "2026-02-17T12:00:00Z",
  },
  {
    id: "a3",
    diseaseName: "Powdery Mildew",
    cropType: "Wheat",
    region: "North India",
    severity: "medium",
    reportedBy: "Amit Patel",
    location: { lat: 28.7041, lng: 77.1025 },
    createdAt: "2026-02-16T18:45:00Z",
  },
  {
    id: "a4",
    diseaseName: "Bacterial Spot",
    cropType: "Tomato",
    region: "North India",
    severity: "medium",
    reportedBy: "Suresh Reddy",
    location: { lat: 28.3949, lng: 77.318 },
    createdAt: "2026-02-16T10:30:00Z",
  },
  {
    id: "a5",
    diseaseName: "Leaf Mold",
    cropType: "Tomato",
    region: "North India",
    severity: "low",
    reportedBy: "Geeta Devi",
    location: { lat: 28.4595, lng: 77.0266 },
    createdAt: "2026-02-15T15:20:00Z",
  },
  {
    id: "a6",
    diseaseName: "Early Blight",
    cropType: "Potato",
    region: "North India",
    severity: "high",
    reportedBy: "Vikram Singh",
    location: { lat: 28.88, lng: 77.09 },
    createdAt: "2026-02-15T09:00:00Z",
  },
  {
    id: "a7",
    diseaseName: "Powdery Mildew",
    cropType: "Grape",
    region: "North India",
    severity: "medium",
    reportedBy: "Anita Kumari",
    location: { lat: 28.67, lng: 77.35 },
    createdAt: "2026-02-14T14:10:00Z",
  },
  {
    id: "a8",
    diseaseName: "Late Blight",
    cropType: "Tomato",
    region: "North India",
    severity: "high",
    reportedBy: "Mohan Das",
    location: { lat: 28.52, lng: 77.15 },
    createdAt: "2026-02-14T07:30:00Z",
  },
]

export const mapMarkers = [
  {
    id: "m1",
    lat: 28.6139,
    lng: 77.209,
    disease: "Early Blight",
    crop: "Tomato",
    severity: "high" as const,
    farmer: "Rajesh Kumar",
    date: "Feb 17, 2026",
  },
  {
    id: "m2",
    lat: 28.5355,
    lng: 77.391,
    disease: "Late Blight",
    crop: "Potato",
    severity: "high" as const,
    farmer: "Priya Sharma",
    date: "Feb 17, 2026",
  },
  {
    id: "m3",
    lat: 28.7041,
    lng: 77.1025,
    disease: "Powdery Mildew",
    crop: "Wheat",
    severity: "medium" as const,
    farmer: "Amit Patel",
    date: "Feb 16, 2026",
  },
  {
    id: "m4",
    lat: 28.3949,
    lng: 77.318,
    disease: "Bacterial Spot",
    crop: "Tomato",
    severity: "medium" as const,
    farmer: "Suresh Reddy",
    date: "Feb 16, 2026",
  },
  {
    id: "m5",
    lat: 28.4595,
    lng: 77.0266,
    disease: "Leaf Mold",
    crop: "Tomato",
    severity: "low" as const,
    farmer: "Geeta Devi",
    date: "Feb 15, 2026",
  },
  {
    id: "m6",
    lat: 28.88,
    lng: 77.09,
    disease: "Early Blight",
    crop: "Potato",
    severity: "high" as const,
    farmer: "Vikram Singh",
    date: "Feb 15, 2026",
  },
  {
    id: "m7",
    lat: 28.67,
    lng: 77.35,
    disease: "Healthy",
    crop: "Grape",
    severity: "low" as const,
    farmer: "Anita Kumari",
    date: "Feb 14, 2026",
  },
  {
    id: "m8",
    lat: 28.52,
    lng: 77.15,
    disease: "Healthy",
    crop: "Rice",
    severity: "low" as const,
    farmer: "Mohan Das",
    date: "Feb 14, 2026",
  },
]

// ── Analytics Data ─────────────────────────────────────────────
export const analyticsMonthly = [
  { month: "Sep", scans: 12, healthy: 8, diseased: 4 },
  { month: "Oct", scans: 18, healthy: 11, diseased: 7 },
  { month: "Nov", scans: 24, healthy: 15, diseased: 9 },
  { month: "Dec", scans: 20, healthy: 14, diseased: 6 },
  { month: "Jan", scans: 31, healthy: 19, diseased: 12 },
  { month: "Feb", scans: 27, healthy: 18, diseased: 9 },
]

export const analyticsByDisease = [
  { name: "Early Blight", count: 18, fill: "#ef4444" },
  { name: "Late Blight", count: 14, fill: "#f97316" },
  { name: "Powdery Mildew", count: 11, fill: "#eab308" },
  { name: "Leaf Mold", count: 8, fill: "#84cc16" },
  { name: "Bacterial Spot", count: 6, fill: "#06b6d4" },
  { name: "Healthy", count: 75, fill: "#16a34a" },
]

export const analyticsByCrop = [
  { crop: "Tomato", count: 38 },
  { crop: "Potato", count: 24 },
  { crop: "Wheat", count: 20 },
  { crop: "Rice", count: 14 },
  { crop: "Cotton", count: 10 },
  { crop: "Maize", count: 6 },
]

// ── Seasonal Disease Forecast ─────────────────────────────────
export interface WeekForecast {
  week: string
  dateRange: string
  risks: { disease: string; crop: string; level: "high" | "medium" | "low" }[]
  tip: string
}

export const seasonalForecast: WeekForecast[] = [
  {
    week: "This Week",
    dateRange: "Feb 20 - Feb 26",
    risks: [
      { disease: "Late Blight", crop: "Potato", level: "high" },
      { disease: "Powdery Mildew", crop: "Wheat", level: "medium" },
      { disease: "Leaf Mold", crop: "Tomato", level: "low" },
    ],
    tip: "Apply preventive fungicide on potato crops. Keep field humidity low. Inspect wheat rows for white powder patches.",
  },
  {
    week: "Week 2",
    dateRange: "Feb 27 - Mar 5",
    risks: [
      { disease: "Early Blight", crop: "Tomato", level: "high" },
      { disease: "Rust", crop: "Wheat", level: "medium" },
      { disease: "Downy Mildew", crop: "Grape", level: "medium" },
    ],
    tip: "Temperatures rising - ideal for Early Blight. Apply copper-based sprays on tomato. Check grape leaves for grey fuzz underneath.",
  },
  {
    week: "Week 3",
    dateRange: "Mar 6 - Mar 12",
    risks: [
      { disease: "Bacterial Spot", crop: "Pepper", level: "high" },
      { disease: "Anthracnose", crop: "Mango", level: "medium" },
      { disease: "Fusarium Wilt", crop: "Cotton", level: "low" },
    ],
    tip: "Use disease-free transplants for pepper. Avoid overhead irrigation. Monitor mango fruits for dark sunken spots.",
  },
  {
    week: "Week 4",
    dateRange: "Mar 13 - Mar 19",
    risks: [
      { disease: "Root Rot", crop: "Soybean", level: "medium" },
      { disease: "Powdery Mildew", crop: "Cucumber", level: "medium" },
      { disease: "Rust", crop: "Maize", level: "low" },
    ],
    tip: "Avoid waterlogging in soybean fields. Improve air circulation around cucumber plants.",
  },
]

// ── Community Reports ─────────────────────────────────────────
export interface CommunityReport {
  id: string
  farmer: string
  region: string
  cropType: string
  diseaseName: string
  severity: "low" | "medium" | "high"
  description: string
  upvotes: number
  createdAt: string
}

export const mockCommunityReports: CommunityReport[] = [
  {
    id: "cr1",
    farmer: "Rajesh Kumar",
    region: "North India",
    cropType: "Tomato",
    diseaseName: "Early Blight",
    severity: "high",
    description: "Found dark concentric ring lesions on the lower leaves of my tomato crop. Spread to 30% of plants in 3 days. Copper fungicide is slowing it down.",
    upvotes: 24,
    createdAt: "2026-02-18T09:30:00Z",
  },
  {
    id: "cr2",
    farmer: "Priya Sharma",
    region: "Punjab",
    cropType: "Wheat",
    diseaseName: "Rust",
    severity: "medium",
    description: "Orange pustules appearing on wheat stems and leaves. About 15% of my 5-acre field is affected. Applied propiconazole spray yesterday.",
    upvotes: 18,
    createdAt: "2026-02-17T14:00:00Z",
  },
  {
    id: "cr3",
    farmer: "Amit Patel",
    region: "Gujarat",
    cropType: "Cotton",
    diseaseName: "Fusarium Wilt",
    severity: "high",
    description: "Cotton plants yellowing on one side of the stem first, then wilting completely. Lost about 20 plants so far.",
    upvotes: 31,
    createdAt: "2026-02-16T11:20:00Z",
  },
  {
    id: "cr4",
    farmer: "Geeta Devi",
    region: "Haryana",
    cropType: "Potato",
    diseaseName: "Late Blight",
    severity: "high",
    description: "Water-soaked dark lesions on potato leaves turning brown fast. Very humid this week. Sprayed metalaxyl immediately.",
    upvotes: 42,
    createdAt: "2026-02-15T17:45:00Z",
  },
  {
    id: "cr5",
    farmer: "Suresh Reddy",
    region: "Andhra Pradesh",
    cropType: "Rice",
    diseaseName: "Bacterial Spot",
    severity: "medium",
    description: "Small water-soaked spots on rice leaves turning yellow with brown centers. Fields near the canal most affected.",
    upvotes: 12,
    createdAt: "2026-02-14T08:00:00Z",
  },
  {
    id: "cr6",
    farmer: "Mohan Das",
    region: "West Bengal",
    cropType: "Mustard",
    diseaseName: "Downy Mildew",
    severity: "low",
    description: "Grey-purple fuzzy growth on underside of mustard leaves. Caught early with only 5% affected. Improved drainage.",
    upvotes: 9,
    createdAt: "2026-02-13T13:30:00Z",
  },
]

// ── Notifications ─────────────────────────────────────────────
export interface Notification {
  id: string
  type: "alert" | "tip" | "system"
  title: string
  message: string
  createdAt: string
  read?: boolean
}

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "alert",
    title: "High Severity Alert: Late Blight Detected",
    message: "Late Blight has been reported by 3 farmers in your region (North India) in the last 24 hours. Take preventive action on Potato crops immediately.",
    createdAt: "2026-02-20T12:00:00Z",
  },
  {
    id: "n2",
    type: "alert",
    title: "Early Blight Spreading in Punjab",
    message: "Early Blight on Tomato has been reported across 5 districts in Punjab. Apply copper-based fungicide as a preventive measure.",
    createdAt: "2026-02-20T08:30:00Z",
  },
  {
    id: "n3",
    type: "tip",
    title: "Tip: Best Time to Spray Fungicide",
    message: "Spray fungicides in the early morning or evening to reduce evaporation and improve effectiveness. Avoid spraying during windy conditions.",
    createdAt: "2026-02-19T07:00:00Z",
  },
  {
    id: "n4",
    type: "system",
    title: "CropGuard AI Model Updated",
    message: "Our disease detection model has been updated with 2,500 new training images for Rust, Anthracnose, and Downy Mildew. Accuracy improved to 96.3%.",
    createdAt: "2026-02-18T14:00:00Z",
  },
  {
    id: "n5",
    type: "tip",
    title: "Weekly Crop Health Tip",
    message: "Practice crop rotation every season to break disease cycles in soil. Avoid planting the same crop family in the same field consecutively.",
    createdAt: "2026-02-18T09:00:00Z",
  },
  {
    id: "n6",
    type: "alert",
    title: "Powdery Mildew Risk: High Humidity Alert",
    message: "Humidity levels above 85% forecast for the next 3 days in Haryana. High risk for Powdery Mildew on Wheat. Monitor crop closely.",
    createdAt: "2026-02-17T16:00:00Z",
  },
  {
    id: "n7",
    type: "system",
    title: "New Feature: Farm Journal",
    message: "You can now log daily farm observations, treatment records, and weather notes using the new Farm Journal feature. Find it in the More menu.",
    createdAt: "2026-02-17T10:00:00Z",
  },
  {
    id: "n8",
    type: "tip",
    title: "Irrigation Tip: Prevent Root Rot",
    message: "Avoid overwatering your crops. Waterlogged soil is the primary cause of Root Rot. Ensure proper field drainage before the rainy season.",
    createdAt: "2026-02-16T08:00:00Z",
  },
  {
    id: "n9",
    type: "alert",
    title: "Community Report: Rust on Wheat",
    message: "A new community report of Rust outbreak has been submitted from Punjab region. Wheat farmers are advised to inspect their fields.",
    createdAt: "2026-02-15T14:30:00Z",
  },
  {
    id: "n10",
    type: "system",
    title: "Welcome to CropGuard!",
    message: "Your account is set up. Upload a crop image to detect diseases instantly, explore the community, and set up your crop preferences in Profile.",
    createdAt: "2026-02-15T10:00:00Z",
  },
]

// ── Market Prices ──────────────────────────────────────────────
export interface MarketPrice {
  crop: string
  price: number      // ₹ per quintal
  change: number     // amount change vs yesterday
  trend: "up" | "down" | "stable"
  unit: string
  history: number[]  // last 7 days prices
  market: string
}

export const mockMarketPrices: MarketPrice[] = [
  // ── Grains & Cereals ───────────────────────────────────────
  { crop: "Wheat", price: 2275, change: 25, trend: "up", unit: "₹/quintal", history: [2200, 2210, 2230, 2225, 2245, 2250, 2275], market: "Azadpur Mandi" },
  { crop: "Rice", price: 2180, change: -15, trend: "down", unit: "₹/quintal", history: [2220, 2210, 2200, 2195, 2190, 2195, 2180], market: "Patna Mandi" },
  { crop: "Maize", price: 1780, change: -10, trend: "down", unit: "₹/quintal", history: [1800, 1795, 1790, 1788, 1785, 1790, 1780], market: "Gulbarga Mandi" },
  { crop: "Barley", price: 1650, change: 20, trend: "up", unit: "₹/quintal", history: [1600, 1610, 1620, 1630, 1635, 1640, 1650], market: "Jaipur Mandi" },
  { crop: "Corn", price: 1820, change: 15, trend: "up", unit: "₹/quintal", history: [1770, 1780, 1790, 1800, 1805, 1810, 1820], market: "Nizamabad Mandi" },
  { crop: "Sorghum", price: 2900, change: 0, trend: "stable", unit: "₹/quintal", history: [2890, 2900, 2905, 2898, 2900, 2900, 2900], market: "Solapur Mandi" },
  // ── Vegetables ─────────────────────────────────────────────
  { crop: "Tomato", price: 1850, change: 120, trend: "up", unit: "₹/quintal", history: [1500, 1580, 1650, 1700, 1730, 1730, 1850], market: "Azadpur Mandi" },
  { crop: "Potato", price: 1200, change: -30, trend: "down", unit: "₹/quintal", history: [1280, 1270, 1250, 1240, 1230, 1230, 1200], market: "Agra Mandi" },
  { crop: "Onion", price: 2050, change: 0, trend: "stable", unit: "₹/quintal", history: [2040, 2055, 2060, 2045, 2050, 2050, 2050], market: "Lasalgaon Mandi" },
  { crop: "Cabbage", price: 950, change: -20, trend: "down", unit: "₹/quintal", history: [1010, 1000, 990, 980, 970, 960, 950], market: "Azadpur Mandi" },
  { crop: "Cauliflower", price: 1100, change: 40, trend: "up", unit: "₹/quintal", history: [1010, 1030, 1050, 1060, 1070, 1080, 1100], market: "Pune Mandi" },
  { crop: "Okra", price: 1450, change: 30, trend: "up", unit: "₹/quintal", history: [1380, 1390, 1400, 1410, 1420, 1440, 1450], market: "Chennai Mandi" },
  { crop: "Green Chilli", price: 3200, change: 80, trend: "up", unit: "₹/quintal", history: [2900, 2980, 3050, 3100, 3120, 3150, 3200], market: "Guntur Mandi" },
  // ── Pulses & Legumes ───────────────────────────────────────
  { crop: "Chickpea", price: 5100, change: 0, trend: "stable", unit: "₹/quintal", history: [5090, 5100, 5105, 5098, 5100, 5100, 5100], market: "Akola Mandi" },
  { crop: "Soybean", price: 4450, change: 80, trend: "up", unit: "₹/quintal", history: [4300, 4320, 4360, 4380, 4400, 4370, 4450], market: "Indore Mandi" },
  { crop: "Green Gram", price: 7200, change: 100, trend: "up", unit: "₹/quintal", history: [7000, 7050, 7080, 7100, 7130, 7150, 7200], market: "Mumbai Mandi" },
  { crop: "Black Gram", price: 6800, change: -50, trend: "down", unit: "₹/quintal", history: [6900, 6880, 6860, 6840, 6820, 6850, 6800], market: "Nagpur Mandi" },
  { crop: "Pigeon Pea", price: 6500, change: 50, trend: "up", unit: "₹/quintal", history: [6350, 6380, 6400, 6420, 6450, 6470, 6500], market: "Gwalior Mandi" },
  { crop: "Lentil", price: 5800, change: 0, trend: "stable", unit: "₹/quintal", history: [5790, 5800, 5805, 5798, 5800, 5800, 5800], market: "Bhopal Mandi" },
  // ── Cash Crops ─────────────────────────────────────────────
  { crop: "Cotton", price: 6800, change: 150, trend: "up", unit: "₹/quintal", history: [6500, 6550, 6600, 6650, 6700, 6650, 6800], market: "Rajkot Mandi" },
  { crop: "Sugarcane", price: 315, change: 5, trend: "up", unit: "₹/quintal", history: [305, 307, 308, 310, 312, 310, 315], market: "UP SAP Rate" },
  { crop: "Jute", price: 5300, change: -30, trend: "down", unit: "₹/quintal", history: [5380, 5370, 5360, 5345, 5340, 5330, 5300], market: "Kolkata Mandi" },
  // ── Oilseeds ───────────────────────────────────────────────
  { crop: "Mustard", price: 5200, change: -40, trend: "down", unit: "₹/quintal", history: [5280, 5270, 5260, 5250, 5240, 5240, 5200], market: "Jaipur Mandi" },
  { crop: "Groundnut", price: 6100, change: 100, trend: "up", unit: "₹/quintal", history: [5900, 5940, 5970, 6000, 6020, 6000, 6100], market: "Rajkot Mandi" },
  { crop: "Sunflower", price: 5500, change: 60, trend: "up", unit: "₹/quintal", history: [5350, 5380, 5400, 5430, 5450, 5470, 5500], market: "Bijapur Mandi" },
  { crop: "Sesame", price: 9800, change: -80, trend: "down", unit: "₹/quintal", history: [9950, 9930, 9900, 9880, 9860, 9840, 9800], market: "Gujarat Mandi" },
  // ── Fruits ─────────────────────────────────────────────────
  { crop: "Mango", price: 4200, change: 200, trend: "up", unit: "₹/quintal", history: [3800, 3900, 3950, 4000, 4050, 4000, 4200], market: "Lucknow Mandi" },
  { crop: "Banana", price: 1400, change: -20, trend: "down", unit: "₹/quintal", history: [1450, 1440, 1430, 1420, 1410, 1420, 1400], market: "Jalgaon Mandi" },
  { crop: "Orange", price: 3600, change: 50, trend: "up", unit: "₹/quintal", history: [3450, 3480, 3510, 3540, 3560, 3580, 3600], market: "Nagpur Mandi" },
  { crop: "Pomegranate", price: 8500, change: 0, trend: "stable", unit: "₹/quintal", history: [8490, 8500, 8510, 8498, 8500, 8500, 8500], market: "Solapur Mandi" },
  { crop: "Guava", price: 2200, change: 80, trend: "up", unit: "₹/quintal", history: [2050, 2080, 2110, 2140, 2160, 2180, 2200], market: "Allahabad Mandi" },
  { crop: "Watermelon", price: 1100, change: -40, trend: "down", unit: "₹/quintal", history: [1200, 1180, 1160, 1140, 1130, 1120, 1100], market: "Kolkata Mandi" },
  { crop: "Papaya", price: 1600, change: 30, trend: "up", unit: "₹/quintal", history: [1530, 1545, 1555, 1565, 1575, 1585, 1600], market: "Pune Mandi" },
]
