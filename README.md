# BritOS 7 — A Portfolio That Boots
<div align="center">

![License](https://img.shields.io/github/license/britsync07-prog/brit-os?style=flat-square&label=license&color=06b6d4) ![Language](https://img.shields.io/github/languages/top/britsync07-prog/brit-os?style=flat-square&color=0ea5e9) ![Stars](https://img.shields.io/github/stars/britsync07-prog/brit-os?style=flat-square&color=f59e0b) ![Last commit](https://img.shields.io/github/last-commit/britsync07-prog/brit-os?style=flat-square&color=22c55e) ![Repo size](https://img.shields.io/github/repo-size/britsync07-prog/brit-os?style=flat-square&color=94a3b8)

</div>


**Live Demo → https://brit-os.pages.dev** · Zero-dependency · Deployed on Cloudflare Pages

> **Portfolio Operating System — not a website, an OS.** Interactive developer portfolio that simulates Windows 7 / BIOS boot, built with pure vanilla JavaScript, HTML5 & CSS3. No frameworks, no build step.

Your visitors don't scroll your portfolio — they *boot into it*:

1. **BIOS POST sequence** (fake hardware checks: `VAULT ... ENCRYPTED`, `STRIPE ... ARMED`)
2. **Login screen** (`Log In as Visitor` — no password, trust is the default policy)
3. **Neon desktop** with draggable windows, taskbar, live clock, Start menu
4. **Working terminal** — `help`, `projects`, `skills`, `matrix`, `sudo hire-me`
5. **File Explorer** where real repositories are folders under `C:\Users\saimon`
6. **Skills.exe** with animated loading bars
7. **Recycle Bin easter egg** — Blue Screen of Death (`STOP CODE: TOO_MUCH_TALENT_IN_ONE_PORTFOLIO`)
8. **Shutdown screen** — "It is now safe to close this tab"

**Keywords:** portfolio operating system, interactive portfolio, vanilla javascript portfolio, os simulation, bios boot portfolio, cloudflare pages portfolio, draggable windows, terminal portfolio

## Run Locally

Zero dependencies, zero build step:

```bash
# option 1 — just open it
start index.html

# option 2 — serve it
python -m http.server 8080
```

## Deploy (Cloudflare Pages)

1. Push this repo (already done)
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → select this repo
3. Build command: *(leave empty)* · Output dir: `/`
4. Deploy → done

Works identically on Netlify / Vercel / GitHub Pages.

## Tech

Pure vanilla HTML + CSS + JavaScript. No frameworks, no build tools, no external assets — sounds are synthesized with WebAudio, icons are emoji, wallpaper is pure CSS gradients.

| Feature | Implementation |
|---|---|
| Window manager | Custom drag/focus/minimize/maximize via Pointer Events |
| Boot sequence | Timed DOM injection |
| Terminal | Command parser (~15 commands) |
| Sounds | WebAudio oscillator synthesis |
| Matrix rain | Canvas 2D |

## Project Structure

```
brit-os/
├── index.html          # Single-page OS shell (desktop, windows, taskbar)
├── styles.css          # Neon glassmorphism, CRT effects, window chrome
├── app.js              # Window manager, boot sequence, terminal parser
├── assets/             # Wallpapers (CSS gradients), sounds (WebAudio)
└── README.md
```

## Why This Portfolio Ranks

Built for **SEO + shareability**: single HTML file = perfect Lighthouse score, `brit-os.pages.dev` indexed as “portfolio operating system”, vanilla JS means instant load on any CDN. Recruiters search “interactive portfolio”, “creative developer portfolio” — this ranks.

## License

MIT License — Copyright (c) 2026 Musfiqur Rahman Saimon. See [LICENSE](./LICENSE).
