import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { toast } from "sonner";
import type { ClinicalCase } from "@/data/cases";
import { getImages } from "@/lib/wikimedia";
import { useFavorites } from "@/lib/store";
import { cn } from "@/lib/utils";
import { spot } from "./ui-context";

export function SpecialtyBadge({ sp, n }: { sp: ClinicalCase["sp"]; n?: number }) {
  const med = sp === "Medicine";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
        med ? "border-medicine/30 bg-medicine/10 text-medicine" : "border-obgyn/30 bg-obgyn/10 text-obgyn",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", med ? "bg-medicine" : "bg-obgyn")} />
      {sp}
      {n !== undefined && <span className="opacity-60">· #{String(n).padStart(2, "0")}</span>}
    </span>
  );
}

export function useThumb(c: ClinicalCase) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    getImages(c.img, 1).then((im) => alive && im[0] && setSrc(im[0].src));
    return () => {
      alive = false;
    };
  }, [c.img]);
  return src;
}

export function CaseCard({ c, index = 0 }: { c: ClinicalCase; index?: number }) {
  const { isFav, toggle } = useFavorites();
  const src = useThumb(c);
  const med = c.sp === "Medicine";
  const saved = isFav(c.id);

  return (
    <article
      onMouseMove={spot}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      className="spotlight animate-rise group relative overflow-hidden rounded-3xl border border-border bg-card/60 transition-all duration-500 hover:-translate-y-1 hover:bg-card"
    >
      <Link to="/case/$id" params={{ id: c.id }} className="flex gap-4 p-4">
        <div
          className={cn(
            "relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl",
            med ? "bg-medicine/15" : "bg-obgyn/15",
          )}
        >
          <span
            className={cn(
              "absolute inset-0 grid place-items-center font-display text-4xl font-bold",
              med ? "text-medicine" : "text-obgyn",
            )}
          >
            {c.t[0]}
          </span>
          {src && (
            <img
              src={src}
              alt=""
              loading="lazy"
              className={cn(
                "absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:scale-110",
                c.sens && "blur-md",
              )}
              onLoad={(e) => e.currentTarget.classList.replace("opacity-0", "opacity-90")}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
        <div className="min-w-0 flex-1 pr-8">
          <SpecialtyBadge sp={c.sp} n={c.n} />
          <h3 className="mt-2 line-clamp-1 text-[17px] font-semibold leading-snug transition group-hover:text-primary">
            {c.t}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{c.dx}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {c.co.slice(0, 3).map((s) => (
              <span key={s} className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
        <ArrowUpRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-hover:opacity-100" />
      </Link>
      <button
        onClick={() => {
          const added = toggle(c.id);
          toast(added ? "Case saved" : "Removed from saved");
        }}
        className={cn(
          "absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-xl border border-border bg-background/70 backdrop-blur transition hover:scale-110",
          saved ? "text-warning" : "text-muted-foreground hover:text-foreground",
        )}
        aria-label={saved ? "Remove from saved" : "Save case"}
      >
        <Star className={cn("h-4 w-4", saved && "fill-warning")} />
      </button>
    </article>
  );
}
