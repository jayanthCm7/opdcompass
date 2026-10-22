import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Logo } from "./Logo";

const LEGAL_LINKS = [
  ["privacy", "Privacy Policy"],
  ["terms", "Terms of Use"],
  ["disclaimer", "Medical Disclaimer"],
  ["cookies", "Cookies"],
  ["copyright", "Copyright & Credits"],
] as const;

export function Footer() {
  return (
    <footer className="no-print relative mt-24 overflow-hidden border-t border-border pb-28 pt-16 md:pb-12">
      <div className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-3xl rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Educational reference for registered medical practitioners and students. Not a substitute for
              clinical judgement, local protocols, or product information. Verify every dose and interaction
              before prescribing.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/" hash="explore" className="hover:text-primary">Clinical cases</Link></li>
              <li><Link to="/tools" className="hover:text-primary">Calculators</Link></li>
              <li><Link to="/red-flags" className="hover:text-primary">Emergency red flags</Link></li>
              <li><Link to="/" hash="about" className="hover:text-primary">About the author</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Legal · 2026</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {LEGAL_LINKS.map(([k, l]) => (
                <li key={k}>
                  <Link to="/legal/$key" params={{ key: k }} className="hover:text-primary">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 select-none overflow-hidden">
          <div className="text-gradient font-display text-[18vw] font-bold leading-[0.8] tracking-tighter opacity-90 md:text-[12rem]">
            OPD Compass
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 Dr Jayanth C M. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Designed & built by <b className="text-foreground">Jayanth C M</b>
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> Bengaluru, India
          </span>
        </div>
      </div>
    </footer>
  );
}
