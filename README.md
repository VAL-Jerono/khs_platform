# HFVS Kenya — Housing Financial Vulnerability Score
### MSc Data Science & Analytics · Strathmore University · 2026

> Modelling housing-based financial vulnerability and insurance risk across all 47 Kenyan counties using the 2023/24 KNBS Kenya Housing Survey microdata.

**Live:** https://khsplatform.vercel.app/

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript |
| Styling    | CSS Variables + minimal Tailwind |
| Fonts      | Cormorant Garamond + DM Sans (Google Fonts) |
| Database   | Supabase (optional — app works fully static) |
| Deployment | Vercel |

---

## Local Development

```bash
git clone https://github.com/VAL-Jerono/khs_platform.git
cd khs_platform
npm install
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel (one command)

```bash
npm i -g vercel
vercel
```

Vercel auto-detects Next.js. No configuration needed beyond env vars.

### Environment Variables (Vercel Dashboard → Settings → Environment Variables)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase anon/public key |

The app is **fully functional without Supabase** — all data is embedded in `lib/data.ts`.
Add Supabase later to enable live data updates from your analysis pipeline.

---

## Project Structure

```
khs-hfvs-platform/
├── app/
│   ├── layout.tsx           # Root layout, fonts, metadata
│   ├── page.tsx             # Home page (all sections)
│   ├── globals.css          # Design system CSS variables
│   ├── loading.tsx          # Global loading UI
│   ├── not-found.tsx        # 404 page
│   └── county/[id]/
│       └── page.tsx         # County deep-dive (SSG, 47 pages)
├── components/
│   ├── Nav.tsx              # Sticky nav with scroll detection
│   ├── Hero.tsx             # Animated hero + KPI grid
│   ├── Overview.tsx         # Methodology + key findings
│   ├── CountyRankings.tsx   # Interactive county atlas (chart + table)
│   ├── ModelPerformance.tsx # XGBoost/LightGBM metrics
│   ├── FeatureImportance.tsx# SHAP feature importance bars
│   ├── Calculator.tsx       # Household HFVS calculator
│   └── Footer.tsx           # Links + attribution
├── lib/
│   ├── data.ts              # All research data (counties, models, features)
│   └── supabase.ts          # Supabase client + types
├── vercel.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Connecting Supabase (Optional)

1. Create a free project at [supabase.com](https://supabase.com)
2. Run the SQL in `lib/supabase.ts` to create the `county_risk` table
3. Upload your county data via CSV import in the Supabase dashboard
4. Copy your Project URL and anon key to `.env.local`
5. Redeploy — the app will fetch live data and fall back to static on error

---

## Data Source

- **Kenya National Data Archive:** https://www.knada.knbs.or.ke
- **Survey:** Kenya Housing Survey 2023/24 (DDI-KEN-KNBS-KHS-2023-24-V001)
- Raw `.dta` files are **not** committed. See the dissertation notebooks for the full analysis pipeline.

---

## Academic Citation

```
[Author]. (2026). Modelling Housing-Based Financial Vulnerability and Insurance Risk 
Among Kenyan Households. MSc Dissertation, Strathmore University, Nairobi.
Data: Kenya National Bureau of Statistics, Kenya Housing Survey 2023/24.
```
