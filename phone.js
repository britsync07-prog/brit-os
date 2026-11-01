/* ============================================================
   BritDroid 14 - Ember Taste Edition Engine
   Native Android Mobile OS for Musfiqur Rahman Saimon
   Strictly mobile-only. Default theme: Ember.
   Zero em-dashes. Anti-slop engineering standards.
   ============================================================ */
"use strict";

(function () {
  // Global state for phone mode
  const PhoneState = {
    isPhoneMode: false,
    bootCompleted: false,
    isUnlocked: false,
    activeApp: null,
    recentApps: ["projects", "about", "skills"],
    sliderOpen: false,
    drawerOpen: false,
    recentsOpen: false,
    flashlightOn: false,
    brightness: 100,
    wallpaper: "ember", // Default theme is strictly ember
    currentHomeScreen: 0,
  };

  // Safe sound synth
  function phoneBeep(freq = 580, dur = 0.05) {
    try {
      if (typeof beep === "function") {
        beep(freq, dur);
      }
    } catch (e) {}
  }

  // Pure device check: phone viewport width <= 768px or mobile userAgent
  function checkIsPhone() {
    const isSmall = window.innerWidth <= 768;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isSmall || (isMobileDevice && window.innerWidth <= 900);
  }

  // Update clock & date strings
  function updatePhoneClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const dateStr = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
    const fullDateStr = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

    // Status bar
    const sbTime = document.getElementById("phone-status-time");
    if (sbTime) sbTime.textContent = timeStr;

    // Lock screen
    const lkTime = document.getElementById("phone-lock-time");
    const lkDate = document.getElementById("phone-lock-date");
    if (lkTime) lkTime.textContent = timeStr;
    if (lkDate) lkDate.textContent = fullDateStr;

    // Home widget
    const hwTime = document.getElementById("phone-hw-time");
    const hwDate = document.getElementById("phone-hw-date");
    if (hwTime) hwTime.textContent = timeStr;
    if (hwDate) hwDate.textContent = dateStr;

    // Slider header
    const scTime = document.getElementById("phone-slider-clock");
    const scDate = document.getElementById("phone-slider-date");
    if (scTime) scTime.textContent = timeStr;
    if (scDate) scDate.textContent = fullDateStr;
  }

  // Initialize Phone OS
  function initPhoneOS() {
    const isPhone = checkIsPhone();
    PhoneState.isPhoneMode = isPhone;

    const phoneContainer = document.getElementById("phone-container");
    const desktopEl = document.getElementById("desktop");
    const bootScreen = document.getElementById("boot-screen");
    const loginScreen = document.getElementById("login-screen");

    if (isPhone) {
      document.body.classList.add("phone-mode-active");
      if (phoneContainer) phoneContainer.classList.remove("hidden");
      if (desktopEl) desktopEl.classList.add("hidden");
      if (bootScreen) bootScreen.classList.add("hidden");
      if (loginScreen) loginScreen.classList.add("hidden");

      // Default wallpaper is Ember
      const savedWall = localStorage.getItem("britdroid-wallpaper") || "ember";
      setPhoneWallpaper(savedWall);

      // Start Android Boot
      runAndroidBoot();
    } else {
      document.body.classList.remove("phone-mode-active");
      if (phoneContainer) phoneContainer.classList.add("hidden");
    }

    updatePhoneClock();
    setInterval(updatePhoneClock, 1000);
    setupPhoneEventListeners();
  }

  // ================= 1. ANDROID BOOT SEQUENCE =================
  function runAndroidBoot() {
    const bootEl = document.getElementById("phone-boot");
    const progressFill = document.getElementById("phone-boot-fill");
    const statusMsg = document.getElementById("phone-boot-msg");

    if (!bootEl) return;

    const stages = [
      { pct: 18, msg: "Starting BritDroid Android 14..." },
      { pct: 40, msg: "Loading portfolio kernel modules..." },
      { pct: 64, msg: "Mounting zero-knowledge vault & filesystem..." },
      { pct: 85, msg: "Preparing Material You Ember layout..." },
      { pct: 100, msg: "Welcome to Saimon's Phone" },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current >= stages.length) {
        clearInterval(interval);
        setTimeout(finishBoot, 400);
        return;
      }
      const s = stages[current];
      if (progressFill) progressFill.style.width = s.pct + "%";
      if (statusMsg) statusMsg.textContent = s.msg;
      phoneBeep(420 + current * 60, 0.04);
      current++;
    }, 360);

    function finishBoot() {
      phoneBeep(640, 0.06);
      setTimeout(() => phoneBeep(880, 0.1), 90);
      bootEl.classList.add("boot-exit");
      setTimeout(() => {
        bootEl.style.display = "none";
        PhoneState.bootCompleted = true;
      }, 600);
    }

    const skipBtn = document.getElementById("phone-boot-skip");
    if (skipBtn) {
      skipBtn.addEventListener("click", () => {
        clearInterval(interval);
        finishBoot();
      });
    }
  }

  // ================= 2. LOCK SCREEN UNLOCK =================
  function unlockPhone() {
    if (PhoneState.isUnlocked) return;
    PhoneState.isUnlocked = true;

    phoneBeep(580, 0.04);
    setTimeout(() => phoneBeep(780, 0.06), 70);

    const lockEl = document.getElementById("phone-lock");
    if (lockEl) {
      lockEl.classList.add("lock-unlocked");
      setTimeout(() => {
        lockEl.style.display = "none";
      }, 450);
    }
  }

  // ================= 3. WALLPAPER SWITCHER (EMBER DEFAULT) =================
  function setPhoneWallpaper(wall) {
    PhoneState.wallpaper = wall;
    localStorage.setItem("britdroid-wallpaper", wall);

    const homeEl = document.getElementById("phone-home");
    const lockEl = document.getElementById("phone-lock");
    const list = ["phone-theme-ember", "phone-theme-midnight", "phone-theme-aurora"];

    [homeEl, lockEl].forEach((el) => {
      if (!el) return;
      list.forEach((c) => el.classList.remove(c));
      el.classList.add(`phone-theme-${wall}`);
    });

    document.querySelectorAll(".wall-swatch-cell").forEach((c) => {
      c.classList.toggle("active", c.dataset.wall === wall);
    });
  }

  // ================= 4. TOP SLIDER (NOTIFICATION & QUICK SETTINGS) =================
  function toggleTopSlider(open) {
    const slider = document.getElementById("phone-slider");
    if (!slider) return;

    if (open === undefined) open = !PhoneState.sliderOpen;
    PhoneState.sliderOpen = open;

    if (open) {
      slider.classList.add("slider-open");
      phoneBeep(650, 0.04);
    } else {
      slider.classList.remove("slider-open");
      phoneBeep(480, 0.04);
    }
  }

  // ================= 5. APP DRAWER =================
  function toggleAppDrawer(open) {
    const drawer = document.getElementById("phone-app-drawer");
    if (!drawer) return;

    if (open === undefined) open = !PhoneState.drawerOpen;
    PhoneState.drawerOpen = open;

    if (open) {
      drawer.classList.add("drawer-open");
      phoneBeep(600, 0.04);
      const searchIn = document.getElementById("drawer-search-input");
      if (searchIn) {
        searchIn.value = "";
        filterAppDrawer("");
      }
    } else {
      drawer.classList.remove("drawer-open");
      phoneBeep(480, 0.04);
    }
  }

  function filterAppDrawer(q) {
    q = (q || "").trim().toLowerCase();
    const rows = document.querySelectorAll(".drawer-app-item");
    rows.forEach((row) => {
      const name = (row.dataset.name || "").toLowerCase();
      const desc = (row.dataset.desc || "").toLowerCase();
      const match = !q || name.includes(q) || desc.includes(q);
      row.style.display = match ? "flex" : "none";
    });
  }

  // Clean about text without any em-dashes
  const CLEAN_ABOUT = `Hi, I am ${PROFILE.name} - ${PROFILE.role}.

I build COMPLETE products:
  • Zero-knowledge vaults (Go + Rust/Tauri)
  • Production CRMs (Next.js + LiveKit)
  • Crypto trading engines (Binance futures)
  • Stripe Connect payout platforms
  • AI video pipelines (FastAPI + MoviePy)
  • High-throughput email infrastructure
  • Data extraction, mining & cleaning
  • E-commerce catalog optimization

Philosophy:
  "Paper-trade it, test it, then deploy it."`;

  // ================= 6. NATIVE APPS (ANTI-SLOP EMBER THEME) =================
  const APPS_DATA = {
    about: {
      title: "About Musfiqur",
      icon: "📄",
      sub: "Bio and engineering background",
      render: () => `
        <div class="profile-card-ember">
          <div class="profile-avatar-box">
            <img src="./assets/avatar.jpg" alt="${PROFILE.name}">
          </div>
          <div class="profile-name-text">${PROFILE.name}</div>
          <div class="profile-role-sub">${PROFILE.role}</div>

          <div class="profile-stats-strip">
            <div class="pss-stat"><div class="pss-val">8+</div><div class="pss-lbl">Shipped</div></div>
            <div class="pss-stat"><div class="pss-val">100%</div><div class="pss-lbl">Live Parity</div></div>
            <div class="pss-stat"><div class="pss-val">Full-Stack</div><div class="pss-lbl">Delivery</div></div>
          </div>

          <div class="profile-body-text">${CLEAN_ABOUT}</div>

          <a class="cta-button-ember" href="mailto:${PROFILE.email}">
            ✉️ Get in Touch
          </a>
        </div>
      `,
    },

    projects: {
      title: "Shipped Projects",
      icon: "🚀",
      sub: "Production grade systems",
      render: () => {
        return PROJECTS.map(
          (p) => `
          <div class="project-card-ember">
            <div class="pce-head">
              <span class="pce-icon">${p.icon}</span>
              <div class="pce-title">${p.name}</div>
            </div>
            <div class="pce-desc">${p.desc.replace(/—/g, "-").replace(/–/g, "-")}</div>
            <div class="pce-chips">
              ${p.stack.map((s) => `<span class="pce-chip">${s}</span>`).join("")}
            </div>
            <a class="cta-button-ember" href="${PROFILE.github}/${p.repo}" target="_blank" rel="noopener">
              View on GitHub ↗
            </a>
          </div>
        `
        ).join("");
      },
    },

    skills: {
      title: "Capabilities",
      icon: "📊",
      sub: "Core engineering stack",
      render: () => {
        return SKILLS.map(([n, lvl, icons]) => {
          const logos = (icons || [])
            .map((i) => `<img src="${DEVICON}${i}.svg" alt="" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;" onerror="this.style.display='none'">`)
            .join("");
          return `
            <div class="skill-item-ember">
              <div class="sie-top">
                <span class="sie-title">${logos} ${n.replace(/—/g, "-")}</span>
                <span class="sie-pct">${lvl}%</span>
              </div>
              <div class="sie-track">
                <div class="sie-fill" style="width:${lvl}%;"></div>
              </div>
            </div>
          `;
        }).join("");
      },
    },

    services: {
      title: "Services for Hire",
      icon: "💼",
      sub: "Data & E-commerce solutions",
      render: () => {
        const list = SERVICES.map(
          (s) => `
          <div class="service-card-ember">
            <div class="sce-head">
              <span class="sce-icon">${s.icon}</span>
              <div>
                <div class="sce-name">${s.name}</div>
                <div class="sce-tag">${s.tag}</div>
              </div>
            </div>
            <div class="sce-desc">${s.desc.replace(/—/g, "-").replace(/–/g, "-")}</div>
            <div class="pce-chips">
              ${s.benefits.map((b) => `<span class="pce-chip">✓ ${b}</span>`).join("")}
            </div>
            <div class="sce-use">
              <b style="color:#ffffff">Example:</b> ${s.useCase}
            </div>
            <a class="cta-button-ember" href="mailto:${PROFILE.email}?subject=Hire me: ${encodeURIComponent(s.name)}" target="_blank" rel="noopener">
              ${s.cta} ↗
            </a>
          </div>
        `
        ).join("");

        return `
          <div style="font-size:12.5px;color:#fed7aa;margin-bottom:12px;text-align:center;">
            Data operations and catalog engineering ready for immediate kickoff:
          </div>
          ${list}
        `;
      },
    },

    explorer: {
      title: "Files & Storage",
      icon: "📁",
      sub: "System directory tree",
      render: () => `
        <div style="background:var(--phone-surface);border:1px solid var(--phone-border);border-radius:var(--phone-radius-md);padding:14px;margin-bottom:12px;">
          <div style="font-size:11.5px;color:var(--phone-muted);margin-bottom:10px;">Root: <b>Internal Storage &gt; saimon</b></div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;align-items:center;gap:10px;padding:9px;background:var(--phone-surface-2);border-radius:10px;">
              <span style="font-size:18px;">📁</span>
              <div><b style="font-size:13px;color:#fff;">projects/</b><br><small style="color:var(--phone-muted)">8 production repositories</small></div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;padding:9px;background:var(--phone-surface-2);border-radius:10px;">
              <span style="font-size:18px;">📄</span>
              <div><b style="font-size:13px;color:#fff;">philosophy.txt</b><br><small style="color:var(--phone-muted)">Ship fast, test thoroughly.</small></div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;padding:9px;background:var(--phone-surface-2);border-radius:10px;">
              <span style="font-size:18px;">📄</span>
              <div><b style="font-size:13px;color:#fff;">bucket-list.txt</b><br><small style="color:var(--phone-muted)">Zero-knowledge vault, trading engines</small></div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;padding:9px;background:var(--phone-surface-2);border-radius:10px;">
              <span style="font-size:18px;">📄</span>
              <div><b style="font-size:13px;color:#fff;">resume.pdf</b><br><small style="color:var(--phone-muted)">Full-Stack Engineer CV</small></div>
            </div>
          </div>
        </div>
      `,
    },

    terminal: {
      title: "Termux Shell",
      icon: "⌨️",
      sub: "Mobile command line",
      render: () => `
        <div class="termux-wrapper">
          <div class="termux-console" id="m-term-screen">
BritDroid 14 Termux Console
Type 'help' or tap shortcuts:

visitor@britdroid:~$ </div>
          <div class="termux-keys-row">
            <button class="termux-key-btn" data-cmd="help">help</button>
            <button class="termux-key-btn" data-cmd="projects">projects</button>
            <button class="termux-key-btn" data-cmd="skills">skills</button>
            <button class="termux-key-btn" data-cmd="hire">hire</button>
            <button class="termux-key-btn" data-cmd="whoami">whoami</button>
            <button class="termux-key-btn" data-cmd="clear">clear</button>
          </div>
          <div class="termux-entry-bar">
            <span class="termux-prompt-char">&gt;</span>
            <input type="text" id="m-term-input" placeholder="Enter command..." autocomplete="off">
            <button class="termux-key-btn" id="m-term-send" style="background:#fb923c;color:#0a0705;">Enter</button>
          </div>
        </div>
      `,
      onMount: wireTermux,
    },

    cv: {
      title: "Curriculum Vitae",
      icon: "📄",
      sub: "Engineer Resume PDF",
      render: () => `
        <div style="display:flex;flex-direction:column;height:100%;gap:10px;">
          <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--phone-surface);border-radius:var(--phone-radius-sm);border:1px solid var(--phone-border);">
            <a class="cta-button-ember" href="./Musfiqur_Rahman_Saimon_Resume.pdf" target="_blank" rel="noopener" style="margin:0;width:auto;font-size:12px;">
              Open in Tab ↗
            </a>
            <a class="cta-button-ember" href="./Musfiqur_Rahman_Saimon_Resume.pdf" download style="margin:0;width:auto;font-size:12px;">
              Download PDF ↓
            </a>
          </div>
          <div style="flex:1;background:#fff;border-radius:var(--phone-radius-sm);overflow:hidden;">
            <iframe src="./Musfiqur_Rahman_Saimon_Resume.pdf" style="width:100%;height:100%;border:none;" title="CV PDF"></iframe>
          </div>
        </div>
      `,
    },

    contact: {
      title: "Direct Connect",
      icon: "📬",
      sub: "Email, GitHub, LinkedIn",
      render: () => `
        <div class="contact-grid-ember">
          <a class="contact-tile-ember" href="mailto:${PROFILE.email}">
            <span class="cte-icon">✉️</span>
            <b class="cte-label">Email</b>
            <small class="cte-detail">${PROFILE.email}</small>
          </a>
          <a class="contact-tile-ember" href="${PROFILE.github}" target="_blank" rel="noopener">
            <span class="cte-icon">🐙</span>
            <b class="cte-label">GitHub</b>
            <small class="cte-detail">britsync07-prog</small>
          </a>
          <a class="contact-tile-ember" href="${PROFILE.linkedin}" target="_blank" rel="noopener">
            <span class="cte-icon">💼</span>
            <b class="cte-label">LinkedIn</b>
            <small class="cte-detail">Musfiqur Rahman Saimon</small>
          </a>
          <div class="contact-tile-ember" id="m-copy-email-btn">
            <span class="cte-icon">📋</span>
            <b class="cte-label">Copy Email</b>
            <small class="cte-detail" id="m-copy-status">Tap to copy</small>
          </div>
        </div>
      `,
      onMount: () => {
        const copyBtn = document.getElementById("m-copy-email-btn");
        const status = document.getElementById("m-copy-status");
        if (copyBtn) {
          copyBtn.addEventListener("click", () => {
            navigator.clipboard?.writeText(PROFILE.email);
            if (status) status.textContent = "Copied ✓";
            phoneBeep(700, 0.04);
            setTimeout(() => {
              if (status) status.textContent = "Tap to copy";
            }, 2000);
          });
        }
      },
    },

    calculator: {
      title: "Calculator",
      icon: "🧮",
      sub: "Arithmetic tool",
      render: () => `
        <div class="calc-container">
          <div class="calc-screen-box">
            <div class="calc-screen-hist" id="m-c-hist">&nbsp;</div>
            <div class="calc-screen-main" id="m-c-cur">0</div>
          </div>
          <div class="calc-keys-grid" id="m-c-pad">
            <button class="calc-btn-item op" data-k="C">C</button>
            <button class="calc-btn-item op" data-k="back">⌫</button>
            <button class="calc-btn-item op" data-k="%">%</button>
            <button class="calc-btn-item op" data-k="/">÷</button>

            <button class="calc-btn-item" data-k="7">7</button>
            <button class="calc-btn-item" data-k="8">8</button>
            <button class="calc-btn-item" data-k="9">9</button>
            <button class="calc-btn-item op" data-k="*">×</button>

            <button class="calc-btn-item" data-k="4">4</button>
            <button class="calc-btn-item" data-k="5">5</button>
            <button class="calc-btn-item" data-k="6">6</button>
            <button class="calc-btn-item op" data-k="-">−</button>

            <button class="calc-btn-item" data-k="1">1</button>
            <button class="calc-btn-item" data-k="2">2</button>
            <button class="calc-btn-item" data-k="3">3</button>
            <button class="calc-btn-item op" data-k="+">+</button>

            <button class="calc-btn-item op" data-k="neg">±</button>
            <button class="calc-btn-item" data-k="0">0</button>
            <button class="calc-btn-item" data-k=".">.</button>
            <button class="calc-btn-item eq" data-k="=">=</button>
          </div>
        </div>
      `,
      onMount: wireCalculator,
    },

    calendar: {
      title: "Calendar",
      icon: "📅",
      sub: "Timeline & delivery schedule",
      render: () => {
        const today = new Date();
        const monthName = today.toLocaleDateString([], { month: "long", year: "numeric" });
        return `
          <div style="background:var(--phone-surface);border:1px solid var(--phone-border);border-radius:var(--phone-radius-md);padding:14px;">
            <div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:12px;text-align:center;">
              ${monthName}
            </div>
            <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;gap:4px;font-size:11.5px;color:var(--phone-muted);font-weight:600;">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;gap:4px;font-size:12.5px;margin-top:8px;">
              ${makeCalendarDays()}
            </div>
          </div>
          <div style="margin-top:14px;background:var(--phone-surface);border-radius:var(--phone-radius-md);padding:12px;border:1px solid var(--phone-border);">
            <div style="font-size:12.5px;font-weight:700;color:#fb923c;margin-bottom:4px;">Delivery Status</div>
            <div style="font-size:12px;color:var(--phone-muted);line-height:1.45;">
              • Full-stack sprint availability: Open<br>
              • Turnaround: Fast, verified, and test covered
            </div>
          </div>
        `;
      },
    },

    notepad: {
      title: "Notes",
      icon: "📝",
      sub: "Local scratchpad",
      render: () => {
        const saved = localStorage.getItem("britos-notes") || "";
        return `
          <div style="display:flex;flex-direction:column;height:100%;gap:10px;">
            <textarea id="m-notes-area" style="flex:1;background:var(--phone-surface);border:1px solid var(--phone-border);border-radius:var(--phone-radius-md);padding:14px;color:#fff;font-family:inherit;font-size:13.5px;resize:none;outline:none;" placeholder="Type notes here... autosaves immediately.">${saved.replace(/</g, "&lt;")}</textarea>
            <div id="m-notes-status" style="font-size:11px;color:var(--phone-muted);text-align:right;">Saved to local storage</div>
          </div>
        `;
      },
      onMount: () => {
        const ta = document.getElementById("m-notes-area");
        const st = document.getElementById("m-notes-status");
        if (ta) {
          ta.addEventListener("input", () => {
            localStorage.setItem("britos-notes", ta.value);
            if (st) st.textContent = `${ta.value.length} characters saved ✓`;
          });
        }
      },
    },

    settings: {
      title: "Settings",
      icon: "⚙️",
      sub: "System personalization",
      render: () => `
        <div class="settings-section-card">
          <div class="ssc-title">Theme & Wallpaper</div>
          <div class="wall-swatches-grid">
            <div class="wall-swatch-cell phone-theme-ember ${PhoneState.wallpaper === "ember" ? "active" : ""}" data-wall="ember">Ember</div>
            <div class="wall-swatch-cell phone-theme-midnight ${PhoneState.wallpaper === "midnight" ? "active" : ""}" data-wall="midnight">Midnight</div>
            <div class="wall-swatch-cell phone-theme-aurora ${PhoneState.wallpaper === "aurora" ? "active" : ""}" data-wall="aurora">Aurora</div>
          </div>
        </div>

        <div class="settings-section-card">
          <div class="ssc-title">Device Specifications</div>
          <div style="font-size:12.5px;color:var(--phone-muted);line-height:1.6;">
            • Model: BritDroid 14 Pro<br>
            • Engineer: Musfiqur Rahman Saimon<br>
            • System Kernel: Android 14 API 34<br>
            • Architecture: Full-Stack ARM64
          </div>
        </div>
      `,
      onMount: () => {
        document.querySelectorAll(".wall-swatch-cell").forEach((el) => {
          el.addEventListener("click", () => {
            setPhoneWallpaper(el.dataset.wall);
            phoneBeep(650, 0.04);
          });
        });
      },
    },

    gallery: {
      title: "Media Showcase",
      icon: "🖼️",
      sub: "Engineer avatar & photography",
      render: () => `
        <div style="background:var(--phone-surface);border:1px solid var(--phone-border);border-radius:var(--phone-radius-md);overflow:hidden;text-align:center;">
          <img src="./assets/avatar.jpg" alt="Musfiqur Rahman Saimon" style="width:100%;max-width:320px;height:auto;display:block;margin:0 auto;">
          <div style="padding:12px;font-size:13px;font-weight:600;color:#fff;">Musfiqur Rahman Saimon</div>
        </div>
      `,
    },

    recycle: {
      title: "Diagnostics",
      icon: "🗑️",
      sub: "System health check",
      render: () => `
        <div style="background:var(--phone-surface);border-radius:var(--phone-radius-md);padding:18px;text-align:center;border:1px solid var(--phone-border);">
          <div style="font-size:42px;margin-bottom:8px;">⚡</div>
          <div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:6px;">System Diagnostic Passed</div>
          <p style="font-size:12px;color:var(--phone-muted);line-height:1.45;margin-bottom:14px;">
            Zero junk detected. All 8 applications are production-ready.
          </p>
          <button class="cta-button-ember" id="diag-run-btn">Run Benchmark</button>
        </div>
      `,
      onMount: () => {
        const btn = document.getElementById("diag-run-btn");
        if (btn) {
          btn.addEventListener("click", () => {
            btn.textContent = "Benchmarked: 100% Optimal ✓";
            phoneBeep(850, 0.08);
          });
        }
      },
    },
  };

  function makeCalendarDays() {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    let html = "";
    for (let i = 0; i < firstDay; i++) {
      html += `<span style="color:#475569">-</span>`;
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate();
      if (isToday) {
        html += `<span style="background:#fb923c;color:#0a0705;border-radius:50%;font-weight:700;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;margin:0 auto;">${d}</span>`;
      } else {
        html += `<span style="color:#ffffff;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;margin:0 auto;">${d}</span>`;
      }
    }
    return html;
  }

  // Open App
  function openPhoneApp(appId) {
    const app = APPS_DATA[appId];
    if (!app) return;

    PhoneState.activeApp = appId;

    if (!PhoneState.recentApps.includes(appId)) {
      PhoneState.recentApps.unshift(appId);
    } else {
      PhoneState.recentApps = [appId, ...PhoneState.recentApps.filter((a) => a !== appId)];
    }

    const appScreen = document.getElementById("phone-app-screen");
    const appTitle = document.getElementById("p-app-title");
    const appIcon = document.getElementById("p-app-icon");
    const appBody = document.getElementById("p-app-body");

    if (appTitle) appTitle.textContent = app.title;
    if (appIcon) appIcon.textContent = app.icon;
    if (appBody) {
      appBody.innerHTML = app.render();
      if (typeof app.onMount === "function") {
        app.onMount();
      }
    }

    toggleAppDrawer(false);
    toggleTopSlider(false);
    toggleRecents(false);

    if (appScreen) {
      appScreen.classList.add("app-open");
      phoneBeep(650, 0.04);
    }
  }

  function closeActivePhoneApp() {
    const appScreen = document.getElementById("phone-app-screen");
    if (appScreen) {
      appScreen.classList.remove("app-open");
      PhoneState.activeApp = null;
      phoneBeep(450, 0.04);
    }
  }

  // Recents Multitasking
  function toggleRecents(open) {
    const recentsEl = document.getElementById("phone-recents");
    if (!recentsEl) return;

    if (open === undefined) open = !PhoneState.recentsOpen;
    PhoneState.recentsOpen = open;

    if (open) {
      renderRecents();
      recentsEl.classList.add("recents-open");
      phoneBeep(620, 0.04);
    } else {
      recentsEl.classList.remove("recents-open");
      phoneBeep(450, 0.04);
    }
  }

  function renderRecents() {
    const track = document.getElementById("phone-recents-track");
    if (!track) return;

    const apps = PhoneState.recentApps.map((id) => APPS_DATA[id]).filter(Boolean);
    if (apps.length === 0) {
      track.innerHTML = `<div style="color:var(--phone-muted);font-size:13px;margin:auto;">No active applications</div>`;
      return;
    }

    track.innerHTML = apps
      .map((app) => {
        const id = Object.keys(APPS_DATA).find((k) => APPS_DATA[k] === app);
        return `
        <div class="recents-card-box" data-app="${id}">
          <div class="rcb-head">
            <span>${app.icon}</span>
            <span class="rcb-title">${app.title}</span>
            <button class="rcb-close-btn" data-close="${id}">✕</button>
          </div>
          <div class="rcb-preview-body">
            <b style="color:#ffffff;font-size:13px;">${app.title}</b>
            <p style="margin-top:4px;color:var(--phone-muted);">${app.sub}</p>
            <div style="margin-top:14px;color:#fb923c;">Tap to activate</div>
          </div>
        </div>
      `;
      })
      .join("");

    track.querySelectorAll(".recents-card-box").forEach((c) => {
      c.addEventListener("click", (e) => {
        if (e.target.closest(".rcb-close-btn")) return;
        openPhoneApp(c.dataset.app);
      });
    });

    track.querySelectorAll(".rcb-close-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.close;
        PhoneState.recentApps = PhoneState.recentApps.filter((a) => a !== id);
        renderRecents();
      });
    });
  }

  // Termux
  function wireTermux() {
    const screen = document.getElementById("m-term-screen");
    const input = document.getElementById("m-term-input");
    const sendBtn = document.getElementById("m-term-send");

    function print(t) {
      if (!screen) return;
      screen.innerHTML += t + "\n";
      screen.scrollTop = screen.scrollHeight;
    }

    function runCmd(c) {
      c = (c || "").trim().toLowerCase();
      print(`<span style="color:#fb923c">visitor@britdroid:~$ ${c}</span>`);
      const [cmd] = c.split(/\s+/);
      switch (cmd) {
        case "help":
          print(`Commands:\n  projects - view portfolio builds\n  skills - capabilities\n  hire - services & availability\n  whoami - active profile\n  clear - clear screen`);
          break;
        case "projects":
          print(PROJECTS.map((p) => `• ${p.name} [${p.repo}]`).join("\n"));
          break;
        case "skills":
          print(SKILLS.map(([n, lvl]) => `• ${n.replace(/—/g, "-")}: ${lvl}%`).join("\n"));
          break;
        case "hire":
        case "services":
          print(`Opening Services view. Direct mail: ${PROFILE.email}`);
          setTimeout(() => openPhoneApp("services"), 250);
          break;
        case "whoami":
          print("guest on BritDroid Ember");
          break;
        case "clear":
          if (screen) screen.innerHTML = "visitor@britdroid:~$ ";
          break;
        default:
          print(`Command '${cmd}' not found. Type 'help'.`);
      }
      phoneBeep(580, 0.03);
    }

    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          runCmd(input.value);
          input.value = "";
        }
      });
    }

    if (sendBtn && input) {
      sendBtn.addEventListener("click", () => {
        runCmd(input.value);
        input.value = "";
      });
    }

    document.querySelectorAll(".termux-key-btn[data-cmd]").forEach((b) => {
      b.addEventListener("click", () => runCmd(b.dataset.cmd));
    });
  }

  // Calculator
  function wireCalculator() {
    const pad = document.getElementById("m-c-pad");
    const cur = document.getElementById("m-c-cur");
    const hist = document.getElementById("m-c-hist");

    let acc = null,
      op = null,
      fresh = true;

    function show(v) {
      if (cur) cur.textContent = v;
    }

    function compute(a, b, o) {
      if (o === "+") return a + b;
      if (o === "-") return a - b;
      if (o === "*") return a * b;
      if (o === "/") return b === 0 ? "Error" : a / b;
      return b;
    }

    function press(k) {
      phoneBeep(880, 0.02);
      if (!cur || !hist) return;

      if (/^[0-9]$/.test(k)) {
        show(fresh || cur.textContent === "0" ? k : cur.textContent + k);
        fresh = false;
        return;
      }

      switch (k) {
        case ".":
          if (fresh) {
            show("0.");
            fresh = false;
          } else if (!cur.textContent.includes(".")) {
            show(cur.textContent + ".");
          }
          break;
        case "C":
          acc = null;
          op = null;
          fresh = true;
          hist.innerHTML = "&nbsp;";
          show("0");
          break;
        case "back":
          show(cur.textContent.length > 1 ? cur.textContent.slice(0, -1) : "0");
          break;
        case "neg":
          show(cur.textContent.startsWith("-") ? cur.textContent.slice(1) : "-" + cur.textContent);
          break;
        case "%":
          show(String(parseFloat(cur.textContent) / 100));
          fresh = true;
          break;
        case "+":
        case "-":
        case "*":
        case "/":
          acc = fresh && acc !== null ? acc : parseFloat(cur.textContent);
          op = k;
          hist.textContent = `${acc} ${k}`;
          fresh = true;
          break;
        case "=":
          if (op === null) return;
          const b = parseFloat(cur.textContent);
          const r = compute(acc, b, op);
          hist.textContent = `${acc} ${op} ${b} =`;
          show(String(r));
          acc = null;
          op = null;
          fresh = true;
          break;
      }
    }

    if (pad) {
      pad.addEventListener("click", (e) => {
        const btn = e.target.closest(".calc-btn-item");
        if (btn) press(btn.dataset.k);
      });
    }
  }

  // Multi-Screen Home Launcher (Screen 1 <-> Screen 2)
  function setHomeScreen(pageIdx) {
    PhoneState.currentHomeScreen = Math.max(0, Math.min(1, pageIdx));
    const track = document.getElementById("phone-pages-track");
    if (track) {
      track.style.transform = `translateX(-${PhoneState.currentHomeScreen * 50}%)`;
    }
    document.querySelectorAll(".page-dot").forEach((dot) => {
      const p = parseInt(dot.dataset.page || "0", 10);
      dot.classList.toggle("active", p === PhoneState.currentHomeScreen);
    });
    phoneBeep(520 + PhoneState.currentHomeScreen * 120, 0.04);
  }

  // Media Player on Screen 2
  let mediaPlaying = false;
  let mediaTimer = null;
  const ambientNotes = [220, 261.63, 293.66, 329.63, 392, 440];
  let ambientIdx = 0;

  function toggleMediaPlayer() {
    const btn = document.getElementById("mpe-play-btn");
    const disc = document.getElementById("mpe-disc");
    const status = document.getElementById("mpe-status-text");

    mediaPlaying = !mediaPlaying;
    if (mediaPlaying) {
      if (btn) btn.textContent = "⏸";
      if (disc) disc.classList.add("playing");
      if (status) status.textContent = "Playing: Ambient Synthesizer";

      phoneBeep(440, 0.12);
      mediaTimer = setInterval(() => {
        const freq = ambientNotes[ambientIdx % ambientNotes.length];
        phoneBeep(freq, 0.14);
        ambientIdx = (ambientIdx + 1) % ambientNotes.length;
      }, 480);
    } else {
      if (btn) btn.textContent = "▶";
      if (disc) disc.classList.remove("playing");
      if (status) status.textContent = "Paused - Tap play";
      if (mediaTimer) {
        clearInterval(mediaTimer);
        mediaTimer = null;
      }
      phoneBeep(330, 0.08);
    }
  }

  // Setup Event Listeners
  function setupPhoneEventListeners() {
    // 1. Status bar tap -> open slider
    const sb = document.getElementById("phone-status-bar");
    if (sb) sb.addEventListener("click", () => toggleTopSlider(true));

    const sliderHandle = document.getElementById("phone-slider-handle");
    if (sliderHandle) sliderHandle.addEventListener("click", () => toggleTopSlider(false));

    // 2. Lock screen unlock
    const unlockBtn = document.getElementById("phone-unlock-btn");
    const lockScreen = document.getElementById("phone-lock");
    if (unlockBtn) unlockBtn.addEventListener("click", unlockPhone);
    if (lockScreen) {
      let startY = 0;
      lockScreen.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
      });
      lockScreen.addEventListener("touchend", (e) => {
        if (startY - e.changedTouches[0].clientY > 45) unlockPhone();
      });
      lockScreen.addEventListener("click", (e) => {
        if (!e.target.closest(".lock-action-circle")) unlockPhone();
      });
    }

    // 3. App icons
    document.querySelectorAll(".home-icon-cell[data-app]").forEach((el) => {
      el.addEventListener("click", () => openPhoneApp(el.dataset.app));
    });

    // 4. Search pill
    const searchPill = document.getElementById("phone-search-pill");
    if (searchPill) searchPill.addEventListener("click", () => toggleAppDrawer(true));

    // 5. Drawer pull
    const drawerHint = document.getElementById("phone-drawer-hint");
    if (drawerHint) drawerHint.addEventListener("click", () => toggleAppDrawer(true));

    // 6. Drawer list items
    document.querySelectorAll(".drawer-app-item[data-app]").forEach((el) => {
      el.addEventListener("click", () => openPhoneApp(el.dataset.app));
    });

    const drawerInput = document.getElementById("drawer-search-input");
    if (drawerInput) {
      drawerInput.addEventListener("input", () => filterAppDrawer(drawerInput.value));
    }

    // 7. App screen back
    const appBack = document.getElementById("p-app-back");
    if (appBack) appBack.addEventListener("click", closeActivePhoneApp);

    // 8. Bottom Nav 3 buttons
    const navBack = document.getElementById("p-nav-back");
    const navHome = document.getElementById("p-nav-home");
    const navRecents = document.getElementById("p-nav-recents");

    if (navBack) {
      navBack.addEventListener("click", () => {
        if (PhoneState.sliderOpen) toggleTopSlider(false);
        else if (PhoneState.drawerOpen) toggleAppDrawer(false);
        else if (PhoneState.recentsOpen) toggleRecents(false);
        else if (PhoneState.activeApp) closeActivePhoneApp();
        else phoneBeep(380, 0.03);
      });
    }

    if (navHome) {
      navHome.addEventListener("click", () => {
        toggleTopSlider(false);
        toggleAppDrawer(false);
        toggleRecents(false);
        closeActivePhoneApp();
        setHomeScreen(0);
      });
    }

    if (navRecents) {
      navRecents.addEventListener("click", () => toggleRecents());
    }

    const clearRecents = document.getElementById("phone-recents-clear");
    if (clearRecents) {
      clearRecents.addEventListener("click", () => {
        PhoneState.recentApps = [];
        renderRecents();
        setTimeout(() => toggleRecents(false), 200);
      });
    }

    // 9. Quick settings toggles
    const qsWifi = document.getElementById("p-qs-wifi");
    const qsBt = document.getElementById("p-qs-bt");
    const qsDark = document.getElementById("p-qs-dark");
    const qsTorch = document.getElementById("p-qs-torch");
    const qsSound = document.getElementById("p-qs-sound");
    const qsAir = document.getElementById("p-qs-air");

    if (qsWifi) qsWifi.addEventListener("click", () => qsWifi.classList.toggle("qs-on"));
    if (qsBt) qsBt.addEventListener("click", () => qsBt.classList.toggle("qs-on"));
    if (qsDark) qsDark.addEventListener("click", () => qsDark.classList.toggle("qs-on"));
    if (qsAir) qsAir.addEventListener("click", () => qsAir.classList.toggle("qs-on"));

    if (qsTorch) {
      qsTorch.addEventListener("click", () => {
        PhoneState.flashlightOn = !PhoneState.flashlightOn;
        qsTorch.classList.toggle("qs-on", PhoneState.flashlightOn);
        const container = document.getElementById("phone-container");
        if (container) {
          container.style.boxShadow = PhoneState.flashlightOn ? "0 0 100px 30px #ffffff" : "";
        }
      });
    }

    if (qsSound) {
      qsSound.addEventListener("click", () => {
        qsSound.classList.toggle("qs-on");
        if (typeof SND_ON !== "undefined") {
          SND_ON = !SND_ON;
        }
      });
    }

    const bright = document.getElementById("phone-brightness-slider");
    if (bright) {
      bright.addEventListener("input", () => {
        const phone = document.getElementById("phone-container");
        if (phone) phone.style.filter = `brightness(${bright.value}%)`;
      });
    }

    document.querySelectorAll(".slider-notif-row[data-open-app]").forEach((el) => {
      el.addEventListener("click", () => openPhoneApp(el.dataset.openApp));
    });

    const clearNotifs = document.getElementById("clear-phone-notifs");
    if (clearNotifs) {
      clearNotifs.addEventListener("click", () => {
        const list = document.querySelector(".slider-notifs-scroller");
        if (list) list.innerHTML = `<div style="text-align:center;color:var(--phone-muted);font-size:12px;padding:16px;">All notifications cleared</div>`;
      });
    }

    // 10. Multi-Page Swipe Gesture (Screen 1 <-> Screen 2)
    const pagesViewport = document.getElementById("phone-pages-viewport");
    if (pagesViewport) {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;
      let isSwiping = false;

      pagesViewport.addEventListener("touchstart", (e) => {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchEndX = touchStartX;
          touchEndY = touchStartY;
          isSwiping = true;
        }
      }, { passive: true });

      pagesViewport.addEventListener("touchmove", (e) => {
        if (!isSwiping || !e.touches || e.touches.length !== 1) return;
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
      }, { passive: true });

      pagesViewport.addEventListener("touchend", () => {
        if (!isSwiping) return;
        isSwiping = false;
        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;

        // Distinct horizontal swipe
        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
          if (deltaX > 0) {
            // Swiped left -> advance to screen 2
            setHomeScreen(1);
          } else {
            // Swiped right -> return to screen 1
            setHomeScreen(0);
          }
        }
      }, { passive: true });

      // Mouse drag support for desktop inspection
      let mouseStartX = 0;
      let mouseStartY = 0;
      let isMouseDown = false;

      pagesViewport.addEventListener("mousedown", (e) => {
        if (e.target.closest("button, input, a, .home-icon-cell, .hsp-glyph, .hsp-mic, .page-dot")) return;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        isMouseDown = true;
      });

      window.addEventListener("mouseup", (e) => {
        if (!isMouseDown) return;
        isMouseDown = false;
        const deltaX = mouseStartX - e.clientX;
        const deltaY = mouseStartY - e.clientY;
        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
          if (deltaX > 0) {
            setHomeScreen(1);
          } else {
            setHomeScreen(0);
          }
        }
      });
    }

    // Keyboard navigation between home screens
    window.addEventListener("keydown", (e) => {
      if (!PhoneState.isPhoneMode || PhoneState.activeApp || PhoneState.drawerOpen || PhoneState.sliderOpen) return;
      if (e.key === "ArrowLeft") {
        setHomeScreen(1);
      } else if (e.key === "ArrowRight") {
        setHomeScreen(0);
      }
    });

    // Pagination indicator dots
    document.querySelectorAll(".page-dot[data-page]").forEach((dot) => {
      dot.addEventListener("click", () => {
        const pageIdx = parseInt(dot.dataset.page || "0", 10);
        setHomeScreen(pageIdx);
      });
    });

    // Media Player on Screen 2
    const playBtn = document.getElementById("mpe-play-btn");
    if (playBtn) {
      playBtn.addEventListener("click", toggleMediaPlayer);
    }
  }

  // Export to window
  window.PhoneState = PhoneState;
  window.openPhoneApp = openPhoneApp;
  window.closeActivePhoneApp = closeActivePhoneApp;
  window.toggleTopSlider = toggleTopSlider;
  window.toggleAppDrawer = toggleAppDrawer;
  window.toggleRecents = toggleRecents;
  window.setHomeScreen = setHomeScreen;
  window.toggleMediaPlayer = toggleMediaPlayer;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPhoneOS);
  } else {
    initPhoneOS();
  }
})();
