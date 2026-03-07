import { useState, useEffect, useRef } from "react";

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
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "18px 60px",
      background: scrolled ? "rgba(253,246,238,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? `1px solid rgba(212,98,58,0.1)` : "1px solid transparent",
      transition: "all 0.3s ease",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500, color: T.clay, cursor: "pointer" }}
        onClick={() => scroll("hero")}>AJ ✦</span>
      <div style={{ display: "flex", gap: 36 }}>
        {["work", "about", "contact"].map(id => (
          <NavLink key={id} onClick={() => scroll(id)}>{id.charAt(0).toUpperCase() + id.slice(1)}</NavLink>
        ))}
      </div>
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
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 60px 80px", position: "relative", overflow: "hidden", background: T.cream }}>
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
          UX Designer
        </p>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(52px,7vw,96px)", lineHeight: 1.05, fontWeight: 500, letterSpacing: -2, color: T.ink, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.4s" }}>
          Designing things<br />people{" "}
          <em style={{ fontStyle: "italic", color: T.clay }}>love</em> to use
        </h1>

        <p style={{ marginTop: 28, fontSize: 18, color: T.muted, lineHeight: 1.7, maxWidth: 520, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.6s" }}>
          Hi, I'm Ashutosh — I craft thoughtful digital experiences that balance user needs with business goals, with a love for clean interactions and warm aesthetics.
        </p>

        <div style={{ display: "flex", gap: 16, marginTop: 44, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.8s ease forwards 0.8s" }}>
          <Btn primary onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>See my work</Btn>
          <Btn onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>About me</Btn>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 40, left: 60, display: "flex", alignItems: "center", gap: 10, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: T.muted, fontFamily: "'DM Sans', sans-serif", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.2s" }}>
        <div style={{ width: 1, height: 40, background: T.muted, animation: "scrollLine 2s ease-in-out infinite" }} />
        Scroll
      </div>
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
const cases = [
  {
    title: "Redesigning onboarding for a fintech app — from 40% to 78% completion",
    desc: "Led end-to-end UX for a 3-step onboarding overhaul. Research revealed users dropped off at identity verification — we reframed it entirely.",
    tags: [{ label: "Product Design", color: "#fde8d8", text: T.clay }, { label: "Mobile", color: "#fde8d8", text: T.clay }],
    grad: "linear-gradient(135deg,#fde8d8,#f5b899)",
    accent: "#f5b899",
    featured: true,
  },
  {
    title: "Building a design system for a SaaS dashboard",
    desc: "Created a component library and token system that reduced design inconsistencies by 60% across a team of 8 designers.",
    tags: [{ label: "UX Research", color: "#d4eae3", text: "#3d7a6a" }, { label: "Web App", color: "#d4eae3", text: "#3d7a6a" }],
    grad: "linear-gradient(135deg,#d4eae3,#8fcabb)",
    accent: "#8fcabb",
  },
  {
    title: "Designing a habit tracker — concept to launch in 10 weeks",
    desc: "Zero to shipped. Conducted 15 user interviews, 3 rounds of prototype testing, and launched to 2K users in beta.",
    tags: [{ label: "0→1 Product", color: "#fef3e2", text: "#9a6e20" }, { label: "Consumer", color: "#fef3e2", text: "#9a6e20" }],
    grad: "linear-gradient(135deg,#fef3e2,#f5d99a)",
    accent: "#f5d99a",
  },
  {
    title: "Making a government portal accessible to all users",
    desc: "Audited and redesigned a public-facing portal for WCAG AA compliance. Improved task completion by 34% in usability testing.",
    tags: [{ label: "Accessibility", color: "#ede0f5", text: "#7a4aa0" }, { label: "Redesign", color: "#ede0f5", text: "#7a4aa0" }],
    grad: "linear-gradient(135deg,#e8d8f0,#c4a8d8)",
    accent: "#c4a8d8",
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
  const delay = (i % 2) * 0.15;

  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        gridColumn: c.featured ? "span 2" : "span 1",
        display: c.featured ? "grid" : "flex",
        gridTemplateColumns: c.featured ? "1fr 1fr" : undefined,
        flexDirection: c.featured ? undefined : "column",
        background: T.white, borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        cursor: "pointer",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hov ? "0 20px 60px rgba(42,31,26,0.12)" : "0 2px 12px rgba(42,31,26,0.05)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        opacity: vis ? 1 : 0,
        transitionDelay: `${delay}s`,
      }}>
      {/* Image */}
      <div style={{ background: c.grad, display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: c.featured ? "auto" : "16/10", minHeight: c.featured ? 260 : undefined }}>
        <MockupSVG accent={c.accent} />
      </div>
      {/* Body */}
      <div style={{ padding: c.featured ? "48px 40px" : "28px 32px 32px", display: "flex", flexDirection: "column", justifyContent: c.featured ? "center" : "flex-start" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {c.tags.map(t => (
            <span key={t.label} style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.5, padding: "4px 12px", borderRadius: 100, background: t.color, color: t.text, fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>
          ))}
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: c.featured ? 30 : 22, fontWeight: 500, letterSpacing: -0.5, color: T.ink, marginBottom: 10, lineHeight: 1.3 }}>{c.title}</div>
        <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>{c.desc}</p>
        <span style={{ fontSize: 13, fontWeight: 500, color: T.clay, display: "inline-flex", alignItems: "center", gap: hov ? 10 : 6, transition: "gap 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
          View case study →
        </span>
      </div>
    </div>
  );
}

function Work() {
  return (
    <section id="work" style={{ padding: "100px 60px", background: T.warmWhite }}>
      <Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
          <div>
            <SectionLabel>Selected work</SectionLabel>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 500, letterSpacing: -1.5, color: T.ink, lineHeight: 1.1 }}>
              Projects I'm <em style={{ color: T.clay, fontStyle: "italic" }}>proud of</em>
            </h2>
          </div>
          <p style={{ fontSize: 16, color: T.muted, maxWidth: 340, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>A mix of product design, research-led thinking, and end-to-end UX across web and mobile.</p>
        </div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
        {cases.map((c, i) => <CaseCard key={i} c={c} i={i} />)}
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
const skills = ["User Research", "Wireframing", "Prototyping", "Figma", "Design Systems", "Usability Testing", "Information Architecture", "Interaction Design"];

function About() {
  return (
    <section id="about" style={{ padding: "100px 60px", background: T.cream, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
      {/* Visual */}
      <Reveal>
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 320, height: 380, borderRadius: 24, background: "linear-gradient(160deg,#fde8d8,#f0c99a)", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <div style={{ fontSize: 100, lineHeight: 1, paddingBottom: 20, filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.1))" }}>🧑‍💻</div>
          </div>
          <div style={{ position: "absolute", top: 20, right: -10, background: T.white, borderRadius: 16, padding: "14px 20px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)", fontSize: 13, fontWeight: 500, color: T.clay, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>✦ Available for work</div>
          <div style={{ position: "absolute", bottom: 40, left: -20, background: T.white, borderRadius: 16, padding: "14px 20px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: T.clay, display: "block" }}>4+</span>
            <span style={{ fontSize: 11, color: T.muted }}>Years of experience</span>
          </div>
        </div>
      </Reveal>

      {/* Text */}
      <Reveal delay={0.15}>
        <SectionLabel>About me</SectionLabel>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px,3.5vw,52px)", fontWeight: 500, letterSpacing: -1.5, color: T.ink, lineHeight: 1.1, marginBottom: 24 }}>
          Designer who <em style={{ color: T.clay, fontStyle: "italic" }}>listens</em> first
        </h2>
        {[
          <>I'm <strong>Ashutosh Jalan</strong>, a UX Designer passionate about creating experiences that feel natural, delightful, and genuinely useful. I believe the best design is often invisible — it just works.</>,
          <>My process starts with <strong>deep empathy</strong> — I spend time with users before touching any design tool. From research synthesis to polished prototypes, I care about every step of the journey.</>,
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

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" style={{ background: T.ink, textAlign: "center", padding: "120px 60px", position: "relative", overflow: "hidden" }}>
      {[{ w: 400, h: 400, bg: T.clay, top: -100, left: -100 }, { w: 300, h: 300, bg: T.sage, bottom: -80, right: -80 }].map((b, i) => (
        <div key={i} style={{ position: "absolute", width: b.w, height: b.h, borderRadius: "50%", background: b.bg, top: b.top, bottom: b.bottom, left: b.left, right: b.right, filter: "blur(100px)", opacity: 0.15, pointerEvents: "none" }} />
      ))}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionLabel light>Let's connect</SectionLabel>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 500, letterSpacing: -1.5, color: T.white, marginBottom: 20, lineHeight: 1.1 }}>
            Got a project in mind?<br /><em style={{ color: T.terra, fontStyle: "italic" }}>Let's talk.</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, maxWidth: 440, margin: "0 auto 48px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
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
    <footer style={{ background: T.ink, borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
      {["© 2025 Ashutosh Jalan. Crafted with care.", "UX Designer · Based in India"].map((t, i) => (
        <p key={i} style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{t}</p>
      ))}
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useFonts();
  useEffect(() => { document.body.style.cursor = "none"; document.body.style.overflowX = "hidden"; return () => { document.body.style.cursor = ""; }; }, []);

  return (
    <div style={{ background: T.cream, minHeight: "100vh" }}>
      <Cursor />
      <Nav />
      <Hero />
      <Work />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
