"use client";
import { useState } from "react";
import { NATIONAL, COUNTIES, getRiskColor, getRiskTier } from "@/lib/data";

type Inputs = {
  monthly_income: string;
  monthly_rent: string;
  has_savings: string;
  land_ownership: string;
  written_lease: string;
  eviction_threat: string;
  near_flood: string;
  wall_material: string;
  floor_material: string;
  electricity: string;
  water_access: string;
  county: string;
};

const DEFAULTS: Inputs = {
  monthly_income:  "30000",
  monthly_rent:    "8000",
  has_savings:     "1",
  land_ownership:  "0",
  written_lease:   "1",
  eviction_threat: "0",
  near_flood:      "0",
  wall_material:   "permanent",
  floor_material:  "cement",
  electricity:     "1",
  water_access:    "improved",
  county:          "47",
};

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

function computeHFVS(inp: Inputs) {
  const income = parseFloat(inp.monthly_income) || 1;
  const rent   = parseFloat(inp.monthly_rent) || 0;

  // D1 – Financial stress (0-1)
  const rentBurden = clamp01(rent / income);
  const hasSavings = parseInt(inp.has_savings);
  const d1 = clamp01(rentBurden * 0.6 + (1 - hasSavings) * 0.4);

  // D2 – Tenure insecurity
  const noLand  = 1 - parseInt(inp.land_ownership);
  const noLease = 1 - parseInt(inp.written_lease);
  const evicted = parseInt(inp.eviction_threat);
  const d2 = clamp01((noLand * 0.45 + noLease * 0.30 + evicted * 0.25));

  // D3 – Physical hazard
  const flood = parseInt(inp.near_flood);
  const d3 = clamp01(flood * 0.7 + 0.1); // baseline hazard

  // D4 – Dwelling quality
  const wallScore  = inp.wall_material  === "permanent" ? 0 : inp.wall_material  === "semi" ? 0.5 : 1;
  const floorScore = inp.floor_material === "cement"    ? 0 : inp.floor_material === "wood"  ? 0.4 : 1;
  const d4 = clamp01((wallScore * 0.55 + floorScore * 0.45));

  // D5 – Utility deprivation
  const noElec  = 1 - parseInt(inp.electricity);
  const badWater = inp.water_access === "unimproved" ? 1 : 0;
  const d5 = clamp01((noElec * 0.5 + badWater * 0.5));

  // Composite
  const hfvs = 0.30 * d1 + 0.25 * d2 + 0.25 * d3 + 0.20 * d4 + 0.20 * d5;

  return { hfvs: clamp01(hfvs), d1, d2, d3, d4, d5 };
}

const DIM_META = [
  { key: "d1", label: "Financial Stress",    color: "#F2A836" },
  { key: "d2", label: "Tenure Insecurity",   color: "#E25A38" },
  { key: "d3", label: "Physical Hazard",     color: "#4A8EE0" },
  { key: "d4", label: "Dwelling Quality",    color: "#8B7BE8" },
  { key: "d5", label: "Utility Deprivation", color: "#35A882" },
];

export default function Calculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<ReturnType<typeof computeHFVS> | null>(null);

  const set = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setInputs((prev) => ({ ...prev, [k]: e.target.value }));

  const compute = () => setResult(computeHFVS(inputs));

  const comparableCounty = result
    ? COUNTIES.reduce((best, c) => Math.abs(c.hfvs - result.hfvs) < Math.abs(best.hfvs - result.hfvs) ? c : best)
    : null;

  return (
    <section id="calculator" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p className="section-head">Household Risk Calculator</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "14px" }}>
            Estimate your{" "}
            <em style={{ color: "var(--amber)", fontStyle: "italic" }}>HFVS score</em>
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "15px", maxWidth: "520px", lineHeight: 1.7 }}>
            Enter household characteristics to compute an indicative Housing Financial Vulnerability Score
            using the same methodology as the dissertation model.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}
          className="responsive-2col">

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Financial */}
            <div className="card">
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F2A836", marginBottom: "12px" }}>
                Financial
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Monthly income (KES)</label>
                  <input type="number" value={inputs.monthly_income} onChange={set("monthly_income")} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Monthly rent (KES)</label>
                  <input type="number" value={inputs.monthly_rent} onChange={set("monthly_rent")} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Has savings?</label>
                <select value={inputs.has_savings} onChange={set("has_savings")}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>

            {/* Tenure */}
            <div className="card">
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E25A38", marginBottom: "12px" }}>
                Tenure
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { k: "land_ownership" as keyof Inputs, label: "Owns land?" },
                  { k: "written_lease" as keyof Inputs,  label: "Written lease?" },
                  { k: "eviction_threat" as keyof Inputs, label: "Eviction threat?" },
                ].map(({ k, label }) => (
                  <div key={k}>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>{label}</label>
                    <select value={inputs[k]} onChange={set(k)}>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Hazard */}
            <div className="card">
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4A8EE0", marginBottom: "12px" }}>
                Physical Hazard
              </p>
              <div>
                <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Near flood zone?</label>
                <select value={inputs.near_flood} onChange={set("near_flood")}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {/* Dwelling & Utilities */}
            <div className="card">
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8B7BE8", marginBottom: "12px" }}>
                Dwelling & Utilities
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Wall material</label>
                  <select value={inputs.wall_material} onChange={set("wall_material")}>
                    <option value="permanent">Permanent</option>
                    <option value="semi">Semi-permanent</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Floor material</label>
                  <select value={inputs.floor_material} onChange={set("floor_material")}>
                    <option value="cement">Cement/Tiles</option>
                    <option value="wood">Wood</option>
                    <option value="earth">Earth/Dung</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Electricity access</label>
                  <select value={inputs.electricity} onChange={set("electricity")}>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Water source</label>
                  <select value={inputs.water_access} onChange={set("water_access")}>
                    <option value="improved">Improved</option>
                    <option value="unimproved">Unimproved</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={compute}>
              Compute HFVS Score →
            </button>
          </div>

          {/* Result panel */}
          <div>
            {!result ? (
              <div style={{
                height: "100%", minHeight: "300px", display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center", textAlign: "center",
                background: "var(--surface)", border: "0.5px dashed var(--border-md)",
                borderRadius: "var(--radius-lg)", padding: "40px", gap: "12px",
              }}>
                <div style={{ fontSize: "40px" }}>📊</div>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6 }}>
                  Fill in the household characteristics and click <strong style={{ color: "var(--text)" }}>Compute HFVS Score</strong> to see
                  where this household sits in the national vulnerability distribution.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Score */}
                <div style={{
                  background: "var(--card)", border: `0.5px solid ${getRiskColor(result.hfvs)}40`,
                  borderRadius: "var(--radius-lg)", padding: "1.5rem", textAlign: "center",
                }}>
                  <div style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                    Estimated HFVS
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "72px", fontWeight: 700, lineHeight: 1,
                    color: getRiskColor(result.hfvs), marginBottom: "10px",
                  }}>
                    {result.hfvs.toFixed(3)}
                  </div>
                  <span className={`badge ${getRiskTier(result.hfvs) === "HIGH" ? "badge-high" : getRiskTier(result.hfvs) === "ABOVE MEAN" ? "badge-above" : "badge-below"}`}>
                    {getRiskTier(result.hfvs)}
                  </span>
                  {comparableCounty && (
                    <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "12px" }}>
                      Most similar to <strong style={{ color: "var(--text)" }}>{comparableCounty.name}</strong>{" "}
                      county (HFVS {comparableCounty.hfvs.toFixed(3)})
                    </p>
                  )}
                </div>

                {/* Dimension breakdown */}
                <div className="card">
                  <p style={{ fontSize: "10px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
                    Dimension scores
                  </p>
                  {DIM_META.map((d) => {
                    const val = result[d.key as keyof typeof result] as number;
                    return (
                      <div key={d.key} style={{ marginBottom: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                          <span style={{ color: d.color }}>{d.label}</span>
                          <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{val.toFixed(3)}</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${val * 100}%`, background: d.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Context */}
                <div style={{
                  background: "var(--surface)", border: "0.5px solid var(--border)",
                  borderRadius: "var(--radius-md)", padding: "1rem", fontSize: "12px",
                  color: "var(--muted)", lineHeight: 1.65,
                }}>
                  <strong style={{ color: "var(--text)" }}>Context:</strong>{" "}
                  National mean HFVS is <strong style={{ color: "var(--text)" }}>{NATIONAL.mean.toFixed(3)}</strong>{" "}
                  (σ = {NATIONAL.sd.toFixed(3)}). Scores above{" "}
                  <strong style={{ color: "var(--red)" }}>{(NATIONAL.mean + NATIONAL.sd).toFixed(3)}</strong>{" "}
                  are classified as high vulnerability. This tool uses a simplified version of the
                  dissertation model — actual HFVS is computed from 40+ KHS variables.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .responsive-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
