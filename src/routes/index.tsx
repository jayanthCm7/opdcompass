import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Calculator,
  Clock,
  FileText,
  ImageIcon,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Printer,
  Search,
  ShieldAlert,
  Siren,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import compass from "@/assets/compass.png";
import { Button } from "@/components/ui/button";
import { Backdrop } from "@/components/site/Shell";
import { CaseCard } from "@/components/site/CaseCard";
import { CountUp, Reveal } from "@/components/site/Reveal";
import { spot, useSiteUI } from "@/components/site/ui-context";
import { slug } from "@/components/site/CommandPalette";
import { CASES } from "@/data/cases";
import { EMERGENCIES, detectEmergencies } from "@/data/emergencies";
import { TOOLS } from "@/data/tools";
import { searchCases, getCase, type CaseTab } from "@/lib/search";
import { useFavorites, useRecent } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OPD Compass — Navigate OPD Care with Confidence" },
      {
        name: "description",
        content:
          "Search a chief complaint for probable diagnosis, investigations, cautions, red flags and a customisable draft prescription.",
      },
      { property: "og:title", content: "OPD Compass — Navigate OPD Care with Confidence" },
      {
        property: "og:description",
        content: "64 OPD cases, 10 emergency red flags, 8 clinical calculators and a printable draft Rx.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CHIPS = [
  "fever", "cough", "acidity", "burning urine", "rash", "period pain", "white discharge",
  "diabetes", "thyroid", "pregnancy bp", "headache", "worms", "knee pain", "anxiety",
];
const TABS: [CaseTab, string][] = [
  ["All", "All cases"],
  ["Medicine", "Medicine"],
  ["Obs & Gynae", "Obs & Gynae"],
  ["Saved", "Saved"],
];

function Index() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<CaseTab>("All");
  const { fav } = useFavorites();
  const { recent, clear } = useRecent();
  const exploreRef = useRef<HTMLElement>(null);

  const results = useMemo(() => searchCases(q, tab, fav), [q, tab, fav]);
  const alerts = useMemo(() => detectEmergencies(q), [q]);
  const counts = useMemo(
    () => ({
      All: CASES.length,
      Medicine: CASES.filter((c) => c.sp === "Medicine").length,
      "Obs & Gynae": CASES.filter((c) => c.sp === "Obs & Gynae").length,
      Saved: fav.length,
    }),
    [fav],
  );
  const recentCases = recent.map(getCase).filter(Boolean) as typeof CASES;

  const jump = (term?: string) => {
    if (term !== undefined) setQ(term);
    exploreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Hero q={q} setQ={setQ} onSubmit={() => jump()} onChip={jump} />
      <StatsBand />
      <Marquee onPick={jump} />

      {/* ---------------- Explore ---------------- */}
      <section id="explore" ref={exploreRef} className="relative mx-auto max-w-7xl scroll-mt-24 px-5 pt-24">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>01 · Case explorer</Eyebrow>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
              Every complaint, <span className="font-serif font-normal italic text-primary">mapped.</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Type symptoms in plain words — English or common Hindi terms like <i>khansi</i> or <i>jalan</i>.
            Every word must match.
          </p>
        </Reveal>

        <div className="sticky top-[84px] z-30 mt-10">
          <div className="glass-strong rounded-3xl p-2 shadow-elevated">
            <div className="flex flex-col gap-2 lg:flex-row">
              <label className="flex h-14 flex-1 items-center gap-3 rounded-2xl bg-secondary/70 px-4 ring-primary/40 transition focus-within:ring-2">
                <Search className="h-5 w-5 text-primary" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g. fever with joint pain, burning urine, pregnancy bp…"
                  className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
                  aria-label="Search clinical cases"
                />
                {q && (
                  <button onClick={() => setQ("")} className="rounded-lg p-1.5 text-muted-foreground hover:bg-background hover:text-foreground" aria-label="Clear search">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
              <div className="scrollbar-none flex gap-1 overflow-x-auto rounded-2xl bg-secondary/40 p-1">
                {TABS.map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setTab(v)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-medium transition",
                      tab === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {v === "Saved" && <Star className={cn("h-3.5 w-3.5", tab === v ? "fill-background" : "")} />}
                    {l}
                    <span className={cn("rounded-md px-1.5 font-mono text-[10px]", tab === v ? "bg-background/15" : "bg-background/60")}>
                      {counts[v]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="scrollbar-none mt-5 flex gap-2 overflow-x-auto pb-1">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => setQ(c)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs transition hover:-translate-y-0.5",
                q === c ? "border-primary bg-primary/15 text-primary" : "border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {alerts.length > 0 && (
          <div className="animate-rise relative mt-6 overflow-hidden rounded-3xl border border-destructive/40 bg-destructive/10 p-5 shadow-danger">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-destructive/30 blur-3xl" />
            <div className="relative flex items-start gap-4">
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-danger">
                <span className="animate-pulse-ring absolute inset-0 rounded-2xl bg-destructive/60" />
                <Siren className="relative h-5 w-5 text-destructive-foreground" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-destructive">Possible emergency — do not manage as routine OPD.</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {alerts.map((a) => (
                    <li key={a.name}>
                      <b className="text-foreground">{a.name}:</b> <span className="text-muted-foreground">{a.action}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/red-flags" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-destructive hover:underline">
                  Open all red flags <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {recentCases.length > 0 && !q && tab === "All" && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Recently viewed
              </h3>
              <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
            </div>
            <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
              {recentCases.map((c) => (
                <Link
                  key={c.id}
                  to="/case/$id"
                  params={{ id: c.id }}
                  className="shrink-0 rounded-2xl border border-border bg-card/60 px-4 py-2.5 text-sm transition hover:border-primary/40 hover:text-primary"
                >
                  {c.t}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            <b className="font-mono text-foreground">{results.length}</b> of {CASES.length} cases
          </span>
          {(q || tab !== "All") && (
            <button onClick={() => { setQ(""); setTab("All"); }} className="hover:text-foreground">Reset filters</button>
          )}
        </div>

        {results.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((c, i) => (
              <CaseCard key={c.id} c={c} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-dashed border-border bg-card/40 p-14 text-center">
            <img src={compass} alt="" width={64} height={64} className="animate-float mx-auto h-16 w-16 opacity-80" loading="lazy" />
            <h3 className="mt-5 text-xl font-semibold">{tab === "Saved" ? "No saved cases yet" : "No matching case"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "Saved" ? "Tap the star on any case to keep it here." : "Try fewer words, or a broader complaint like “fever” or “pain”."}
            </p>
          </div>
        )}
      </section>

      <Workflow />
      <RedFlagTeaser />
      <ToolsTeaser />
      <About />
      <Contact />
    </>
  );
}

function Eyebrow({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "danger" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em]",
        tone === "primary" ? "text-primary" : "text-destructive",
      )}
    >
      <span className={cn("h-px w-8", tone === "primary" ? "bg-primary" : "bg-destructive")} />
      {children}
    </span>
  );
}

/* ================= HERO ================= */
function Hero({
  q,
  setQ,
  onSubmit,
  onChip,
}: {
  q: string;
  setQ: (v: string) => void;
  onSubmit: () => void;
  onChip: (t: string) => void;
}) {
  const { openPalette } = useSiteUI();
  return (
    <section className="relative isolate overflow-hidden pt-32 md:pt-36">
      <Backdrop />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="min-w-0">
          <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 py-1 pl-1 pr-3 text-xs text-primary">
            <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] font-medium uppercase text-primary-foreground">New</span>
            Clinical reference toolkit · 2026 edition
          </div>
          <h1 className="animate-rise mt-6 text-[clamp(2.8rem,7.5vw,6.2rem)] font-bold leading-[0.92] tracking-[-0.04em] [animation-delay:80ms]">
            Navigate OPD care
            <br />
            with <span className="text-gradient font-serif font-normal italic tracking-tight">confidence.</span>
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:160ms]">
            Search a chief complaint for the probable diagnosis, investigations, cautions, red flags — and a
            customisable draft prescription you can print in seconds.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="animate-rise group relative mt-8 max-w-xl [animation-delay:240ms]"
          >
            <div className="absolute -inset-px rounded-[22px] bg-brand opacity-40 blur-md transition group-focus-within:opacity-80" />
            <div className="relative flex h-16 items-center gap-3 rounded-[22px] border border-border bg-card pl-5 pr-2">
              <Search className="h-5 w-5 text-primary" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What brings the patient in today?"
                className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
                aria-label="Search a chief complaint"
              />
              <Button type="submit" variant="hero" className="h-12 rounded-2xl px-5">
                Search <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="animate-rise mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground [animation-delay:300ms]">
            <span>Try:</span>
            {["fever", "acidity", "period pain", "pregnancy bp"].map((t) => (
              <button key={t} onClick={() => onChip(t)} className="rounded-full border border-border px-2.5 py-1 transition hover:border-primary/50 hover:text-primary">
                {t}
              </button>
            ))}
            <button onClick={openPalette} className="ml-1 hidden items-center gap-1 sm:inline-flex">
              or press <kbd className="rounded border border-border bg-secondary px-1.5 font-mono">⌘K</kbd>
            </button>
          </div>

          <div className="animate-rise mt-9 flex flex-wrap gap-3 [animation-delay:360ms]">
            <Button asChild variant="glass" size="pill">
              <Link to="/tools"><Calculator className="h-4 w-4" /> Clinical tools</Link>
            </Button>
            <Button asChild variant="danger" size="pill">
              <Link to="/red-flags"><Siren className="h-4 w-4" /> Emergency red flags</Link>
            </Button>
          </div>
        </div>

        <HeroVisual />
      </div>

      {/* ECG trace */}
      <svg viewBox="0 0 1200 120" className="mt-16 h-24 w-full text-primary" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0 60 H300 L320 60 L335 30 L350 95 L365 10 L380 105 L395 60 H620 L640 60 L655 35 L670 90 L685 15 L700 100 L715 60 H900 L920 60 L935 30 L950 95 L965 10 L980 105 L995 60 H1200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="1000"
          className="animate-ecg drop-shadow-[0_0_8px_var(--primary)]"
          style={{ strokeLinejoin: "round" }}
        />
      </svg>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* rotating tick ring */}
      <svg viewBox="0 0 400 400" className="animate-spin-slow absolute inset-0 h-full w-full text-primary/40" aria-hidden>
        <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 6" />
        <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="0.4" />
        {Array.from({ length: 72 }).map((_, i) => (
          <line
            key={i}
            x1="200"
            y1="8"
            x2="200"
            y2={i % 6 === 0 ? 22 : 14}
            stroke="currentColor"
            strokeWidth={i % 6 === 0 ? 1.4 : 0.6}
            transform={`rotate(${i * 5} 200 200)`}
          />
        ))}
      </svg>
      <div className="absolute inset-[18%] rounded-full bg-primary/25 blur-[80px]" />
      <img
        src={compass}
        alt="Glass compass with a medical cross at its centre"
        width={1024}
        height={1024}
        className="animate-float relative z-10 mx-auto h-full w-full object-contain p-[12%] drop-shadow-[0_30px_60px_oklch(0_0_0/0.6)]"
      />

      <FloatCard className="left-[-4%] top-[14%] [animation-delay:-1s]" label="Most probable Dx" value="GERD" tone="primary" />
      <FloatCard className="right-[-6%] top-[38%] [animation-delay:-3s]" label="CURB-65" value="2 / 5 · Admit" tone="warning" />
      <FloatCard className="bottom-[10%] left-[2%] [animation-delay:-5s]" label="Red flag" value="Thunderclap headache" tone="danger" />
    </div>
  );
}

function FloatCard({ className, label, value, tone }: { className: string; label: string; value: string; tone: "primary" | "warning" | "danger" }) {
  const dot = { primary: "bg-primary", warning: "bg-warning", danger: "bg-destructive" }[tone];
  return (
    <div className={cn("glass animate-float absolute z-20 hidden rounded-2xl px-4 py-3 sm:block", className)}>
      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
        {label}
      </div>
      <div className="mt-1 font-display text-sm font-semibold">{value}</div>
    </div>
  );
}

/* ================= STATS ================= */
function StatsBand() {
  const med = CASES.filter((c) => c.sp === "Medicine").length;
  const stats = [
    { n: CASES.length, l: "Clinical cases" },
    { n: med, l: "Internal medicine" },
    { n: CASES.length - med, l: "Obs & Gynae" },
    { n: EMERGENCIES.length, l: "Emergency red flags" },
    { n: TOOLS.length, l: "Calculators" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5">
      <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-border bg-card/40 md:grid-cols-5">
        {stats.map((s, i) => (
          <div key={s.l} className={cn("border-border p-6 md:p-8", i > 0 && "md:border-l", i % 2 === 1 && "border-l md:border-l", i >= 2 && "border-t md:border-t-0")}>
            <div className="font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl">
              <CountUp to={s.n} />
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Marquee({ onPick }: { onPick: (t: string) => void }) {
  const items = CASES.slice(0, 32).map((c) => c.t);
  return (
    <div className="mask-fade-x mt-14 overflow-hidden py-2">
      <div className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
        {[...items, ...items].map((t, i) => (
          <button
            key={i}
            onClick={() => onPick((t.split(/[\s/(]/)[0] ?? t).toLowerCase())}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            <Activity className="h-3.5 w-3.5 text-primary" />
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= WORKFLOW BENTO ================= */
function Workflow() {
  const steps = [
    { n: "01", t: "Search the complaint", d: "Plain-language symptoms match titles, diagnoses, keywords and complaints." },
    { n: "02", t: "Review the case", d: "Pathophysiology, investigations, treatment, cautions and referral triggers." },
    { n: "03", t: "Draft the Rx", d: "An editable slip on your letterhead — print, PDF, copy or WhatsApp." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 pt-32">
      <Reveal>
        <Eyebrow>02 · How it works</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          From complaint to prescription in <span className="font-serif font-normal italic text-primary">three moves.</span>
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-6">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 100} className="md:col-span-2">
            <div onMouseMove={spot} className="spotlight h-full rounded-3xl border border-border bg-card/50 p-7">
              <div className="font-mono text-sm text-primary">{s.n}</div>
              <h3 className="mt-10 text-2xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          </Reveal>
        ))}
        <Reveal delay={100} className="md:col-span-3">
          <Feature icon={ImageIcon} title="Licensed clinical imagery" text="Openly licensed images from Wikimedia Commons with credits — sensitive images blurred by default." />
        </Reveal>
        <Reveal delay={200} className="md:col-span-3">
          <Feature icon={FileText} title="Your letterhead, every slip" text="Save your name, registration and clinic once. Every draft prescription carries it." />
        </Reveal>
        <Reveal delay={100} className="md:col-span-2">
          <Feature icon={Printer} title="Print-perfect A4" text="Only the slip prints. Everything else stays out of the way." />
        </Reveal>
        <Reveal delay={200} className="md:col-span-2">
          <Feature icon={Lock} title="Private by design" text="No accounts, no tracking. Saved cases live only in your browser." />
        </Reveal>
        <Reveal delay={300} className="md:col-span-2">
          <Feature icon={Sparkles} title="Keyboard first" text="Press ⌘K or / anywhere to jump to any case, tool or red flag." />
        </Reveal>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof Lock; title: string; text: string }) {
  return (
    <div onMouseMove={spot} className="spotlight group flex h-full gap-4 rounded-3xl border border-border bg-card/50 p-6">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary transition group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

/* ================= RED FLAGS ================= */
function RedFlagTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-destructive/30 bg-destructive/[0.07] p-8 md:p-12">
          <div className="animate-aurora absolute -right-20 -top-20 h-96 w-96 rounded-full bg-destructive/25 blur-[100px]" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <Eyebrow tone="danger">03 · Emergency recognition</Eyebrow>
              <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                Know when it is <span className="font-serif font-normal italic text-destructive">not</span> routine OPD.
              </h2>
              <p className="mt-4 text-muted-foreground">
                {EMERGENCIES.length} red-flag presentations with first actions. Typing any of these into search triggers an instant alert.
              </p>
              <Button asChild variant="danger" size="pill" className="mt-8">
                <Link to="/red-flags"><ShieldAlert className="h-4 w-4" /> View all red flags</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {EMERGENCIES.slice(0, 4).map((e) => (
                <Link
                  key={e.name}
                  to="/red-flags"
                  hash={slug(e.name)}
                  className="group rounded-2xl border border-destructive/20 bg-background/50 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-destructive/50"
                >
                  <Siren className="h-5 w-5 text-destructive" />
                  <h3 className="mt-4 font-semibold group-hover:text-destructive">{e.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{e.sign}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= TOOLS ================= */
function ToolsTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-32">
      <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Eyebrow>04 · Bedside calculators</Eyebrow>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
            Numbers you need, <span className="font-serif font-normal italic text-primary">instantly.</span>
          </h2>
        </div>
        <Button asChild variant="glass" size="pill">
          <Link to="/tools">Open all tools <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {TOOLS.map((t, i) => (
          <Reveal key={t.id} delay={i * 50}>
            <Link
              to="/tools"
              hash={t.id}
              onMouseMove={spot}
              className="spotlight group flex h-full flex-col rounded-3xl border border-border bg-card/50 p-5 transition hover:-translate-y-1"
            >
              <span className="text-3xl transition group-hover:scale-110">{t.icon}</span>
              <h3 className="mt-6 font-semibold group-hover:text-primary">{t.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= ABOUT ================= */
function About() {
  const tags = ["Clinical Procedures", "Internal Medicine", "AI in Healthcare", "Medical Research", "Healthcare Innovation"];
  return (
    <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-32">
      <Reveal>
        <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-border bg-card/40 p-8 md:grid-cols-[auto_1fr] md:p-12">
          <div className="relative mx-auto h-48 w-48 md:mx-0">
            <div className="animate-spin-slow absolute inset-0 rounded-full bg-[conic-gradient(var(--primary),var(--primary-glow),var(--obgyn),var(--primary))] p-[2px]">
              <div className="h-full w-full rounded-full bg-background" />
            </div>
            <div className="absolute inset-3 grid place-items-center rounded-full bg-secondary">
              <span className="text-gradient font-display text-6xl font-bold">JC</span>
            </div>
          </div>
          <div>
            <Eyebrow>About me</Eyebrow>
            <div className="mt-3 font-serif text-2xl italic text-gradient md:text-3xl">
              Care. Curiosity. Innovation.
            </div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Dr Jayanth C M</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">MBBS · Medical Officer</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Bengaluru, Karnataka</span>
            </div>
            <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
              An MBBS graduate with a strong interest in patient-centred care, clinical procedures, artificial
              intelligence in healthcare, and medical innovation. A curious learner and collaborative
              professional who enjoys bringing together clinical knowledge, clear communication, and technology
              to create practical, meaningful healthcare solutions.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= CONTACT ================= */
function Contact() {
  const links = [
    { icon: Mail, label: "Email", sub: "jayanthcm.arpitha@gmail.com", href: "mailto:jayanthcm.arpitha@gmail.com?subject=Hello%20Dr%20Jayanth" },
    { icon: MessageCircle, label: "WhatsApp", sub: "Message directly", href: "https://wa.me/917483122714?text=Hello%20Dr%20Jayanth%20C%20M" },
  ];
  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-32">
      <Reveal className="text-center">
        <Eyebrow>Get in touch</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
          Say <span className="text-gradient font-serif font-normal italic">hello.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          Great ideas start with a conversation. A project, a collaboration, or simply a hello — drop a message
          and I’ll get back to you as soon as I can.
        </p>
      </Reveal>
      <div className="mt-12 flex justify-center gap-5">
        {links.map((l, i) => (
          <Reveal key={l.label} delay={i * 100}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={l.label}
              title={l.label}
              className="grid h-20 w-20 place-items-center rounded-3xl bg-brand text-primary-foreground shadow-glow transition hover:-translate-y-1 hover:rotate-6 hover:scale-105"
            >
              <l.icon className="h-8 w-8" />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
