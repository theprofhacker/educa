# Session notes — save point

**Saved:** 2026-08-01  
**Project path:** `/home/thehacker/educa`  
**GitHub:** https://github.com/theprofhacker/educa  
**Live site:** https://theprofhacker.github.io/educa/  
**GitHub account:** `theprofhacker`  
**Local branch:** `main` (tracking `origin/main`)  
**HEAD:** `c3f1105` — Remove Approach / Philosophy section from the site  
**Working tree:** clean (all changes pushed)

---

## What this project is

Editorial **portfolio / video showcase** for **The Hacker (@theprocracker)** on X:

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
├── SESSION-NOTES.md    # This file
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

**Removed this session (intentionally):**
- Hero tagline “Building in public / Demonstrating craft”
- Extra bio line about “Selected walkthroughs…”
- Full **02 — Approach / Philosophy** section

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

## Design decisions

- Editorial portfolio (not a basic X clone grid)  
- Gold accent instead of multi-color labels  
- White primary buttons; ghost secondary  
- Featured work is a wide split card on desktop  
- No multi-color name/bio (green/cyan/yellow removed earlier)

---

## Git history (recent)

```
c3f1105 Remove Approach / Philosophy section from the site
0a6e978 Trim hero bio to the core tagline
176af48 Simplify hero headline to name and handle
80d5acb Elevate site to an editorial portfolio layout
ddd9a5b Document live GitHub Pages URL in README
ecde289 Redesign site as a professional creator portfolio
1122028 Use full original X video poster thumbnails
cd6b290 Update video showcase with latest @theprocracker posts
```

**Remote:** https://github.com/theprofhacker/educa.git  
**Pages:** already enabled · https://theprofhacker.github.io/educa/

---

## How to resume later

1. `cd /home/thehacker/educa`  
2. Read this file + `README.md`  
3. Edit videos: `js/videos.js` (first entry = featured)  
4. Tweak UI/copy: `index.html` + `styles.css`  
5. Logic/cards: `js/app.js`  
6. Push:
   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   git add -A && git commit -m "Your message" && git push
   ```
7. Live site auto-updates from `main` via GitHub Pages (~1–2 min)

### Optional next steps

- [ ] Refresh video list from @theprocracker again  
- [ ] Add official X `embedHtml` for in-page lightbox  
- [ ] Custom domain for Pages  
- [ ] Open Graph image / favicon  
- [ ] More summaries on non-featured cards  

---

## GitHub CLI

```bash
export PATH="$HOME/.local/bin:$PATH"
gh auth status   # account: theprofhacker
```

---

*End of session handoff — 2026-08-01.*
