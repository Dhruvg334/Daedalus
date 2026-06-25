"use client";

const paths = [
  {
    id: "ai_automation_builder",
    title: "AI Automation Builder",
    cluster: "AI & Software",
    fit: 88,
    aiExposure: 8,
    growth: 8,
    difficulty: 6,
    summary: "Builds workflows that use AI, APIs, and software to automate repeated tasks.",
    skills: ["Python", "APIs", "Prompt Engineering", "Workflow Design"],
    human: ["Problem framing", "User empathy", "Edge case debugging"],
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: "product_designer",
    title: "AI-Native Product Designer",
    cluster: "Design & Product",
    fit: 81,
    aiExposure: 6,
    growth: 9,
    difficulty: 5,
    summary: "Shapes how humans interact with AI-powered products through design thinking.",
    skills: ["Figma", "User Research", "Prototyping", "Systems Thinking"],
    human: ["Aesthetic judgment", "Empathy research", "Narrative design"],
    color: "from-violet-400 to-purple-500",
  },
  {
    id: "growth_strategist",
    title: "Growth & AI Strategist",
    cluster: "Business & Finance",
    fit: 74,
    aiExposure: 5,
    growth: 8,
    difficulty: 4,
    summary: "Uses data and AI tools to drive business growth, partnerships, and market entry.",
    skills: ["Analytics", "Go-to-Market", "Storytelling", "Financial Modeling"],
    human: ["Stakeholder trust", "Strategic judgment", "Market reading"],
    color: "from-emerald-400 to-teal-500",
  },
];

function ScoreBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="meter-bar flex-1">
      <div className="meter-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function PathsPreview() {
  return (
    <section id="paths" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Example Output</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Three paths,{" "}
            <span className="shimmer-text">one decision cockpit</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-md mx-auto text-base">
            This is what Daedalus generates for a student interested in coding, business, and content creation.
          </p>
        </div>

        {/* Comparison header */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/50">
            <div className="hidden md:grid grid-cols-4 gap-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              <span>Career Path</span>
              <span className="text-center">Fit Score</span>
              <span className="text-center">AI Exposure</span>
              <span className="text-center">Growth</span>
            </div>
          </div>

          {paths.map((p, i) => (
            <div
              key={p.id}
              className={`p-6 ${i < paths.length - 1 ? "border-b border-white/50" : ""} hover:bg-white/30 transition-colors`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Title */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${p.color}`} />
                    <span className="text-[11px] text-slate-400">{p.cluster}</span>
                    {i === 0 && (
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                        Best Fit
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-slate-800 text-[15px]">{p.title}</div>
                  <div className="text-slate-400 text-[12px] mt-1 leading-relaxed">{p.summary}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.skills.slice(0, 3).map((s) => (
                      <span key={s} className="chip text-[11px]">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Fit score */}
                <div className="text-center">
                  <div className="text-3xl font-bold font-display text-slate-800">{p.fit}</div>
                  <div className="text-[11px] text-slate-400">/ 100</div>
                  <div className="mt-2 px-4">
                    <ScoreBar value={p.fit} max={100} />
                  </div>
                </div>

                {/* AI Exposure */}
                <div className="text-center">
                  <div className="text-3xl font-bold font-display text-slate-800">{p.aiExposure}</div>
                  <div className="text-[11px] text-slate-400">/ 10</div>
                  <div className="text-[11px] text-amber-500 mt-1 font-medium">
                    {p.aiExposure >= 7 ? "High augmentation" : p.aiExposure >= 4 ? "Moderate assist" : "Low exposure"}
                  </div>
                </div>

                {/* Growth */}
                <div className="text-center">
                  <div className="text-3xl font-bold font-display text-slate-800">{p.growth}</div>
                  <div className="text-[11px] text-slate-400">/ 10</div>
                  <div className="text-[11px] text-emerald-500 mt-1 font-medium">High demand</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Human advantage strip */}
        <div className="mt-5 glass-card rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-3">
            Your human edge — what AI cannot replace
          </p>
          <div className="flex flex-wrap gap-2">
            {["Problem framing", "User empathy", "Aesthetic judgment", "Strategic judgment", "Market reading", "Stakeholder trust", "Edge case debugging"].map((skill) => (
              <span key={skill} className="chip">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
