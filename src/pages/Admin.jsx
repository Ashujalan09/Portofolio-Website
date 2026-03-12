import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { cases as allCases } from "../App.jsx";

const T = {
  cream: "#fdf6ee", warmWhite: "#fffaf4", clay: "#d4623a", terra: "#e8825c",
  ink: "#2a1f1a", muted: "#7a6a62", white: "#ffffff", sage: "#7a9e8e",
};

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
const SESSION_KEY = "pf_admin_auth";

// ── Shared input style ────────────────────────────────────────────────────────
const inp = {
  width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)",
  fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: T.ink, background: T.white,
  outline: "none", boxSizing: "border-box",
};

// ── Small button ──────────────────────────────────────────────────────────────
function Btn({ children, onClick, danger, outline, small, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: small ? 12 : 14, fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer", borderRadius: 8,
        padding: small ? "6px 14px" : "10px 20px",
        border: outline || danger ? `1.5px solid ${danger ? "#e05c5c" : T.clay}` : "none",
        background: danger ? (hov ? "#e05c5c" : "transparent") : outline ? (hov ? "#fde8d8" : "transparent") : T.clay,
        color: danger ? (hov ? T.white : "#e05c5c") : outline ? T.clay : T.white,
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s",
      }}>
      {children}
    </button>
  );
}

// ── Tab button ────────────────────────────────────────────────────────────────
function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: active ? 500 : 400,
      padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
      color: active ? T.clay : T.muted,
      borderBottom: active ? `2px solid ${T.clay}` : "2px solid transparent",
      transition: "all 0.2s",
    }}>{label}</button>
  );
}

// ── Password Screen ───────────────────────────────────────────────────────────
function PasswordScreen({ onSuccess }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onSuccess(); }
    else { setErr(true); setPw(""); setTimeout(() => setErr(false), 2000); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.cream }}>
      <div style={{ background: T.white, borderRadius: 20, padding: "48px 40px", width: 360, boxShadow: "0 8px 40px rgba(42,31,26,0.1)" }}>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 500, color: T.ink, marginBottom: 8 }}>Admin</p>
        <p style={{ fontSize: 14, color: T.muted, marginBottom: 32, fontFamily: "'DM Sans', sans-serif" }}>Enter your password to continue.</p>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)}
            style={{ ...inp, border: err ? "1.5px solid #e05c5c" : "1px solid rgba(0,0,0,0.12)" }} autoFocus />
          {err && <p style={{ fontSize: 13, color: "#e05c5c", fontFamily: "'DM Sans', sans-serif" }}>Incorrect password.</p>}
          <button type="submit" style={{ padding: "12px", borderRadius: 10, border: "none", background: T.clay, color: T.white, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Sign in
          </button>
        </form>
        <Link to="/" style={{ display: "block", marginTop: 20, fontSize: 13, color: T.muted, textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>← Back to portfolio</Link>
      </div>
    </div>
  );
}

// ── Case Studies Tab ─────────────────────────────────────────────────────────
function CaseStudiesTab() {
  const { caseVisibility, toggleCaseVisibility } = useData();
  const [loading, setLoading] = useState(null);

  const handleToggle = async (slug) => {
    setLoading(slug);
    await toggleCaseVisibility(slug);
    setLoading(null);
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: T.muted, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>
        Toggle visibility of case studies on the public portfolio. Edit functionality coming soon.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allCases.map((c) => {
          const hidden = caseVisibility[c.slug] ?? false;
          return (
            <div key={c.slug} style={{ background: T.white, border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, opacity: hidden ? 0.6 : 1, transition: "opacity 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: hidden ? T.muted : "#4caf7d", flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 500, color: T.ink, marginBottom: 4 }}>{c.title}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    {c.tags.map((t) => <span key={t.label} style={{ fontSize: 11, padding: "2px 10px", borderRadius: 100, background: t.color, color: t.text, fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>)}
                  </div>
                </div>
              </div>
              <Btn small outline={!hidden} danger={false} disabled={loading === c.slug} onClick={() => handleToggle(c.slug)}>
                {loading === c.slug ? "…" : hidden ? "Show" : "Hide"}
              </Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Experience Tab ────────────────────────────────────────────────────────────
const emptyExp = { role: "", company: "", period: "", type: "Full-time", desc: "", highlights: "" };

function ExperienceTab() {
  const { experiences, saveExperience, deleteExperience } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyExp);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setForm(emptyExp); setEditing("new"); };
  const openEdit = (exp) => { setForm({ ...exp, highlights: exp.highlights?.join("\n") || "" }); setEditing(exp.id); };
  const cancel = () => setEditing(null);

  const save = async () => {
    if (!form.role || !form.company) return;
    setSaving(true);
    await saveExperience({ ...form, id: editing === "new" ? undefined : editing, highlights: form.highlights.split("\n").filter(Boolean) });
    setSaving(false);
    setEditing(null);
  };

  const del = async (id) => {
    if (!confirm("Delete this experience?")) return;
    await deleteExperience(id);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <Btn onClick={openNew}>+ Add Experience</Btn>
      </div>

      {editing && (
        <div style={{ background: T.warmWhite, border: `1.5px solid ${T.clay}`, borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 500, color: T.ink, marginBottom: 20 }}>{editing === "new" ? "New Experience" : "Edit Experience"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <input style={inp} placeholder="Role *" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <input style={inp} placeholder="Company *" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <input style={inp} placeholder="Period (e.g. 2022 – 2023)" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
            <select style={inp} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {["Full-time", "Part-time", "Internship", "Freelance", "Contract"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <textarea style={{ ...inp, minHeight: 80, resize: "vertical", marginBottom: 14 }} placeholder="Description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
          <textarea style={{ ...inp, minHeight: 80, resize: "vertical", marginBottom: 20 }} placeholder={"Highlights (one per line)\nLine 1\nLine 2"} value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} />
          <div style={{ display: "flex", gap: 12 }}>
            <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Btn>
            <Btn outline onClick={cancel}>Cancel</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {experiences.map((exp) => (
          <div key={exp.id} style={{ background: T.white, border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "18px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 500, color: T.ink }}>{exp.role}</p>
              <p style={{ fontSize: 13, color: T.clay, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>{exp.company} · {exp.period} · {exp.type}</p>
              <p style={{ fontSize: 13, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>{exp.desc}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <Btn small outline onClick={() => openEdit(exp)}>Edit</Btn>
              <Btn small danger onClick={() => del(exp.id)}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Education Tab ─────────────────────────────────────────────────────────────
const emptyEdu = { degree: "", school: "", year: "", desc: "" };

function EducationTab() {
  const { education, saveEducation, deleteEducation } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEdu);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setForm(emptyEdu); setEditing("new"); };
  const openEdit = (edu) => { setForm(edu); setEditing(edu.id); };
  const cancel = () => setEditing(null);

  const save = async () => {
    if (!form.degree || !form.school) return;
    setSaving(true);
    await saveEducation({ ...form, id: editing === "new" ? undefined : editing });
    setSaving(false);
    setEditing(null);
  };

  const del = async (id) => {
    if (!confirm("Delete this entry?")) return;
    await deleteEducation(id);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <Btn onClick={openNew}>+ Add Education</Btn>
      </div>

      {editing && (
        <div style={{ background: T.warmWhite, border: `1.5px solid ${T.clay}`, borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 500, color: T.ink, marginBottom: 20 }}>{editing === "new" ? "New Education" : "Edit Education"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <input style={inp} placeholder="Degree / Certificate *" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
            <input style={inp} placeholder="School / Institution *" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
            <input style={{ ...inp, gridColumn: "span 2" }} placeholder="Year (e.g. 2018 – 2022)" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>
          <textarea style={{ ...inp, minHeight: 80, resize: "vertical", marginBottom: 20 }} placeholder="Description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
          <div style={{ display: "flex", gap: 12 }}>
            <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Btn>
            <Btn outline onClick={cancel}>Cancel</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {education.map((edu) => (
          <div key={edu.id} style={{ background: T.white, border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "18px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 500, color: T.ink }}>{edu.degree}</p>
              <p style={{ fontSize: 13, color: T.clay, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>{edu.school} · {edu.year}</p>
              <p style={{ fontSize: 13, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>{edu.desc}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <Btn small outline onClick={() => openEdit(edu)}>Edit</Btn>
              <Btn small danger onClick={() => del(edu.id)}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Personal Info Tab ─────────────────────────────────────────────────────────
function PersonalInfoTab() {
  const { personalInfo, savePersonalInfo } = useData();
  const [form, setForm] = useState(personalInfo);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(personalInfo); }, [personalInfo]);

  const save = async () => {
    setSaving(true);
    await savePersonalInfo(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const field = (label, key, multiline) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: T.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>{label}</label>
      {multiline
        ? <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        : <input style={inp} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />}
    </div>
  );

  return (
    <div style={{ maxWidth: 640 }}>
      {field("Full Name", "name")}
      {field("Hero Headline", "heroTitle")}
      {field("Hero Bio", "heroBio", true)}
      {field("About Bio — Paragraph 1", "aboutBio1", true)}
      {field("About Bio — Paragraph 2", "aboutBio2", true)}
      {field("About Bio — Paragraph 3", "aboutBio3", true)}
      {field("Skills (comma-separated)", "skills")}
      {field("Years of Experience", "yearsExperience")}
      {field("Location", "location")}
      {field("Email", "email")}
      {field("LinkedIn URL", "linkedin")}
      {field("Dribbble URL", "dribbble")}

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
        <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Btn>
        {saved && <span style={{ fontSize: 13, color: "#4caf7d", fontFamily: "'DM Sans', sans-serif" }}>Saved!</span>}
      </div>
    </div>
  );
}

// ── Work Logs Tab ─────────────────────────────────────────────────────────────
const CATEGORIES = ["Content Update", "New Feature", "Design Change", "Fix"];
const AREAS = ["Case Studies", "Experience", "Education", "Personal Info", "Admin", "Code & Infrastructure"];
const CATEGORY_COLORS = {
  "Content Update": { bg: "#f0c99a", text: "#7a4a1a" },
  "New Feature":    { bg: "#b8d4c8", text: "#2a5a4a" },
  "Design Change":  { bg: "#e8e0d8", text: "#5a4a3a" },
  "Fix":            { bg: "#fddcdc", text: "#a03030" },
};

const SEED_LOGS = [
  {
    id: "log-seed-1",
    date: "2026-03-08",
    category: "Content Update",
    area: "Case Studies",
    title: "Renamed the NPS case study",
    description: "Changed the project title from \"National Pension Scheme\" to \"Nation Pension Scheme Onboarding\" to more accurately reflect the scope of the work shown.",
  },
  {
    id: "log-seed-2",
    date: "2026-03-07",
    category: "New Feature",
    area: "Admin",
    title: "Admin panel launched",
    description: "Built a password-protected admin section at /admin, making it possible to manage all portfolio content without touching any code. Includes tabs for case studies, work experience, education, and personal info.",
  },
  {
    id: "log-seed-3",
    date: "2026-03-07",
    category: "New Feature",
    area: "Code & Infrastructure",
    title: "Connected to a live cloud database",
    description: "Linked the portfolio to Firebase so all content changes made in the admin panel are saved permanently and show up on the live site instantly — no manual file edits needed.",
  },
  {
    id: "log-seed-4",
    date: "2026-03-07",
    category: "New Feature",
    area: "Case Studies",
    title: "Case study visibility control",
    description: "Added the ability to show or hide individual case studies on the portfolio without deleting them. Useful for temporarily removing work from public view while keeping it stored.",
  },
];

const emptyLog = { date: new Date().toISOString().slice(0, 10), category: "Content Update", area: "Case Studies", title: "", description: "" };

function WorkLogsTab() {
  const { workLogs, saveLog, deleteLog } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyLog);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const openNew = () => { setForm(emptyLog); setEditing("new"); };
  const openEdit = (log) => { setForm(log); setEditing(log.id); };
  const cancel = () => setEditing(null);

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    await saveLog({ ...form, id: editing === "new" ? undefined : editing });
    setSaving(false);
    setEditing(null);
  };

  const del = async (id) => {
    if (!confirm("Delete this log entry?")) return;
    await deleteLog(id);
  };

  const seedHistory = async () => {
    setSeeding(true);
    for (const log of SEED_LOGS) await saveLog(log);
    setSeeding(false);
  };

  const formatDate = (iso) => {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
          A plain-English record of changes made to this website — content updates, new features, and fixes.
        </p>
        <Btn onClick={openNew}>+ Add Log</Btn>
      </div>

      {editing && (
        <div style={{ background: T.warmWhite, border: `1.5px solid ${T.clay}`, borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 500, color: T.ink, marginBottom: 20 }}>
            {editing === "new" ? "New Log Entry" : "Edit Log Entry"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
            <input type="date" style={inp} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <select style={inp} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select style={inp} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
              {AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <input style={{ ...inp, marginBottom: 14 }} placeholder="Title — short description of the change *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea style={{ ...inp, minHeight: 90, resize: "vertical", marginBottom: 20 }} placeholder="Description — what changed and why (plain language, no jargon)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div style={{ display: "flex", gap: 12 }}>
            <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Btn>
            <Btn outline onClick={cancel}>Cancel</Btn>
          </div>
        </div>
      )}

      {workLogs.length === 0 && !editing && (
        <div style={{ background: T.white, border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "40px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 15, color: T.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>No logs yet.</p>
          <Btn outline onClick={seedHistory} disabled={seeding}>
            {seeding ? "Loading history…" : "Load previous change history"}
          </Btn>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {workLogs.map((log) => {
          const catColor = CATEGORY_COLORS[log.category] || CATEGORY_COLORS["Content Update"];
          return (
            <div key={log.id} style={{ background: T.white, border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>{formatDate(log.date)}</span>
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 100, background: catColor.bg, color: catColor.text, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{log.category}</span>
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 100, background: "rgba(0,0,0,0.05)", color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>{log.area}</span>
                  </div>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 500, color: T.ink, marginBottom: 6 }}>{log.title}</p>
                  {log.description && <p style={{ fontSize: 13, color: T.muted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>{log.description}</p>}
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Btn small outline onClick={() => openEdit(log)}>Edit</Btn>
                  <Btn small danger onClick={() => del(log.id)}>Delete</Btn>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
const TABS = ["Case Studies", "Experience", "Education", "Personal Info", "Work Logs"];

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: T.cream, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Nav */}
      <nav style={{ background: T.white, borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "16px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link to="/" style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 500, color: T.clay, textDecoration: "none" }}>AJ ✦</Link>
          <span style={{ fontSize: 13, color: T.muted, background: "#fde8d8", padding: "3px 10px", borderRadius: 100 }}>Admin</span>
        </div>
        <button onClick={onLogout} style={{ background: "none", border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: T.muted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Log out</button>
      </nav>

      {/* Tabs */}
      <div style={{ background: T.white, borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0 48px" }}>
        <div style={{ display: "flex" }}>
          {TABS.map((t, i) => <Tab key={t} label={t} active={tab === i} onClick={() => setTab(i)} />)}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "40px 48px", maxWidth: 900 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 500, color: T.ink, marginBottom: 28 }}>{TABS[tab]}</h2>
        {tab === 0 && <CaseStudiesTab />}
        {tab === 1 && <ExperienceTab />}
        {tab === 2 && <EducationTab />}
        {tab === 3 && <PersonalInfoTab />}
        {tab === 4 && <WorkLogsTab />}
      </div>
    </div>
  );
}

// ── Admin Page (root export) ──────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem(SESSION_KEY));

  const login = () => { sessionStorage.setItem(SESSION_KEY, "1"); setAuthed(true); };
  const logout = () => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); };

  return authed ? <Dashboard onLogout={logout} /> : <PasswordScreen onSuccess={login} />;
}
