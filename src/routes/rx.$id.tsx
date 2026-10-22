import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ClipboardCopy, FileSignature, MessageCircle, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Backdrop } from "@/components/site/Shell";
import { useSiteUI } from "@/components/site/ui-context";
import { getCase, splitRx } from "@/lib/search";
import { useLetterhead } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rx/$id")({
  loader: ({ params }) => {
    const c = getCase(params.id);
    if (!c) throw notFound();
    return { c };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `Draft Rx — ${loaderData.c.dx} | OPD Compass` : "Draft Rx | OPD Compass";
    const d = "Editable, printable draft prescription on your own letterhead.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: RxPage,
});

function RxPage() {
  const { c } = Route.useLoaderData();
  const { doc, active } = useLetterhead();
  const { openLetterhead } = useSiteUI();
  const paper = useRef<HTMLDivElement>(null);

  const [patient, setPatient] = useState({ name: "", age: "", sex: "" });
  const [meds, setMeds] = useState<boolean[]>(() => c.rx.map(() => true));
  const [show, setShow] = useState({ adv: true, inv: true, rf: true });
  const [resetKey, setResetKey] = useState(0);

  const date = useMemo(
    () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    [],
  );
  const paperKey = JSON.stringify({ patient, meds, show, resetKey, doc });

  const text = () => paper.current?.innerText ?? "";
  const copy = () =>
    navigator.clipboard.writeText(text()).then(
      () => toast.success("Prescription text copied"),
      () => toast.error("Select the slip and copy manually"),
    );
  const share = () => {
    const t = text();
    if (navigator.share) {
      navigator.share({ title: "Draft Rx", text: t }).catch(() => {});
      return;
    }
    window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank", "noopener");
  };

  const input =
    "w-full rounded-xl border border-input bg-secondary/50 px-3 py-2.5 text-sm outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10";

  return (
    <div className="relative isolate pb-32 pt-28">
      <Backdrop />
      <div className="mx-auto max-w-7xl px-5">
        <div className="no-print flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="glass" size="sm" className="rounded-xl">
            <Link to="/case/$id" params={{ id: c.id }}><ArrowLeft className="h-4 w-4" /> Back to case</Link>
          </Button>
          <h1 className="font-display text-xl font-semibold">Draft prescription</h1>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Controls */}
          <aside className="no-print space-y-4 lg:sticky lg:top-28 lg:h-fit">
            <Panel title="Letterhead">
              {active ? (
                <div className="text-sm">
                  <div className="font-semibold">{doc.name}</div>
                  {doc.qual && <div className="text-muted-foreground">{doc.qual}</div>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No letterhead yet — the slip shows blank lines.</p>
              )}
              <Button variant="glass" size="sm" className="mt-3 w-full rounded-xl" onClick={openLetterhead}>
                <FileSignature className="h-4 w-4" /> {active ? "Edit letterhead" : "Set up letterhead"}
              </Button>
            </Panel>

            <Panel title="Patient">
              <div className="space-y-2">
                <input className={input} placeholder="Patient name" value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <input className={input} placeholder="Age" inputMode="numeric" value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value })} />
                  <select className={input} value={patient.sex} onChange={(e) => setPatient({ ...patient, sex: e.target.value })}>
                    <option value="">Sex</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>
            </Panel>

            <Panel title="Medicines">
              <div className="space-y-1.5">
                {c.rx.map((r, i) => (
                  <label key={r} className="flex cursor-pointer items-start gap-2.5 rounded-xl p-2 text-sm transition hover:bg-secondary">
                    <input
                      type="checkbox"
                      checked={meds[i]}
                      onChange={() => setMeds(meds.map((m, j) => (j === i ? !m : m)))}
                      className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
                    />
                    <span className={cn(!meds[i] && "text-muted-foreground line-through")}>{splitRx(r).drug}</span>
                  </label>
                ))}
              </div>
            </Panel>

            <Panel title="Sections">
              {([["adv", "Advice"], ["inv", "Investigations"], ["rf", "Return-immediately warnings"]] as const).map(([k, l]) => (
                <label key={k} className="flex cursor-pointer items-center gap-2.5 rounded-xl p-2 text-sm hover:bg-secondary">
                  <input type="checkbox" checked={show[k]} onChange={() => setShow({ ...show, [k]: !show[k] })} className="h-4 w-4 accent-[var(--primary)]" />
                  {l}
                </label>
              ))}
            </Panel>

            <p className="rounded-2xl border border-warning/30 bg-warning/10 p-3 text-xs leading-relaxed text-warning">
              Draft only. Click any text on the slip to edit it before printing. Changing the options above resets manual edits.
            </p>
          </aside>

          {/* Paper */}
          <div>
            <div
              key={paperKey}
              id="rx-paper"
              ref={paper}
              contentEditable
              suppressContentEditableWarning
              className="animate-rise mx-auto max-w-[210mm] rounded-3xl bg-paper p-8 text-sm text-paper-foreground shadow-elevated outline-none md:p-12"
            >
              <div className={cn("flex items-start justify-between gap-4 border-b-2 pb-4", active ? "border-paper-ink" : "border-paper-line")}>
                <div>
                  {active ? (
                    <>
                      <div className="font-display text-2xl font-bold text-paper-ink">{doc.name}</div>
                      {doc.qual && <div className="text-xs text-paper-muted">{doc.qual}</div>}
                      {doc.clinic && <div className="text-xs text-paper-muted">{doc.clinic}</div>}
                    </>
                  ) : (
                    <>
                      <div className="font-display text-2xl font-bold text-paper-muted/60">Dr. ____________________</div>
                      <div className="text-xs text-paper-muted/60">Qualification · registration no.</div>
                      <div className="text-xs text-paper-muted/60">Clinic · phone</div>
                    </>
                  )}
                </div>
                <div className="text-xs font-semibold text-paper-muted">{date}</div>
              </div>

              <div className="grid grid-cols-1 gap-2 border-b border-dashed border-paper-line py-4 text-xs sm:grid-cols-3">
                <div>Name: <b>{patient.name || "________________"}</b></div>
                <div>Age/Sex: <b>{patient.age || "___"}/{patient.sex || "___"}</b></div>
                <div>Dx: <b>{c.dx}</b></div>
              </div>

              <div className="flex gap-4 py-6">
                <span className="font-serif text-5xl italic leading-none text-paper-ink">℞</span>
                <ol className="flex-1 space-y-3">
                  {c.rx.filter((_, i) => meds[i]).map((r, i) => {
                    const { drug, dose } = splitRx(r);
                    return (
                      <li key={r} className="border-b border-dotted border-paper-line pb-2">
                        <b>{i + 1}. {drug}</b>
                        {dose && <div className="text-xs text-paper-muted">{dose}</div>}
                      </li>
                    );
                  })}
                </ol>
              </div>

              {show.adv && (
                <div className="text-xs">
                  <b className="text-paper-ink">Advice:</b>
                  <ul className="mt-1 list-disc pl-5">
                    {c.adv.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </div>
              )}
              {show.inv && (
                <div className="mt-3 text-xs">
                  <b className="text-paper-ink">Investigations:</b> {c.inv.join(", ")}
                </div>
              )}
              {show.rf && (
                <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-[11px] text-destructive">
                  <b>Return immediately if:</b> {c.rf.join(" • ")}
                </div>
              )}
              <div className="mt-12 flex items-end justify-between text-xs">
                <span>Review: <b>{c.rev}</b></span>
                <span className="w-40 border-t border-paper-muted pt-1 text-center">Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print fixed inset-x-0 bottom-20 z-40 px-3 md:bottom-5">
        <div className="glass-strong mx-auto flex max-w-xl gap-2 rounded-2xl p-2 shadow-elevated">
          <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0 rounded-xl" onClick={() => setResetKey((k) => k + 1)} aria-label="Reset slip" title="Reset slip">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="glass" className="h-11 rounded-xl" onClick={copy}>
            <ClipboardCopy className="h-4 w-4" /> Copy
          </Button>
          <Button variant="glass" className="h-11 flex-1 rounded-xl" onClick={share}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
          <Button variant="hero" className="h-11 flex-1 rounded-xl" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print / PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}
