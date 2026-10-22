<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Clinical content (cases, red flags, calculators, legal copy) lives as typed static data in `src/data/`; pages only render it — keeps the medical compilation in one auditable place.
- Personal state (saved cases, recent cases, letterhead) is browser-only via `src/lib/store.ts` (useSyncExternalStore over localStorage) — the app is account-free and privacy-first by design.
- Case images: own copyright-free sets in `src/data/case-images.ts` (keyed by case id) take priority; otherwise client-side Wikimedia Commons (`src/lib/wikimedia.ts`), filtering NC/ND licences and sensitive titles — no API key or server needed.
- Single dark "Clinical Noir" theme; all colours are tokens in `src/styles.css`, prescription paper uses its own `paper-*` tokens so it prints light.
- Clinical rules (search matching, emergency detection, calculator outputs) are covered by `src/test/opd-rules.test.ts`; update it when changing those rules.
