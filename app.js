/* ============================================================
   BritOS 7 — portfolio OS
   ============================================================ */
"use strict";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const isMobile = () => window.matchMedia("(max-width: 720px)").matches;

/* ---------------- DATA ---------------- */
const PROFILE = {
  name: "Musfiqur Rahman Saimon",
  role: "Full-Stack Product Engineer",
  email: "mdsaimon552723@gmail.com",
  github: "https://github.com/britsync07-prog",
};

const PROJECTS = [
  { icon: "\u{1F510}", name: "AHS Vault", repo: "ahs-app",
    desc: "Zero-knowledge biometric vault. AES-256-GCM chunked storage unlocked by paired phone / WebAuthn.",
    stack: ["Go", "Rust/Tauri", "React PWA", "Kotlin"] },
  { icon: "\u{1F4CA}", name: "BritCRM", repo: "crm",
    desc: "Self-hosted all-in-one CRM with LiveKit meetings, team chat, billing + MCP server for AI agents.",
    stack: ["Next.js 16", "Socket.io", "Prisma", "LiveKit"] },
  { icon: "\u{1F4B3}", name: "BlackDesck", repo: "stripepay",
    desc: "Consultation platform with Stripe Connect payouts and risk-based 3DS checkout.",
    stack: ["Laravel", "Inertia", "React", "Stripe"] },
  { icon: "\u{1F4C8}", name: "BritTrade AI", repo: "britTrade",
    desc: "Crypto signal engine with automated Binance futures execution, paper/live parity, Android app.",
    stack: ["Node.js", "CCXT", "Capacitor", "Kotlin"] },
  { icon: "\u{1F3AC}", name: "BritTube", repo: "BritTube",
    desc: "AI video pipeline: script, footage, TTS voiceover, subtitles, MP4. Public API + MCP server.",
    stack: ["FastAPI", "MoviePy", "Next.js", "MCP"] },
  { icon: "\u{1F3B0}", name: "WinyPay Client", repo: "bdclient011",
    desc: "Gaming platform with seamless-wallet integration and custom payment gateway.",
    stack: ["Next.js 15", "Express", "Prisma"] },
  { icon: "\u2709\uFE0F", name: "MailSender", repo: "mailsender",
    desc: "Postal-style multi-tenant MTA infrastructure: DKIM/SPF automation, warmup engine.",
    stack: ["TypeScript", "SMTP", "PostgreSQL", "Redis"] },
  { icon: "\u{1F3AF}", name: "LeadHunter", repo: "testingit",
    desc: "B2B lead-gen platform: stealth scraping queue, segmented newsletters, tracking pixels.",
    stack: ["Puppeteer", "SQLite", "Stripe"] },
];

const SKILLS = [
  ["TypeScript / JavaScript", 95], ["React / Next.js", 93], ["Node.js / Express", 92],
  ["Python / FastAPI", 85], ["Databases (SQL / Prisma / ORM)", 88],
  ["Payments (Stripe / PayPal)", 90], ["Email Infra (SMTP / DKIM)", 86],
  ["Go / Rust (Tauri)", 74], ["DevOps (Docker / PM2 / CI)", 84], ["AI Agents (MCP)", 80],
];

const ABOUT_TXT = `> cat about.txt

Hi, I'm ${PROFILE.name} — ${PROFILE.role}.

I build COMPLETE products — the kind with real users,
real payments, real infrastructure:

  • Zero-knowledge vaults        (Go + Rust/Tauri)
  • Production CRMs              (Next.js + LiveKit)
  • Trading engines              (Binance futures)
  • Payment platforms            (Stripe Connect)
  • AI video pipelines           (FastAPI + MoviePy)
  • Email infrastructure         (custom SMTP relays)

I don't stop at "it works on my machine".
I handle payment flows, deliverability,
race conditions, and signed auto-updaters.

Philosophy:
  "Paper-trade it, test it, then deploy it."

Currently exploring: AI agent surfaces (MCP servers).`;

/* ---------------- SOUND ---------------- */
let actx = null;
function beep(freq, dur, delay = 0) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = "triangle"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.07, actx.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + delay + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(actx.currentTime + delay); o.stop(actx.currentTime + delay + dur + 0.02);
  } catch (e) {}
}

/* ---------------- BOOT ---------------- */
const BOOT_LINES = [
  ["brand", "BritBIOS (C) 2026 BritSync Technologies, Inc."],
  ["", ""],
  ["", "CPU  : Saimon-Core i9 @ Full-Stack GHz .......... <span class='ok'>OK</span>"],
  ["", "MEM  : Shipping 32 products since day one ........ <span class='ok'>OK</span>"],
  ["", "GPU  : Rendering pixel-perfect UI ................ <span class='ok'>OK</span>"],
  ["", "NET  : Binance websocket ......................... <span class='ok'>LINK UP</span>"],
  ["", "SMTP : Port 587 handshake ........................ <span class='ok'>OK</span>"],
  ["", "VAULT: Zero-knowledge keys ....................... <span class='warn'>ENCRYPTED</span>"],
  ["", "STRIPE: Risk-based 3DS engine .................... <span class='ok'>ARMED</span>"],
  ["", ""],
  ["", "Detecting talent ................................ <span class='ok'>FOUND (excessive)</span>"],
  ["", "Loading BritOS kernel ........................... <span class='ok'>DONE</span>"],
];

function runBoot() {
  const log = $("#boot-log");
  let i = 0;
  const next = () => {
    if (i >= BOOT_LINES.length) {
      $("#boot-bar-wrap").style.display = "block";
      let p = 0;
      const t = setInterval(() => {
        p += Math.random() * 18 + 6;
        $("#boot-bar").style.width = Math.min(p, 100) + "%";
        if (p >= 100) { clearInterval(t); $("#boot-prompt").style.display = "block"; armBootSkip(); }
      }, 130);
      return;
    }
    const [cls, txt] = BOOT_LINES[i++];
    const div = document.createElement("div");
    if (cls) div.className = cls;
    div.innerHTML = txt || "&nbsp;";
    log.appendChild(div);
    setTimeout(next, 90 + Math.random() * 140);
  };
  next();
}
function armBootSkip() {
  const go = () => {
    $("#boot-screen").classList.add("hidden");
    $("#login-screen").classList.remove("hidden");
  };
  setTimeout(() => {
    document.addEventListener("keydown", go, { once: true });
    $("#boot-screen").addEventListener("click", go, { once: true });
  }, 150);
}

$("#login-btn").addEventListener("click", () => {
  beep(520, 0.07); beep(720, 0.09, 0.09);
  $("#login-screen").classList.add("hidden");
  $("#desktop").classList.remove("hidden");
  startClock();
});

function startClock() {
  const tick = () => {
    const d = new Date();
    $("#clock").textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    $("#tray-date").textContent = d.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
  };
  tick(); setInterval(tick, 1000);
}

/* ---------------- WINDOW MANAGER ---------------- */
const BTN_MIN = '<svg viewBox="0 0 10 10"><path d="M1 5h8"/></svg>';
const BTN_MAX = '<svg viewBox="0 0 10 10"><rect x="1.6" y="1.6" width="6.8" height="6.8"/></svg>';
const BTN_X = '<svg viewBox="0 0 10 10"><path d="M1.6 1.6l6.8 6.8M8.4 1.6l-6.8 6.8"/></svg>';

let zTop = 20;
const openWins = {};
const closeHooks = {};

function createWindow(appId, title, icon, bodyHTML, w = 640, h = 480) {
  if (openWins[appId]) { focusWin(appId); return openWins[appId]; }
  const win = document.createElement("div");
  win.className = "window focused";
  win.dataset.app = appId;
  const vw = innerWidth, vh = innerHeight;
  w = Math.min(w, vw - 30); h = Math.min(h, vh - 120);
  const off = Object.keys(openWins).length * 26;
  win.style.width = w + "px"; win.style.height = h + "px";
  win.style.left = isMobile() ? "2vw" : Math.max(10, (vw - w) / 2 - 120 + off) + "px";
  win.style.top = isMobile() ? "2vh" : Math.max(10, (vh - h) / 2 - 70 + off) + "px";
  win.innerHTML =
    `<div class="titlebar">
       <span class="t-icon">${icon}</span><span class="t-title">${title}</span>
       <button class="win-btn min" title="Minimize">${BTN_MIN}</button>
       <button class="win-btn max" title="Maximize">${BTN_MAX}</button>
       <button class="win-btn close" title="Close">${BTN_X}</button>
     </div>
     <div class="win-body">${bodyHTML}</div>`;
  $("#windows-layer").appendChild(win);

  const task = document.createElement("div");
  task.className = "task-item active";
  task.innerHTML = `<span>${icon}</span><span class="tl">${title}</span>`;
  $("#task-windows").appendChild(task);

  openWins[appId] = { el: win, task };
  zTop++; win.style.zIndex = zTop;

  win.addEventListener("pointerdown", () => focusWin(appId));
  task.addEventListener("click", () => {
    if (win.classList.contains("minimized")) focusWin(appId);
    else if (win.style.zIndex == zTop) minimizeWin(appId);
    else focusWin(appId);
  });
  win.querySelector(".close").addEventListener("click", (e) => { e.stopPropagation(); closeWin(appId); });
  win.querySelector(".min").addEventListener("click", (e) => { e.stopPropagation(); minimizeWin(appId); });
  win.querySelector(".max").addEventListener("click", (e) => { e.stopPropagation(); maximizeWin(appId); });
  makeDraggable(win, win.querySelector(".titlebar"));

  focusWin(appId);
  return openWins[appId];
}
function focusWin(appId) {
  const w = openWins[appId]; if (!w) return;
  zTop++; w.el.style.zIndex = zTop;
  w.el.classList.remove("minimized"); w.el.style.display = "flex";
  Object.entries(openWins).forEach(([id, o]) => {
    o.el.classList.toggle("focused", id === appId);
    o.task.classList.toggle("active", id === appId && !o.el.classList.contains("minimized"));
  });
  if (appId === "skills") animateSkills();
}
function minimizeWin(id) { const w = openWins[id]; if (!w) return; w.el.classList.add("minimized"); w.el.style.display = "none"; w.task.classList.remove("active"); }
function maximizeWin(id) { const w = openWins[id]; if (!w) return; w.el.classList.toggle("maximized"); }
function closeWin(id) {
  const w = openWins[id]; if (!w) return;
  if (closeHooks[id]) { closeHooks[id](); delete closeHooks[id]; }
  w.el.remove(); w.task.remove(); delete openWins[id];
  beep(300, 0.06);
}
function makeDraggable(win, bar) {
  let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".win-btn") || win.classList.contains("maximized") || isMobile()) return;
    dragging = true; sx = e.clientX; sy = e.clientY; ox = win.offsetLeft; oy = win.offsetTop;
    try { bar.setPointerCapture(e.pointerId); } catch (err) {}
  });
  bar.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const nx = Math.min(innerWidth - 110, Math.max(-(win.offsetWidth - 80), ox + e.clientX - sx));
    const ny = Math.min(innerHeight - 100, Math.max(0, oy + e.clientY - sy));
    win.style.left = nx + "px"; win.style.top = ny + "px";
  });
  bar.addEventListener("pointerup", () => { dragging = false; });
  bar.addEventListener("pointercancel", () => { dragging = false; });
}

/* ---------------- CORE APPS ---------------- */
function appAbout() { createWindow("about", "About.txt — Notepad", "\uD83D\uDCC4", `<div class="notepad-view">${ABOUT_TXT}</div>`, 600, 540); beep(600, 0.05); }

function appProjects() {
  const html = PROJECTS.map((p) =>
    `<div class="proj-card"><b>${p.icon} ${p.name}</b><p>${p.desc}</p>
     <div class="chips">${p.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
     <a class="gh-link" href="${PROFILE.github}/${p.repo}" target="_blank" rel="noopener">View on GitHub ↗</a></div>`).join("");
  createWindow("projects", `Projects — ${PROJECTS.length} shipped`, "\uD83D\uDE80", html, 660, 560);
  beep(640, 0.05);
}

function appSkills() {
  const html = SKILLS.map(([n]) =>
    `<div class="skill-row"><div class="skill-label"><span>${n}</span></div>
     <div class="skill-bar"><div class="skill-fill"></div></div></div>`).join("");
  createWindow("skills", "Skills.exe — System Capabilities", "\uD83D\uDCCA", html, 560, 500);
  requestAnimationFrame(animateSkills);
}
function animateSkills() {
  $$(".window[data-app='skills'] .skill-fill").forEach((f, i) => {
    setTimeout(() => { f.style.width = Math.max(SKILLS[i] ? SKILLS[i][1] - 8 : 60, 50) + "%"; }, 60 + i * 90);
  });
}

/* explorer */
const EXPLORER = [
  { name: "C:", parent: null, type: "drive" },
  { name: "Users", parent: "C:", type: "folder" },
  { name: "saimon", parent: "Users", type: "folder" },
  ...PROJECTS.map((p) => ({ name: p.name, parent: "saimon", type: "project", ref: p })),
  { name: "Documents", parent: "saimon", type: "folder" },
  { name: "philosophy.txt", parent: "Documents", type: "file",
    body: "\n1. Ship fast, ship tested.\n2. Paper-trade before live.\n3. Webhooks are liars — verify everything.\n4. The database you committed to git will haunt you.\n" },
  { name: "bucket-list.txt", parent: "Documents", type: "file",
    body: "\n[x] Build a vault nobody can peek into\n[x] Automate a trading desk\n[x] Run a CRM in production\n[ ] 100k emails/day infrastructure\n[ ] An OS portfolio (you are looking at it)\n" },
];
function appExplorer() {
  createWindow("explorer", "My Works — File Explorer", "\uD83D\uDCC1", `<div class="explore"><div class="exp-side" id="exp-side"></div><div class="exp-main" id="exp-main"></div></div>`, 700, 490);
  wireExplorer(); beep(660, 0.05);
}
function wireExplorer() {
  const side = $("#exp-side"), main = $("#exp-main");
  const pathOf = (item) => (item.parent ? pathByName(item.parent) + "\\" + item.name : item.name);
  function pathByName(n) { const it = EXPLORER.find((x) => x.name === n); return it ? pathOf(it) : n; }
  function renderSide(active) {
    side.innerHTML = "";
    EXPLORER.forEach((item, idx) => {
      const depth = item.parent ? pathByName(item.parent).split("\\").length : 0;
      const d = document.createElement("div");
      d.textContent = (item.type === "project" ? "[DIR] " : item.type === "file" ? "[FILE] " : "[DRV] ") + item.name;
      d.style.paddingLeft = 10 + depth * 14 + "px";
      if (idx === active) d.classList.add("on");
      d.addEventListener("click", () => renderMain(idx));
      side.appendChild(d);
    });
  }
  function renderMain(idx) {
    const item = EXPLORER[idx];
    renderSide(idx);
    if (item.type === "project") {
      const p = item.ref;
      main.innerHTML = `<h3>${p.icon} ${p.name}</h3><div class="ep-desc">${p.desc}</div>
        <div class="chips">${p.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
        <a class="gh-link" href="${PROFILE.github}/${p.repo}" target="_blank" rel="noopener">Open repository ↗</a>`;
    } else if (item.type === "file") {
      main.innerHTML = `<h3>${item.name}</h3><div class="notepad-view">${item.body}</div>`;
    } else {
      const kids = EXPLORER.filter((x) => x.parent === item.name);
      main.innerHTML = `<h3>${pathOf(item)}</h3><div class="ep-desc">${kids.length} item(s)</div>` +
        kids.map((k) => `<div class="proj-card"><b>${k.type === "file" ? "[FILE]" : "[DIR]"} ${k.name}</b></div>`).join("");
    }
  }
  renderMain(EXPLORER.findIndex((x) => x.name === "saimon"));
}

/* terminal */
function appTerminal() {
  createWindow("terminal", "Terminal — saimon@britos", "⌨\uFE0F", termHTML(), 640, 430);
  wireTerminal(); beep(520, 0.06);
}
function termHTML() {
  return `<div class="term" id="term">
    <div class="t-out">BritOS Terminal v7.3 — type <span class="t-accent">help</span> to list commands</div>
    <div class="t-out">&nbsp;</div>
    <div class="term-input-line"><span class="t-in">visitor@britos:~$&nbsp;</span><input id="term-in" autocomplete="off" spellcheck="false"></div>
  </div>`;
}
function wireTerminal() {
  const term = $("#term"), input = $("#term-in");
  input.focus();
  term.addEventListener("click", () => input.focus());
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const raw = input.value.trim(); input.value = "";
    print(`<span class="t-in">visitor@britos:~$ ${raw.replace(/</g, "&lt;")}</span>`);
    if (raw) runCmd(raw.toLowerCase());
    term.scrollTop = term.scrollHeight;
  });
  function print(html) {
    const d = document.createElement("div");
    d.className = "t-out"; d.innerHTML = html;
    term.insertBefore(d, term.lastElementChild);
  }
  function runCmd(cmd) {
    const [c, ...args] = cmd.split(/\s+/);
    switch (c) {
      case "help":
        print(`available commands:
  about / projects / skills / socials / contact
  calc | calendar | notepad | settings   launch apps
  whoami | date | echo | clear
  matrix     enter the matrix
  sudo       try your luck
  exit       close terminal`);
        break;
      case "about": print(`${PROFILE.name} — ${PROFILE.role}. Type <span class="t-accent">projects</span> for proof.`); break;
      case "projects": print(PROJECTS.map((p) => `${p.name.padEnd(16)} [${p.repo}]`).join("\n")); break;
      case "skills": print(SKILLS.map(([n, lvl]) => `${n}: ${"#".repeat(Math.round(lvl / 8))}${lvl}%`).join("\n")); break;
      case "socials": print(`github → <a href="${PROFILE.github}" target="_blank" rel="noopener" style="color:#67e8f9">open my GitHub profile ↗</a>`); break;
      case "contact": print(`email → ${PROFILE.email}`); break;
      case "whoami": print("visitor — but saimon is the admin here"); break;
      case "date": print(new Date().toString()); break;
      case "echo": print(args.join(" ").replace(/</g, "&lt;") || "&nbsp;"); break;
      case "clear": term.querySelectorAll(".t-out").forEach((n) => n.remove()); break;
      case "calc": case "calendar": case "notepad": case "settings":
        APPS[c === "calc" ? "calculator" : c](); print(`launching ${c}...`); break;
      case "sudo": print(args.join(" ") === "hire-me"
        ? "<span class='t-accent'>[PERMISSION GRANTED]</span> smart move. email sent to top of pile: " + PROFILE.email
        : "nice try. visitor is not in the sudoers file. this incident WILL be reported... to my GitHub."); break;
      case "matrix": startMatrix(); print("<span class='t-accent'>wake up... follow the white rabbit.</span>"); break;
      case "exit": closeWin("terminal"); break;
      default: print(`'${c.replace(/</g, "&lt;")}' is not recognized. try <span class="t-accent">help</span>`);
    }
  }
}

function appContact() {
  const html = `
    <div class="contact-grid">
      <a class="ccard" href="mailto:${PROFILE.email}"><span class="ci">\u2709\uFE0F</span><b>Email</b><small>${PROFILE.email}</small></a>
      <a class="ccard" href="${PROFILE.github}" target="_blank" rel="noopener"><span class="ci">\uD83D\uDC19</span><b>GitHub</b><small>Open my GitHub profile ↗</small></a>
      <a class="ccard" href="#" id="copy-mail"><span class="ci">\uD83D\uDCCB</span><b>Copy Email</b><small>click to copy</small></a>
    </div>
    <p style="margin-top:16px;color:#8a8aa3;font-size:13px">Open for freelance builds, collaborations, and interesting problems.</p>`;
  const w = createWindow("contact", "Contact — Get in touch", "\uD83D\uDCEC", html, 560, 350);
  w.el.querySelector("#copy-mail").addEventListener("click", (e) => {
    e.preventDefault();
    navigator.clipboard?.writeText(PROFILE.email);
    e.currentTarget.querySelector("small").textContent = "copiated ✓".replace("copiated", "copied");
    beep(800, 0.06);
  });
  beep(700, 0.05);
}

function appRecycle() {
  const bsod = $("#bsod");
  bsod.classList.remove("hidden");
  beep(160, 0.3); beep(120, 0.4, 0.25);
  let p = 0;
  const t = setInterval(() => {
    p += Math.random() * 22 + 8;
    $("#bsod-pct").textContent = Math.min(100, Math.round(p)) + "% complete";
    if (p >= 100) { clearInterval(t); bsod.classList.add("hidden"); $("#bsod-pct").textContent = "0% complete"; }
  }, 550);
}

/* ---------------- CALCULATOR ---------------- */
function appCalculator() {
  const html = `
    <div class="calc">
      <div class="calc-disp"><div class="calc-hist" id="c-hist">&nbsp;</div><div class="calc-cur" id="c-cur">0</div></div>
      <div class="calc-pad" id="c-pad">
        <button class="ckey fn" data-k="C">C</button><button class="ckey fn" data-k="back">&larr;</button>
        <button class="ckey fn" data-k="%">%</button><button class="ckey op" data-k="/">&divide;</button>
        <button class="ckey" data-k="7">7</button><button class="ckey" data-k="8">8</button>
        <button class="ckey" data-k="9">9</button><button class="ckey op" data-k="*">&times;</button>
        <button class="ckey" data-k="4">4</button><button class="ckey" data-k="5">5</button>
        <button class="ckey" data-k="6">6</button><button class="ckey op" data-k="-">&minus;</button>
        <button class="ckey" data-k="1">1</button><button class="ckey" data-k="2">2</button>
        <button class="ckey" data-k="3">3</button><button class="ckey op" data-k="+">+</button>
        <button class="ckey fn" data-k="neg">&plusmn;</button><button class="ckey" data-k="0">0</button>
        <button class="ckey" data-k=".">.</button><button class="ckey eq" data-k="=">=</button>
      </div>
    </div>`;
  const w = createWindow("calculator", "Calculator", "\uD83E\uDDEE", html, 320, 470);
  const cur = w.el.querySelector("#c-cur"), hist = w.el.querySelector("#c-hist");
  let acc = null, op = null, fresh = true;
  const show = (v) => { cur.textContent = v; };
  function compute(a, b, o) {
    if (o === "+") return a + b; if (o === "-") return a - b;
    if (o === "*") return a * b; if (o === "/") return b === 0 ? NaN : a / b;
    return b;
  }
  function fmt(n) {
    if (!isFinite(n)) return "Cannot divide by zero";
    return String(Math.round(n * 1e10) / 1e10);
  }
  function press(k) {
    beep(880, 0.02);
    if (/^[0-9]$/.test(k)) { show(fresh || cur.textContent === "0" ? k : cur.textContent + k); fresh = false; return; }
    switch (k) {
      case ".": if (fresh) { show("0."); fresh = false; } else if (!cur.textContent.includes(".")) show(cur.textContent + "."); break;
      case "C": acc = null; op = null; fresh = true; hist.innerHTML = "&nbsp;"; show("0"); break;
      case "back": show(cur.textContent.length > 1 ? cur.textContent.slice(0, -1) : "0"); break;
      case "neg": show(cur.textContent.startsWith("-") ? cur.textContent.slice(1) : "-" + cur.textContent); break;
      case "%": show(fmt(parseFloat(cur.textContent) / 100)); fresh = true; break;
      case "+": case "-": case "*": case "/":
        acc = fresh && acc !== null ? acc : parseFloat(cur.textContent);
        op = k; hist.textContent = `${fmt(acc)} ${k}`;
        fresh = true; break;
      case "=": {
        if (op === null) return;
        const b = parseFloat(cur.textContent);
        const r = compute(acc, b, op);
        hist.textContent = `${fmt(acc)} ${op} ${fmt(b)} =`;
        show(fmt(r)); acc = null; op = null; fresh = true;
        break;
      }
    }
  }
  w.el.querySelector("#c-pad").addEventListener("click", (e) => {
    const b = e.target.closest(".ckey"); if (b) press(b.dataset.k);
  });
  const kb = (e) => {
    if (!openWins.calculator) { document.removeEventListener("keydown", kb); return; }
    if (document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    const m = { Enter: "=", "=": "=", Backspace: "back", Escape: "C" };
    if (/^[0-9.]$/.test(e.key)) press(e.key);
    else if ("+-*/".includes(e.key) && e.key.length === 1) { e.preventDefault(); press(e.key); }
    else if (m[e.key]) { e.preventDefault(); press(m[e.key]); }
  };
  document.addEventListener("keydown", kb);
  closeHooks.calculator = () => document.removeEventListener("keydown", kb);
}

/* ---------------- CALENDAR ---------------- */
function appCalendar() {
  const html = `
    <div class="cal">
      <div class="cal-head">
        <div class="cal-title" id="cal-t"></div>
        <div class="cal-nav">
          <button class="cal-btn wide" id="cal-today">Today</button>
          <button class="cal-btn" id="cal-prev">&lsaquo;</button>
          <button class="cal-btn" id="cal-next">&rsaquo;</button>
        </div>
      </div>
      <div class="cal-grid" id="cal-g"></div>
      <div class="cal-foot" id="cal-f"></div>
    </div>`;
  const w = createWindow("calendar", "Calendar", "\uD83D\uDCC5", html, 360, 480);
  let view = new Date();
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DOWS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  function render() {
    const y = view.getFullYear(), m = view.getMonth();
    w.el.querySelector("#cal-t").textContent = `${MONTHS[m]} ${y}`;
    const g = w.el.querySelector("#cal-g");
    g.innerHTML = DOWS.map((d) => `<div class="cal-dow">${d}</div>`).join("");
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();
    const today = new Date();
    for (let i = first - 1; i >= 0; i--) g.insertAdjacentHTML("beforeend", `<div class="cal-day dim">${prevDays - i}</div>`);
    for (let d = 1; d <= days; d++) {
      const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
      g.insertAdjacentHTML("beforeend", `<div class="cal-day${isToday ? " today" : ""}">${d}</div>`);
    }
    const rem = (7 - (g.children.length % 7)) % 7;
    for (let d = 1; d <= rem; d++) g.insertAdjacentHTML("beforeend", `<div class="cal-day dim">${d}</div>`);
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    w.el.querySelector("#cal-f").textContent =
      `Week ${Math.ceil(dayOfYear / 7)} · Day ${dayOfYear} of ${today.getFullYear()} — ship something.`;
  }
  w.el.querySelector("#cal-prev").addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); });
  w.el.querySelector("#cal-next").addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });
  w.el.querySelector("#cal-today").addEventListener("click", () => { view = new Date(); render(); });
  render(); beep(700, 0.05);
}

/* ---------------- NOTEPAD ---------------- */
function appNotepad() {
  const saved = localStorage.getItem("britos-notes") || "";
  const html = `
    <textarea class="np-area" id="np-a" placeholder="Type anything. It saves automatically...">${saved.replace(/</g, "&lt;")}</textarea>
    <div class="np-status" id="np-s"></div>`;
  const w = createWindow("notepad", "Notepad — untitled.txt", "\uD83D\uDCDD", html, 560, 430);
  const ta = w.el.querySelector("#np-a"), st = w.el.querySelector("#np-s");
  const stat = () => {
    const t = ta.value;
    st.textContent = `${t.length} chars · ${t.trim() ? t.trim().split(/\s+/).length : 0} words · autosaved`;
  };
  let tid = null;
  ta.addEventListener("input", () => {
    stat();
    clearTimeout(tid);
    tid = setTimeout(() => localStorage.setItem("britos-notes", ta.value), 400);
  });
  stat(); beep(650, 0.05);
}

/* ---------------- SETTINGS ---------------- */
const ACCENTS = {
  aqua:   { indigo: "#38bdf8", violet: "#06b6d4", pink: "#2dd4bf", css: "linear-gradient(135deg,#38bdf8,#06b6d4,#2dd4bf)" },
  ice:    { indigo: "#93c5fd", violet: "#60a5fa", pink: "#7dd3fc", css: "linear-gradient(135deg,#93c5fd,#60a5fa,#7dd3fc)" },
  matrix: { indigo: "#10b981", violet: "#22c55e", pink: "#a3e635", css: "linear-gradient(135deg,#10b981,#22c55e,#a3e635)" },
  ember:  { indigo: "#f97316", violet: "#ef4444", pink: "#fb7185", css: "linear-gradient(135deg,#f97316,#ef4444,#fb7185)" },
};
const WALLS = ["aurora", "midnight", "emberfall"];

function applySettings(s) {
  const a = ACCENTS[s.accent] || ACCENTS.aqua;
  const r = document.documentElement.style;
  r.setProperty("--indigo", a.indigo);
  r.setProperty("--violet", a.violet);
  r.setProperty("--pink", a.pink);
  r.setProperty("--accent-grad", a.css);
  const wp = $("#wallpaper");
  wp.classList.remove("wall-midnight", "wall-emberfall");
  if (WALLS.includes(s.wall) && s.wall !== "aurora") wp.classList.add("wall-" + s.wall);
  let scan = $("#scanlines");
  if (s.crt && !scan) {
    scan = document.createElement("div"); scan.id = "scanlines";
    $("#desktop").appendChild(scan);
  } else if (!s.crt && scan) scan.remove();
}
function getSettings() {
  try { return JSON.parse(localStorage.getItem("britos-settings")) || {}; } catch (e) { return {}; }
}
function saveSettings(s) { localStorage.setItem("britos-settings", JSON.stringify(s)); }

function appSettings() {
  const s = Object.assign({ accent: "aqua", wall: "aurora", crt: false, snd: true }, getSettings());
  const html = `
    <div class="set-row"><h4>Accent color</h4><div class="swatches" id="sw">
      ${Object.entries(ACCENTS).map(([k, v]) =>
        `<div class="swatch${s.accent === k ? " on" : ""}" data-a="${k}" style="background:${v.css}" title="${k}"></div>`).join("")}
    </div></div>
    <div class="set-row"><h4>Wallpaper</h4><div class="wall-opts" id="wo">
      ${WALLS.map((wl) => `<div class="wall-opt${s.wall === wl ? " on" : ""}" data-w="${wl}">${wl}</div>`).join("")}
    </div></div>
    <div class="set-row"><h4>Display</h4>
      <div class="toggle-row"><span>CRT scanlines (retro)</span>
        <label class="switch"><input type="checkbox" id="crt-t"${s.crt ? " checked" : ""}><span class="slider"></span></label>
      </div>
      <div class="toggle-row"><span>UI sounds</span>
        <label class="switch"><input type="checkbox" id="snd-t"${s.snd ? " checked" : ""}><span class="slider"></span></label>
      </div>
      <div class="toggle-row"><span>Desktop icons</span>
        <button class="wall-opt" id="reset-icons">Reset positions</button>
      </div>
    </div>
    <p class="ep-desc" style="margin-top:6px">Settings persist in your browser.</p>`;
  const w = createWindow("settings", "Settings — Personalization", "\u2699\uFE0F", html, 520, 500);
  const upd = (patch) => { const ns = Object.assign(getSettings(), patch); saveSettings(ns); applySettings(ns); SND_ON = ns.snd !== false; };
  w.el.querySelector("#sw").addEventListener("click", (e) => {
    const el = e.target.closest(".swatch"); if (!el) return;
    w.el.querySelectorAll(".swatch").forEach((x) => x.classList.remove("on")); el.classList.add("on");
    upd({ accent: el.dataset.a }); beep(750, 0.05);
  });
  w.el.querySelector("#wo").addEventListener("click", (e) => {
    const el = e.target.closest(".wall-opt"); if (!el) return;
    w.el.querySelectorAll(".wall-opt").forEach((x) => x.classList.remove("on")); el.classList.add("on");
    upd({ wall: el.dataset.w }); beep(750, 0.05);
  });
  w.el.querySelector("#crt-t").addEventListener("change", (e) => upd({ crt: e.target.checked }));
  w.el.querySelector("#snd-t").addEventListener("change", (e) => upd({ snd: e.target.checked }));
  w.el.querySelector("#reset-icons").addEventListener("click", () => { localStorage.removeItem("britos-icon-pos"); location.reload(); });
  beep(700, 0.05);
}
let SND_ON = getSettings().snd !== false;
const _beep = beep;
beep = function (f, d, dl) { if (SND_ON) _beep(f, d, dl); };

/* ---------------- TASK MANAGER ---------------- */
function appTaskMgr() {
  const html = `
    <table class="tm-table"><thead><tr><th>Process</th><th>CPU</th><th>Memory</th><th></th></tr></thead>
    <tbody id="tm-b"></tbody></table>
    <div class="tm-note">Processes = windows you have open. End task closes them. Obviously.</div>`;
  const w = createWindow("taskmgr", "Task Manager", "\uD83D\uDDA5\uFE0F", html, 540, 380);
  const body = w.el.querySelector("#tm-b");
  function render() {
    const ids = Object.keys(openWins).filter((k) => k !== "taskmgr");
    body.innerHTML = ids.length
      ? ids.map((id) => {
          const cpu = (Math.random() * 14 + 0.4).toFixed(1);
          const mem = (Math.random() * 180 + 24).toFixed(0);
          return `<tr><td>${openWins[id].task.querySelector(".tl").textContent}</td>
            <td>${cpu}%</td><td>${mem} MB</td>
            <td><button class="tm-end" data-id="${id}">End task</button></td></tr>`;
        }).join("")
      : `<tr><td colspan="4" style="color:#8a8aa3">No other processes running. Suspiciously efficient.</td></tr>`;
  }
  const iv = setInterval(() => { if (openWins.taskmgr) render(); }, 1500);
  closeHooks.taskmgr = () => clearInterval(iv);
  body.addEventListener("click", (e) => {
    const b = e.target.closest(".tm-end");
    if (b) { closeWin(b.dataset.id); render(); }
  });
  render(); beep(680, 0.05);
}

/* ---------------- MATRIX ---------------- */
function startMatrix() {
  const old = $("#matrix-canvas"); if (old) old.remove();
  const cv = document.createElement("canvas");
  cv.id = "matrix-canvas"; document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = Math.floor(cv.width / 15);
  const drops = Array(cols).fill(1);
  const chars = "01BRITOS$#@<>{}[]";
  const iv = setInterval(() => {
    ctx.fillStyle = "rgba(0,0,0,.07)"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#34d399"; ctx.font = "14px monospace";
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 15, y * 15);
      if (y * 15 > cv.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 45);
  setTimeout(() => { clearInterval(iv); cv.remove(); }, 5000);
}

/* ---------------- APP REGISTRY ---------------- */
const APPS = {
  about: appAbout, projects: appProjects, skills: appSkills, explorer: appExplorer,
  terminal: appTerminal, contact: appContact, recycle: appRecycle,
  calculator: appCalculator, calendar: appCalendar, notepad: appNotepad,
  settings: appSettings, taskmgr: appTaskMgr,
};

const APP_META = {
  about: ["\uD83D\uDCC4", "About.txt"], projects: ["\uD83D\uDE80", "Projects"], skills: ["\uD83D\uDCCA", "Skills.exe"],
  explorer: ["\uD83D\uDCC1", "My Works"], terminal: ["\u2328\uFE0F", "Terminal"], contact: ["\uD83D\uDCEC", "Contact"],
  recycle: ["\uD83D\uDDD1\uFE0F", "Recycle Bin"], calculator: ["\uD83E\uDDEE", "Calculator"], calendar: ["\uD83D\uDCC5", "Calendar"],
  notepad: ["\uD83D\uDCDD", "Notepad"], settings: ["\u2699\uFE0F", "Settings"], taskmgr: ["\uD83D\uDDA5\uFE0F", "Task Manager"],
};

/* ---------------- START MENU + SEARCH ---------------- */
const SEARCH_INDEX = [
  ...Object.keys(APPS).filter((id) => id !== "recycle").map((id) =>
    ({ type: "app", id, label: APP_META[id][1], icon: APP_META[id][0], sub: "app" })),
  ...PROJECTS.map((p) => ({ type: "project", ref: p, label: p.name, icon: p.icon, sub: p.repo })),
  { type: "cmd", label: "Enter the matrix", icon: "\uD83D\uDFE9", sub: "command", run: () => startMatrix() },
];
const smMenu = $("#start-menu"), smQ = $("#sm-q"), smHome = $("#sm-home"), smRes = $("#sm-results");

function doSearch(q) {
  q = q.trim().toLowerCase();
  if (!q) { smHome.classList.remove("hidden"); smRes.classList.add("hidden"); smRes.innerHTML = ""; return; }
  const hits = SEARCH_INDEX.filter((x) => (x.label + " " + (x.sub || "")).toLowerCase().includes(q));
  smHome.classList.add("hidden"); smRes.classList.remove("hidden");
  smRes.innerHTML = hits.length
    ? hits.slice(0, 8).map((h) => `<button class="sres" data-i="${SEARCH_INDEX.indexOf(h)}"><span class="si">${h.icon}</span>${h.label}<small>${h.sub || ""}</small></button>`).join("")
    : `<div style="padding:20px;color:#77778f;font-size:13px">No results found.</div>`;
}
function openHit(i) {
  const h = SEARCH_INDEX[i]; if (!h) return;
  closeStart();
  if (h.type === "cmd") h.run();
  else APPS[h.type === "project" ? "projects" : h.id]();
}
smQ.addEventListener("input", () => doSearch(smQ.value));
smQ.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { const f = smRes.querySelector(".sres"); if (f) openHit(+f.dataset.i); }
  if (e.key === "Escape") { smQ.value = ""; doSearch(""); }
});
smRes.addEventListener("click", (e) => { const b = e.target.closest(".sres"); if (b) openHit(+b.dataset.i); });

function closeStart() { smMenu.classList.add("hidden"); $("#start-btn").classList.remove("open"); }
$("#start-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  const opening = smMenu.classList.contains("hidden");
  smMenu.classList.toggle("hidden");
  $("#start-btn").classList.toggle("open", opening);
  if (opening) { smQ.value = ""; doSearch(""); setTimeout(() => smQ.focus(), 60); beep(760, 0.05); }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest("#start-menu") && !e.target.closest("#start-btn")) closeStart();
  if (!e.target.closest(".power-wrap")) $("#power-pop").classList.add("hidden");
});
$$("#start-menu [data-app]").forEach((el) => el.addEventListener("click", () => { closeStart(); APPS[el.dataset.app](); }));
$("#power-btn").addEventListener("click", (e) => { e.stopPropagation(); $("#power-pop").classList.toggle("hidden"); });
$("#pp-restart").addEventListener("click", () => location.reload());
$("#pp-shutdown").addEventListener("click", () => {
  closeStart();
  $("#desktop").classList.add("hidden");
  $("#shutdown-screen").classList.remove("hidden");
});
$("#shutdown-screen").addEventListener("click", () => location.reload());

/* ---------------- DESKTOP ICONS: draggable ---------------- */
let lastIconDrag = 0;
function saveIconPositions() {
  const o = {};
  $$(".dicon").forEach((d) => { o[d.dataset.app] = { x: d.offsetLeft, y: d.offsetTop }; });
  localStorage.setItem("britos-icon-pos", JSON.stringify(o));
}
function layoutIcons() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem("britos-icon-pos")) || {}; } catch (e) {}
  const vh = innerHeight;
  let col = 0, row = 0;
  $$(".dicon").forEach((d) => {
    const p = saved[d.dataset.app];
    if (p && typeof p.x === "number") { d.style.left = p.x + "px"; d.style.top = p.y + "px"; return; }
    let x = 12 + col * 102, y = 12 + row * 90;
    while (y > vh - 180) { col++; row = 0; x = 12 + col * 102; y = 12; }
    d.style.left = x + "px"; d.style.top = y + "px";
    row++;
  });
}
function makeIconDraggable(d) {
  d.addEventListener("pointerdown", (e) => {
    if (isMobile()) return;
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY, ox = d.offsetLeft, oy = d.offsetTop;
    let moved = false;
    try { d.setPointerCapture(e.pointerId); } catch (err) {}
    d.classList.add("dragging");
    const mv = (ev) => {
      if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 5) moved = true;
      if (!moved) return;
      const nx = Math.max(0, Math.min(innerWidth - d.offsetWidth, ox + ev.clientX - sx));
      const ny = Math.max(0, Math.min(innerHeight - 100, oy + ev.clientY - sy));
      d.style.left = nx + "px"; d.style.top = ny + "px";
    };
    const up = () => {
      d.removeEventListener("pointermove", mv);
      d.removeEventListener("pointerup", up);
      d.removeEventListener("pointercancel", up);
      d.classList.remove("dragging");
      if (moved) { lastIconDrag = Date.now(); saveIconPositions(); }
    };
    d.addEventListener("pointermove", mv);
    d.addEventListener("pointerup", up);
    d.addEventListener("pointercancel", up);
  });
}

$$(".dicon").forEach((d) => {
  makeIconDraggable(d);
  d.addEventListener("dblclick", () => {
    if (Date.now() - lastIconDrag < 250) return;
    APPS[d.dataset.app]();
  });
  d.addEventListener("click", () => {
    if (Date.now() - lastIconDrag < 250) return;
    d.classList.add("selected");
    setTimeout(() => d.classList.remove("selected"), 350);
  });
});

/* ---------------- INIT ---------------- */
applySettings(Object.assign({ accent: "aqua", wall: "aurora", crt: false, snd: true }, getSettings()));
layoutIcons();
runBoot();
