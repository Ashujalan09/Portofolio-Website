import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const T = {
  cream: "#fdf6ee",
  warmWhite: "#fffaf4",
  clay: "#d4623a",
  terra: "#e8825c",
  sand: "#f0c99a",
  sage: "#7a9e8e",
  ink: "#2a1f1a",
  muted: "#7a6a62",
  white: "#ffffff",
};

function SectionLabel({ children, light }) {
  return (
    <p style={{ fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", color: light ? "#e8825c" : T.clay, fontWeight: 500, display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <span style={{ width: 24, height: 1.5, background: light ? "#e8825c" : T.clay, display: "inline-block" }} />
      {children}
    </p>
  );
}

export default function NationalPensionScheme() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflowX = "hidden";
    return () => { document.body.style.overflowX = ""; };
  }, []);

  const navigate = useNavigate();

  return (
    <div style={{ background: T.cream, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Top Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px clamp(20px,5vw,60px)", background: "rgba(253,246,238,0.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(212,98,58,0.1)" }}>
        <Link to="/" style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500, color: T.clay, textDecoration: "none" }}>AJ ✦</Link>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: `1.5px solid ${T.clay}`, color: T.clay, borderRadius: 100, padding: "8px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: "clamp(20px,6vw,60px)", paddingRight: "clamp(20px,6vw,60px)", background: "linear-gradient(135deg,#fde8d8,#f5b899)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(0px)", opacity: 0.4, background: "linear-gradient(to bottom, transparent 60%, rgba(253,246,238,1))" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {[{ label: "Product Design", text: T.clay }, { label: "Gov-Tech", text: T.clay }].map((t) => (
              <span key={t.label} style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.5, padding: "4px 14px", borderRadius: 100, background: "rgba(255,255,255,0.7)", color: t.text, fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>
            ))}
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px,5vw,72px)", fontWeight: 500, letterSpacing: -2, color: T.ink, lineHeight: 1.1, marginBottom: 20 }}>Nation Pension Scheme Onboarding</h1>
          <p style={{ fontSize: 18, color: T.muted, maxWidth: 600, lineHeight: 1.7, fontWeight: 300 }}>Redesigning the NPS experience for millions of subscribers</p>
          <div style={{ display: "flex", gap: 40, marginTop: 48, flexWrap: "wrap" }}>
            {[["Role", "Lead UX Designer"], ["Timeline", "4 months"], ["Tools", "Figma, Maze, Miro"]].map(([label, val]) => (
              <div key={label}>
                <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.clay, fontWeight: 500, marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 15, color: T.ink, fontWeight: 400 }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section style={{ padding: "clamp(40px,7vw,80px) clamp(20px,6vw,60px)", background: T.warmWhite }}>
        <div style={{ maxWidth: 760 }}>
          <SectionLabel>The Problem</SectionLabel>
          <p style={{ fontSize: 18, color: T.ink, lineHeight: 1.8, fontWeight: 300 }}>The existing NPS portal was overwhelming for first-time users, with dense financial jargon, unclear navigation, and no guidance through key actions like account setup, fund selection, or withdrawal. Drop-off rates were high and user trust was low.</p>
        </div>
      </section>

      {/* ── Process ── */}
      <section style={{ padding: "clamp(40px,7vw,80px) clamp(20px,6vw,60px)", background: T.cream }}>
        <SectionLabel>The Process</SectionLabel>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 500, letterSpacing: -1, color: T.ink, marginBottom: 48, lineHeight: 1.2 }}>How I approached it</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {[
            { step: "Research", desc: "Conducted 20+ interviews with NPS subscribers across age groups. Ran contextual inquiry sessions and analysed support ticket themes to identify top pain points." },
            { step: "Define", desc: "Synthesised findings into user personas and journey maps. Prioritised three critical flows: onboarding, contribution tracking, and withdrawal initiation." },
            { step: "Design", desc: "Designed simplified, step-by-step flows with plain-language copy, progress indicators, and contextual help. Created a component library aligned to government design standards." },
            { step: "Test", desc: "Ran 3 rounds of usability testing with 8 participants each. Iterated on information hierarchy, form design, and error states based on findings." },
          ].map((p, i) => (
            <div key={i} style={{ background: T.white, borderRadius: 20, padding: "32px 28px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(42,31,26,0.04)" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.clay, fontWeight: 500, marginBottom: 8 }}>0{i + 1}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: T.ink, marginBottom: 12 }}>{p.step}</div>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Outcome ── */}
      <section style={{ padding: "clamp(40px,7vw,80px) clamp(20px,6vw,60px)", background: T.ink, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: T.clay, filter: "blur(100px)", opacity: 0.15, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
          <SectionLabel light>The Outcome</SectionLabel>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, fontWeight: 300 }}>Redesigned portal reduced average task completion time by 42%. Onboarding drop-off decreased significantly. Received positive feedback from both subscribers and administrators during pilot rollout.</p>
        </div>
      </section>

      {/* ── Next Project ── */}
      <section style={{ padding: "clamp(40px,7vw,80px) clamp(20px,6vw,60px)", background: T.cream, textAlign: "center" }}>
        <p style={{ fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", color: T.clay, fontWeight: 500, marginBottom: 16 }}>Next Project</p>
        <Link to="/case-study/investment-portfolio" style={{ textDecoration: "none" }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px,3vw,40px)", fontWeight: 500, color: T.ink, letterSpacing: -1, marginBottom: 24, lineHeight: 1.2 }}>Investment Portfolio</h3>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, color: T.clay }}>View case study →</span>
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: T.ink, borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px clamp(20px,6vw,60px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        {["© 2025 Ashutosh Jalan. Crafted with care.", "UX Designer · Based in India"].map((t, i) => (
          <p key={i} style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>{t}</p>
        ))}
      </footer>
    </div>
  );
}
