import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  FlaskConical,
  HeartPulse,
  Lightbulb,
  ListChecks,
  Pill,
  Siren,
  Star,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Backdrop } from "@/components/site/Shell";
import { SpecialtyBadge } from "@/components/site/CaseCard";
import { spot } from "@/components/site/ui-context";
import { getCase, neighbours, splitRx } from "@/lib/search";
import { getImages, type CommonsImage } from "@/lib/wikimedia";
import { useFavorites, useRecent } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/case/$id")({
  loader: ({ params }) => {
    const c = getCase(params.id);
    if (!c) throw notFound();
    return { c };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.c;
    const title = c ? `${c.t} — ${c.dx} | OPD Compass` : "Case | OPD Compass";
    const desc = c ? `${c.dx}: investigations, treatment guidance, cautions and red flags for ${c.t.toLowerCase()}.` : "Clinical case";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CasePage,
  notFoundComponent: () => (
    <div className="grid min-h-[70vh] place-items-center px-5 pt-32 text-center">
      <div>
        <h1 className="text-4xl font-bold">Case not found</h1>
        <Link to="/" hash="explore" className="mt-4 inline-block text-primary hover:underline">Browse all cases</Link>
      </div>
    </div>
  ),
});

const SECTIONS = [
  { id: "complaints", label: "Complaints", icon: ListChecks },
  { id: "investigations", label: "Investigations", icon: FlaskConical },
  { id: "treatment", label: "Treatment", icon: Pill },
  { id: "advice", label: "Advice", icon: Lightbulb },
  { id: "cautions", label: "Cautions", icon: TriangleAlert },
  { id: "complications", label: "Complications", icon: HeartPulse },
  { id: "refer", label: "Refer if", icon: Siren },
];

function CasePage() {
  const { c } = Route.useLoaderData();
  const { isFav, toggle } = useFavorites();
  const { push } = useRecent();
  const { prev, next } = neighbours(c.id);
  const saved = isFav(c.id);

  useEffect(() => {
    push(c.id);
  }, [c.id, push]);

  const copy = (title: string, items: string[]) => {
    navigator.clipboard.writeText(`${title}\n${items.map((x) => `• ${x}`).join("\n")}`).then(
      () => toast.success(`${title} copied`),
      () => toast.error("Copy failed"),
    );
  };

  return (
    <div className="relative isolate pb-32 pt-28">
      <Backdrop />
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="glass" size="sm" className="rounded-xl">
            <Link to="/" hash="explore"><ArrowLeft className="h-4 w-4" /> All cases</Link>
          </Button>
          <Button
            variant="glass"
            size="sm"
            className={cn("rounded-xl", saved && "border-warning/50 text-warning")}
            onClick={() => toast(toggle(c.id) ? "Case saved" : "Removed from saved")}
          >
            <Star className={cn("h-4 w-4", saved && "fill-warning")} /> {saved ? "Saved" : "Save"}
          </Button>
        </div>

        {/* Header */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-rise flex flex-col justify-end rounded-[2rem] border border-border bg-card/50 p-7 md:p-10">
            <SpecialtyBadge sp={c.sp} n={c.n} />
            <h1 className="mt-4 text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">{c.t}</h1>
            <div className="relative mt-7 overflow-hidden rounded-2xl bg-brand p-5 text-primary-foreground shadow-glow">
              <div className="shimmer-sweep absolute inset-0" />
              <div className="relative font-mono text-[10px] uppercase tracking-[0.2em] opacity-75">Most probable diagnosis</div>
              <div className="relative mt-1 font-display text-2xl font-bold">{c.dx}</div>
            </div>
            <p className="mt-5 font-serif text-lg italic leading-relaxed text-muted-foreground">{c.pa}</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4 text-primary" /> Review in <b className="text-foreground">{c.rev}</b>
            </div>
          </div>
          <Gallery c={c} />
        </div>

        {/* Body */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="sticky top-28 hidden h-fit space-y-1 lg:block">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">On this case</div>
            {SECTIONS.filter((s) => s.id !== "complications" || c.cx?.length).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                  s.id === "refer" && "text-destructive hover:text-destructive",
                )}
              >
                <s.icon className="h-4 w-4" /> {s.label}
              </a>
            ))}
          </nav>

          <div className="grid gap-4 md:grid-cols-2">
            <Block id="complaints" title="Chief complaints" icon={ListChecks} tone="medicine" onCopy={() => copy("Chief complaints", c.co)}>
              <Bullets items={c.co} />
            </Block>
            <Block id="investigations" title="Investigations" icon={FlaskConical} tone="glow" onCopy={() => copy("Investigations", c.inv)}>
              <Bullets items={c.inv} />
            </Block>
            <Block id="treatment" title="Treatment guidance" icon={Pill} tone="primary" span onCopy={() => copy("Treatment", c.rx)}>
              <ol className="grid gap-2 sm:grid-cols-2">
                {c.rx.map((r, i) => {
                  const { drug, dose } = splitRx(r);
                  return (
                    <li key={r} className="flex gap-3 rounded-2xl border border-border bg-secondary/50 p-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 font-mono text-xs text-primary">{i + 1}</span>
                      <div>
                        <div className="font-medium">{drug}</div>
                        {dose && <div className="mt-0.5 text-sm text-muted-foreground">{dose}</div>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Block>
            <Block id="advice" title="Advice" icon={Lightbulb} tone="success" onCopy={() => copy("Advice", c.adv)}>
              <Bullets items={c.adv} />
            </Block>
            <Block id="cautions" title="Cautions" icon={TriangleAlert} tone="warning" onCopy={() => copy("Cautions", c.cau)}>
              <Bullets items={c.cau} />
            </Block>
            {c.cx?.length ? (
              <Block id="complications" title="Complications" icon={HeartPulse} tone="muted" span onCopy={() => copy("Complications", c.cx!)}>
                <div className="flex flex-wrap gap-2">
                  {c.cx.map((x) => (
                    <span key={x} className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm">{x}</span>
                  ))}
                </div>
              </Block>
            ) : null}

            <section id="refer" className="relative scroll-mt-28 overflow-hidden rounded-3xl border border-destructive/40 bg-destructive/10 p-6 md:col-span-2">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-destructive/25 blur-3xl" />
              <h2 className="relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-destructive">
                <AlertTriangle className="h-4 w-4" /> Refer immediately if
              </h2>
              <ul className="relative mt-4 grid gap-2 sm:grid-cols-2">
                {c.rf.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 rounded-xl bg-background/40 p-3 text-sm">
                    <Siren className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> {x}
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid gap-3 sm:grid-cols-2 md:col-span-2">
              {prev ? (
                <Link to="/case/$id" params={{ id: prev.id }} className="group rounded-2xl border border-border bg-card/50 p-5 transition hover:border-primary/40">
                  <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"><ChevronLeft className="h-3 w-3" /> Previous</span>
                  <span className="mt-1 block font-semibold group-hover:text-primary">{prev.t}</span>
                </Link>
              ) : <span />}
              {next && (
                <Link to="/case/$id" params={{ id: next.id }} className="group rounded-2xl border border-border bg-card/50 p-5 text-right transition hover:border-primary/40">
                  <span className="flex items-center justify-end gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Next <ChevronRight className="h-3 w-3" /></span>
                  <span className="mt-1 block font-semibold group-hover:text-primary">{next.t}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="no-print fixed inset-x-0 bottom-20 z-40 px-3 md:bottom-5">
        <div className="glass-strong mx-auto flex max-w-xl items-center gap-3 rounded-2xl p-2 pl-5 shadow-elevated">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{c.t}</div>
            <div className="truncate text-xs text-muted-foreground">{c.rx.length} medicines · review {c.rev}</div>
          </div>
          <Button asChild variant="hero" className="h-11 rounded-xl px-5">
            <Link to="/rx/$id" params={{ id: c.id }}>Build draft Rx <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

const TONES = {
  primary: "text-primary bg-primary/10 border-primary/25",
  medicine: "text-medicine bg-medicine/10 border-medicine/25",
  glow: "text-primary-glow bg-primary-glow/10 border-primary-glow/25",
  success: "text-success bg-success/10 border-success/25",
  warning: "text-warning bg-warning/10 border-warning/25",
  muted: "text-muted-foreground bg-secondary border-border",
};

function Block({
  id,
  title,
  icon: Icon,
  tone,
  span,
  onCopy,
  children,
}: {
  id: string;
  title: string;
  icon: typeof Pill;
  tone: keyof typeof TONES;
  span?: boolean;
  onCopy: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      onMouseMove={spot}
      className={cn("spotlight animate-rise group scroll-mt-28 rounded-3xl border border-border bg-card/50 p-6", span && "md:col-span-2")}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl border", TONES[tone])}>
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
        <button
          onClick={onCopy}
          className="ml-auto rounded-lg p-2 text-muted-foreground opacity-0 transition hover:bg-secondary hover:text-foreground group-hover:opacity-100"
          aria-label={`Copy ${title}`}
        >
          <ClipboardCopy className="h-4 w-4" />
        </button>
      </div>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((x) => (
        <li key={x} className="flex gap-3 text-[15px] leading-relaxed">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          {x}
        </li>
      ))}
    </ul>
  );
}

function Gallery({ c }: { c: ReturnType<typeof getCase> & {} }) {
  const [imgs, setImgs] = useState<CommonsImage[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    let alive = true;
    setImgs(null);
    setIdx(0);
    setReveal(false);
    getImages(c.img, 5).then((r) => alive && setImgs(r));
    return () => {
      alive = false;
    };
  }, [c.img]);

  if (imgs === null) return <div className="min-h-80 animate-pulse rounded-[2rem] bg-card" />;
  if (!imgs.length)
    return (
      <div className="grid min-h-80 place-items-center rounded-[2rem] border border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
        No openly licensed clinical image available for this case.
      </div>
    );

  const im = imgs[idx];
  const blur = c.sens && !reveal;
  return (
    <div className="animate-rise flex flex-col gap-3">
      <div className="group relative min-h-80 flex-1 overflow-hidden rounded-[2rem] border border-border bg-card">
        <img key={im.src} src={im.src} alt={im.title} className={cn("animate-rise absolute inset-0 h-full w-full object-cover", blur && "scale-110 blur-2xl")} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        {blur && (
          <button onClick={() => setReveal(true)} className="glass absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-5 py-2.5 text-sm font-medium">
            Sensitive image — tap to view
          </button>
        )}
        {imgs.length > 1 && (
          <>
            <button onClick={() => setIdx((idx - 1 + imgs.length) % imgs.length)} className="glass absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full opacity-0 transition group-hover:opacity-100" aria-label="Previous image">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setIdx((idx + 1) % imgs.length)} className="glass absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full opacity-0 transition group-hover:opacity-100" aria-label="Next image">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <a href={im.link} target="_blank" rel="noopener noreferrer" className="absolute inset-x-0 bottom-0 p-5">
          <div className="line-clamp-1 text-sm font-medium">{im.title}</div>
          <div className="mt-0.5 line-clamp-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {im.credit} · {im.lic} · Wikimedia Commons
          </div>
        </a>
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-2">
          {imgs.map((x, i) => (
            <button
              key={x.src}
              onClick={() => setIdx(i)}
              className={cn("h-16 flex-1 overflow-hidden rounded-xl border-2 transition", i === idx ? "border-primary" : "border-transparent opacity-50 hover:opacity-100")}
              aria-label={`Show image ${i + 1}`}
            >
              <img src={x.src} alt="" loading="lazy" className={cn("h-full w-full object-cover", c.sens && !reveal && "blur-md")} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
