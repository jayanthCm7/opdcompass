import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calculator, FileSignature, Search, Siren, Stethoscope } from "lucide-react";
import { Logo } from "./Logo";
import { useSiteUI } from "./ui-context";
import { useLetterhead } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Cases", icon: Stethoscope, hash: "explore" },
  { to: "/tools", label: "Tools", icon: Calculator },
  { to: "/red-flags", label: "Red Flags", icon: Siren },
] as const;

export function Header() {
  const { openPalette, openLetterhead } = useSiteUI();
  const { active } = useLetterhead();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-7xl items-center gap-3 rounded-2xl px-3 transition-all duration-500 sm:px-4",
          scrolled ? "glass-strong shadow-elevated" : "border border-transparent",
        )}
      >
        <Logo />

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              hash={"hash" in n ? n.hash : undefined}
              activeOptions={{ exact: true, includeHash: false }}
              className="group flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground data-[status=active]:text-foreground"
            >
              <n.icon className="h-4 w-4 transition group-hover:text-primary group-data-[status=active]:text-primary" />
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={openPalette}
            className="group flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground sm:w-64"
            aria-label="Search everything"
          >
            <Search className="h-4 w-4 group-hover:text-primary" />
            <span className="hidden sm:inline">Search cases, tools…</span>
            <kbd className="ml-auto hidden rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:inline">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={openLetterhead}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-secondary/60 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            aria-label="Prescription letterhead"
            title="Prescription letterhead"
          >
            <FileSignature className="h-4 w-4" />
            {active && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="glass-strong fixed inset-x-3 bottom-3 z-50 flex justify-around rounded-2xl p-1.5 md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.label}
            to={n.to}
            hash={"hash" in n ? n.hash : undefined}
            activeOptions={{ exact: true, includeHash: false }}
            className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium text-muted-foreground data-[status=active]:bg-secondary data-[status=active]:text-primary"
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
