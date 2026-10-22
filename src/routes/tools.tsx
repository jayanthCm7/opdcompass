import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Backdrop } from "@/components/site/Shell";
import { Reveal } from "@/components/site/Reveal";
import { spot } from "@/components/site/ui-context";
import { TOOLS, type ClinicalTool, type ToolValues } from "@/data/tools";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Clinical Calculators — BMI, CrCl, CURB-65, EDD | OPD Compass" },
      { name: "description", content: "Eight bedside calculators: BMI (Asian cut-offs), paediatric paracetamol, Cockcroft-Gault, CURB-65, Centor, EDD, BP/MAP and ORS." },
      { property: "og:title", content: "Clinical Calculators | OPD Compass" },
      { property: "og:description", content: "Live bedside calculators for the OPD — results as you type." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <div className="relative isolate pb-16 pt-32">
      <Backdrop />
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            <span className="h-px w-8 bg-primary" /> {TOOLS.length} live calculators
          </span>
          <h1 className="mt-3 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            Clinical <span className="text-gradient font-serif font-normal italic">tools.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">Results update as you type. Always cross-check against product information and local protocols.</p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {TOOLS.map((t, i) => (
            <Reveal key={t.id} delay={(i % 2) * 80}>
              <ToolCard t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function initial(t: ClinicalTool): ToolValues {
  return Object.fromEntries(t.fields.map((f) => [f.k, f.type === "check" ? false : f.type === "select" ? f.opts?.[0]?.[0] ?? "" : ""]));
}

function ToolCard({ t }: { t: ClinicalTool }) {
  const [v, setV] = useState<ToolValues>(() => initial(t));
  const r = t.calc(v);
  const field =
    "mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-3 text-sm outline-none transition focus:border-primary/60 focus:bg-secondary focus:ring-4 focus:ring-primary/10";

  return (
    <section
      id={t.id}
      onMouseMove={spot}
      className="spotlight h-full scroll-mt-28 rounded-3xl border border-border bg-card/50 p-6 target:border-primary/60 target:shadow-glow"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border bg-secondary text-3xl">{t.icon}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold">{t.name}</h2>
          <p className="text-sm text-muted-foreground">{t.desc}</p>
        </div>
        <button onClick={() => setV(initial(t))} className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground" aria-label={`Reset ${t.name}`}>
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className={cn("mt-5 grid gap-3", t.fields.length > 1 && t.fields.every((f) => f.type !== "check") && "sm:grid-cols-2")}>
        {t.fields.map((f) => {
          if (f.type === "check")
            return (
              <label key={f.k} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition", v[f.k] ? "border-primary/50 bg-primary/10" : "border-border bg-secondary/40 hover:border-primary/30")}>
                <input type="checkbox" checked={!!v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.checked })} className="h-4 w-4 accent-[var(--primary)]" />
                {f.l}
              </label>
            );
          return (
            <label key={f.k} className="block text-xs font-medium text-muted-foreground">
              {f.l}
              {f.type === "select" ? (
                <select value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} className={field}>
                  {f.opts!.map(([val, l]) => <option key={val} value={val}>{l}</option>)}
                </select>
              ) : (
                <input
                  type={f.type === "date" ? "date" : "number"}
                  inputMode="decimal"
                  step="any"
                  min="0"
                  placeholder={f.ph}
                  value={v[f.k]}
                  onChange={(e) => setV({ ...v, [f.k]: e.target.value })}
                  className={field}
                />
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-5">
        {r ? (
          <div key={r.big} className="animate-rise relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/[0.07] p-5">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
            <div className="text-gradient relative font-display text-3xl font-bold">{r.big}</div>
            <div className="relative mt-1 font-semibold">{r.label}</div>
            <p className="relative mt-2 text-xs leading-relaxed text-muted-foreground">{r.note}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">Enter values to see the result.</div>
        )}
      </div>
    </section>
  );
}
