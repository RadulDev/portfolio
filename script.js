(() => {
  "use strict";
  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else n.setAttribute(k, v);
    }
    kids.flat().forEach(k => k != null && k !== "" && n.append(k));
    return n;
  };
  const has = a => Array.isArray(a) && a.length > 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const external = url => /^https?:/.test(url) ? { target: "_blank", rel: "noopener" } : {};
  const P = D.person;

  /* ---------- Meta ---------- */
  document.title = D.meta.title || P.name;
  $('meta[name="description"]').setAttribute("content", D.meta.description || "");

  /* ---------- Hero ---------- */
  $("#mark-name").textContent = P.name;
  const nameEl = $("#name");
  nameEl.setAttribute("aria-label", P.name);
  let ci = 0;
  P.name.split(" ").forEach((word, wi) => {
    const wEl = el("span", { class: "word", "aria-hidden": "true" });
    [...word].forEach(c => { const s = el("span", { class: "ch" }, c); s.style.setProperty("--i", ci++); wEl.append(s); });
    nameEl.append(wEl);
    if (wi < P.name.split(" ").length - 1) nameEl.append(" ");
  });
  if (!reduced) {
    nameEl.classList.add("intro-anim");
    requestAnimationFrame(() => requestAnimationFrame(() => nameEl.classList.add("ready")));
  }
  const hl = $("#headline");
  hl.append(P.headline);
  if (P.location) hl.append(el("span", { class: "loc", text: ", " + P.location }));
  $("#intro").textContent = P.intro;
  if (P.status) { const st = $("#status"); st.hidden = false; st.lastElementChild.textContent = P.status; }

  const cta = $("#hero-cta");
  cta.append(el("a", { class: "btn primary", href: "#contact" }, "Get in touch"));
  if (P.resume) cta.append(el("a", { class: "btn", href: P.resume, download: "" }, "Download CV"));
  if (has(D.publications)) cta.append(el("a", { class: "btn", href: "#publications" }, "Read my papers"));
  (P.links || []).slice(0, 2).forEach(l => cta.append(el("a", { class: "btn", href: l.url, ...external(l.url) }, l.label)));

  if (has(D.highlights)) D.highlights.forEach(h => $("#highlights").append(el("div", {}, el("dt", { text: h.value }), el("dd", { text: h.label }))));
  else $("#highlights").remove();

  /* ---------- About ---------- */
  (P.about || []).forEach(p => $("#about-text").append(el("p", { text: p })));
  if (P.photo) { const f = $("#portrait"); f.hidden = false; f.append(el("img", { src: P.photo, alt: "Portrait of " + P.name, loading: "lazy" })); }
  if (has(D.languages)) D.languages.forEach(l => $("#lang-list").append(el("li", {}, el("span", { class: "t", text: l.name }), el("span", { class: "s", text: l.level }))));
  else $("#lang-wrap").remove();

  /* ---------- Research panels ---------- */
  const viz = [];
  if (has(D.research) && window.BioViz) {
    D.research.forEach(r => {
      const canvas = el("canvas", { role: "img", "aria-label": `Interactive illustration: ${r.title}`, class: r.visual === "spectrum" ? "" : "drag" });
      const readout = el("p", { class: "readout", "aria-live": "polite" });
      $("#research-list").append(el("article", { class: "panel" }, canvas,
        el("div", { class: "panel-body" }, el("h3", { text: r.title }), el("p", { text: r.text }), readout)));
      if (BioViz[r.visual]) viz.push(BioViz[r.visual](canvas, readout));
    });
  } else $("#research").remove();

  if (window.BioViz) BioViz.helix($("#helix"), [$("#hud-bp"), $("#hud-pair"), $("#hud-rise")]);

  /* ---------- Experience ---------- */
  const months = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
  const parse = s => {
    if (!s || /present/i.test(s)) return new Date();
    const m = s.trim().match(/^([a-z]{3})[a-z]*\.?\s+(\d{4})$/i);
    if (m) return new Date(+m[2], months[m[1].toLowerCase()] ?? 0);
    const y = s.match(/\d{4}/); return y ? new Date(+y[0], 0) : null;
  };
  const duration = (a, b) => {
    const s = parse(a), e = parse(b); if (!s || !e) return "";
    const n = (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth() + 1;
    if (n < 1) return "";
    const y = Math.floor(n / 12), m = n % 12;
    return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo`].filter(Boolean).join(" ");
  };
  if (has(D.experience)) {
    D.experience.forEach(j => {
      const meta = [j.type, j.location].filter(Boolean).join(", ");
      $("#timeline").append(el("li", { class: "job" + (/present/i.test(j.end || "") ? " current" : "") },
        el("div", { class: "job-when" }, `${j.start} – ${j.end}`, el("span", { class: "dur", text: duration(j.start, j.end) })),
        el("div", { class: "job-body" },
          el("h3", { class: "job-role", text: j.role }),
          el("p", { class: "job-co" }, el("strong", { text: j.company }), meta ? ", " + meta : ""),
          j.summary ? el("p", { class: "job-sum", text: j.summary }) : null,
          has(j.points) ? el("ul", {}, j.points.map(p => el("li", { text: p }))) : null,
          has(j.stack) ? el("ul", { class: "stack", "aria-label": "Areas and tools" }, j.stack.map(s => el("li", { text: s }))) : null
        )));
    });
  } else $("#experience").remove();

  /* ---------- Publications (static list + live ORCID sync) ---------- */
  const me = [].concat(D.highlightAuthor || P.name);
  const normDoi = d => (d || "").toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, "").trim();
  const normTitle = t => (t || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
  const yearOf = d => +((d || "").match(/\d{4}/) || [0])[0];
  let pubs = (D.publications || []).slice();

  const authorsNode = text => {
    const p = el("p", { class: "pub-authors" });
    if (!text) return null;
    const re = new RegExp(`(${me.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
    text.split(re).forEach(part => p.append(me.includes(part) ? el("strong", { text: part }) : part));
    return p;
  };
  const renderPubs = () => {
    const list = $("#pub-list"); list.replaceChildren();
    pubs.forEach((pb, i) => {
      const url = pb.url || (pb.doi ? "https://doi.org/" + pb.doi : "");
      list.append(el("li", { class: "pub", id: "pub-" + i },
        el("div", { class: "pub-date", text: pb.date || "" }),
        el("div", {},
          url ? el("a", { class: "pub-title", href: url, ...external(url) }, pb.title) : el("p", { class: "pub-title", text: pb.title }),
          authorsNode(pb.authors),
          el("p", { class: "pub-venue" },
            pb.venue ? el("em", { text: pb.venue }) : null,
            pb.doi ? el("span", { class: "doi", text: "doi:" + pb.doi }) : null,
            pb.note ? el("span", { class: "badge", text: pb.note }) : null,
            pb.fromOrcid ? el("span", { class: "badge new", text: "New via ORCID" }) : null)
        )));
    });
    const meta = $("#pub-meta"); meta.replaceChildren(`${pubs.length} papers`);
    if (D.scholar) meta.append(" · ", el("a", { href: D.scholar, ...external(D.scholar) }, "Google Scholar"));
    if (D.orcid) meta.append(" · ", el("a", { href: "https://orcid.org/" + D.orcid, ...external("https:") }, "ORCID"));
    document.querySelectorAll("#highlights div").forEach(d => { if (/publication/i.test(d.querySelector("dd").textContent)) d.querySelector("dt").textContent = pubs.length; });
  };

  async function syncOrcid() {
    if (!D.orcid || !window.fetch) return;
    const sync = $("#pub-sync");
    try {
      const ctrl = new AbortController(); setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(`https://pub.orcid.org/v3.0/${D.orcid}/works`, { headers: { Accept: "application/json" }, signal: ctrl.signal });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const known = new Set(pubs.map(p => normDoi(p.doi)).filter(Boolean));
      const knownT = new Set(pubs.map(p => normTitle(p.title)));
      let added = 0;
      (data.group || []).forEach(g => {
        const w = g["work-summary"] && g["work-summary"][0]; if (!w) return;
        const ids = (w["external-ids"] && w["external-ids"]["external-id"]) || [];
        const doi = normDoi((ids.find(x => x["external-id-type"] === "doi") || {})["external-id-value"]);
        const title = w.title && w.title.title && w.title.title.value;
        if (!title || (doi && known.has(doi)) || knownT.has(normTitle(title))) return;
        const pd = w["publication-date"] || {};
        const mo = pd.month && pd.month.value ? new Date(2000, +pd.month.value - 1).toLocaleString("en", { month: "short" }) + " " : "";
        pubs.push({ title, authors: "", venue: (w["journal-title"] && w["journal-title"].value) || "", date: pd.year ? mo + pd.year.value : "", doi, url: w.url && w.url.value, fromOrcid: true });
        added++;
      });
      if (added) {
        pubs.sort((a, b) => yearOf(b.date) - yearOf(a.date));
        renderPubs(); buildIndex();
      }
      sync.textContent = `Synced with ORCID ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` + (added ? `, ${added} new` : "");
    } catch (e) {
      sync.textContent = "";
    }
  }
  if (has(pubs) || D.orcid) { renderPubs(); syncOrcid(); } else $("#publications").remove();

  /* ---------- Projects ---------- */
  if (has(D.projects)) {
    D.projects.forEach((p, i) => {
      const id = "proj-" + i, li = el("li", { class: "proj", id: "p-" + i });
      const btn = el("button", { class: "proj-head", "aria-expanded": "false", "aria-controls": id, type: "button" },
        el("span", { class: "proj-name" }, p.name, el("span", { class: "proj-tag", text: p.tagline })),
        el("span", { class: "proj-year", text: p.year || "" }),
        el("span", { class: "proj-icon", "aria-hidden": "true" }));
      const panel = el("div", { class: "proj-panel", id, role: "region" }, el("div", {}, el("div", { class: "proj-inner" },
        el("p", { text: p.details }),
        has(p.stack) ? el("ul", { class: "stack" }, p.stack.map(s => el("li", { text: s }))) : null,
        has(p.links) ? el("div", { class: "proj-links" }, p.links.map(l => el("a", { href: l.url, ...external(l.url) }, l.label))) : null)));
      btn.addEventListener("click", () => btn.setAttribute("aria-expanded", li.classList.toggle("open")));
      li.append(btn, panel); $("#project-list").append(li);
    });
  } else $("#projects").remove();

  /* ---------- Skills ---------- */
  if (has(D.skills)) {
    const groups = $("#skill-groups"), filter = $("#skill-filter"), btns = [];
    const set = g => {
      btns.forEach(b => b.setAttribute("aria-pressed", b.dataset.g === g));
      groups.classList.toggle("filtered", g !== "*");
      groups.querySelectorAll(".skill-group").forEach(n => n.classList.toggle("on", n.dataset.g === g));
    };
    ["*", ...D.skills.map(s => s.group)].forEach(g => {
      const b = el("button", { type: "button", "data-g": g, "aria-pressed": String(g === "*") }, g === "*" ? "All" : g);
      b.addEventListener("click", () => set(g)); btns.push(b); filter.append(b);
    });
    D.skills.forEach(s => groups.append(el("div", { class: "skill-group", "data-g": s.group }, el("h3", { text: s.group }), el("ul", {}, s.items.map(i => el("li", { text: i }))))));
  } else $("#skills").remove();

  /* ---------- Education ---------- */
  if (has(D.education)) {
    D.education.forEach(e => $("#edu-list").append(el("li", {},
      el("div", { class: "when", text: [e.start, e.end].filter(Boolean).join(" – ") }),
      el("div", {}, el("p", { class: "deg", text: e.degree }), el("p", { class: "sch", text: e.school }), e.note ? el("p", { class: "sch", text: e.note }) : null))));
  } else $("#education").remove();

  /* ---------- Credentials ---------- */
  if (has(D.certifications)) {
    D.certifications.forEach(c => $("#cert-list").append(el("li", {},
      c.url ? el("a", { class: "t", href: c.url, ...external(c.url) }, c.name) : el("span", { class: "t", text: c.name }),
      c.issuer ? el("span", { class: "s", text: c.issuer }) : null,
      el("span", { class: "y", text: c.date ? "Issued " + c.date : "" }))));
  } else $("#credentials").remove();

  /* ---------- Contact ---------- */
  const emailBtn = $("#email");
  emailBtn.textContent = P.email;
  emailBtn.setAttribute("aria-label", `Copy email address ${P.email}`);
  emailBtn.addEventListener("click", async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(P.email); ok = true; } catch (e) {}
    if (!ok) { location.href = "mailto:" + P.email; return; }
    $("#copied").textContent = "Email address copied.";
    setTimeout(() => ($("#copied").textContent = ""), 2600);
  });
  $("#contact-links").append(el("li", {}, el("a", { class: "btn primary", href: "mailto:" + P.email }, "Open in mail app")));
  (P.links || []).forEach(l => $("#contact-links").append(el("li", {}, el("a", { class: "btn", href: l.url, ...external(l.url) }, l.label))));
  if (D.scholar) $("#contact-links").append(el("li", {}, el("a", { class: "btn", href: D.scholar, ...external(D.scholar) }, "Google Scholar")));
  $("#foot-text").textContent = `© ${new Date().getFullYear()} ${P.name}`;

  /* ---------- Rail + scroll spy ---------- */
  const sections = [...document.querySelectorAll("section.block")];
  const railLinks = sections.map(s => { const a = el("a", { href: "#" + s.id, text: s.dataset.title }); $("#rail-list").append(el("li", {}, a)); return a; });
  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) railLinks.forEach(a => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + en.target.id)));
  }), { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => spy.observe(s));

  const bar = $(".progress span"), top = $(".topbar");
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    top.classList.toggle("scrolled", scrollY > 8);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Theme ---------- */
  const setMetaColor = () => $('meta[name="theme-color"]').setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
  $(".theme").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    setMetaColor(); field.recolor(); window.BioViz && BioViz.refresh();
  });

  /* ---------- Name: weight follows the pointer ---------- */
  const chars = [...nameEl.querySelectorAll(".ch")];
  const shapeName = (x, y) => chars.forEach(c => {
    const r = c.getBoundingClientRect();
    const t = Math.max(0, 1 - Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) / 280);
    c.style.setProperty("--w", Math.round(300 + t * 500));
    c.classList.toggle("hot", t > 0.55);
  });
  const resetName = () => chars.forEach(c => { c.style.removeProperty("--w"); c.classList.remove("hot"); });

  /* ---------- Background dot field ---------- */
  const field = (() => {
    const cv = $("#field"), ctx = cv.getContext("2d");
    let w, h, color, accent, mx = -9999, my = -9999, raf = 0;
    const gap = 30;
    function draw() {
      if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const off = (scrollY * 0.15) % gap;
      for (let y = -off; y < h + gap; y += gap) for (let x = gap / 2; x < w; x += gap) {
        const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy), t = Math.max(0, 1 - d / 170);
        ctx.fillStyle = t > 0.05 ? accent : color;
        ctx.globalAlpha = t > 0.05 ? 0.25 + t * 0.6 : 0.8;
        ctx.beginPath(); ctx.arc(x + (d ? dx / d : 0) * t * 12, y + (d ? dy / d : 0) * t * 12, 1 + t * 1.2, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    const size = () => { const dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(); };
    const recolor = () => { const cs = getComputedStyle(document.documentElement); color = cs.getPropertyValue("--dot").trim(); accent = cs.getPropertyValue("--accent").trim(); draw(); };
    const queue = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); }); };
    addEventListener("resize", size); addEventListener("scroll", queue, { passive: true });
    if (!reduced && matchMedia("(pointer: fine)").matches) {
      let nameRaf = 0;
      addEventListener("pointermove", e => {
        mx = e.clientX; my = e.clientY; queue();
        if (!nameRaf) nameRaf = requestAnimationFrame(() => { nameRaf = 0; shapeName(mx, my); });
      }, { passive: true });
      document.addEventListener("pointerleave", () => { mx = my = -9999; queue(); resetName(); });
    }
    recolor(); size();
    return { recolor };
  })();
  setMetaColor();

  /* ---------- Command palette ---------- */
  const dlg = $("#cmd"), input = $("#cmd-input"), list = $("#cmd-results");
  $("#kbd-hint").textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Ctrl K";
  let index = [];
  function buildIndex() {
    index = [
      ...sections.map(s => ({ label: s.dataset.title, kind: "Section", go: () => s.scrollIntoView() })),
      ...pubs.map((p, i) => ({ label: p.title, kind: "Paper", go: () => $("#pub-" + i)?.scrollIntoView({ block: "center" }) })),
      ...(D.experience || []).map((j, i) => ({ label: `${j.role}, ${j.company}`, kind: "Role", go: () => $("#timeline").children[i]?.scrollIntoView({ block: "center" }) })),
      ...(D.projects || []).map((p, i) => ({ label: p.name, kind: "Project", go: () => {
        const li = $("#p-" + i); if (!li) return;
        if (!li.classList.contains("open")) li.querySelector(".proj-head").click();
        li.scrollIntoView({ block: "center" });
      } })),
      ...(D.skills || []).flatMap(g => g.items.map(s => ({ label: s, kind: g.group, go: () => { $("#skills").scrollIntoView(); $(`#skill-filter [data-g="${CSS.escape(g.group)}"]`)?.click(); } }))),
      { label: "Copy email address", kind: "Action", go: () => emailBtn.click() },
      { label: "Switch theme", kind: "Action", go: () => $(".theme").click() }
    ];
  }
  buildIndex();
  let results = [], sel = 0;
  const render = () => {
    const q = input.value.trim().toLowerCase();
    results = index.filter(r => !q || r.label.toLowerCase().includes(q) || r.kind.toLowerCase().includes(q)).slice(0, 40);
    sel = Math.min(sel, Math.max(0, results.length - 1));
    list.replaceChildren(...(results.length ? results.map((r, i) => {
      const li = el("li", { role: "option", "aria-selected": String(i === sel) }, el("span", { text: r.label }), el("span", { class: "k", text: r.kind }));
      li.addEventListener("click", () => run(i));
      li.addEventListener("mousemove", () => { if (sel !== i) { sel = i; render(); } });
      return li;
    }) : [el("li", { class: "empty", text: "Nothing matches. Try a section name, a paper or a skill." })]));
    list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  };
  const open = () => { input.value = ""; sel = 0; render(); dlg.showModal(); input.focus(); };
  const run = i => { const r = results[i]; dlg.close(); if (r) setTimeout(r.go, 10); };
  $(".cmd-open").addEventListener("click", open);
  input.addEventListener("input", () => { sel = 0; render(); });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { sel = Math.min(sel + 1, results.length - 1); render(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
    else if (e.key === "Enter") { e.preventDefault(); run(sel); }
  });
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); dlg.open ? dlg.close() : open(); }
    else if (e.key === "/" && !dlg.open && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
  });
})();
