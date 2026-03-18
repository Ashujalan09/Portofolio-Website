import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import NationalPensionScheme from "./pages/case-studies/NationalPensionScheme.jsx";
import InvestmentPortfolio from "./pages/case-studies/InvestmentPortfolio.jsx";
import ReportingModule from "./pages/case-studies/ReportingModule.jsx";
import SaasDashboard from "./pages/case-studies/SaasDashboard.jsx";
import AdminPage from "./pages/Admin.jsx";
import { DataProvider, useData } from "./context/DataContext.jsx";

// ── Tokens ────────────────────────────────────────────────────────────────────
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

// ── Google Fonts injector ─────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    if (document.getElementById("pf-fonts")) return;
    const link = document.createElement("link");
    link.id = "pf-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400;1,9..144,500&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ── useWindowWidth ────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ── useInView ─────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Reveal wrapper ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Custom Cursor ─────────────────────────────────────────────────────────────
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });
  const hovering = useRef(false);

  useEffect(() => {
    const onMove = (e) => { pos.current.mx = e.clientX; pos.current.my = e.clientY; };
    document.addEventListener("mousemove", onMove);

    const links = () => document.querySelectorAll("a, button");
    const enter = () => { hovering.current = true; };
    const leave = () => { hovering.current = false; };
    const attach = () => links().forEach(l => { l.addEventListener("mouseenter", enter); l.addEventListener("mouseleave", leave); });
    attach();

    let raf;
    const loop = () => {
      const p = pos.current;
      p.rx += (p.mx - p.rx) * 0.12;
      p.ry += (p.my - p.ry) * 0.12;
      if (dotRef.current) { dotRef.current.style.left = p.mx + "px"; dotRef.current.style.top = p.my + "px"; }
      if (ringRef.current) { ringRef.current.style.left = p.rx + "px"; ringRef.current.style.top = p.ry + "px"; }
      const s = hovering.current ? "6px" : "12px";
      const rs = hovering.current ? "52px" : "36px";
      if (dotRef.current) { dotRef.current.style.width = s; dotRef.current.style.height = s; }
      if (ringRef.current) { ringRef.current.style.width = rs; ringRef.current.style.height = rs; }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  const base = { position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transform: "translate(-50%,-50%)", transition: "width 0.2s, height 0.2s" };
  return (
    <>
      <div ref={dotRef} style={{ ...base, width: 12, height: 12, background: T.clay }} />
      <div ref={ringRef} style={{ ...base, width: 36, height: 36, border: `1.5px solid ${T.clay}`, background: "transparent", opacity: 0.5, zIndex: 9998 }} />
    </>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 768;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navItems = ["work", "experience", "education", "about", "contact"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: `18px clamp(20px,5vw,60px)`,
      background: scrolled || menuOpen ? "rgba(253,246,238,0.95)" : "transparent",
      backdropFilter: scrolled || menuOpen ? "blur(14px)" : "none",
      borderBottom: scrolled || menuOpen ? `1px solid rgba(212,98,58,0.1)` : "1px solid transparent",
      transition: "all 0.3s ease",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500, color: T.clay, cursor: "pointer" }}
        onClick={() => scroll("hero")}>AJ ✦</span>

      {isMobile ? (
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{ background: "none", border: "none", cursor: "pointer", color: T.clay, fontSize: 22, lineHeight: 1, padding: 4, display: "flex", alignItems: "center" }}
          aria-label="Toggle menu">
          {menuOpen ? "✕" : "☰"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: 36 }}>
          {navItems.map(id => (
            <NavLink key={id} onClick={() => scroll(id)}>{id.charAt(0).toUpperCase() + id.slice(1)}</NavLink>
          ))}
        </div>
      )}

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "rgba(253,246,238,0.97)", backdropFilter: "blur(16px)",
          borderBottom: `1px solid rgba(212,98,58,0.1)`,
          padding: "8px 0 16px",
          display: "flex", flexDirection: "column",
        }}>
          {navItems.map(id => (
            <button key={id} onClick={() => scroll(id)}
              style={{ background: "none", border: "none", borderBottom: "1px solid rgba(212,98,58,0.07)", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 400, color: T.ink, padding: "14px clamp(20px,5vw,60px)" }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function NavLink({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 400, color: hov ? T.clay : T.muted, transition: "color 0.2s", position: "relative", padding: 0 }}>
      {children}
      <span style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 1.5, background: T.clay, transform: hov ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.25s ease" }} />
    </button>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
const blobAnim = `
@keyframes blobFloat {
  0%,100%{transform:translate(0,0) scale(1)}
  33%{transform:translate(20px,-20px) scale(1.05)}
  66%{transform:translate(-15px,15px) scale(0.97)}
}
@keyframes fadeUp {
  from{opacity:0;transform:translateY(24px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes scrollLine {
  0%,100%{transform:scaleY(1);opacity:0.5}
  50%{transform:scaleY(0.4);opacity:1}
}
`;

function Hero() {
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: `clamp(100px,15vw,120px) clamp(20px,6vw,60px) 80px`, position: "relative", overflow: "hidden", background: T.cream }}>
      <style>{blobAnim}</style>
      {/* Blobs */}
      {[
        { w: 500, h: 500, bg: T.sand, top: -100, right: -100, dur: "8s", delay: "0s" },
        { w: 300, h: 300, bg: T.sageLight, bottom: 0, left: -50, dur: "10s", delay: "0s", dir: "reverse" },
        { w: 200, h: 200, bg: T.terra, top: "40%", right: "20%", dur: "7s", delay: "2s", opacity: 0.2 },
      ].map((b, i) => (
        <div key={i} style={{ position: "absolute", width: b.w, height: b.h, borderRadius: "50%", background: b.bg, top: b.top, bottom: b.bottom, left: b.left, right: b.right, filter: "blur(80px)", opacity: b.opacity ?? 0.35, animation: `blobFloat ${b.dur} ease-in-out infinite ${b.delay ?? ""} ${b.dir ?? ""}`, pointerEvents: "none" }} />
      ))}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 840 }}>
        <p style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: T.clay, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, display: "flex", alignItems: "center", gap: 10, marginBottom: 24, opacity: 0, animation: "fadeUp 0.7s ease forwards 0.2s" }}>
          <span style={{ width: 32, height: 1.5, background: T.clay, display: "inline-block" }} />
          Product Designer
        </p>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(40px,7vw,96px)", lineHeight: 1.05, fontWeight: 500, letterSpacing: -2, color: T.ink, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.4s" }}>
          Designing things<br />people{" "}
          <em style={{ fontStyle: "italic", color: T.clay }}>love</em> to use
        </h1>

        <p style={{ marginTop: 28, fontSize: "clamp(15px,2vw,18px)", color: T.muted, lineHeight: 1.7, maxWidth: 520, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.6s" }}>
          Hi, I'm Ashutosh — a Product Designer who turns complex problems into intuitive, impactful experiences. I bridge user needs, business goals, and technical constraints to ship products people love.
        </p>

        <div style={{ display: "flex", gap: 16, marginTop: 44, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.8s ease forwards 0.8s" }}>
          <Btn primary onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>See my work</Btn>
          <Btn onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>About me</Btn>
        </div>
      </div>

      {!isMobile && (
        <div style={{ position: "absolute", bottom: 40, left: "clamp(20px,6vw,60px)", display: "flex", alignItems: "center", gap: 10, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: T.muted, fontFamily: "'DM Sans', sans-serif", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.2s" }}>
          <div style={{ width: 1, height: 40, background: T.muted, animation: "scrollLine 2s ease-in-out infinite" }} />
          Scroll
        </div>
      )}
    </section>
  );
}

function Btn({ children, primary, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, cursor: "pointer", borderRadius: 100, padding: "14px 32px", border: primary ? "none" : `1.5px solid ${T.clay}`,
        background: primary ? T.clay : hov ? T.clay : "transparent",
        color: primary ? T.white : hov ? T.white : T.clay,
        boxShadow: primary ? `0 4px 20px rgba(212,98,58,${hov ? 0.4 : 0.3})` : "none",
        transform: hov ? "translateY(-2px)" : "none",
        transition: "all 0.2s ease",
      }}>
      {children}
    </button>
  );
}

// ── Case Studies ──────────────────────────────────────────────────────────────
export const cases = [
  {
    slug: "national-pension-scheme",
    title: "Nation Pension Scheme Onboarding",
    subtitle: "Redesigning the NPS experience for millions of subscribers",
    desc: "End-to-end redesign of the National Pension Scheme portal — simplifying complex financial workflows and making retirement planning accessible to all.",
    tags: [{ label: "Product Design", color: "#fde8d8", text: T.clay }, { label: "Gov-Tech", color: "#fde8d8", text: T.clay }],
    grad: "linear-gradient(135deg,#fde8d8,#f5b899)",
    accent: "#f5b899",
    featured: true,
    role: "Lead UX Designer",
    timeline: "4 months",
    tools: "Figma, Maze, Miro",
    problem: "The existing NPS portal was overwhelming for first-time users, with dense financial jargon, unclear navigation, and no guidance through key actions like account setup, fund selection, or withdrawal. Drop-off rates were high and user trust was low.",
    process: [
      { step: "Research", desc: "Conducted 20+ interviews with NPS subscribers across age groups. Ran contextual inquiry sessions and analysed support ticket themes to identify top pain points." },
      { step: "Define", desc: "Synthesised findings into user personas and journey maps. Prioritised three critical flows: onboarding, contribution tracking, and withdrawal initiation." },
      { step: "Design", desc: "Designed simplified, step-by-step flows with plain-language copy, progress indicators, and contextual help. Created a component library aligned to government design standards." },
      { step: "Test", desc: "Ran 3 rounds of usability testing with 8 participants each. Iterated on information hierarchy, form design, and error states based on findings." },
    ],
    outcome: "Redesigned portal reduced average task completion time by 42%. Onboarding drop-off decreased significantly. Received positive feedback from both subscribers and administrators during pilot rollout.",
  },
  {
    slug: "investment-portfolio",
    title: "Investment Portfolio",
    subtitle: "Helping users understand and manage their investments at a glance",
    desc: "Designed an intuitive investment portfolio dashboard that turns complex financial data into clear, actionable insights for retail investors.",
    tags: [{ label: "UX Design", color: "#d4eae3", text: "#3d7a6a" }, { label: "Fintech", color: "#d4eae3", text: "#3d7a6a" }],
    grad: "linear-gradient(135deg,#d4eae3,#8fcabb)",
    accent: "#8fcabb",
    role: "Product Designer",
    timeline: "3 months",
    tools: "Figma, FigJam, Hotjar",
    problem: "Retail investors using the platform struggled to understand their overall portfolio health. Data was fragmented across multiple screens, charts were hard to interpret, and users couldn't easily act on insights — leading to low engagement and high churn.",
    process: [
      { step: "Research", desc: "Analysed in-app behaviour via Hotjar heatmaps and session recordings. Interviewed 15 active investors to understand their mental models around portfolio tracking." },
      { step: "Define", desc: "Created affinity maps and opportunity frameworks. Defined the core job-to-be-done: users want to know at a glance — am I on track, and what should I do next?" },
      { step: "Design", desc: "Designed a unified portfolio view with a health score, allocation breakdown, performance trends, and one-tap actions. Prioritised clarity over data density." },
      { step: "Test", desc: "Conducted A/B prototype testing with 12 users. Validated that the simplified dashboard improved comprehension and confidence in taking next steps." },
    ],
    outcome: "New dashboard increased daily active engagement by 35%. Users reported higher confidence in understanding their portfolio. Feature became the most-used screen in the app post-launch.",
  },
  {
    slug: "reporting-module",
    title: "Reporting Module",
    subtitle: "Turning data into decisions for operations teams",
    desc: "Designed a flexible reporting module for a B2B SaaS platform, enabling operations teams to generate, customise, and share reports without needing engineering support.",
    tags: [{ label: "B2B SaaS", color: "#fef3e2", text: "#9a6e20" }, { label: "Data UX", color: "#fef3e2", text: "#9a6e20" }],
    grad: "linear-gradient(135deg,#fef3e2,#f5d99a)",
    accent: "#f5d99a",
    role: "Senior UX Designer",
    timeline: "3 months",
    tools: "Figma, Notion, Loom",
    problem: "Operations teams were dependent on the engineering team to pull custom reports — a process that took 3–5 days per request. This created bottlenecks, slowed decisions, and frustrated both teams.",
    process: [
      { step: "Research", desc: "Shadowed operations managers during their reporting workflows. Identified 8 recurring report types and the most common customisation needs across 5 customer accounts." },
      { step: "Define", desc: "Mapped out the end-to-end reporting journey. Defined three user types — viewers, editors, and admins — with distinct needs and permission levels." },
      { step: "Design", desc: "Designed a drag-and-drop report builder with pre-built templates, filter controls, and scheduling options. Included a preview mode and one-click sharing." },
      { step: "Test", desc: "Ran task-based usability tests with 6 operations managers. Refined the template library and simplified the filter UI based on where users got stuck." },
    ],
    outcome: "Reporting module reduced engineering dependency for report generation by 80%. Teams could self-serve reports in under 5 minutes. Customer satisfaction scores for the feature improved by 28 points.",
  },
  {
    slug: "saas-dashboard",
    title: "SaaS Dashboard",
    subtitle: "A unified command centre for platform administrators",
    desc: "Led the redesign of a SaaS platform's admin dashboard — consolidating fragmented tools into a cohesive workspace that helps admins monitor, manage, and act efficiently.",
    tags: [{ label: "Design Systems", color: "#ede0f5", text: "#7a4aa0" }, { label: "Web App", color: "#ede0f5", text: "#7a4aa0" }],
    grad: "linear-gradient(135deg,#e8d8f0,#c4a8d8)",
    accent: "#c4a8d8",
    role: "Lead UX Designer",
    timeline: "5 months",
    tools: "Figma, Storybook, Zeroheight",
    problem: "Platform admins were juggling 4 separate tools to manage users, billing, analytics, and support. Context switching was constant, critical alerts were missed, and onboarding new admins took weeks.",
    process: [
      { step: "Research", desc: "Ran a 2-week diary study with 8 admins to understand daily workflows. Identified the top 10 tasks by frequency and urgency across all existing tools." },
      { step: "Define", desc: "Defined a unified information architecture grouping tasks by workflow — not tool origin. Created a priority matrix to decide what appears on the main dashboard view." },
      { step: "Design", desc: "Built a modular dashboard with customisable widgets, a global search, and a notification centre. Developed a full component library with 80+ components documented in Zeroheight." },
      { step: "Test", desc: "Ran 4 rounds of testing including first-click tests, task flows, and a 2-week beta with 12 admins. Iterated on widget layout, navigation labels, and alert hierarchy." },
    ],
    outcome: "Consolidated 4 tools into one. Admin onboarding time dropped from 3 weeks to 4 days. Task completion rate on critical actions improved by 55%. Design system adopted across 3 product teams.",
  },
];

function MockupSVG({ accent }) {
  return (
    <div style={{ width: "72%", maxWidth: 280, background: T.white, borderRadius: 12, padding: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", transform: "perspective(600px) rotateY(-5deg) rotateX(3deg)" }}>
      {[accent, "#f0f0f0"].map((c, i) => <div key={i} style={{ height: 8, background: c, borderRadius: 4, marginBottom: 10, width: i === 1 ? "60%" : "100%" }} />)}
      {[100, 80, 55].map((w, i) => <div key={i} style={{ height: 6, background: "#f5f5f5", borderRadius: 3, marginBottom: 7, width: `${w}%` }} />)}
      <div style={{ height: 40, background: accent, borderRadius: 8, marginTop: 12, opacity: 0.7 }} />
    </div>
  );
}

function CaseCard({ c, i }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useInView(0.1);
  const w = useWindowWidth();
  const isMobile = w < 768;
  const delay = (i % 2) * 0.15;
  const isFeatured = c.featured && !isMobile;

  return (
    <Link ref={ref} to={`/case-study/${c.slug}`}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        gridColumn: isFeatured ? "span 2" : "span 1",
        display: isFeatured ? "grid" : "flex",
        gridTemplateColumns: isFeatured ? "1fr 1fr" : undefined,
        flexDirection: isFeatured ? undefined : "column",
        background: T.white, borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        cursor: "pointer", textDecoration: "none",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hov ? "0 20px 60px rgba(42,31,26,0.12)" : "0 2px 12px rgba(42,31,26,0.05)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        opacity: vis ? 1 : 0,
        transitionDelay: `${delay}s`,
      }}>
      {/* Image */}
      <div style={{ background: c.grad, display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: isFeatured ? "auto" : "16/10", minHeight: isFeatured ? 260 : undefined }}>
        <MockupSVG accent={c.accent} />
      </div>
      {/* Body */}
      <div style={{ padding: isFeatured ? "48px 40px" : "24px 28px 28px", display: "flex", flexDirection: "column", justifyContent: isFeatured ? "center" : "flex-start" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {c.tags.map(t => (
            <span key={t.label} style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.5, padding: "4px 12px", borderRadius: 100, background: t.color, color: t.text, fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>
          ))}
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: isFeatured ? 30 : 22, fontWeight: 500, letterSpacing: -0.5, color: T.ink, marginBottom: 10, lineHeight: 1.3 }}>{c.title}</div>
        <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>{c.desc}</p>
        <span style={{ fontSize: 13, fontWeight: 500, color: T.clay, display: "inline-flex", alignItems: "center", gap: hov ? 10 : 6, transition: "gap 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
          View case study →
        </span>
      </div>
    </Link>
  );
}

function Work() {
  const { cases: visibleCases } = useData();
  const w = useWindowWidth();
  const isMobile = w < 768;
  return (
    <section id="work" style={{ padding: `clamp(60px,8vw,100px) clamp(20px,6vw,60px)`, background: T.warmWhite }}>
      <Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
          <div>
            <SectionLabel>Selected work</SectionLabel>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px,4vw,56px)", fontWeight: 500, letterSpacing: -1.5, color: T.ink, lineHeight: 1.1 }}>
              Projects I'm <em style={{ color: T.clay, fontStyle: "italic" }}>proud of</em>
            </h2>
          </div>
          <p style={{ fontSize: 16, color: T.muted, maxWidth: 340, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>End-to-end product design — from research and strategy through to polished, shipped experiences across web and mobile.</p>
        </div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 24 }}>
        {visibleCases.map((c, i) => <CaseCard key={i} c={c} i={i} />)}
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
const skills = ["Product Strategy", "User Research", "Wireframing", "Prototyping", "Figma", "Design Systems", "Usability Testing", "Interaction Design", "Stakeholder Management", "Information Architecture"];

function About() {
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section id="about" style={{ padding: `clamp(60px,8vw,100px) clamp(20px,6vw,60px)`, background: T.cream, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 48 : 80, alignItems: "center" }}>
      {/* Visual */}
      <Reveal>
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div style={{ width: isMobile ? "100%" : 320, maxWidth: 320, height: 380, borderRadius: 24, background: "linear-gradient(160deg,#fde8d8,#f0c99a)", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <div style={{ fontSize: 100, lineHeight: 1, paddingBottom: 20, filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.1))" }}>🧑‍💻</div>
          </div>
          <div style={{ position: "absolute", top: 20, right: isMobile ? 0 : -10, background: T.white, borderRadius: 16, padding: "12px 16px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)", fontSize: 12, fontWeight: 500, color: T.clay, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>✦ Available for work</div>
          <div style={{ position: "absolute", bottom: 40, left: isMobile ? 0 : -20, background: T.white, borderRadius: 16, padding: "12px 16px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: T.clay, display: "block" }}>4+</span>
            <span style={{ fontSize: 11, color: T.muted }}>Years of experience</span>
          </div>
        </div>
      </Reveal>

      {/* Text */}
      <Reveal delay={0.15}>
        <SectionLabel>About me</SectionLabel>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,3.5vw,52px)", fontWeight: 500, letterSpacing: -1.5, color: T.ink, lineHeight: 1.1, marginBottom: 24 }}>
          Designer who <em style={{ color: T.clay, fontStyle: "italic" }}>thinks</em> in systems
        </h2>
        {[
          <>I'm <strong>Ashutosh Jalan</strong>, a Product Designer passionate about shaping products from concept to launch. I believe great design lives at the intersection of user empathy, business clarity, and technical possibility.</>,
          <>My process starts with <strong>understanding the problem deeply</strong> — talking to users, studying data, and aligning with stakeholders. From early discovery to final handoff, I care about every decision along the way.</>,
          <>When I'm not designing, I'm obsessing over <strong>personal productivity systems</strong>, exploring new apps, or sketching ideas in my notebook.</>
        ].map((t, i) => (
          <p key={i} style={{ fontSize: 16, color: T.muted, lineHeight: 1.8, marginBottom: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{t}</p>
        ))}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
          {skills.map(s => <SkillPill key={s}>{s}</SkillPill>)}
        </div>
      </Reveal>
    </section>
  );
}

function SkillPill({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <span onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? "#fde8d8" : T.white, border: `1px solid ${hov ? T.clay : "rgba(212,98,58,0.2)"}`, color: T.ink, padding: "8px 18px", borderRadius: 100, fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", cursor: "default" }}>
      {children}
    </span>
  );
}

// ── Work Experience ───────────────────────────────────────────────────────────

function Experience() {
  const { experiences } = useData();
  return (
    <section id="experience" style={{ padding: `clamp(60px,8vw,100px) clamp(20px,6vw,60px)`, background: T.cream }}>
      <Reveal>
        <SectionLabel>Work Experience</SectionLabel>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px,4vw,56px)", fontWeight: 500, letterSpacing: -1.5, color: T.ink, lineHeight: 1.1, marginBottom: 60 }}>
          Where I've <em style={{ color: T.clay, fontStyle: "italic" }}>worked</em>
        </h2>
      </Reveal>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {experiences.map((e, i) => <ExpCard key={i} e={e} i={i} />)}
      </div>
    </section>
  );
}

function ExpCard({ e, i }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={i * 0.1}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          background: T.white, borderRadius: 20, padding: `clamp(24px,4vw,36px) clamp(20px,4vw,40px)`,
          border: `1px solid ${hov ? "rgba(212,98,58,0.25)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: hov ? "0 12px 40px rgba(42,31,26,0.1)" : "0 2px 12px rgba(42,31,26,0.04)",
          transform: hov ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.3s ease",
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: T.ink, marginBottom: 4 }}>{e.role}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.clay, fontFamily: "'DM Sans', sans-serif" }}>{e.company}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1, color: T.clay, fontFamily: "'DM Sans', sans-serif", background: "#fde8d8", padding: "4px 12px", borderRadius: 100 }}>{e.period}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: T.muted, fontFamily: "'DM Sans', sans-serif", background: "rgba(0,0,0,0.04)", padding: "4px 12px", borderRadius: 100 }}>{e.type}</span>
          </div>
        </div>
        <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>{e.desc}</p>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
          {e.highlights.map((h, j) => (
            <li key={j} style={{ fontSize: 13, color: T.ink, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ color: T.clay, marginTop: 2, flexShrink: 0 }}>✦</span>
              {h}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────

function Education() {
  const { education } = useData();
  return (
    <section id="education" style={{ padding: `clamp(60px,8vw,100px) clamp(20px,6vw,60px)`, background: T.warmWhite }}>
      <Reveal>
        <SectionLabel>Education</SectionLabel>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px,4vw,56px)", fontWeight: 500, letterSpacing: -1.5, color: T.ink, lineHeight: 1.1, marginBottom: 60 }}>
          Where I <em style={{ color: T.clay, fontStyle: "italic" }}>learned</em> to design
        </h2>
      </Reveal>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {education.map((e, i) => <EduCard key={i} e={e} i={i} />)}
      </div>
    </section>
  );
}

function EduCard({ e, i }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={i * 0.1}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          background: T.white, borderRadius: 20, padding: `clamp(24px,4vw,36px) clamp(20px,4vw,40px)`,
          border: `1px solid ${hov ? "rgba(212,98,58,0.25)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: hov ? "0 12px 40px rgba(42,31,26,0.1)" : "0 2px 12px rgba(42,31,26,0.04)",
          transform: hov ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.3s ease",
          display: "flex", gap: "clamp(16px,4vw,40px)", alignItems: "flex-start", flexWrap: "wrap",
        }}>
        <div style={{ minWidth: 100 }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1, color: T.clay, fontFamily: "'DM Sans', sans-serif", background: "#fde8d8", padding: "4px 12px", borderRadius: 100 }}>{e.year}</span>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: T.ink, marginBottom: 4 }}>{e.degree}</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.clay, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>{e.school}</div>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{e.desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" style={{ background: T.ink, textAlign: "center", padding: `clamp(80px,12vw,120px) clamp(20px,6vw,60px)`, position: "relative", overflow: "hidden" }}>
      {[{ w: 400, h: 400, bg: T.clay, top: -100, left: -100 }, { w: 300, h: 300, bg: T.sage, bottom: -80, right: -80 }].map((b, i) => (
        <div key={i} style={{ position: "absolute", width: b.w, height: b.h, borderRadius: "50%", background: b.bg, top: b.top, bottom: b.bottom, left: b.left, right: b.right, filter: "blur(100px)", opacity: 0.15, pointerEvents: "none" }} />
      ))}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionLabel light>Let's connect</SectionLabel>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px,4vw,56px)", fontWeight: 500, letterSpacing: -1.5, color: T.white, marginBottom: 20, lineHeight: 1.1 }}>
            Got a project in mind?<br /><em style={{ color: T.terra, fontStyle: "italic" }}>Let's talk.</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(15px,2vw,17px)", maxWidth: 440, margin: "0 auto 48px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            I'm open to freelance projects, full-time roles, and interesting collaborations. Say hello — I'd love to hear from you.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <ContactBtn primary href="mailto:hello@ashutoshjalan.com">✉ Say hello</ContactBtn>
            <ContactBtn href="https://linkedin.com/in/ashutoshjalan" target="_blank">LinkedIn</ContactBtn>
            <ContactBtn href="https://dribbble.com/ashutoshjalan" target="_blank">Dribbble</ContactBtn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactBtn({ children, primary, href, target }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target={target}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 100, textDecoration: "none", fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
        background: primary ? T.clay : hov ? "rgba(255,255,255,0.08)" : "transparent",
        color: T.white,
        border: primary ? "none" : "1.5px solid rgba(255,255,255,0.3)",
        boxShadow: primary ? "0 4px 20px rgba(212,98,58,0.4)" : "none",
        transform: hov ? "translateY(-3px)" : "none",
        transition: "all 0.2s ease",
      }}>
      {children}
    </a>
  );
}

// ── SectionLabel ──────────────────────────────────────────────────────────────
function SectionLabel({ children, light }) {
  return (
    <p style={{ fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", color: light ? T.terra : T.clay, fontWeight: 500, display: "flex", alignItems: "center", gap: 10, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>
      <span style={{ width: 24, height: 1.5, background: light ? T.terra : T.clay, display: "inline-block" }} />
      {children}
    </p>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: T.ink, borderTop: "1px solid rgba(255,255,255,0.07)", padding: `28px clamp(20px,6vw,60px)`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
      {["© 2025 Ashutosh Jalan. Crafted with care.", "Product Designer · Based in India"].map((t, i) => (
        <p key={i} style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{t}</p>
      ))}
    </footer>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <div style={{ background: T.cream, minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <Work />
      <About />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useFonts();
  useEffect(() => { document.body.style.cursor = "none"; document.body.style.overflowX = "hidden"; return () => { document.body.style.cursor = ""; }; }, []);

  return (
    <DataProvider>
      <Cursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/case-study/national-pension-scheme" element={<NationalPensionScheme />} />
        <Route path="/case-study/investment-portfolio" element={<InvestmentPortfolio />} />
        <Route path="/case-study/reporting-module" element={<ReportingModule />} />
        <Route path="/case-study/saas-dashboard" element={<SaasDashboard />} />
        <Route path="/portal" element={<AdminPage />} />
      </Routes>
    </DataProvider>
  );
}
