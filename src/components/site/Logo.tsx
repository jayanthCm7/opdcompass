import { Link } from "@tanstack/react-router";
import compass from "@/assets/compass.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="OPD Compass home">
      <span className="relative grid h-9 w-9 place-items-center">
        <span className="absolute inset-0 rounded-full bg-primary/25 blur-md transition group-hover:bg-primary/45" />
        <img
          src={compass}
          alt=""
          width={36}
          height={36}
          className="relative h-9 w-9 transition-transform duration-700 group-hover:rotate-[135deg]"
        />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[17px] font-bold tracking-tight">
            OPD<span className="text-primary">Compass</span>
          </span>
          <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Clinical toolkit
          </span>
        </span>
      )}
    </Link>
  );
}
