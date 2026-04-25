import { notFound } from "next/navigation";
import { COUNTIES, NATIONAL, DIMENSIONS, getRiskColor, getRiskTier } from "@/lib/data";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export async function generateStaticParams() {
  return COUNTIES.map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const county = COUNTIES.find((c) => c.id === parseInt(params.id));
  if (!county) return { title: "County not found" };
  return {
    title: `${county.name} · HFVS ${county.hfvs.toFixed(3)} · Kenya Housing Vulnerability`,
    description: `County-level HFVS profile for ${county.name}: composite score ${county.hfvs.toFixed(3)}, ${(county.pct_high * 100).toFixed(0)}% high-vulnerability households.`,
  };
}

export default function CountyPage({ params }: { params: { id: string } }) {
  const county = COUNTIES.find((c) => c.id === parseInt(params.id));
  if (!county) notFound();

  const rank = [...COUNTIES].sort((a, b) => b.hfvs - a.hfvs).findIndex((c) => c.id === county.id) + 1;
  const tier = getRiskTier(county.hfvs);
  const color = getRiskColor(county.hfvs);

  const nearby = [...COUNTIES]
    .filter((c) => c.id !== county.id)
    .sort((a, b) => Math.abs(a.hfvs - county.hfvs) - Math.abs(b.hfvs - county.hfvs))
    .slice(0, 5);

  return (
    <>
      <Nav />
      <main style={{ paddingTop: "90px", minHeight: "100vh" }}>
        <div className="container" style={{ paddingTop: "40px", paddingBottom: "80px" }}>
          <Link href="/#counties" className="back-link">← All Counties</Link>

          {/* Header */}
          <div className="county-header" style={{ marginBottom: "40px" }}>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>
                County #{rank} of 47 · ID {county.id}
              </p>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, lineHeight: 1.05, marginBottom: "16px" }}>
                {county.name}
              </h1>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <span className={`badge ${tier === "HIGH" ? "badge-high" : tier === "ABOVE MEAN" ? "badge-above" : "badge-below"}`}>
                  {tier} VULNERABILITY
                </span>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  {(county.pct_urban * 100).toFixed(0)}% Urban · {county.n_households} households
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "72px", fontWeight: 700, color, lineHeight: 1 }}>
                {county.hfvs.toFixed(3)}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)" }}>Composite HFVS</div>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "40px" }}>
            {[
              { label: "National Rank",   value: `#${rank}`,                                       sub: "By HFVS score" },
              { label: "High-Risk HHs",   value: `${(county.pct_high * 100).toFixed(0)}%`,          sub: "HFVS > mean+σ" },
              { label: "vs Nat. Mean",    value: `${county.hfvs > NATIONAL.mean ? "+" : ""}${((county.hfvs - NATIONAL.mean) * 100).toFixed(1)}pp`, sub: "Deviation" },
              { label: "Surveyed HHs",    value: county.n_households.toLocaleString(),               sub: "KHS 2023/24" },
              { label: "Urban Share",     value: `${(county.pct_urban * 100).toFixed(0)}%`,          sub: "Urban/rural" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-label">{s.label}</div>
                <div className="stat-value display" style={{ fontSize: "24px" }}>{s.value}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Two columns */}
          <div className="county-cols" style={{ marginBottom: "32px" }}>
            {/* Dimension breakdown */}
            <div className="card">
              <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
                Dimension Breakdown
              </p>
              {DIMENSIONS.map((d) => {
                const val = county[d.key as "d1" | "d2" | "d3" | "d4" | "d5"];
                const natMean = COUNTIES.reduce((s, c) => s + (c[d.key as "d1"] as number), 0) / COUNTIES.length;
                return (
                  <div key={d.key} style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <div>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: d.color }}>{d.label}</span>
                        <span style={{ fontSize: "10px", color: "var(--muted)", marginLeft: "8px" }}>(w={d.weight})</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "14px" }}>{val.toFixed(3)}</span>
                        <span style={{ fontSize: "10px", color: val > natMean ? "var(--red)" : "var(--teal)", marginLeft: "6px" }}>
                          {val > natMean ? "▲" : "▼"}{Math.abs(val - natMean).toFixed(3)}
                        </span>
                      </div>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${(val / 0.5) * 100}%`, background: d.color }} />
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: "2px" }}>Nat. mean: {natMean.toFixed(3)}</div>
                  </div>
                );
              })}
            </div>

            {/* Similar counties */}
            <div className="card">
              <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
                Most Similar Counties
              </p>
              {nearby.map((n) => (
                <Link key={n.id} href={`/county/${n.id}`} className="similar-county-row">
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>{n.name}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: getRiskColor(n.hfvs) }}>
                    {n.hfvs.toFixed(3)}
                  </span>
                </Link>
              ))}
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "12px", lineHeight: 1.6 }}>
                Ranked by proximity in HFVS composite score.
              </div>
            </div>
          </div>

          {/* Distribution bar */}
          <div className="card">
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
              Position in National Distribution
            </p>
            <div style={{ position: "relative", height: "48px", background: "var(--surface)", borderRadius: "6px", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--teal) 0%, var(--amber) 50%, var(--red) 100%)", opacity: 0.15 }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.3)", left: `${((NATIONAL.mean - NATIONAL.range[0]) / (NATIONAL.range[1] - NATIONAL.range[0])) * 100}%` }}>
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%) translateX(-50%)", fontSize: "9px", color: "var(--muted)", whiteSpace: "nowrap", background: "var(--surface)", padding: "2px 5px", borderRadius: "3px" }}>Mean</div>
              </div>
              <div style={{ position: "absolute", top: "8px", bottom: "8px", width: "3px", borderRadius: "2px", background: color, left: `${((county.hfvs - NATIONAL.range[0]) / (NATIONAL.range[1] - NATIONAL.range[0])) * 100}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--dim)", marginTop: "6px" }}>
              <span>Min {NATIONAL.range[0]}</span>
              <span style={{ color }}>{county.name}: {county.hfvs.toFixed(3)}</span>
              <span>Max {NATIONAL.range[1]}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        .back-link { font-size: 13px; color: var(--muted); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 28px; transition: color 0.15s; }
        .back-link:hover { color: var(--text); }
        .county-header { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: flex-start; }
        .county-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .similar-county-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 0.5px solid var(--border); text-decoration: none; color: var(--text); transition: opacity 0.15s; }
        .similar-county-row:hover { opacity: 0.75; }
        .similar-county-row:last-of-type { border-bottom: none; }
        @media (max-width: 640px) {
          .county-header { grid-template-columns: 1fr; }
          .county-cols { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
