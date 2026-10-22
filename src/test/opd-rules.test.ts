import { describe, expect, it } from "vitest";
import { searchCases } from "@/lib/search";
import { detectEmergencies } from "@/data/emergencies";
import { TOOLS } from "@/data/tools";
import { CASES } from "@/data/cases";

const tool = (id: string) => TOOLS.find((t) => t.id === id)!;

describe("OPD Compass clinical rules", () => {
  it("ships 46 Medicine and 18 Obs & Gynae cases", () => {
    expect(CASES.filter((c) => c.sp === "Medicine")).toHaveLength(46);
    expect(CASES.filter((c) => c.sp === "Obs & Gynae")).toHaveLength(18);
  });

  it("search requires every word to match", () => {
    const hits = searchCases("dry cough");
    expect(hits.map((c) => c.id)).toContain("m1");
    expect(searchCases("dry cough zzzz")).toHaveLength(0);
  });

  it("Saved tab only returns saved cases", () => {
    expect(searchCases("", "Saved", ["m2"]).map((c) => c.id)).toEqual(["m2"]);
  });

  it("flags chest pain as possible acute coronary syndrome", () => {
    expect(detectEmergencies("chest pain since morning").map((e) => e.name)).toContain("Acute Coronary Syndrome");
    expect(detectEmergencies("ch")).toHaveLength(0);
  });

  it("BMI uses Asian-Indian cut-offs (23 is overweight)", () => {
    expect(tool("bmi").calc({ wt: "66.5", ht: "170" })?.label).toBe("Overweight");
  });

  it("child paracetamol is 15 mg/kg capped at 1 g", () => {
    expect(tool("pcm").calc({ wt: "12" })?.big).toBe("180 mg per dose");
    expect(tool("pcm").calc({ wt: "100" })?.big).toBe("1000 mg per dose");
  });

  it("Cockcroft-Gault applies 0.85 for females", () => {
    expect(tool("crcl").calc({ age: "60", wt: "72", scr: "1", sex: "M" })?.big).toBe("80 ml/min");
    expect(tool("crcl").calc({ age: "60", wt: "72", scr: "1", sex: "F" })?.big).toBe("68 ml/min");
  });

  it("ORS plan B is 75 ml/kg over 4 hours", () => {
    expect(tool("ors").calc({ wt: "20" })?.big).toBe("1500 ml over 4 hours");
  });
});
