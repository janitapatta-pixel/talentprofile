import React, { useEffect, useState } from "react";

// Modern gradient blue version — FIXED + Skills tab implemented with % bars
// Pages: Home ↔ My Talent Profile
export default function App() {
  const [page, setPage] = useState<"home" | "profile">("home");
  const [profile, setProfile] = useState({
    firstName: "Jani",
    lastName: "Doe",
    gender: "female", // used for AI Summary pronoun
    employeeId: "EMP-001",
    role: "Business Analyst",
    level: "L2",
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=60",
    summary:
      "a hybrid BA with data + product instincts, capable of delivering measurable outcomes across business and technology.",
  });

  const [skills] = useState<Skill[]>([
    { name: "Requirements Analysis", level: 85 },
    { name: "GenAI Prompting", level: 80 },
    { name: "Journey Mapping", level: 70 },
    { name: "SQL", level: 60 },
    { name: "Stakeholder Comms", level: 58 },
    { name: "Data Visualization", level: 55 },
    { name: "API Documentation", level: 52 },
  ]);

  useEffect(() => {
    const completeness = getProfileCompleteness(profile, skills);
    const recs = getAISkillRecommendations(skills);
    const tests: Array<[string, boolean]> = [
      ["TopBar exists", typeof TopBar === "function"],
      ["HomePage exists", typeof HomePage === "function"],
      ["ProfilePage exists", typeof ProfilePage === "function"],
      ["SkillsTab exists", typeof SkillsTab === "function"],
      ["Skills non-empty", Array.isArray(skills) && skills.length > 0],
      ["Completeness function exists", typeof getProfileCompleteness === "function"],
      ["Completeness in range", typeof completeness === "number" && completeness >= 0 && completeness <= 100],
      ["AI recs function exists", typeof getAISkillRecommendations === "function"],
      ["AI recs array", Array.isArray(recs)],
    ];
    const failed = tests.filter(([, ok]) => !ok);
    if (failed.length) {
      console.error("SMOKE TESTS FAILED:", failed.map(([name]) => name));
      throw new ReferenceError("Missing components or data: " + failed.map(([n]) => n).join(", "));
    }
  }, [skills, profile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-slate-800">
      <TopBar onGoHome={() => setPage("home")} onGoProfile={() => setPage("profile")} />
      <main className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
        {page === "home" ? (
          <HomePage profile={profile} skills={skills} onOpenProfile={() => setPage("profile")} />
        ) : (
          <ProfilePage profile={profile} onChange={setProfile} onBack={() => setPage("home")} skills={skills} />)
        }
      </main>
    </div>
  );
}

type Skill = { name: string; level: number };

function TopBar({
  onGoHome,
  onGoProfile,
}: {
  onGoHome: () => void;
  onGoProfile: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between">
        <button onClick={onGoHome} className="text-lg font-semibold tracking-tight hover:opacity-80 transition">
          Talent Platform
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onGoProfile}
            className="rounded-2xl bg-white/10 px-4 py-1.5 text-sm font-medium hover:bg-white/20 active:scale-[0.99] text-white backdrop-blur"
          >
            My Talent Profile
          </button>
        </div>
      </div>
    </header>
  );
}

function HomePage({
  profile,
  skills,
  onOpenProfile,
}: {
  profile: any;
  skills: Skill[];
  onOpenProfile: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Experience", "Skills", "Certification/Awards"];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-blue-100 bg-white/80 backdrop-blur p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Welcome back, {profile.firstName}</h1>
            <p className="text-slate-600 text-sm mt-1">
              Build your profile once, reuse everywhere. Keep your experience, skills, and specialization synced.
            </p>
          </div>
          <button
            onClick={onOpenProfile}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 text-sm font-medium hover:opacity-90 shadow-md active:scale-[0.99]"
          >
            Open My Talent Profile
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-white/80 backdrop-blur p-4 shadow-md">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={
                "px-4 py-2 rounded-full text-sm border transition font-medium " +
                (activeTab === t
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm"
                  : "bg-white text-blue-800 border-blue-200 hover:bg-blue-50")
              }
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-4">
          {activeTab === "Overview" && <OverviewTab profile={profile} skills={skills} />}
          {activeTab === "Experience" && <ExperienceTab />}
          {activeTab === "Skills" && <SkillsTab skills={skills} />}
          {activeTab === "Certification/Awards" && <CertAwardsTab />}
        </div>
      </div>
    </section>
  );
}

function ProfilePage({
  profile,
  onChange,
  onBack,
  skills,
}: {
  profile: any;
  onChange: (p: any) => void;
  onBack: () => void;
  skills: Skill[];
}) {
  const name = `${profile.firstName} ${profile.lastName}`.trim();
  const pronoun = profile.gender === "female" ? "She" : profile.gender === "male" ? "He" : "They";
  const top5 = [...skills].sort((a, b) => b.level - a.level).slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-900">My Talent Profile</h2>
        <button
          onClick={onBack}
          className="rounded-xl border border-blue-200 bg-white/70 backdrop-blur px-4 py-2 text-sm hover:bg-blue-50"
        >
          Back to Home
        </button>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-white/80 backdrop-blur p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center">
            <img src={profile.photoUrl} alt="Talent" className="h-28 w-28 rounded-2xl object-cover ring-2 ring-blue-200" />
            <p className="text-xs text-slate-500 mt-2">Tap fields to edit</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name-Last Name" value={name} onChange={(v) => {
              const [f = "", ...rest] = v.split(" ");
              onChange({ ...profile, firstName: f, lastName: rest.join(" ") });
            }} />
            <Field label="Employee ID" value={profile.employeeId} onChange={(v) => onChange({ ...profile, employeeId: v })} />
            <Field label="Current Role" value={profile.role} onChange={(v) => onChange({ ...profile, role: v })} />
            <Field label="Current Level" value={profile.level} onChange={(v) => onChange({ ...profile, level: v })} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-blue-100 bg-white/80 backdrop-blur p-6 shadow-lg">
          <div className="flex items-center gap-2">
            <AiBadgeIcon />
            <h3 className="font-semibold text-blue-900">AI Summary</h3>
          </div>
          <p className="text-sm text-slate-700 mt-3">
            {name} is {profile.summary} {pronoun.toLowerCase()} demonstrates strong skills in requirements analysis,
            GenAI-assisted documentation, and journey mapping. {pronoun} bridges product, design, and engineering teams
            to deliver impactful results.
          </p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white/80 backdrop-blur p-6 shadow-lg space-y-4">
          <h3 className="font-semibold text-blue-900">Highlights</h3>

          <div>
            <div className="text-xs font-medium text-slate-600 mb-2">Area of Expertise</div>
            <div className="flex flex-wrap gap-2">
              {["RTDM", "Payments", "Onboarding/KYC", "Talent Platforms", "AI in HR"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full border border-blue-200 bg-white text-xs">{t}</span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-600 mb-2">Top 5 Skills</div>
            <ul className="space-y-1 text-sm">
              {top5.map((s, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{s.name}</span>
                  <span className="text-xs text-slate-600">{s.level}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-600 mb-2">Certification / Reward</div>
            <ul className="space-y-1 text-sm">
              {[
                { type: "Certification", name: "AWS Solutions Architect – Associate", year: 2023 },
                { type: "Certification", name: "Scrum Product Owner", year: 2022 },
                { type: "Award", name: "Quarterly Top Performer", year: 2024 },
              ].map((it, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{it.name} • <span className="text-slate-500">{it.type}</span></span>
                  <span className="text-xs text-slate-600">{it.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-white/80 backdrop-blur p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-blue-900">Experience Snapshot</h3>
          <span className="text-xs text-slate-500">Layout preview</span>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {"ABCDE".split("").map((ch, idx) => (
            <div key={idx} className="rounded-2xl border border-blue-200 bg-white p-4">
              <div className="text-sm font-medium text-blue-900">Project {ch}</div>
              <p className="text-xs text-slate-600 mt-1">Add a short one-liner of your contribution.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewTab({ profile, skills }: { profile: any; skills: any[] }) {
  const completeness = getProfileCompleteness(profile, skills);
  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 shadow-inner">
      <div className="flex items-center gap-4">
        <img src={profile.photoUrl} alt="Profile" className="h-16 w-16 rounded-full ring-2 ring-blue-200 object-cover" />
        <div className="flex-1">
          <div className="font-semibold text-blue-900">{profile.firstName} {profile.lastName}</div>
          <div className="text-xs text-slate-600">{profile.role} • {profile.level}</div>
          <div className="text-xs text-slate-500">ID: {profile.employeeId}</div>
        </div>
        <div className="min-w-[200px] rounded-xl bg-white/80 border border-blue-200 p-3 shadow-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-slate-600">Profile Completeness</span>
            <span className="text-sm font-semibold text-blue-900">{completeness}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-blue-100">
            <div className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: `${completeness}%` }} />
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-700 mt-3">{profile.summary}</p>
    </div>
  );
}

function ExperienceTab() {
  return <div className="text-sm text-blue-800">Experience content here...</div>;
}

function SkillsTab({ skills }: { skills: Skill[] }) {
  const recommendations = getAISkillRecommendations(skills);
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s.name} className="rounded-2xl border border-blue-100 bg-white/90 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-blue-900">{s.name}</span>
              <span className="text-xs text-slate-600">{s.level}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-blue-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                style={{ width: `${s.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-blue-100 bg-white/90 p-5">
        <div className="flex items-center gap-2 mb-2">
          <AiBadgeIcon />
          <h4 className="font-semibold text-blue-900">AI Skill Recommendations</h4>
        </div>
        {recommendations.length === 0 ? (
          <p className="text-sm text-slate-600">No recommendations right now — great job keeping skills above target levels!</p>
        ) : (
          <ul className="space-y-3">
            {recommendations.map((r, i) => (
              <li key={r.name + i} className="border border-blue-100 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-blue-900">{r.name}</div>
                    <p className="text-xs text-slate-600 mt-1">{r.reason}</p>
                  </div>
                  <button
                    className="shrink-0 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90"
                    onClick={() => window.open(r.courseUrl, "_blank")}
                  >
                    Explore Courses
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function CertAwardsTab() {
  return <div className="text-sm text-blue-800">Certification and Awards here...</div>;
}

function getProfileCompleteness(profile: any, skills: any[]): number {
  const checks = [
    !!profile.firstName,
    !!profile.lastName,
    !!profile.employeeId,
    !!profile.role,
    !!profile.level,
    !!profile.photoUrl,
    !!profile.summary,
    Array.isArray(skills) && skills.length > 0,
  ];
  const filled = checks.filter(Boolean).length;
  const pct = Math.round((filled / checks.length) * 100);
  return Math.max(0, Math.min(100, pct));
}

function getAISkillRecommendations(skills: Skill[]): { name: string; reason: string; courseUrl: string }[] {
  const TARGET = 65;
  const candidates = skills
    .filter((s) => typeof s.level === "number" && s.level < TARGET)
    .sort((a, b) => a.level - b.level)
    .slice(0, 3);

  const reasons: Record<string, string> = {
    "SQL": "Unlock deeper analytics and faster debugging across product funnels.",
    "Data Visualization": "Tell clearer stories with dashboards and executive updates.",
    "API Documentation": "Tighten handoffs with backend/QA and reduce rework.",
    "Stakeholder Comms": "Drive alignment and decision velocity across teams.",
  };

  return candidates.map((c) => ({
    name: c.name,
    reason: reasons[c.name] || "Boost capability to accelerate delivery and quality.",
    courseUrl: `https://internal-courses-platform.example.com/search?q=${encodeURIComponent(c.name)}`,
  }));
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-blue-200 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function AiBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-800" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm0 2a8 8 0 1 1-8 8 8.01 8.01 0 0 1 8-8Zm-2 5h1.5l1.75 6H11l-.3-1.2H8.8L8.5 15H7l1-6Zm.6 1.5-.4 2.4h1.5l-.6-2.4ZM14 9h1.5v6H14Z" />
    </svg>
  );
}
