import { createContext, useContext, useEffect, useState } from "react";
import { fetchCollection, saveDoc, removeDoc } from "../firebase.js";
import { cases as hardcodedCases } from "../App.jsx";

// ── Hardcoded defaults (fallback if Firestore is empty) ──────────────────────
const defaultExperiences = [
  {
    id: "exp-1",
    role: "Senior UX Designer",
    company: "Finstack Technologies",
    period: "2023 – Present",
    type: "Full-time",
    desc: "Leading design for a B2B fintech platform used by 50K+ businesses.",
    highlights: ["Redesigned onboarding flow, lifting completion from 40% to 78%", "Built and maintained a design system with 120+ components", "Mentored 2 junior designers"],
  },
  {
    id: "exp-2",
    role: "UX Designer",
    company: "Craft Studio",
    period: "2022 – 2023",
    type: "Full-time",
    desc: "Worked on consumer apps and SaaS products across e-commerce, health, and edtech verticals.",
    highlights: ["Shipped 4 major product features in 12 months", "Ran 30+ usability sessions across 3 products", "Reduced support tickets by 22% through better UX"],
  },
  {
    id: "exp-3",
    role: "Product Design Intern",
    company: "Groww",
    period: "2021 – 2022",
    type: "Internship",
    desc: "Assisted the core design team in research synthesis, wireframing, and prototyping.",
    highlights: ["Contributed to a redesign that improved DAU by 15%", "Created 40+ Figma components for the design system"],
  },
];

const defaultEducation = [
  {
    id: "edu-1",
    degree: "B.Des in Interaction Design",
    school: "National Institute of Design",
    year: "2018 – 2022",
    desc: "Focused on human-centered design, interaction design principles, and user research methodologies.",
  },
  {
    id: "edu-2",
    degree: "UX Design Professional Certificate",
    school: "Google / Coursera",
    year: "2022",
    desc: "Completed a 7-course program covering the end-to-end UX design process.",
  },
  {
    id: "edu-3",
    degree: "Higher Secondary (Science)",
    school: "Delhi Public School",
    year: "2018",
    desc: "Graduated with distinction, with a focus on mathematics and computer science.",
  },
];

const defaultPersonalInfo = {
  name: "Ashutosh Jalan",
  heroTitle: "Designing things people love to use",
  heroBio: "Hi, I'm Ashutosh — I craft thoughtful digital experiences that balance user needs with business goals, with a love for clean interactions and warm aesthetics.",
  aboutBio1: "I'm Ashutosh Jalan, a UX Designer passionate about creating experiences that feel natural, delightful, and genuinely useful. I believe the best design is often invisible — it just works.",
  aboutBio2: "My process starts with deep empathy — I spend time with users before touching any design tool. From research synthesis to polished prototypes, I care about every step of the journey.",
  aboutBio3: "When I'm not designing, I'm obsessing over personal productivity systems, exploring new apps, or sketching ideas in my notebook.",
  skills: "User Research,Wireframing,Prototyping,Figma,Design Systems,Usability Testing,Information Architecture,Interaction Design",
  email: "hello@ashutoshjalan.com",
  linkedin: "https://linkedin.com/in/ashutoshjalan",
  dribbble: "https://dribbble.com/ashutoshjalan",
  yearsExperience: "4+",
  location: "India",
};

// ── Context ──────────────────────────────────────────────────────────────────
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [experiences, setExperiences] = useState(defaultExperiences);
  const [education, setEducation] = useState(defaultEducation);
  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const [caseVisibility, setCaseVisibility] = useState({});
  const [workLogs, setWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [visSnap, expSnap, eduSnap, infoSnap, logsSnap] = await Promise.all([
          fetchCollection("caseVisibility"),
          fetchCollection("experiences"),
          fetchCollection("education"),
          fetchCollection("personalInfo"),
          fetchCollection("workLogs"),
        ]);

        // Case visibility map: { slug: true/false }
        const visMap = {};
        visSnap.forEach((d) => { visMap[d.id] = d.hidden ?? false; });
        setCaseVisibility(visMap);

        if (expSnap.length > 0) setExperiences(expSnap);
        if (eduSnap.length > 0) setEducation(eduSnap);
        if (infoSnap.length > 0) setPersonalInfo({ ...defaultPersonalInfo, ...infoSnap[0] });
        if (logsSnap.length > 0) setWorkLogs([...logsSnap].sort((a, b) => b.date.localeCompare(a.date)));
      } catch (err) {
        console.error("Firebase initialization/fetch failed:", err);
        // Firebase not configured yet — use defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Visible cases = hardcoded list minus hidden ones
  const cases = hardcodedCases.filter((c) => !caseVisibility[c.slug]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const today = () => new Date().toISOString().slice(0, 10);

  async function toggleCaseVisibility(slug) {
    const isHidden = caseVisibility[slug] ?? false;
    const next = !isHidden;
    await saveDoc("caseVisibility", slug, { hidden: next });
    setCaseVisibility((prev) => ({ ...prev, [slug]: next }));
    const caseTitle = hardcodedCases.find((c) => c.slug === slug)?.title ?? slug;
    await saveLog({
      date: today(), category: "Content Update", area: "Case Studies",
      title: next ? `Hid case study from portfolio: ${caseTitle}` : `Made case study visible on portfolio: ${caseTitle}`,
    });
  }

  async function saveExperience(exp) {
    const id = exp.id || `exp-${Date.now()}`;
    const data = { ...exp, id };
    const isEdit = experiences.some((e) => e.id === id);
    await saveDoc("experiences", id, data);
    setExperiences((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      return idx >= 0 ? prev.map((e) => (e.id === id ? data : e)) : [...prev, data];
    });
    await saveLog({
      date: today(), category: "Content Update", area: "Experience",
      title: isEdit ? `Updated experience: ${data.role} at ${data.company}` : `Added new experience: ${data.role} at ${data.company}`,
    });
  }

  async function deleteExperience(id) {
    const entry = experiences.find((e) => e.id === id);
    await removeDoc("experiences", id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    if (entry) await saveLog({
      date: today(), category: "Content Update", area: "Experience",
      title: `Removed experience: ${entry.role} at ${entry.company}`,
    });
  }

  async function saveEducation(edu) {
    const id = edu.id || `edu-${Date.now()}`;
    const data = { ...edu, id };
    const isEdit = education.some((e) => e.id === id);
    await saveDoc("education", id, data);
    setEducation((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      return idx >= 0 ? prev.map((e) => (e.id === id ? data : e)) : [...prev, data];
    });
    await saveLog({
      date: today(), category: "Content Update", area: "Education",
      title: isEdit ? `Updated education: ${data.degree} at ${data.school}` : `Added new education: ${data.degree} at ${data.school}`,
    });
  }

  async function deleteEducation(id) {
    const entry = education.find((e) => e.id === id);
    await removeDoc("education", id);
    setEducation((prev) => prev.filter((e) => e.id !== id));
    if (entry) await saveLog({
      date: today(), category: "Content Update", area: "Education",
      title: `Removed education: ${entry.degree} at ${entry.school}`,
    });
  }

  async function savePersonalInfo(info) {
    await saveDoc("personalInfo", "main", info);
    setPersonalInfo(info);
    await saveLog({
      date: today(), category: "Content Update", area: "Personal Info",
      title: "Updated personal info and bio",
    });
  }

  async function saveLog(log) {
    const id = log.id || `log-${Date.now()}`;
    const data = { ...log, id };
    await saveDoc("workLogs", id, data);
    setWorkLogs((prev) => {
      const others = prev.filter((l) => l.id !== id);
      return [data, ...others].sort((a, b) => b.date.localeCompare(a.date));
    });
  }

  async function deleteLog(id) {
    await removeDoc("workLogs", id);
    setWorkLogs((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <DataContext.Provider value={{
      cases, caseVisibility, experiences, education, personalInfo, workLogs, loading,
      toggleCaseVisibility,
      saveExperience, deleteExperience,
      saveEducation, deleteEducation,
      savePersonalInfo,
      saveLog, deleteLog,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
