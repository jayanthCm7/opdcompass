import { createContext, useContext } from "react";

export interface SiteUI {
  openPalette: () => void;
  openLetterhead: () => void;
}

export const SiteUIContext = createContext<SiteUI>({
  openPalette: () => {},
  openLetterhead: () => {},
});

export const useSiteUI = () => useContext(SiteUIContext);

/** Cursor-follow spotlight: pair with the `spotlight` utility class. */
export function spot(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}
