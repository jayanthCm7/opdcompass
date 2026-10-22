import { useCallback, useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed stores. Server snapshot is always the fallback value,
 * so SSR and the first client render match; real values appear after hydration.
 */
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return fallback;
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked */
  }
  listeners.get(key)?.forEach((l) => l());
}

function subscribe(key: string, cb: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(cb);
  const onStorage = (e: StorageEvent) => e.key === key && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.get(key)!.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStored<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => read(key, fallback),
    () => fallback,
  );
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = read(key, fallback);
      const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      write(key, v);
    },
    // fallback is a stable literal at each call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set];
}

const EMPTY: string[] = [];

export function useFavorites() {
  const [fav, setFav] = useStored<string[]>("opd_fav", EMPTY);
  const toggle = useCallback(
    (id: string) => {
      let added = false;
      setFav((prev) => {
        added = !prev.includes(id);
        return added ? [...prev, id] : prev.filter((x) => x !== id);
      });
      return added;
    },
    [setFav],
  );
  return { fav, isFav: (id: string) => fav.includes(id), toggle };
}

export function useRecent() {
  const [recent, setRecent] = useStored<string[]>("opd_recent", EMPTY);
  const push = useCallback(
    (id: string) => setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)),
    [setRecent],
  );
  return { recent, push, clear: () => setRecent([]) };
}

export interface Letterhead {
  name: string;
  qual: string;
  clinic: string;
}
const EMPTY_DOC: Letterhead = { name: "", qual: "", clinic: "" };

export function useLetterhead() {
  const [doc, setDoc] = useStored<Letterhead>("opd_doc", EMPTY_DOC);
  return { doc, setDoc, clear: () => setDoc(EMPTY_DOC), active: !!doc.name?.trim() };
}
