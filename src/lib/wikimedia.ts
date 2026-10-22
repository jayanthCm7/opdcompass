export interface CommonsImage {
  src: string;
  title: string;
  credit: string;
  lic: string;
  link: string;
}

const mem: Record<string, CommonsImage[]> = {};
const inflight: Record<string, Promise<CommonsImage[]>> = {};

/** Openly licensed clinical images from Wikimedia Commons (browser-only). */
export async function getImages(q: string, limit = 5): Promise<CommonsImage[]> {
  const key = `opd_img_v4_${q}`;
  if (mem[key]) return mem[key].slice(0, limit);
  try {
    const saved = localStorage.getItem(key);
    if (saved) return (mem[key] = JSON.parse(saved)).slice(0, limit);
  } catch {
    /* ignore */
  }
  if (!inflight[key]) inflight[key] = fetchImages(q, key);
  return (await inflight[key]).slice(0, limit);
}

async function fetchImages(q: string, key: string): Promise<CommonsImage[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      generator: "search",
      gsrsearch: q,
      gsrnamespace: "6",
      gsrlimit: "12",
      prop: "imageinfo",
      iiprop: "url|extmetadata|mime",
      iiurlwidth: "900",
    });
  try {
    const j = await (await fetch(url, { signal: ctrl.signal })).json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pages: any[] = Object.values(j?.query?.pages || {}).sort(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a: any, b: any) => (a.index || 0) - (b.index || 0),
    );
    const strip = (h?: string) => (h || "").replace(/<[^>]*>/g, "").trim();
    const out: CommonsImage[] = [];
    for (const p of pages) {
      const i = p.imageinfo?.[0];
      if (!i || !/image\/(jpeg|png)/.test(i.mime)) continue;
      if (/nude|naked|genital|penis|vagina|vulva/i.test(p.title)) continue;
      const lic = strip(i.extmetadata?.LicenseShortName?.value);
      if (/NC|ND/.test(lic)) continue;
      out.push({
        src: i.thumburl || i.url,
        title: p.title.replace(/^File:/, "").replace(/\.[a-z]+$/i, "").replace(/_/g, " "),
        credit: strip(i.extmetadata?.Artist?.value).slice(0, 60) || "Wikimedia Commons",
        lic: lic || "CC",
        link: i.descriptionurl,
      });
      if (out.length >= 5) break;
    }
    if (out.length) {
      try {
        localStorage.setItem(key, JSON.stringify(out));
      } catch {
        /* ignore */
      }
    }
    return (mem[key] = out);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
    delete inflight[key];
  }
}
