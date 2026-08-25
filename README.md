# BritOS 7 — A Portfolio That Boots

**Not a website. An operating system.**

Your visitors don't scroll your portfolio — they *boot into it*:

1. **BIOS POST sequence** (fake hardware checks: `VAULT ... ENCRYPTED`, `STRIPE ... ARMED`)
2. **Login screen** (`Log In as Visitor` — no password, trust is the default policy)
3. **Neon desktop** with draggable windows, taskbar, live clock, Start menu
4. **Working terminal** — `help`, `projects`, `skills`, `matrix`, `sudo hire-me`
5. **File Explorer** where real repositories are folders under `C:\Users\saimon`
6. **Skills.exe** with animated loading bars
7. **Recycle Bin easter egg** — Blue Screen of Death (`STOP CODE: TOO_MUCH_TALENT_IN_ONE_PORTFOLIO`)
8. **Shutdown screen** — "It is now safe to close this tab"

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

## License

MIT License — Copyright (c) 2026 Musfiqur Rahman Saimon. See [LICENSE](./LICENSE).
