import type { CommonsImage } from "@/lib/wikimedia";
import peConsult from "@/assets/cases/pe-consult.jpg";
import peCouple from "@/assets/cases/pe-couple-counselling.jpg";
import peTiming from "@/assets/cases/pe-timing-treatment.jpg";
import pePelvic from "@/assets/cases/pe-pelvic-floor.jpg";
import peSerotonin from "@/assets/cases/pe-serotonin.jpg";
import gPain from "@/assets/cases/gerd-pain.jpg";
import gReflux from "@/assets/cases/gerd-reflux.jpg";
import gExam from "@/assets/cases/gerd-exam.jpg";
import gDiet from "@/assets/cases/gerd-diet.jpg";
import bDis from "@/assets/cases/bloat-discomfort.jpg";
import bGut from "@/assets/cases/bloat-gut.jpg";
import bCon from "@/assets/cases/bloat-consult.jpg";
import bWalk from "@/assets/cases/bloat-walk.jpg";
import abCough from "@/assets/cases/ab-cough.jpg";
import abAirways from "@/assets/cases/ab-airways.jpg";
import abSteth from "@/assets/cases/ab-stethoscope.jpg";
import abFluids from "@/assets/cases/ab-warm-fluids.jpg";

const own = (src: string, title: string): CommonsImage => ({
  src,
  title,
  credit: "OPD Compass original",
  lic: "Copyright-free",
  source: "OPD Compass",
});

/** Original, copyright-free pictures that replace Wikimedia results for specific cases. */
export const CASE_IMAGES: Record<string, CommonsImage[]> = {
  m2: [
    own(gPain, "Burning epigastric pain"),
    own(gReflux, "Acid reflux through a weak sphincter"),
    own(gExam, "Abdominal examination in OPD"),
    own(gDiet, "Light meals, less spicy and fried food"),
  ],
  m3: [
    own(abCough, "Productive cough at home"),
    own(abAirways, "Inflamed bronchial tubes with mucus"),
    own(abSteth, "Chest auscultation in OPD"),
    own(abFluids, "Warm fluids and rest"),
  ],
  m6: [
    own(bDis, "Bloating and fullness after meals"),
    own(bGut, "Gas trapped in the bowel"),
    own(bCon, "Explaining digestion in OPD"),
    own(bWalk, "Eat slowly, walk after meals"),
  ],
  m12: [
    own(peConsult, "Confidential men's health consultation"),
    own(peCouple, "Couple counselling and sex therapy"),
    own(peTiming, "Timing and on-demand treatment"),
    own(pePelvic, "Pelvic floor exercises"),
    own(peSerotonin, "Serotonin and ejaculatory control"),
  ],
};
