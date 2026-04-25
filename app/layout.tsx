import type { Metadata } from "next";
import "./globals.css";

// Fonts are loaded via CSS @import in globals.css using Google Fonts CDN.
// This works on Vercel (full internet access) without requiring build-time fetches.

export const metadata: Metadata = {
  title: "HFVS Kenya · Housing Financial Vulnerability Score",
  description:
    "Modelling Housing-Based Financial Vulnerability and Insurance Risk across 47 Kenyan counties using 2023/24 KNBS Kenya Housing Survey microdata. MSc Data Science Dissertation — Strathmore University.",
  keywords: [
    "Kenya Housing Survey", "HFVS", "Financial Vulnerability",
    "XGBoost", "Housing Insurance", "KNBS", "Strathmore University",
    "Kenya counties", "actuarial risk",
  ],
  openGraph: {
    title: "Housing Financial Vulnerability Score · Kenya 2023/24",
    description:
      "21,347 households · 47 counties · XGBoost AUC 0.989 · MSc Dissertation, Strathmore University",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
