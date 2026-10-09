# Session notes — full save (do not lose)

**Last saved:** 2026-10-09  
**Status:** All previous website work is **kept**. Site code through `7cc4302` is **committed** and **pushed**. This notes commit follows that.  
**Working tree:** the only untracked path that matters is `.github/workflows/refresh-x.yml` (see below). Do not `git add -A` until `gh` has the `workflow` scope, or the push is rejected.

| | |
|--|--|
| **Project path** | `/home/thehacker/educa` |
| **GitHub** | https://github.com/theprofhacker/educa |
| **Live site** | https://theprofhacker.github.io/educa/ |
| **GitHub account** | `theprofhacker` |
| **X handle** | `@theprocracker` |
| **X followers (snapshot)** | 8,545 on 2026-10-09 |
| **Telegram** | https://t.me/social2hacks (`@social2hacks`) |
| **Signal** | https://signal.me/#u/theprocracker.43 (`@theprocracker.43`) |
| **HEAD before this notes save** | `7cc4302` — Add live shelves, on-page playback, and a share card |

---

## Guarantee for next session

Nothing from earlier sessions was discarded. The August 2026 layout, copy history, and git history below are still in this file. The **current** site is the October 2026 state in the next section.

When you return, open this file and `CONVERSATION-LOG.md`. Do **not** rebuild from scratch unless asked.

---

## Current state — 2026-10-09

Static portfolio for **The Hacker (@theprocracker)**. HTML + Tailwind CDN + vanilla JS. GitHub Pages from `main`.

**Look:** deep violet background `#070514`, aurora accent (violet `#7c3aed` into cyan `#22d3ee` / `#5eead4`). Fonts still Instrument Serif + Inter. Avatar: `assets/avatar.jpg`.

**Videos** (`js/videos.js`, generated — do not edit by hand):

- `window.VIDEOS` — six most-viewed posts, first is the featured card
- `window.LATEST` — six newer posts that are not already in the most-viewed six
- Play opens an on-page X embed (`platform.twitter.com/embed/Tweet.html`). "Open original on X" stays under the player
- Filter chips: All, Desktop, Network, OSINT, Video
- Catalog of seen posts: `data/catalog.json`

**Accounts:** `js/auth.js`. Sign up with username, email, and password. Sign in with username **or** email. Session stays in **this browser only** (`localStorage`). There is no server. Do not put passwords in the repo.

**Connect:** X, Telegram, and Signal, with icons, in the profile panel, the connect row, and the footer.

**GitHub row:** `js/repos.js`. Pins on the profile were empty, so the row shows `educa` and `theprofhacker`. `scripts/refresh_site.py` skips repos whose name or description matches brute-force, stolen-account, or remote-access tools. Do not add those repos to the site.

**Share card:** `assets/favicon.svg` and `assets/og.png` (name, @theprocracker, follower count). Open Graph tags are in `index.html`.

**Refresh:** `python3 scripts/refresh_site.py` rewrites the follower count, both shelves, `js/repos.js`, and the share card. It uses the public FixupX media feed and `api.fxtwitter.com`. No X API key.

**Not on GitHub yet:** `.github/workflows/refresh-x.yml` (Mondays 13:17 UTC, plus manual run). Push was rejected because the `gh` token has `gist`, `read:org`, and `repo` only — not `workflow`. To publish it later:

```bash
export PATH="$HOME/.local/bin:$PATH"
gh auth refresh -s workflow
cd /home/thehacker/educa
git add .github/workflows/refresh-x.yml
git commit -m "Run a weekly refresh of X stats"
git push
```

**Left unfinished (user did not pick these):**

- Theme switch (violet vs flat ink)
- Custom domain
- Accounts that work on every device (needs a real backend; do not invent one on GitHub Pages)

---

## August 2026 snapshot (kept, no longer the live look)

Editorial **portfolio / video showcase** for **The Hacker (@theprocracker)** on X. The palette below was replaced on 2026-10-09. Do not restore gold-on-ink unless asked.

- Static site: HTML + Tailwind (CDN) + vanilla JS  
- Dark ink palette (`#070708`) with gold accent (`#c8a96b`)  
- Fonts: **Instrument Serif** (display) + **Inter** (UI)  
- Video data in `js/videos.js`  
- Deployed via **GitHub Pages** (`main` branch, root `/`)

---

## Project files

```
educa/
├── index.html          # Layout, Tailwind config, hero / work / contact / footer
├── styles.css          # Portfolio system (nav, buttons, cards, featured, footer)
├── js/
│   ├── videos.js       # Video array (titles, categories, thumbs, URLs)
│   └── app.js          # Featured card + grid, lightbox, nav scroll
├── assets/
│   └── avatar.jpg      # Profile photo
├── README.md           # How to run + live URL
├── SESSION-NOTES.md    # This handoff file
└── .gitignore
```

**Local preview:**
```bash
cd /home/thehacker/educa
python3 -m http.server 8080
# open http://localhost:8080
```

---

## Site structure (current)

| Section | Content |
|---------|---------|
| **Nav** | TH monogram, Work / About / Contact, Follow CTA |
| **Hero (#about)** | Title “The Hacker”, @theprocracker, bio: *Growth hacking is a mindset rather than a toolset.* Profile panel (avatar, stats, chips). |
| **Work (#work)** | `01 — Work` · Featured = first video · grid of remaining (numbered) |
| **Contact (#contact)** | `02 — Connect` · X + GitHub links |
| **Footer** | Brand, navigate, presence, legal line |

**Intentionally removed earlier (keep removed unless asked):**
- Hero tagline “Building in public / Demonstrating craft”
- Extra bio line about “Selected walkthroughs…”
- Full **Approach / Philosophy** section

---

## Content & copy

| Item | Value |
|------|--------|
| Display name | **The Hacker** |
| Handle | **@theprocracker** |
| Bio | **Growth hacking is a mindset rather than a toolset.** |
| Section work | **Featured videos** |
| GitHub link | https://github.com/theprofhacker |
| X link | https://x.com/theprocracker |
| Avatar | `assets/avatar.jpg` |

---

## Videos (6 posts in `js/videos.js`)

First item = large featured card. Thumbs use `?format=jpg&name=orig` (native resolution).  
`referrerpolicy="no-referrer"` on images so X CDN loads reliably.

| # | Date | Title | Category | Status ID |
|---|------|-------|----------|-----------|
| Featured | Aug 1, 2026 | Switch Between Themes — Grok Build | Workflow | `2083674380518006837` |
| 02 | Jul 31, 2026 | InstaBrute v2.0 — Kali Linux | Tooling | `2083313276893401256` |
| 03 | Jul 31, 2026 | BruteForce Snapchat Password | Demo | `2083157793415016916` |
| 04 | Jul 30, 2026 | MailRecon 2.0 — Kali Linux 2026.2 | Tooling | `2082796572304113976` |
| 05 | Jul 29, 2026 | NetUnix 5.0 — Update & Upgrade Tool | Systems | `2082460139475378200` |
| 06 | Jul 29, 2026 | Monitoring System Tools in Kali Linux | Systems | `2082429799981514833` |

Optional fields: `category`, `summary` (featured), `embedHtml` (lightbox).

---

## Design decisions (keep)

- Editorial portfolio (not a basic X clone grid)  
- Gold accent instead of multi-color labels  
- White primary buttons; ghost secondary  
- Featured work is a wide split card on desktop  
- No multi-color name/bio (green/cyan/yellow removed in redesign)

---

## Evolution of the site (conversation history summary)

1. Built dark X-style SPA (grid cards, sticky nav, footer)  
2. Bio, titles, avatar, colors iterated  
3. Real X videos + original thumbnails  
4. GitHub repo created & pushed: `theprofhacker/educa`  
5. Redesign → professional creator portfolio  
6. Full original X poster thumbnails  
7. Elevated to editorial portfolio (Instrument Serif + gold)  
8. GitHub Pages live URL documented  
9. Hero simplified (name + handle; core bio only)  
10. Approach / Philosophy section removed  
11. Session notes saved for handoff  

---

## Git history (full project)

```
8bb21f3 Update session notes for handoff (2026-08-01)
c3f1105 Remove Approach / Philosophy section from the site
0a6e978 Trim hero bio to the core tagline
176af48 Simplify hero headline to name and handle
80d5acb Elevate site to an editorial portfolio layout
ddd9a5b Document live GitHub Pages URL in README
ecde289 Redesign site as a professional creator portfolio
1122028 Use full original X video poster thumbnails
cd6b290 Update video showcase with latest @theprocracker posts
eb0453b Add session notes so work can resume later
469afe8 Add .gitignore
6ce34bc Initial commit: X video showcase for @theprocracker
```

**Remote:** https://github.com/theprofhacker/educa.git  
**Pages:** https://theprofhacker.github.io/educa/

---

## How to resume later

1. `cd /home/thehacker/educa`
2. Read **this file** (the "Current state" section first) and `CONVERSATION-LOG.md`
3. Videos come from `python3 scripts/refresh_site.py`, not from hand edits to `js/videos.js`
4. UI: `index.html`, `styles.css`, `js/app.js`, `js/auth.js`
5. Do **not** `git add -A` while `.github/workflows/refresh-x.yml` is untracked, unless `gh auth status` shows the `workflow` scope
6. Otherwise push with:
   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   git add index.html styles.css js assets data scripts SESSION-NOTES.md CONVERSATION-LOG.md
   git commit -m "Your message" && git push
   ```
7. Live site updates from `main` via GitHub Pages (~1–2 min)

### Done since the August list

- [x] Refresh video list from @theprocracker (most viewed + latest)
- [x] On-page X embed lightbox
- [x] Open Graph image and favicon
- [ ] Custom domain
- [ ] More summaries on non-featured cards
- [ ] Weekly Action on GitHub (file is local only; token lacks `workflow`)  

---

## GitHub CLI

```bash
export PATH="$HOME/.local/bin:$PATH"
gh auth status   # account: theprofhacker
```

---

*Full save complete — 2026-10-09. August notes kept. October site work is on `main`. The weekly workflow file is local only.*
