import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const T = {
  cream: "#fdf6ee",
  warmWhite: "#fffaf4",
  clay: "#d4623a",
  terra: "#e8825c",
  sand: "#f0c99a",
  sage: "#7a9e8e",
  sageLight: "#b8d4c8",
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

export default function InvestmentPortfolio() {
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
      <section style={{ paddingTop: "clamp(100px,14vw,140px)", paddingBottom: 80, paddingLeft: "clamp(20px,6vw,60px)", paddingRight: "clamp(20px,6vw,60px)", background: "linear-gradient(135deg, #fef3e8 0%, #fde0c0 50%, #fbd5a8 100%)", position: "relative", overflow: "hidden" }}>
        {/* Fade to cream at bottom */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.5, background: "linear-gradient(to bottom, transparent 55%, rgba(253,246,238,1))", pointerEvents: "none" }} />
        {/* Decorative phone silhouette */}
        <div style={{ position: "absolute", right: -20, top: 60, width: 200, height: 380, borderRadius: 32, background: "linear-gradient(160deg, #ef8c24, #f06837)", opacity: 0.12, transform: "rotate(8deg)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 60, top: 80, width: 180, height: 340, borderRadius: 28, background: "linear-gradient(160deg, #ef8c24, #f06837)", opacity: 0.08, transform: "rotate(4deg)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
          {/* Tags with dot icons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {[
              { label: "UX Design", emoji: "✏️" },
              { label: "Fintech", emoji: "📈" },
              { label: "Mobile App", emoji: "📱" },
            ].map((t) => (
              <span key={t.label} style={{ fontSize: 12, fontWeight: 500, letterSpacing: 0.3, padding: "6px 14px", borderRadius: 100, background: "rgba(255,255,255,0.75)", color: T.clay, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(8px)", border: "1px solid rgba(212,98,58,0.15)" }}>
                <span style={{ fontSize: 13 }}>{t.emoji}</span>{t.label}
              </span>
            ))}
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(40px,5.5vw,80px)", fontWeight: 500, letterSpacing: -2.5, color: T.ink, lineHeight: 1.05, marginBottom: 20 }}>Investment Portfolio</h1>
          <p style={{ fontSize: 19, color: T.muted, maxWidth: 580, lineHeight: 1.75, fontWeight: 300 }}>Helping users understand and manage their investments at a glance</p>
          <div style={{ display: "flex", gap: 40, marginTop: 52, flexWrap: "wrap" }}>
            {[["Role", "Product Designer"], ["Timeline", "3 months"], ["Tools", "Figma, FigJam, Hotjar"]].map(([label, val]) => (
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
          {/* Pain point chips */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            {[
              { icon: "📊", text: "Fragmented data" },
              { icon: "😕", text: "Hard-to-read charts" },
              { icon: "📉", text: "Low engagement" },
            ].map((chip) => (
              <span key={chip.text} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 500, padding: "7px 16px", borderRadius: 100, background: "rgba(212,98,58,0.08)", color: T.clay, border: "1px solid rgba(212,98,58,0.14)" }}>
                <span>{chip.icon}</span>{chip.text}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 18, color: T.ink, lineHeight: 1.85, fontWeight: 300 }}>Retail investors using the platform struggled to understand their overall portfolio health. Data was fragmented across multiple screens, charts were hard to interpret, and users couldn't easily act on insights — leading to low engagement and high churn.</p>
        </div>
      </section>

      {/* ── Research Insights ── */}
      <section style={{ padding: "clamp(40px,7vw,80px) clamp(20px,6vw,60px)", background: T.cream }}>
        <SectionLabel>Research Findings</SectionLabel>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 500, letterSpacing: -1, color: T.ink, marginBottom: 48, lineHeight: 1.2 }}>What users told us</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {[
            {
              emoji: "🧭",
              title: "Mental Model Gap",
              quote: "\"I see numbers but I don't know if I'm doing well\"",
              stat: "12/15 users",
              statLabel: "couldn't gauge portfolio health",
            },
            {
              emoji: "😤",
              title: "Decision Paralysis",
              quote: "\"Too many charts, not enough direction\"",
              stat: "8 rage clicks",
              statLabel: "avg per session on allocation charts",
            },
            {
              emoji: "🔕",
              title: "Action Disconnect",
              quote: "\"I see data, but what should I do next?\"",
              stat: "0/15 users",
              statLabel: "took action after viewing portfolio screen",
            },
          ].map((card) => (
            <div key={card.title} style={{ background: T.white, borderRadius: 20, padding: "32px 28px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(42,31,26,0.04)", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 40, lineHeight: 1 }}>{card.emoji}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500, color: T.ink }}>{card.title}</div>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, fontStyle: "italic", flex: 1 }}>{card.quote}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: "rgba(212,98,58,0.08)", border: "1px solid rgba(212,98,58,0.15)", width: "fit-content" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.clay }}>{card.stat}</span>
                <span style={{ fontSize: 12, color: T.muted }}>{card.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── UI Mockup Showcase ── */}
      <section style={{ padding: "clamp(60px,8vw,100px) clamp(20px,6vw,60px)", background: "linear-gradient(160deg, #fdf0e4 0%, #f5f6f7 100%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SectionLabel>The Design</SectionLabel>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 500, letterSpacing: -1, color: T.ink, marginBottom: 56, lineHeight: 1.2, textAlign: "center" }}>A unified view of your portfolio</h2>

        {/* Phone frame */}
        <div style={{ width: "min(320px, calc(100vw - 48px))", borderRadius: 44, background: "#1a1a1a", boxShadow: "0 40px 100px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)", padding: "12px", position: "relative" }}>
          {/* Notch */}
          <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 100, height: 28, background: "#1a1a1a", borderRadius: "0 0 18px 18px", zIndex: 10 }} />
          {/* Screen */}
          <div style={{ borderRadius: 34, overflow: "hidden", background: "#f5f6f7", minHeight: 620 }}>
            {/* Status bar */}
            <div style={{ background: "#f5f6f7", padding: "28px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#353535" }}>9:41</span>
              <span style={{ fontSize: 12, color: "#767676" }}>▲▲▲ ◀ 🔋</span>
            </div>

            {/* Market ticker */}
            <div style={{ background: "#f5f6f7", padding: "4px 12px 8px", display: "flex", gap: 0, borderBottom: "1px solid #ebebeb" }}>
              {[
                { name: "NIFTY 50", val: "25,347", chg: "+0.16%", up: true },
                { name: "BANK NIFTY", val: "51,708", chg: "-0.12%", up: false },
                { name: "SENSEX", val: "82,776", chg: "+1.16%", up: true },
              ].map((idx, i) => (
                <div key={idx.name} style={{ flex: 1, borderRight: i < 2 ? "1px solid #ebebeb" : "none", padding: "4px 8px" }}>
                  <div style={{ fontSize: 9, color: "#767676", fontWeight: 600, letterSpacing: 0.3, marginBottom: 2 }}>{idx.name}</div>
                  <div style={{ fontSize: 10, color: idx.up ? "#269c32" : "#fe3c30", fontWeight: 700 }}>{idx.val}</div>
                  <div style={{ fontSize: 9, color: "#767676" }}>{idx.chg}</div>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div style={{ background: "#ffffff", display: "flex", borderBottom: "1px solid #ebebeb" }}>
              {["Portfolio", "Open Position"].map((tab, i) => (
                <div key={tab} style={{ flex: 1, textAlign: "center", padding: "12px 8px", fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "#db620a" : "#767676", borderBottom: i === 0 ? "2px solid #db620a" : "2px solid transparent" }}>
                  {tab}
                </div>
              ))}
            </div>

            {/* Filter chips */}
            <div style={{ background: "#ffffff", padding: "10px 12px", display: "flex", gap: 8, overflowX: "auto" }}>
              {["Overview", "Demat", "Stocks", "F&O", "MF"].map((chip, i) => (
                <span key={chip} style={{ fontSize: 11, fontWeight: i === 2 ? 600 : 400, padding: "5px 12px", borderRadius: 20, background: i === 2 ? "#db620a" : "transparent", color: i === 2 ? "#fff" : "#767676", border: i === 2 ? "none" : "1px solid #ebebeb", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {chip}
                </span>
              ))}
            </div>

            {/* Portfolio summary card */}
            <div style={{ margin: "12px", borderRadius: 12, background: "linear-gradient(90deg, #ef8c24, #f06837)", padding: "16px", position: "relative", overflow: "hidden" }}>
              {/* Decorative wave */}
              <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 2 }}>₹ 37,80,584</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", marginBottom: 3 }}>Invested Value</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>₹ 32,70,451</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", marginBottom: 3 }}>Overall P&L</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>₹ 20,584 <span style={{ fontSize: 11, fontWeight: 400 }}>(16.3%)</span></div>
                  </div>
                </div>
                <div style={{ marginTop: 10, padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,0.18)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.85)" }}>Today's P&L</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>▲ ₹ 1,729 (8.1%)</span>
                </div>
              </div>
            </div>

            {/* Stock list */}
            <div style={{ background: "#ffffff", padding: "0 12px" }}>
              {[
                { name: "BANDHANBNK", qty: 10, avg: "289.45", pl: "-64.80", plPct: "0.18%", ltp: "1,664.80", gain: false },
                { name: "BHARTIARTL", qty: 35, avg: "289.45", pl: "+2435.80", plPct: "0.18%", ltp: "473.13", gain: true },
                { name: "HEROMOTOCO", qty: 13, avg: "289.45", pl: "+122.80", plPct: "0.18%", ltp: "164.30", gain: true },
              ].map((stock, i) => (
                <div key={stock.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 2 ? "1px solid #ebebeb" : "none" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #ef8c24, #f06837)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {stock.name.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#353535" }}>{stock.name}</div>
                      <div style={{ fontSize: 10, color: "#767676", marginTop: 2 }}>📦 {stock.qty} &nbsp; Avg {stock.avg}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: stock.gain ? "#269c32" : "#fe3c30" }}>{stock.pl} <span style={{ fontWeight: 400, color: "#767676" }}>({stock.plPct})</span></div>
                    <div style={{ fontSize: 10, color: "#767676", marginTop: 2 }}>LTP {stock.ltp}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom nav */}
            <div style={{ background: "#ffffff", display: "flex", borderTop: "1px solid #ebebeb", padding: "10px 0 6px" }}>
              {[
                { icon: "⊞", label: "Home", active: false },
                { icon: "🔖", label: "Watchlist", active: false },
                { icon: "💼", label: "Portfolio", active: true },
                { icon: "📋", label: "Orders", active: false },
                { icon: "🔧", label: "Tools", active: false },
              ].map((item) => (
                <div key={item.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 9, color: item.active ? "#db620a" : "#767676", fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Caption chips below phone */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {["Portfolio Overview", "P&L Tracking", "Stock Holdings"].map((cap) => (
            <span key={cap} style={{ fontSize: 12, fontWeight: 500, padding: "6px 16px", borderRadius: 100, background: "rgba(212,98,58,0.08)", color: T.clay, border: "1px solid rgba(212,98,58,0.14)", letterSpacing: 0.3 }}>{cap}</span>
          ))}
        </div>
      </section>

      {/* ── Process ── */}
      <section style={{ padding: "clamp(40px,7vw,80px) clamp(20px,6vw,60px)", background: T.cream }}>
        <SectionLabel>The Process</SectionLabel>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,3vw,44px)", fontWeight: 500, letterSpacing: -1, color: T.ink, marginBottom: 48, lineHeight: 1.2 }}>How I approached it</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {[
            { step: "Research", desc: "Analysed in-app behaviour via Hotjar heatmaps and session recordings. Interviewed 15 active investors to understand their mental models around portfolio tracking." },
            { step: "Define", desc: "Created affinity maps and opportunity frameworks. Defined the core job-to-be-done: users want to know at a glance — am I on track, and what should I do next?" },
            { step: "Design", desc: "Designed a unified portfolio view with a health score, allocation breakdown, performance trends, and one-tap actions. Prioritised clarity over data density." },
            { step: "Test", desc: "Conducted A/B prototype testing with 12 users. Validated that the simplified dashboard improved comprehension and confidence in taking next steps." },
          ].map((p, i) => (
            <div key={i} style={{ background: T.white, borderRadius: 20, padding: "32px 28px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(42,31,26,0.04)" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.clay, fontWeight: 500, marginBottom: 8 }}>0{i + 1}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: T.ink, marginBottom: 12 }}>{p.step}</div>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Key Metrics Strip ── */}
      <section style={{ padding: "clamp(40px,6vw,60px) clamp(20px,6vw,60px)", background: T.warmWhite, borderTop: "1px solid rgba(212,98,58,0.12)", borderBottom: "1px solid rgba(212,98,58,0.12)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
          {[
            { num: "35%", label: "Daily active users increase" },
            { num: "15", label: "Investor interviews conducted" },
            { num: "12", label: "Prototype test participants" },
            { num: "3 mo", label: "Design to launch" },
          ].map((stat, i) => (
            <div key={stat.num} style={{ flex: "1 1 140px", textAlign: "center", padding: "20px clamp(16px,3vw,32px)", borderLeft: i % 2 !== 0 ? "1px solid rgba(212,98,58,0.12)" : "none" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px,4vw,60px)", fontWeight: 500, color: T.clay, letterSpacing: -1, lineHeight: 1.1 }}>{stat.num}</div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 8, lineHeight: 1.5 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Outcome ── */}
      <section style={{ padding: "clamp(40px,7vw,80px) clamp(20px,6vw,60px)", background: T.ink, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: T.clay, filter: "blur(100px)", opacity: 0.15, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
          <SectionLabel light>The Outcome</SectionLabel>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, fontWeight: 300 }}>New dashboard increased daily active engagement by 35%. Users reported higher confidence in understanding their portfolio. Feature became the most-used screen in the app post-launch.</p>
        </div>
      </section>

      {/* ── Next Project ── */}
      <section style={{ padding: "clamp(40px,7vw,80px) clamp(20px,6vw,60px)", background: T.cream, textAlign: "center" }}>
        <p style={{ fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", color: T.clay, fontWeight: 500, marginBottom: 16 }}>Next Project</p>
        <Link to="/case-study/reporting-module" style={{ textDecoration: "none" }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px,3vw,40px)", fontWeight: 500, color: T.ink, letterSpacing: -1, marginBottom: 24, lineHeight: 1.2 }}>Reporting Module</h3>
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
