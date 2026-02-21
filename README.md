# 🌾 CropGuard — Crop Disease Detection System

An AI-powered web application to help farmers detect crop diseases, monitor weather, manage expenses, and access government schemes — all in one place.

## 🚀 Features

- **🔍 Disease Detection** — Upload crop images and get instant AI-powered disease diagnosis
- **📊 Dashboard** — Live alerts, detection history, and farm health overview
- **🌦️ Weather Widget** — Real-time weather data relevant to your farm location
- **📖 Disease Encyclopedia** — Browse a comprehensive database of crop diseases and treatments
- **📅 Crop Calendar** — Plan your farming activities with a seasonal crop calendar
- **🏛️ Government Schemes** — Discover and apply for agricultural support schemes
- **💰 Expense Tracker** — Track and manage farm-related expenses
- **💧 Irrigation Scheduler** — Plan and automate irrigation schedules
- **🗺️ Field Map Manager** — Visualize and manage your fields on an interactive map
- **🌾 Yield Calculator** — Estimate your crop yield based on field data
- **👤 Profile & Settings** — Manage your account and preferences

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework & routing |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI components |
| [Recharts](https://recharts.org/) | Data visualization |
| [Lucide React](https://lucide.dev/) | Icons |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/Light mode |

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/crop-disease-system.git
cd crop-disease-system

# Install dependencies
npm install
# or
pnpm install
```

### Running the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
crop-disease-system/
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Main dashboard
│   ├── upload/           # Disease detection (image upload)
│   ├── encyclopedia/     # Disease encyclopedia
│   ├── schemes/          # Government schemes
│   ├── expense-tracker/  # Expense tracking
│   ├── irrigation/       # Irrigation scheduler
│   ├── field-map/        # Field map manager
│   ├── yield-calculator/ # Yield calculator
│   ├── profile/          # Profile & settings
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions & mock data
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🌙 Dark Mode

CropGuard supports both light and dark themes, togglable from the navigation bar.

## 📄 License

This project is licensed under the MIT License.
