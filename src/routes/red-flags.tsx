import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Siren } from "lucide-react";
import { Backdrop } from "@/components/site/Shell";
import { slug } from "@/components/site/CommandPalette";
import { EMERGENCIES } from "@/data/emergencies";

export const Route = createFileRoute("/red-flags")({
  head: () => ({
    meta: [
      { title: "Emergency Red Flags — Stabilise & Refer | OPD Compass" },
      { name: "description", content: "Ten emergency presentations that must never be managed as routine OPD — with first actions: ACS, stroke, pre-eclampsia, anaphylaxis, sepsis and more." },
      { property: "og:title", content: "Emergency Red Flags | OPD Compass" },
      { property: "og:description", content: "Recognise, stabilise and refer: ten red-flag emergencies with first actions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RedFlags,
});

function RedFlags() {
  const [q, setQ] = useState("");
  const s = q.toLowerCase().trim();
  const list = EMERGENCIES.filter(
    (e) => !s || [e.name, e.sign, e.action, ...e.keywords].join(" ").toLowerCase().includes(s),
  );

  return (
    <div className="relative isolate pb-16 pt-32">
      <Backdrop tone="danger" />
      <div className="mx-auto max-w-5xl px-5">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-destructive">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-destructive" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
            </span>
            Emergency recognition
          </span>
          <h1 className="mt-5 text-5xl font-bold tracking-tight md:text-7xl">
            Stabilise. <span className="font-serif font-normal italic text-destructive">Refer.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            These are red-flag emergencies, not routine OPD cases. Start first actions and arrange urgent transfer.
          </p>
        </div>

        <label className="glass-strong mt-10 flex h-14 items-center gap-3 rounded-2xl px-4">
          <Search className="h-5 w-5 text-destructive" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by sign, e.g. chest pain, stridor, pregnancy…" className="h-full flex-1 bg-transparent outline-none placeholder:text-muted-foreground/70" />
        </label>

        <ol className="mt-8 space-y-4">
          {list.map((e, i) => (
            <li
              key={e.name}
              id={slug(e.name)}
              style={{ animationDelay: `${i * 50}ms` }}
              className="animate-rise group relative scroll-mt-28 overflow-hidden rounded-3xl border border-border bg-card/50 p-6 transition hover:border-destructive/40 target:border-destructive/70 target:shadow-danger md:p-8"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-danger" />
              <div className="grid gap-5 md:grid-cols-[auto_1fr_1.2fr] md:items-start">
                <span className="font-mono text-4xl font-medium text-destructive/40 transition group-hover:text-destructive">
                  {String(EMERGENCIES.indexOf(e) + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-semibold">
                    <Siren className="h-5 w-5 text-destructive" /> {e.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.sign}</p>
                </div>
                <div className="rounded-2xl border border-destructive/25 bg-destructive/[0.07] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-destructive">First action</div>
                  <p className="mt-1.5 text-sm leading-relaxed">{e.action}</p>
                </div>
              </div>
            </li>
          ))}
          {!list.length && <li className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">No red flag matches “{q}”.</li>}
        </ol>
      </div>
    </div>
  );
}
