import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { LetterheadDialog } from "./LetterheadDialog";
import { SiteUIContext } from "./ui-context";
import { Toaster } from "@/components/ui/sonner";

export function Shell({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState(false);
  const [letterhead, setLetterhead] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target as HTMLElement)?.isContentEditable) {
        e.preventDefault();
        setPalette(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ui = useMemo(
    () => ({ openPalette: () => setPalette(true), openLetterhead: () => setLetterhead(true) }),
    [],
  );

  return (
    <SiteUIContext.Provider value={ui}>
      <div className="relative min-h-screen overflow-x-clip">
        <div className="bg-noise pointer-events-none fixed inset-0 z-[60]" />
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
      <CommandPalette open={palette} onOpenChange={setPalette} onLetterhead={() => setLetterhead(true)} />
      <LetterheadDialog open={letterhead} onOpenChange={setLetterhead} />
      <Toaster position="bottom-center" />
    </SiteUIContext.Provider>
  );
}

/** Shared ambient page backdrop: aurora blobs + grid. */
export function Backdrop({ tone = "brand" }: { tone?: "brand" | "danger" }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      {tone === "brand" ? (
        <>
          <div className="animate-aurora absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="animate-aurora absolute -right-32 top-20 h-[480px] w-[480px] rounded-full bg-primary-glow/20 blur-[120px] [animation-delay:-6s]" />
          <div className="animate-aurora absolute left-1/3 top-80 h-[360px] w-[360px] rounded-full bg-obgyn/10 blur-[120px] [animation-delay:-11s]" />
        </>
      ) : (
        <>
          <div className="animate-aurora absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-destructive/25 blur-[120px]" />
          <div className="animate-aurora absolute -right-32 top-20 h-[480px] w-[480px] rounded-full bg-warning/10 blur-[120px] [animation-delay:-6s]" />
        </>
      )}
    </div>
  );
}
