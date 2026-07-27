# Session notes — save point

**Saved:** 2026-07-26  
**Project path:** `/home/thehacker/educa`  
**GitHub:** https://github.com/theprofhacker/educa  
**GitHub account used:** `theprofhacker`  
**Local branch:** `main` (tracking `origin/main`)

---

## What this project is

A single-page **X (Twitter) video showcase** for **@theprocracker**:

- HTML + Tailwind CSS (CDN) + vanilla JavaScript  
- Dark theme (pitch black `#000000`)  
- Profile header, video grid with original X thumbnails, sticky nav, footer  
- Video data lives in `js/videos.js` (easy to edit)

---

## Project files

```
educa/
├── index.html          # Page layout, Tailwind config, header/nav/footer
├── styles.css          # Scrollbar, play-button hover, lightbox, nav shadow
├── js/
│   ├── videos.js       # Video array (ids, dates, urls, thumbnails)
│   └── app.js          # Renders cards, play → X, optional lightbox
├── assets/
│   └── avatar.jpg      # Profile photo (from Downloads)
├── README.md           # How to run / add videos
├── SESSION-NOTES.md    # This file
└── .gitignore
```

**Preview locally:**
```bash
cd /home/thehacker/educa
python3 -m http.server 8080
# open http://localhost:8080
```

---

## Content & copy (final state)

| Item | Value |
|------|--------|
| Display name | **The Hacker** (green: `text-green-500`) |
| Handle | **@theprocracker** (light white: `text-white/80`) in nav, profile, footer |
| Bio | **Growth hacking is a mindset rather than a toolset** (cyan: `text-cyan-400`) |
| Section heading | **Popular videos on X** (blue: `text-blue-500`) |
| Subtitle under heading | **Created by thehacker.** (yellow: `text-yellow-400`) |
| Footer tagline | **Top X video posts · Not affiliated with X Corp.** |
| Video titles | All **empty** (titles hidden on cards) |
| Avatar | `assets/avatar.jpg` (was `/home/thehacker/Downloads/photo_2026-03-23_13-57-29.jpg`) |

---

## Videos (6 real X posts + original thumbnails)

All in `js/videos.js`, linked to real posts:

1. Jul 24, 2026 — status `2080601033521111043` (SkyForce)  
2. Jul 23, 2026 — status `2080260704502768125` (Recons 2.0)  
3. Jul 21, 2026 — status `2079649397525422144`  
4. Jul 21, 2026 — status `2079648464364081248` (Viking)  
5. Jul 21, 2026 — status `2079523354076234205` (BashFire)  
6. Jul 20, 2026 — status `2079159612029431831` (InstaRecon)

Thumbnails use X `amplify_video_thumb` poster URLs.  
Play / “Watch on X” open the post URL (no `embedHtml` set yet).

---

## Theme decisions during this session

- Started dark (X-style black).  
- Switched to **white** twice, then **reverted to black** both times.  
- **Final theme: dark / black** (`bg-x-black`, dark cards `#16181c`).  
- Accent colors above were kept through theme flips.

---

## Conversation timeline (what we did)

1. Built the full SPA (header, grid, JS data array, sticky nav, footer).  
2. Bio → “Growth hacking is a mindset rather than a toolset”.  
3. Headings: Top videos → Popular Videos on X → Watch popular… → **Popular videos on X**.  
4. Avatar: TP placeholder → user photo in `assets/avatar.jpg`.  
5. Cleared all six video **titles** (cards stay; text removed).  
6. Footer / subtitle copy tweaks.  
7. Wired 6 real videos + original X thumbnails.  
8. Color tweaks: name green, handle light white, bio cyan, heading blue, credit yellow.  
9. Background white ↔ black toggles; ended on black.  
10. Created GitHub repo and pushed as **theprofhacker/educa**.

---

## Git status at save

- Commits on `main` (at least):
  - Initial commit: X video showcase  
  - Add `.gitignore`  
- Pushed to: `https://github.com/theprofhacker/educa.git`  
- Working tree was clean after push.

**Note:** If you edit files after this note was written, run:
```bash
cd /home/thehacker/educa
git status
git add -A && git commit -m "Your message"
git push
```

---

## GitHub CLI notes

- `gh` installed for the user at: `~/.local/bin/gh`  
- Authenticated as: **theprofhacker**  
- Device-code login URL (for future re-auth): https://github.com/login/device  
- Protocol: HTTPS  

```bash
export PATH="$HOME/.local/bin:$PATH"
gh auth status
```

---

## How to resume later

1. Open project: `cd /home/thehacker/educa`  
2. Read this file + `README.md`  
3. Edit videos in `js/videos.js`  
4. Tweak UI/copy in `index.html`  
5. Push updates:
   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   git add -A && git commit -m "Update site" && git push
   ```

### Optional next steps (not done yet)

- [ ] Add titles back for some videos  
- [ ] Paste official X `embedHtml` for in-page lightbox playback  
- [ ] Deploy (GitHub Pages, Netlify, etc.)  
- [ ] Update GitHub profile links if handle should be `theprocracker` vs `theprofhacker`  
- [ ] Commit this `SESSION-NOTES.md` if you want it on GitHub too  

---

*End of saved conversation / session handoff.*
