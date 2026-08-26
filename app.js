/* ============================================================
   BritOS 7 — portfolio of Musfiqur Rahman Saimon
   portfolio OS
   ============================================================ */
"use strict";

const $ = (s) => document.querySelector(s);
const isMobile = () => window.matchMedia("(max-width: 720px)").matches;

/* ---------------- DATA ---------------- */
const PROFILE = {
  name: "Musfiqur Rahman Saimon",
  role: "Full-Stack Product Engineer",
  email: "mdsaimon552723@gmail.com",
  github: "https://github.com/britsync07-prog",
};

const PROJECTS = [
  { icon: "🔐", name: "AHS Vault", repo: "ahs-app",
    desc: "Zero-knowledge biometric vault. AES-256-GCM chunked storage unlocked by paired phone / WebAuthn.",
    stack: ["Go", "Rust/Tauri", "React PWA", "Kotlin"] },
  { icon: "📊", name: "BritCRM", repo: "crm",
    desc: "Self-hosted all-in-one CRM with LiveKit meetings, team chat, billing + MCP server for AI agents.",
    stack: ["Next.js 16", "Socket.io", "Prisma", "LiveKit"] },
  { icon: "💳", name: "BlackDesck", repo: "stripepay",
    desc: "Consultation platform with Stripe Connect payouts and risk-based 3DS checkout.",
    stack: ["Laravel", "Inertia", "React", "Stripe"] },
  { icon: "📈", name: "BritTrade AI", repo: "britTrade",
    desc: "Crypto signal engine with automated Binance futures execution, paper/live parity, Android app.",
    stack: ["Node.js", "CCXT", "Capacitor", "Kotlin"] },
  { icon: "🎬", name: "BritTube", repo: "BritTube",
    desc: "AI video pipeline: script → footage → TTS → subtitles → MP4, public API + MCP server.",
    stack: ["FastAPI", "MoviePy", "Next.js", "MCP"] },
  { icon: "🎰", name: "WinyPay Client", repo: "bdclient011",
    desc: "Gaming platform with seamless-wallet integration and custom payment gateway.",
    stack: ["Next.js 15", "Express", "Prisma"] },
  { icon: "✉️", name: "MailSender", repo: "mailsender",
    desc: "Postal-style multi-tenant MTA infrastructure: DKIM/SPF automation, warmup engine.",
    stack: ["TypeScript", "SMTP", "PostgreSQL", "Redis"] },
  { icon: "🎯", name: "LeadHunter", repo: "testingit",
    desc: "B2B lead-gen platform: stealth scraping queue, segmented newsletters, tracking pixels.",
    stack: ["Puppeteer", "SQLite", "Stripe"] },
];

const SKILLS = [
  ["TypeScript / JavaScript", 95], ["React / Next.js", 93], ["Node.js / Express", 92],
  ["Python / FastAPI", 85], ["Databases (SQL · Prisma · ORM)", 88],
  ["Payments (Stripe / PayPal)", 90], ["Email Infra (SMTP / DKIM)", 86],
  ["Go / Rust (Tauri)", 74], ["DevOps (Docker · PM2 · CI)", 84], ["AI Agents (MCP)", 80],
];

/* ---------------- BOOT SEQUENCE ---------------- */
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
        if (p >= 100) {
          clearInterval(t);
          $("#boot-prompt").style.display = "block";
          armBootSkip();
        }
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
    document.removeEventListener("keydown", go);
    $("#boot-screen").classList.add("hidden");
    $("#login-screen").classList.remove("hidden");
  };
  setTimeout(() => {
    document.addEventListener("keydown", go, { once: true });
    $("#boot-screen").addEventListener("click", go, { once: true });
  }, 150);
}

/* ---------------- LOGIN ---------------- */
$("#login-btn").addEventListener("click", () => {
  beep(520, 0.07); beep(720, 0.09, 0.09);
  $("#login-screen").classList.add("hidden");
  const d = $("#desktop");
  d.classList.remove("hidden");
  startClock();
});

/* tiny synth for UI sounds (no audio files needed) */
let actx = null;
function beep(freq, dur, delay = 0) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = "triangle"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.08, actx.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + delay + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(actx.currentTime + delay); o.stop(actx.currentTime + delay + dur + 0.02);
  } catch (e) {}
}

/* ---------------- CLOCK ---------------- */
function startClock() {
  const tick = () => {
    $("#clock").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  tick(); setInterval(tick, 1000);
}

/* ---------------- WINDOW MANAGER ---------------- */
let zTop = 20;
const openWins = {}; // appId -> {el, task}

function createWindow(appId, title, icon, bodyHTML, w = 640, h = 480) {
  if (openWins[appId]) { focusWin(appId); return openWins[appId]; }

  const win = document.createElement("div");
  win.className = "window focused";
  win.dataset.app = appId;
  const vw = window.innerWidth, vh = window.innerHeight;
  w = Math.min(w, vw - 30); h = Math.min(h, vh - 110);
  const off = Object.keys(openWins).length * 26;
  win.style.width = w + "px"; win.style.height = h + "px";
  win.style.left = isMobile() ? "2vw" : Math.max(10, (vw - w) / 2 - 120 + off) + "px";
  win.style.top = isMobile() ? "2vh" : Math.max(10, (vh - h) / 2 - 60 + off) + "px";
  win.innerHTML =
    `<div class="titlebar">
       <span class="t-icon">${icon}</span><span class="t-title">${title}</span>
       <button class="win-btn min">—</button>
       <button class="win-btn max">▢</button>
       <button class="win-btn close">✕</button>
     </div>
     <div class="win-body">${bodyHTML}</div>`;
  $("#windows-layer").appendChild(win);

  /* taskbar item */
  const task = document.createElement("div");
  task.className = "task-item active";
  task.innerHTML = `<span>${icon}</span><span class="tl">${title}</span>`;
  $("#task-windows").appendChild(task);

  openWins[appId] = { el: win, task };
  zTop++;
  win.style.zIndex = zTop;

  /* events */
  win.addEventListener("pointerdown", () => focusWin(appId));
  task.addEventListener("click", () => {
    if (win.classList.contains("minimized")) { restoreWin(appId); }
    else if (win.style.zIndex == zTop) { minimizeWin(appId); }
    else { focusWin(appId); }
  });
  win.querySelector(".close").addEventListener("click", (e) => { e.stopPropagation(); closeWin(appId); });
  win.querySelector(".min").addEventListener("click", (e) => { e.stopPropagation(); minimizeWin(appId); });
  win.querySelector(".max").addEventListener("click", (e) => { e.stopPropagation(); maximizeWin(appId); });
  makeDraggable(win, win.querySelector(".titlebar"), appId);

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
function minimizeWin(appId) {
  const w = openWins[appId]; if (!w) return;
  w.el.classList.add("minimized"); w.el.style.display = "none";
  w.task.classList.remove("active");
}
function restoreWin(appId) { focusWin(appId); }
function maximizeWin(appId) {
  const w = openWins[appId]; if (!w) return;
  w.el.classList.toggle("maximized");
}
function closeWin(appId) {
  const w = openWins[appId]; if (!w) return;
  w.el.remove(); w.task.remove();
  delete openWins[appId];
  beep(300, 0.06);
}

/* dragging */
function makeDraggable(win, bar, appId) {
  let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".win-btn") || win.classList.contains("maximized") || isMobile()) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    ox = win.offsetLeft; oy = win.offsetTop;
    bar.setPointerCapture(e.pointerId);
  });
  bar.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const nx = Math.min(window.innerWidth - 110, Math.max(-(win.offsetWidth - 80), ox + e.clientX - sx));
    const ny = Math.min(window.innerHeight - 90, Math.max(0, oy + e.clientY - sy));
    win.style.left = nx + "px";
    win.style.top = ny + "px";
  });
  bar.addEventListener("pointerup", () => { dragging = false; });
}

/* ---------------- APPS ---------------- */
const APPS = {
  about() {
    createWindow("about", "About.txt — Notepad", "📄", `<div class="notepad">${ABOUT_TXT}</div>`, 600, 520);
    beep(600, 0.05);
  },
  projects() {
    const html = PROJECTS.map((p) =>
      `<div class="proj-card"><b>${p.icon} ${p.name}</b><p>${p.desc}</p>
       <div class="chips">${p.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
       <a class="gh-link" href="${PROFILE.github}/${p.repo}" target="_blank" rel="noopener">View on GitHub ↗</a></div>`
    ).join("");
    createWindow("projects", `Projects — ${PROJECTS.length} shipped`, "🚀", html, 660, 540);
    beep(640, 0.05);
  },
  skills() {
    const html = SKILLS.map(([n]) =>
      `<div class="skill-row"><div class="skill-label"><span>${n}</span></div>
       <div class="skill-bar"><div class="skill-fill" data-w="0"></div></div></div>`).join("");
    const win = createWindow("skills", "Skills.exe — System Capabilities", "📊", html, 560, 500);
    requestAnimationFrame(() => animateSkills());
  },
  explorer() { createWindow("explorer", "My Works — File Explorer", "📁", explorerHTML(), 700, 480); wireExplorer(); beep(660, 0.05); },
  terminal() { createWindow("terminal", "Terminal — saimon@britos", "⌨️", termHTML(), 640, 420); wireTerminal(); beep(520, 0.06); },
  contact() {
    const html = `
      <div class="contact-grid">
        <a class="ccard" href="mailto:${PROFILE.email}"><span class="ci">📧</span><b>Email</b><small>${PROFILE.email}</small></a>
        <a class="ccard" href="${PROFILE.github}" target="_blank" rel="noopener"><span class="ci">🐙</span><b>GitHub</b><small>Open my GitHub profile ↗</small></a>
        <a class="ccard" href="#" id="copy-mail"><span class="ci">📋</span><b>Copy Email</b><small>click to copy</small></a>
      </div>
      <p style="margin-top:16px;color:#8a8aa3;font-size:13px">Open for freelance builds, collaborations, and interesting problems.</p>`;
    const w = createWindow("contact", "Contact — Get in touch", "📬", html, 540, 340);
    w.el.querySelector("#copy-mail").addEventListener("click", (e) => {
      e.preventDefault();
      navigator.clipboard?.writeText(PROFILE.email);
      e.currentTarget.querySelector("small").textContent = "copied ✓";
      beep(800, 0.06);
    });
    beep(700, 0.05);
  },
  recycle() {
    const bsod = $("#bsod");
    bsod.classList.remove("hidden");
    beep(160, 0.3); beep(120, 0.4, 0.25);
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 22 + 8;
      $("#bsod-pct").textContent = Math.min(100, Math.round(p)) + "% complete";
      if (p >= 100) {
        clearInterval(t);
        bsod.classList.add("hidden");
        $("#bsod-pct").textContent = "0% complete";
      }
    }, 550);
  },
};

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
function explorerHTML() {
  return `<div class="explore"><div class="exp-side" id="exp-side"></div><div class="exp-main" id="exp-main"></div></div>`;
}
function wireExplorer() {
  const side = $("#exp-side"), main = $("#exp-main");
  const pathOf = (item) => (item.parent ? pathByName(item.parent) + "\\" + item.name : item.name);
  function pathByName(n) { const it = EXPLORER.find((x) => x.name === n); return it ? pathOf(it) : n; }
  function renderSide(active) {
    side.innerHTML = "";
    EXPLORER.forEach((item, idx) => {
      const depth = item.parent ? (pathByName(item.parent).split("\\").length) : 0;
      const d = document.createElement("div");
      d.textContent = (item.type === "project" ? "📁 " : item.type === "file" ? "📄 " : "💾 ") + item.name;
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
      main.innerHTML = `<h3>📁 ${p.name}</h3><div class="ep-desc">${p.desc}</div>
        <div class="chips">${p.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
        <a class="gh-link" href="${PROFILE.github}/${p.repo}" target="_blank" rel="noopener">Open repository ↗</a>`;
    } else if (item.type === "file") {
      main.innerHTML = `<h3>📄 ${item.name}</h3><div class="notepad">${item.body}</div>`;
    } else {
      const kids = EXPLORER.filter((x) => x.parent === item.name);
      main.innerHTML = `<h3>💾 ${pathOf(item)}</h3><div class="ep-desc">${kids.length} item(s)</div>` +
        kids.map((k) => `<div class="proj-card"><b>${k.type === "file" ? "📄" : "📁"} ${k.name}</b></div>`).join("");
    }
  }
  renderMain(EXPLORER.findIndex((x) => x.name === "saimon"));
}

/* skills animation */
function animateSkills() {
  const fills = document.querySelectorAll("#windows-layer .window[data-app='skills'] .skill-fill");
  fills.forEach((f, i) => {
    setTimeout(() => { f.style.width = SKILLS[i] ? Math.max(SKILLS[i][1] - 8, 55) + "%" : "70%"; }, 60 + i * 90);
  });
}

/* ---------------- TERMINAL ---------------- */
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
  about      who is this guy
  projects   list shipped products
  skills     tech capabilities
  socials    links
  contact    email
  whoami     current user
  matrix     enter the matrix
  sudo       try your luck
  clear      wipe screen
  date       system time
  echo       repeat after you`);
        break;
      case "about":
        print(`${PROFILE.name} — ${PROFILE.role}.
Builds complete products: vaults, CRMs, trading engines,
payment platforms, AI pipelines. Type <span class="t-accent">projects</span> for proof.`);
        break;
      case "projects":
        print(PROJECTS.map((p) => `${p.icon} ${p.name.padEnd(16)} [${p.repo}]`).join("\n"));
        break;
      case "skills":
        print(SKILLS.map(([n, lvl]) => `${n}: ${"█".repeat(Math.round(lvl / 8))}${lvl}%`).join("\n"));
        break;
      case "socials":
        print(`github → <a href="${PROFILE.github}" target="_blank" rel="noopener" style="color:#a78bfa">open my GitHub profile ↗</a>`);
        break;
      case "contact":
        print(`email → ${PROFILE.email}`);
        break;
      case "whoami": print("visitor — but saimon is the admin here"); break;
      case "date": print(new Date().toString()); break;
      case "echo": print(args.join(" ").replace(/</g, "&lt;") || "&nbsp;"); break;
      case "clear": term.querySelectorAll(".t-out").forEach((n) => n.remove()); break;
      case "sudo": print(args.join(" ") === "hire-me"
        ? "<span class='t-accent'>[PERMISSION GRANTED]</span> smart move. email sent to top of pile: " + PROFILE.email
        : "nice try. visitor is not in the sudoers file. this incident WILL be reported… to my GitHub."); break;
      case "matrix": startMatrix(); print("<span class='t-accent'>wake up… follow the purple rabbit.</span>"); break;
      case "exit": closeWin("terminal"); break;
      default:
        print(`'${c.replace(/</g, "&lt;")}' is not recognized. try <span class="t-accent">help</span>`);
    }
  }
}

/* ---------------- MATRIX RAIN ---------------- */
function startMatrix() {
  const old = $("#matrix-canvas"); if (old) old.remove();
  const cv = document.createElement("canvas");
  cv.id = "matrix-canvas"; document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = Math.floor(cv.width / 15);
  const drops = Array(cols).fill(1);
  const chars = "アイウエオカキクケコサシスセソ01BRITOS$#@";
  const iv = setInterval(() => {
    ctx.fillStyle = "rgba(0,0,0,.07)"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#8b5cf6"; ctx.font = "14px monospace";
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 15, y * 15);
      if (y * 15 > cv.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 45);
  setTimeout(() => { clearInterval(iv); cv.remove(); }, 5000);
}

/* ---------------- DESKTOP EVENTS ---------------- */
document.querySelectorAll(".dicon").forEach((d) => {
  const launch = () => { d.classList.add("selected"); setTimeout(() => d.classList.remove("selected"), 350); APPS[d.dataset.app](); };
  d.addEventListener("dblclick", launch);
  d.addEventListener("click", () => d.classList.add("selected"));
});

$("#start-btn").addEventListener("click", (e) => { e.stopPropagation(); $("#start-menu").classList.toggle("hidden"); });
document.addEventListener("click", (e) => {
  if (!e.target.closest("#start-menu") && !e.target.closest("#start-btn")) $("#start-menu").classList.add("hidden");
});
document.querySelectorAll("#start-menu [data-app]").forEach((m) => {
  m.addEventListener("click", () => { $("#start-menu").classList.add("hidden"); APPS[m.dataset.app](); });
});
$("#sm-restart").addEventListener("click", () => location.reload());
$("#sm-shutdown").addEventListener("click", () => {
  $("#desktop").classList.add("hidden");
  $("#shutdown-screen").classList.remove("hidden");
});
$("#shutdown-screen").addEventListener("click", () => location.reload());

/* keyboard shortcut: Enter also logs in from boot prompt state handled above */

/* ---------------- START ---------------- */
runBoot();
