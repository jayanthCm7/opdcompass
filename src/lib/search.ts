import { CASES, type ClinicalCase } from "@/data/cases";

export type CaseTab = "All" | "Medicine" | "Obs & Gynae" | "Saved";

/** Every word of the query must appear in the case title, diagnosis, keywords or complaints. */
export function searchCases(query: string, tab: CaseTab = "All", saved: string[] = []): ClinicalCase[] {
  const s = query.toLowerCase().trim();
  const words = s.split(/\s+/).filter(Boolean);
  return CASES.filter((c) => {
    const okTab = tab === "All" || (tab === "Saved" ? saved.includes(c.id) : c.sp === tab);
    if (!okTab) return false;
    if (!words.length) return true;
    const blob = [c.t, c.dx, ...c.kw, ...c.co].join(" ").toLowerCase();
    return words.every((w) => blob.includes(w));
  });
}

export function getCase(id: string) {
  return CASES.find((c) => c.id === id);
}

export function neighbours(id: string) {
  const i = CASES.findIndex((c) => c.id === id);
  return {
    prev: i > 0 ? CASES[i - 1] : undefined,
    next: i >= 0 && i < CASES.length - 1 ? CASES[i + 1] : undefined,
  };
}

export function splitRx(line: string) {
  const [drug, dose] = line.split(" — ");
  return { drug, dose };
}
