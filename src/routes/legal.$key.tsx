import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Backdrop } from "@/components/site/Shell";
import { LEGAL } from "@/data/legal";

export const Route = createFileRoute("/legal/$key")({
  loader: ({ params }) => {
    const doc = LEGAL[params.key];
    if (!doc) throw notFound();
    return { doc, key: params.key };
  },
  head: ({ loaderData }) => {
    const t = `${loaderData?.doc.title ?? "Legal"} | OPD Compass`;
    const d = `${loaderData?.doc.title ?? "Legal information"} for OPD Compass, a clinical reference toolkit.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: LegalPage,
});

const NAV = [
  ["privacy", "Privacy"],
  ["terms", "Terms"],
  ["disclaimer", "Disclaimer"],
  ["cookies", "Cookies"],
  ["copyright", "Copyright"],
] as const;

function LegalPage() {
  const { doc, key } = Route.useLoaderData();
  return (
    <div className="relative isolate pb-16 pt-32">
      <Backdrop />
      <div className="mx-auto max-w-3xl px-5">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Legal · 2026</div>
        <h1 className="mt-2 text-5xl font-bold tracking-tight">{doc.title}</h1>
        <div className="scrollbar-none mt-6 flex gap-2 overflow-x-auto">
          {NAV.map(([k, l]) => (
            <Link
              key={k}
              to="/legal/$key"
              params={{ key: k }}
              className={k === key ? "shrink-0 rounded-full bg-foreground px-4 py-1.5 text-sm text-background" : "shrink-0 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground"}
            >
              {l}
            </Link>
          ))}
        </div>
        <article
          className="mt-8 space-y-3 rounded-3xl border border-border bg-card/50 p-7 text-[15px] leading-relaxed text-muted-foreground md:p-10"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </div>
    </div>
  );
}
