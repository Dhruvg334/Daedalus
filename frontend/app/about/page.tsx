import Link from "next/link"
import { ArrowRight, BrainCircuit, LineChart, ShieldCheck, Users } from "lucide-react"
import { FloatingNav } from "@/components/FloatingNav"
import Footer from "@/components/Footer"

const developers = [
  { name: "Dhruv Gupta", role: "Product direction, integration, deployment, testing, and frontend/backend reliability" },
  { name: "Akshhaya Isa", role: "Frontend experience, interaction design, and interface development" },
  { name: "Pavit Agrawal", role: "Backend services, API implementation, and data flow" },
]

const innovationPoints = [
  {
    title: "Decision system, not a chatbot",
    description: "Daedalus combines structured profile capture, career-path scoring, optional AI reranking, explainable trace data, and action planning.",
    icon: BrainCircuit,
  },
  {
    title: "AI exposure made visible",
    description: "The platform shows how AI changes each career path, where human judgment still matters, and which skills become more valuable.",
    icon: LineChart,
  },
  {
    title: "Transparent fallback behavior",
    description: "If Gemini is unavailable, Daedalus remains usable through deterministic recommendations and visible diagnostic traces.",
    icon: ShieldCheck,
  },
  {
    title: "Built for real users",
    description: "Students and early professionals get career options, skill gaps, learning direction, opportunities, and a 7-day execution sprint.",
    icon: Users,
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-black">
      <FloatingNav />
      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-[#1e6a8a]">About Daedalus</p>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">Career navigation for the AI era.</h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Daedalus helps people move from vague career anxiety to structured career action. It compares future paths, explains AI exposure, highlights skill gaps, and turns the result into a practical sprint.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/onboarding" className="btn-dark text-base">Start simulation <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/demo-personas" className="btn-outline text-base">Explore demo profiles</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-neutral-500">Demo video</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Product walkthrough placeholder</h2>
            <p className="mt-4 leading-7 text-neutral-600">
              Add the final product demo video here after recording. The recommended video should cover onboarding, simulation, dashboard, skill map, action sprint, assistant fallback, and share report.
            </p>
          </div>
          <div className="aspect-video rounded-[2rem] border border-black/15 bg-black p-4 shadow-2xl">
            <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-white/15 bg-[radial-gradient(circle_at_50%_35%,rgba(126,190,214,0.35),transparent_35%),linear-gradient(135deg,#111827,#000)] text-center text-white">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.32em] text-white/45">Video slot</p>
                <p className="mt-3 text-2xl font-black">Embed demo video here</p>
                <p className="mt-2 text-sm text-white/60">Replace this panel with a YouTube, Loom, or local demo embed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-neutral-500">Why it matters</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {innovationPoints.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
                <Icon className="h-6 w-6 text-[#1e6a8a]" />
                <h3 className="mt-4 text-xl font-black">{title}</h3>
                <p className="mt-2 leading-7 text-neutral-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-neutral-500">Developers</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {developers.map((developer) => (
              <div key={developer.name} className="rounded-[1.25rem] border border-black/10 bg-[#fbfaf7] p-5">
                <h3 className="text-lg font-black">{developer.name}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{developer.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
