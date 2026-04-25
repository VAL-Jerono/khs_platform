"use client";
import { useEffect, useRef } from "react";
import { NATIONAL } from "@/lib/data";

const KPI = [
  { label: "Households Surveyed", value: "21,347", sub: "Nationally representative" },
  { label: "Counties Covered",    value: "47",     sub: "All Kenyan counties" },
  { label: "High Vulnerability",  value: "40%",    sub: "HFVS > national mean + 1σ" },
  { label: "XGBoost AUC",         value: "0.989",  sub: "Binary classification" },
  { label: "National Mean HFVS",  value: "0.324",  sub: "σ = 0.031" },
  { label: "Urban Households",    value: "44.3%",  sub: "Rural/urban split" },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    const N = 60;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r:  Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242,168,54,${p.alpha})`;
        ctx.fill();
        // Draw lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(242,168,54,${0.06 * (1 - dist / 90)})`;
            ctx.stroke();
          }
        }
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
        width: "700px", height: "400px",
        background: "radial-gradient(ellipse at center, rgba(242,168,54,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
        {/* Eyebrow */}
        <div className="fade-up" style={{ marginBottom: "20px" }}>
          <span style={{
            fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--amber)",
            border: "0.5px solid rgba(242,168,54,0.3)", borderRadius: "100px",
            padding: "5px 14px",
          }}>
            MSc Dissertation · Strathmore University · 2026
          </span>
        </div>

        {/* Title */}
        <h1 className="fade-up delay-1" style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(36px, 6vw, 76px)", lineHeight: 1.05,
          letterSpacing: "-0.02em", marginBottom: "24px", maxWidth: "820px",
        }}>
          Housing Financial{" "}
          <em style={{ fontStyle: "italic", color: "var(--amber)" }}>Vulnerability</em>{" "}
          Score
        </h1>

        {/* Subtitle */}
        <p className="fade-up delay-2" style={{
          fontSize: "clamp(15px, 2vw, 18px)", color: "var(--muted)",
          maxWidth: "560px", lineHeight: 1.7, marginBottom: "40px",
        }}>
          Modelling housing-based financial vulnerability and insurance risk
          across all <strong style={{ color: "var(--text)" }}>47 Kenyan counties</strong> using
          2023/24 KNBS microdata — what actuaries do: inferring risk from
          observable household characteristics.
        </p>

        {/* CTA row */}
        <div className="fade-up delay-3" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "72px" }}>
          <a href="#overview" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
            Explore the Research
          </a>
          <a href="#counties" style={{
            padding: "11px 24px", fontSize: "14px", fontWeight: 600,
            border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: "6px",
            color: "var(--text)", textDecoration: "none",
            transition: "border-color 0.15s",
          }}>
            County Risk Map →
          </a>
        </div>

        {/* KPI grid */}
        <div className="fade-up delay-4" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "10px",
        }}>
          {KPI.map((k, i) => (
            <div key={i} className="stat-card">
              <div className="stat-label">{k.label}</div>
              <div className="stat-value display">{k.value}</div>
              <div className="stat-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="fade-up delay-5" style={{ textAlign: "center", marginTop: "60px" }}>
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            gap: "6px", color: "var(--dim)", fontSize: "11px", letterSpacing: "0.08em",
          }}>
            <span>SCROLL</span>
            <div style={{
              width: "1px", height: "40px",
              background: "linear-gradient(to bottom, var(--amber), transparent)",
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}
