"use client";
import { CheckCircle2, Circle } from "lucide-react";

const days = [
  { day: 1, title: "Pick a repeated student problem", deliverable: "One selected problem statement", done: true },
  { day: 2, title: "Sketch the workflow", deliverable: "Simple workflow diagram", done: true },
  { day: 3, title: "Learn API request basics", deliverable: "Working fetch call returning JSON", done: true },
  { day: 4, title: "Connect input to AI", deliverable: "Prompt that returns a structured output", done: false },
  { day: 5, title: "Build the output display", deliverable: "Simple UI showing AI response", done: false },
  { day: 6, title: "Add error handling", deliverable: "App handles failures gracefully", done: false },
  { day: 7, title: "Record a 60-second demo", deliverable: "Shareable project with README + video", done: false },
];

export default function SprintPreview() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Sprint card */}
          <div className="glass-card rounded-3xl overflow-hidden order-2 lg:order-1">
            <div className="px-6 py-5 border-b border-white/60">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-1">
                7-Day Sprint
              </div>
              <div className="font-display font-bold text-slate-800 text-[18px]">
                Build Your First AI Automation
              </div>
              <div className="text-slate-400 text-[12px] mt-1">
                Expected output: Deployed workflow with README & demo
              </div>
            </div>

            <div className="relative p-4">
              <div className="timeline-line" />
              <div className="space-y-1 pl-10">
                {days.map((d) => (
                  <div key={d.day} className="relative flex items-start gap-3 py-3">
                    {/* Timeline dot */}
                    <div className="absolute left-[-30px] top-[14px]">
                      {d.done ? (
                        <CheckCircle2 size={16} className="text-blue-500 fill-blue-50" />
                      ) : (
                        <Circle size={16} className="text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-300">
                          DAY {d.day}
                        </span>
                        {d.done && (
                          <span className="text-[10px] text-blue-400 font-medium">✓ done</span>
                        )}
                      </div>
                      <div className={`text-[13px] font-medium ${d.done ? "text-slate-600" : "text-slate-800"}`}>
                        {d.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{d.deliverable}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-6 pb-5">
              <div className="flex justify-between text-[11px] text-slate-400 mb-2">
                <span>Progress</span>
                <span className="text-blue-500 font-semibold">3 / 7 days</span>
              </div>
              <div className="meter-bar">
                <div className="meter-fill" style={{ width: "43%" }} />
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div className="order-1 lg:order-2">
            <p className="section-label mb-3">Action Sprint</p>
            <h2 className="font-display text-4xl font-bold text-slate-800 tracking-tight leading-tight mb-6">
              Leave with steps,
              <br />
              <span className="shimmer-text">not motivation.</span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-6">
              Every Daedalus simulation ends with a 7-day sprint tailored to
              your chosen career path. Not vague advice — daily tasks with
              specific deliverables.
            </p>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              By day 7, you have a real project. Something to show a mentor,
              put in a portfolio, or use to start a conversation.
            </p>

            <div className="flex flex-wrap gap-3">
              {["Daily tasks", "Real deliverables", "Checklist UI", "Exportable"].map((tag) => (
                <span key={tag} className="chip">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
