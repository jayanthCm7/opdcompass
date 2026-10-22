import type { CommonsImage } from "@/lib/wikimedia";
import peConsult from "@/assets/cases/pe-consult.jpg";
import peCouple from "@/assets/cases/pe-couple-counselling.jpg";
import peTiming from "@/assets/cases/pe-timing-treatment.jpg";
import pePelvic from "@/assets/cases/pe-pelvic-floor.jpg";
import peSerotonin from "@/assets/cases/pe-serotonin.jpg";

const own = (src: string, title: string): CommonsImage => ({
  src,
  title,
  credit: "OPD Compass original",
  lic: "Copyright-free",
  source: "OPD Compass",
});

/** Original, copyright-free pictures that replace Wikimedia results for specific cases. */
export const CASE_IMAGES: Record<string, CommonsImage[]> = {
  m12: [
    own(peConsult, "Confidential men's health consultation"),
    own(peCouple, "Couple counselling and sex therapy"),
    own(peTiming, "Timing and on-demand treatment"),
    own(pePelvic, "Pelvic floor exercises"),
    own(peSerotonin, "Serotonin and ejaculatory control"),
  ],
};
