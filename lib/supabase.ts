import { createClient } from "@supabase/supabase-js";

// These env vars are set in .env.local (dev) and Vercel project settings (prod).
// The NEXT_PUBLIC_ prefix means they're safe to expose to the browser.
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Returns null if env vars are missing (static-only mode, no DB needed)
export const supabase =
  supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null;

// ─── Types matching a future `county_risk` Supabase table ──────────────────
// Run this SQL in Supabase SQL editor to create the table:
//
// create table county_risk (
//   county_id    int primary key,
//   county_name  text not null,
//   mean_hfvs    float not null,
//   pct_high     float,
//   pct_urban    float,
//   n_households int,
//   updated_at   timestamptz default now()
// );
//
// Then upload data via the Supabase dashboard CSV import or the Python script:
// scripts/upload_to_supabase.py

export type CountyRiskRow = {
  county_id:    number;
  county_name:  string;
  mean_hfvs:    number;
  pct_high:     number;
  pct_urban:    number;
  n_households: number;
  updated_at:   string;
};

// Fetch live county data from Supabase (falls back to static data if no DB)
export async function fetchCountyRisk(): Promise<CountyRiskRow[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("county_risk")
    .select("*")
    .order("mean_hfvs", { ascending: false });
  if (error) { console.error("Supabase error:", error); return null; }
  return data as CountyRiskRow[];
}
