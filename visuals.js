/* Interactive bioinformatics visuals, drawn on <canvas> with no libraries.
   BioViz.helix(canvas, hud) · BioViz.spectrum / molecule / genome(canvas, readoutEl) */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stages = [];
  let C = {};
  const readColors = () => {
    const cs = getComputedStyle(document.documentElement);
    const g = n => cs.getPropertyValue(n).trim();
    C = { ink: g("--ink"), muted: g("--muted"), line: g("--line"), a: g("--accent"), b: g("--accent-2"), bg: g("--bg-2"), dark: document.documentElement.dataset.theme !== "light" };
  };
  readColors();

  const hexA = (hex, a) => {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    const n = parseInt(h, 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  };
  // Deterministic pseudo-random + smooth 1D noise
  const rand = s => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const noise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return rand(i) * (1 - u) + rand(i + 1) * u; };

  /* ---------- Shared stage: DPR, resize, visibility, pointer, loop ---------- */
  function stage(canvas, opts) {
    const ctx = canvas.getContext("2d");
    const st = { canvas, ctx, w: 0, h: 0, t: 0, visible: false, px: null, py: null, dragging: false, dx: 0, dy: 0, vx: 0, vy: 0, raf: 0, last: 0, opts };
    const size = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      st.w = r.width; st.h = r.height;
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      frame(performance.now(), true);
    };
    function frame(now, once) {
      const dt = Math.min(0.05, (now - (st.last || now)) / 1000); st.last = now;
      if (!once || !st.t) st.t += dt;
      if (!st.dragging) { st.vx *= 0.94; st.vy *= 0.94; st.dx += st.vx; st.dy += st.vy; }
      ctx.clearRect(0, 0, st.w, st.h);
      opts.draw(st, dt);
      if (!once) loop();
    }
    const loop = () => {
      st.raf = 0;
      const wantsMotion = !reduced || st.dragging || Math.abs(st.vx) > 1e-4 || (opts.settling && opts.settling(st));
      if (st.visible && wantsMotion) st.raf = requestAnimationFrame(frame);
    };
    st.kick = () => { if (!st.raf && st.visible) { st.last = performance.now(); st.raf = requestAnimationFrame(frame); } else if (!st.visible) frame(performance.now(), true); };
    st.redraw = () => frame(performance.now(), true);

    new ResizeObserver(size).observe(canvas);
    new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; if (st.visible) st.kick(); }, { rootMargin: "80px" }).observe(canvas);

    const pos = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    canvas.addEventListener("pointermove", e => {
      const [x, y] = pos(e);
      if (st.dragging && opts.drag) { const ddx = (x - st.px) * 0.01, ddy = (y - st.py) * 0.01; st.dx += ddx; st.dy += ddy; st.vx = ddx; st.vy = ddy; }
      st.px = x; st.py = y; if (reduced) st.redraw(); else st.kick();
    });
    canvas.addEventListener("pointerleave", () => { st.px = st.py = null; st.dragging = false; st.redraw(); opts.leave && opts.leave(st); });
    if (opts.drag) {
      canvas.addEventListener("pointerdown", e => { st.dragging = true; [st.px, st.py] = pos(e); canvas.setPointerCapture(e.pointerId); st.kick(); });
      const up = () => { st.dragging = false; };
      canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
    }
    stages.push(st);
    return st;
  }

  /* ---------- DNA double helix ---------- */
  function helix(canvas, hud) {
    const seq = "ATGCGTACCGGATTCAGCTAGCTTGACA";
    const comp = { A: "T", T: "A", G: "C", C: "G" };
    const N = seq.length, TWIST = (2 * Math.PI) / 10.5, GROOVE = Math.PI * 0.78, SUB = 5;
    const particles = Array.from({ length: 46 }, (_, i) => ({ a: rand(i) * 6.283, r: 1.6 + rand(i + 50) * 1.6, y: rand(i + 99) * 2 - 1, s: 0.2 + rand(i + 7) * 0.5 }));
    let hovered = -1;

    const st = stage(canvas, {
      drag: true,
      leave: () => setHud(-1),
      draw(st) {
        const { ctx, w, h, t } = st;
        const rotY = (reduced ? 0.6 : t * 0.35) + st.dx;
        const tilt = Math.max(-0.6, Math.min(0.6, 0.32 + st.dy * 0.5));
        const H = h * 0.86, unit = H / (N - 1), R = Math.min(w * 0.2, unit * 3.4);
        const cx = w / 2, cy = h / 2, D = R * 9;
        const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
        const P = (ang, yy) => {
          const x = R * Math.cos(ang), z = R * Math.sin(ang), y = yy;
          const y2 = y * cosT - z * sinT, z2 = y * sinT + z * cosT;
          const s = D / (D + z2);
          return { x: cx + x * s, y: cy + y2 * s, z: z2, s };
        };
        const yAt = i => (i - (N - 1) / 2) * unit;
        const angA = i => i * TWIST + rotY, angB = i => i * TWIST + rotY + GROOVE;

        const items = [];
        // particles (solvent ions)
        particles.forEach((p, k) => {
          const a = p.a + t * 0.08 * (k % 2 ? 1 : -1) + rotY * 0.4;
          const q = P(a, p.y * H * 0.55); q.x = cx + (q.x - cx) * p.r;
          items.push({ z: q.z * p.r, f: () => { ctx.fillStyle = hexA(k % 3 ? C.a : C.b, 0.25 * p.s + (q.z < 0 ? 0.15 : 0)); ctx.beginPath(); ctx.arc(q.x, q.y, 1.2 * q.s, 0, 6.283); ctx.fill(); } });
        });
        // backbones
        [angA, angB].forEach((ang, sIdx) => {
          const col = sIdx ? C.b : C.a;
          for (let i = 0; i < N - 1; i++) for (let k = 0; k < SUB; k++) {
            const f0 = i + k / SUB, f1 = i + (k + 1) / SUB;
            const p0 = P(ang(f0), yAt(f0)), p1 = P(ang(f1), yAt(f1));
            const z = (p0.z + p1.z) / 2, depth = 0.5 - z / (2 * R);
            items.push({ z, f: () => {
              ctx.strokeStyle = hexA(col, 0.25 + depth * 0.75); ctx.lineWidth = 2.2 + depth * 2.6; ctx.lineCap = "round";
              ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
            } });
          }
        });
        // base pairs + nucleotides
        const mids = [];
        for (let i = 0; i < N; i++) {
          const a = P(angA(i), yAt(i)), b = P(angB(i), yAt(i));
          const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; mids.push(m);
          const gc = seq[i] === "G" || seq[i] === "C";
          const col = gc ? C.b : C.a;
          const z = (a.z + b.z) / 2, depth = 0.5 - z / (2 * R), hot = i === hovered;
          items.push({ z: z + 0.01, f: () => {
            ctx.lineCap = "round";
            ctx.strokeStyle = hot ? C.ink : hexA(col, 0.18 + depth * 0.6); ctx.lineWidth = hot ? 3 : 1.4 + depth * 1.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(m.x - (m.x - a.x) * 0.08, m.y - (m.y - a.y) * 0.08); ctx.stroke();
            ctx.strokeStyle = hot ? C.ink : hexA(col, 0.1 + depth * 0.45);
            ctx.beginPath(); ctx.moveTo(m.x + (b.x - m.x) * 0.08, m.y + (b.y - m.y) * 0.08); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (hot) { ctx.shadowColor = col; ctx.shadowBlur = 16; }
          } });
          [[a, C.a], [b, C.b]].forEach(([p, c]) => items.push({ z: p.z - 0.01, f: () => {
            const d = 0.5 - p.z / (2 * R);
            ctx.shadowBlur = 0;
            ctx.fillStyle = hexA(c, 0.35 + d * 0.65);
            ctx.beginPath(); ctx.arc(p.x, p.y, (2.4 + d * 3) * (hot ? 1.4 : 1), 0, 6.283); ctx.fill();
            if (C.dark && d > 0.7) { ctx.fillStyle = hexA("#ffffff", (d - 0.7) * 1.4); ctx.beginPath(); ctx.arc(p.x - 1, p.y - 1, 1.2, 0, 6.283); ctx.fill(); }
          } }));
        }
        items.sort((p, q) => q.z - p.z).forEach(it => it.f());
        ctx.shadowBlur = 0;

        // hover detection
        let best = -1, bd = 22;
        if (st.px != null && !st.dragging) mids.forEach((m, i) => { const d = Math.hypot(m.x - st.px, m.y - st.py); if (d < bd) { bd = d; best = i; } });
        if (best !== hovered) { hovered = best; setHud(best); }
        if (hovered >= 0) {
          const m = mids[hovered];
          ctx.strokeStyle = hexA(C.ink, 0.5); ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
          ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(w - 8, m.y); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = C.ink; ctx.font = "500 11px 'JetBrains Mono', monospace"; ctx.textAlign = "right";
          ctx.fillText(`${seq[hovered]}–${comp[seq[hovered]]}`, w - 8, m.y - 6);
        }
      }
    });
    function setHud(i) {
      if (!hud) return;
      const [bp, pair, rise] = hud;
      if (i < 0) { bp.textContent = `${N} bp`; pair.textContent = "B-DNA"; rise.textContent = "3.4 Å / 36°"; return; }
      bp.textContent = `${String(i + 1).padStart(2, "0")} / ${N}`;
      const gc = seq[i] === "G" || seq[i] === "C";
      pair.textContent = `${seq[i]}–${comp[seq[i]]}, ${gc ? 3 : 2} H-bonds`;
      rise.textContent = `${(i * 3.4).toFixed(1)} Å`;
    }
    setHud(-1);
    return st;
  }

  /* ---------- Mass spectrum ---------- */
  function spectrum(canvas, out) {
    const peaks = [];
    for (let i = 0; i < 64; i++) {
      const mz = 150 + rand(i * 3.1) * 1450;
      let inten = Math.pow(rand(i * 7.7), 3.2);
      peaks.push({ mz, i: inten });
    }
    [[428.24, .72], [587.31, .58], [742.38, 1], [913.47, .46], [1126.55, .38], [1289.62, .3]].forEach(([mz, i]) => peaks.push({ mz, i, key: true }));
    // isotope envelopes for key peaks
    peaks.filter(p => p.key).forEach(p => { peaks.push({ mz: p.mz + 1.003, i: p.i * .55 }); peaks.push({ mz: p.mz + 2.006, i: p.i * .2 }); });
    peaks.sort((a, b) => a.mz - b.mz);
    let grow = reduced ? 1 : 0, hov = -1;
    const st = stage(canvas, {
      settling: () => grow < 1,
      leave: () => { hov = -1; out && (out.textContent = "Hover a peak to read m/z"); },
      draw(st, dt) {
        const { ctx, w, h, t } = st;
        if (st.visible && grow < 1) grow = Math.min(1, grow + dt * 0.9);
        const L = 34, Rr = 12, T = 22, B = 28, pw = w - L - Rr, ph = h - T - B;
        const X = mz => L + (mz - 140) / 1480 * pw, Y = v => T + ph * (1 - v);
        // grid + axes
        ctx.strokeStyle = hexA(C.muted, 0.18); ctx.lineWidth = 1;
        for (let g = 0; g <= 4; g++) { const y = Y(g / 4); ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(w - Rr, y); ctx.stroke(); }
        ctx.fillStyle = C.muted; ctx.font = "10px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
        for (let m = 200; m <= 1600; m += 300) ctx.fillText(m, X(m), h - 10);
        ctx.textAlign = "right"; ctx.fillText("100", L - 6, Y(1) + 3); ctx.fillText("0", L - 6, Y(0) + 3);
        ctx.textAlign = "left"; ctx.fillText("m/z", w - Rr - 22, h - 10);
        // peaks
        const e = 1 - Math.pow(1 - grow, 3);
        let best = -1, bd = 10;
        if (st.px != null) peaks.forEach((p, k) => { const d = Math.abs(X(p.mz) - st.px); if (d < bd && p.i > 0.04) { bd = d; best = k; } });
        hov = best;
        peaks.forEach((p, k) => {
          const x = X(p.mz), y = Y(p.i * e * 0.92);
          const on = k === hov;
          ctx.strokeStyle = on ? C.ink : p.key ? C.a : hexA(C.a, 0.45);
          ctx.lineWidth = on ? 2.4 : p.key ? 1.8 : 1.1;
          ctx.beginPath(); ctx.moveTo(x, Y(0)); ctx.lineTo(x, y); ctx.stroke();
          if (p.key && e > 0.95) { ctx.fillStyle = hexA(C.ink, 0.8); ctx.textAlign = "center"; ctx.fillText(p.mz.toFixed(2), x, y - 6); }
        });
        // scan line
        if (!reduced) {
          const sx = L + ((t * 0.18) % 1) * pw;
          const g = ctx.createLinearGradient(sx - 40, 0, sx, 0);
          g.addColorStop(0, hexA(C.b, 0)); g.addColorStop(1, hexA(C.b, 0.22));
          ctx.fillStyle = g; ctx.fillRect(sx - 40, T, 40, ph);
          ctx.strokeStyle = hexA(C.b, 0.7); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx, T); ctx.lineTo(sx, Y(0)); ctx.stroke();
        }
        if (hov >= 0 && out) { const p = peaks[hov]; out.textContent = `m/z ${p.mz.toFixed(3)} · relative intensity ${Math.round(p.i * 100)}%`; }
      }
    });
    out && (out.textContent = "Hover a peak to read m/z");
    return st;
  }

  /* ---------- Ligand in binding pocket ---------- */
  function molecule(canvas, out) {
    // Small drug-like scaffold: phenyl – amide – pyridine with a hydroxyl and chloro group.
    const atoms = [], bonds = [];
    const add = (el, x, y, z, label) => (atoms.push({ el, x, y, z, label }), atoms.length - 1);
    const ring = (cx, cy, tw, els, name) => {
      const ids = [];
      for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ids.push(add(els[k] || "C", cx + Math.cos(a) * 1.4, cy + Math.sin(a) * 1.4 * Math.cos(tw), Math.sin(a) * 1.4 * Math.sin(tw), `${name} ${els[k] === "N" ? "nitrogen" : "carbon"}`)); }
      ids.forEach((id, k) => bonds.push([id, ids[(k + 1) % 6], k % 2 ? 2 : 1]));
      return ids;
    };
    const r1 = ring(-3.3, 0, 0.3, ["C", "C", "C", "C", "C", "C"], "Phenyl");
    const c7 = add("C", -0.9, 0.2, 0.2, "Carbonyl carbon"), o8 = add("O", -0.6, 1.4, 0.6, "Carbonyl oxygen (H-bond acceptor)"), n9 = add("N", 0.3, -0.6, 0, "Amide nitrogen (H-bond donor)");
    bonds.push([r1[0], c7, 1], [c7, o8, 2], [c7, n9, 1]);
    const r2 = ring(2.6, -0.4, -0.5, ["C", "C", "N", "C", "C", "C"], "Pyridine");
    bonds.push([n9, r2[3], 1]);
    const cl = add("Cl", -5.6, 0.9, 0.4, "Chlorine substituent"); bonds.push([r1[3], cl, 1]);
    const oh = add("O", 4.4, -1.9, -0.6, "Hydroxyl oxygen"); bonds.push([r2[0], oh, 1]);
    const cen = atoms.reduce((s, a) => [s[0] + a.x, s[1] + a.y, s[2] + a.z], [0, 0, 0]).map(v => v / atoms.length);
    atoms.forEach(a => { a.x -= cen[0]; a.y -= cen[1]; a.z -= cen[2]; });
    // Pocket surface: points on an open, bumpy ellipsoid shell
    const pocket = [];
    for (let i = 0; i < 520; i++) {
      const u = rand(i * 1.37) * 2 - 1, th = rand(i * 2.91) * 6.283, s = Math.sqrt(1 - u * u);
      if (u > 0.45) continue; // opening toward the viewer/top
      const bump = 1 + (noise(th * 2 + u * 3) - 0.5) * 0.25;
      pocket.push({ x: s * Math.cos(th) * 6.4 * bump, y: u * 3.8 * bump, z: s * Math.sin(th) * 4.2 * bump });
    }
    const hb = [[o8, { x: -0.4, y: 3.6, z: 1.4 }], [n9, { x: 1.4, y: -3.4, z: 0.8 }], [r2[2], { x: 3.6, y: 2.6, z: -0.8 }]];
    const col = el => ({ C: C.dark ? "#B9CDD3" : "#4B6168", N: "#5B8CFF", O: "#FF6B7A", Cl: "#57D163" }[el]);
    const rad = el => ({ C: 0.42, N: 0.45, O: 0.46, Cl: 0.6 }[el]);
    let hov = -1;
    const st = stage(canvas, {
      drag: true,
      leave: () => { out && (out.textContent = "Drag to rotate · hover an atom"); },
      draw(st) {
        const { ctx, w, h, t } = st;
        const ry = (reduced ? 0.5 : t * 0.3) + st.dx, rx = 0.35 + st.dy * 0.6;
        const cy_ = Math.cos(ry), sy = Math.sin(ry), cx_ = Math.cos(rx), sx = Math.sin(rx);
        const S = Math.min(w * 0.78, h) / 11.5, D = 26;
        const pr = p => {
          const x = p.x * cy_ + p.z * sy, z = -p.x * sy + p.z * cy_;
          const y = p.y * cx_ - z * sx, z2 = p.y * sx + z * cx_;
          const k = D / (D + z2); return { x: w / 2 + x * S * k, y: h / 2 + y * S * k, z: z2, k };
        };
        // pocket
        pocket.forEach(p => { const q = pr(p); const d = (6 - q.z) / 12; ctx.fillStyle = hexA(C.b, 0.08 + d * 0.32); ctx.beginPath(); ctx.arc(q.x, q.y, 1.6 * q.k, 0, 6.283); ctx.fill(); });
        const P = atoms.map(pr);
        // H-bonds (dashed, pulsing)
        ctx.setLineDash([3, 4]); ctx.lineWidth = 1.4;
        hb.forEach(([ai, target], k) => { const a = P[ai], b = pr(target); ctx.strokeStyle = hexA(C.a, 0.35 + 0.35 * Math.sin(t * 2.4 + k)); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.fillStyle = hexA(C.a, 0.8); ctx.beginPath(); ctx.arc(b.x, b.y, 2.6, 0, 6.283); ctx.fill(); });
        ctx.setLineDash([]);
        // hover
        let best = -1, bd = 14;
        if (st.px != null && !st.dragging) P.forEach((q, i) => { const d = Math.hypot(q.x - st.px, q.y - st.py); if (d < bd) { bd = d; best = i; } });
        if (best !== hov) { hov = best; if (out) out.textContent = best >= 0 ? `${atoms[best].el} · ${atoms[best].label}` : "Drag to rotate · hover an atom"; }
        // bonds then atoms, depth sorted
        const items = [];
        bonds.forEach(([i, j, o]) => items.push({ z: (P[i].z + P[j].z) / 2 + 0.05, f: () => {
          const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L * 2.2, ny = dx / L * 2.2;
          ctx.strokeStyle = hexA(C.ink, 0.55); ctx.lineWidth = 2.2 * a.k;
          const offs = o === 2 ? [-1, 1] : [0];
          offs.forEach(m => { ctx.beginPath(); ctx.moveTo(a.x + nx * m, a.y + ny * m); ctx.lineTo(b.x + nx * m, b.y + ny * m); ctx.stroke(); });
        } }));
        P.forEach((q, i) => items.push({ z: q.z, f: () => {
          const a = atoms[i], r = rad(a.el) * S * q.k * (i === hov ? 1.35 : 1);
          const g = ctx.createRadialGradient(q.x - r * 0.35, q.y - r * 0.35, r * 0.1, q.x, q.y, r);
          g.addColorStop(0, "#ffffff"); g.addColorStop(0.25, col(a.el)); g.addColorStop(1, hexA(col(a.el), 0.75));
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, 6.283); ctx.fill();
          if (i === hov) { ctx.strokeStyle = C.a; ctx.lineWidth = 2; ctx.stroke(); }
        } }));
        items.sort((a, b) => b.z - a.z).forEach(it => it.f());
      }
    });
    out && (out.textContent = "Drag to rotate · hover an atom");
    return st;
  }

  /* ---------- Genome coverage track ---------- */
  function genome(canvas, out) {
    const START = 43044000, BP_PER_PX = 18;
    const cov = p => 18 + noise(p / 900) * 40 + noise(p / 140) * 14 + (exonAt(p) ? 22 : 0);
    // Features are generated per index so the track can pan forever in either direction.
    const exon = k => { const s = k * 1100 + rand(k) * 500; return [s, s + 180 + rand(k + 3) * 420]; };
    const exonAt = p => { const k = Math.floor(p / 1100); return [k - 1, k].some(j => { const [a, b] = exon(j); return p >= a && p <= b; }); };
    const variant = k => ({ p: k * 1500 + rand(k * 5) * 1100, ref: "ACGT"[((k % 4) + 4) % 4], alt: "TGCA"[(((k * 3) % 4) + 4) % 4], af: 0.2 + rand(k + 11) * 0.7 });
    const range = (a, b, step) => { const out = []; for (let k = Math.floor(a / step) - 1; k <= Math.ceil(b / step); k++) out.push(k); return out; };
    let hov = -1;
    const st = stage(canvas, {
      drag: true,
      leave: () => { out && (out.textContent = "Drag to pan · hover a variant"); },
      draw(st) {
        const { ctx, w, h, t } = st;
        const off = (reduced ? 0 : t * 60) - st.dx * 120;
        const P0 = off * BP_PER_PX / 4;
        const toX = p => (p - P0) / BP_PER_PX;
        const rulerY = 22, covTop = 44, covBot = h * 0.62, geneY = h * 0.74;
        // ruler
        ctx.fillStyle = C.muted; ctx.font = "10px 'JetBrains Mono', monospace"; ctx.textAlign = "left";
        ctx.fillText("chr17", 8, 14);
        const step = 1000, first = Math.floor(P0 / step) * step;
        ctx.strokeStyle = hexA(C.muted, 0.35); ctx.lineWidth = 1;
        for (let p = first; toX(p) < w; p += step) {
          const x = toX(p); if (x < 0) continue;
          ctx.beginPath(); ctx.moveTo(x, rulerY); ctx.lineTo(x, rulerY + 5); ctx.stroke();
          if ((p / step) % 4 === 0) ctx.fillText((START + p).toLocaleString("en-US"), x + 3, rulerY - 4);
        }
        ctx.beginPath(); ctx.moveTo(0, rulerY + 5.5); ctx.lineTo(w, rulerY + 5.5); ctx.stroke();
        // coverage area
        const g = ctx.createLinearGradient(0, covTop, 0, covBot);
        g.addColorStop(0, hexA(C.a, 0.75)); g.addColorStop(1, hexA(C.a, 0.08));
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, covBot);
        for (let x = 0; x <= w; x += 2) { const v = cov(P0 + x * BP_PER_PX) / 100; ctx.lineTo(x, covBot - v * (covBot - covTop)); }
        ctx.lineTo(w, covBot); ctx.closePath(); ctx.fill();
        ctx.fillStyle = C.muted; ctx.fillText("coverage", 8, covTop - 4);
        // gene model
        ctx.strokeStyle = hexA(C.ink, 0.5); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, geneY); ctx.lineTo(w, geneY); ctx.stroke();
        ctx.fillStyle = hexA(C.ink, 0.5);
        for (let x = 10 - (toX(0) % 40 + 40) % 40; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, geneY - 3); ctx.lineTo(x - 4, geneY); ctx.lineTo(x, geneY + 3); ctx.stroke(); }
        range(P0, P0 + w * BP_PER_PX, 1100).map(exon).forEach(([a, b]) => { const x0 = toX(a), x1 = toX(b); if (x1 < 0 || x0 > w) return; ctx.fillStyle = C.b; ctx.fillRect(x0, geneY - 7, Math.max(2, x1 - x0), 14); });
        // variants
        const variants = range(P0, P0 + w * BP_PER_PX, 1500).map(variant);
        let best = -1, bd = 10;
        if (st.px != null && !st.dragging) variants.forEach((v, k) => { const d = Math.abs(toX(v.p) - st.px); if (d < bd) { bd = d; best = k; } });
        hov = best;
        variants.forEach((v, k) => {
          const x = toX(v.p); if (x < -10 || x > w + 10) return;
          const len = 6 + v.af * 16, on = k === hov;
          ctx.strokeStyle = on ? C.ink : hexA(C.muted, 0.6); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x, h - 6); ctx.lineTo(x, h - 6 - len); ctx.stroke();
          ctx.fillStyle = on ? C.ink : (v.af > 0.6 ? C.b : C.a);
          ctx.beginPath(); ctx.arc(x, h - 6 - len, on ? 5 : 3.5, 0, 6.283); ctx.fill();
          if (on) { ctx.strokeStyle = hexA(C.ink, 0.35); ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(x, covTop); ctx.lineTo(x, h - 6 - len); ctx.stroke(); ctx.setLineDash([]); }
        });
        if (hov >= 0 && out) { const v = variants[hov]; out.textContent = `chr17:${Math.round(START + v.p).toLocaleString("en-US")} · ${v.ref}>${v.alt} · VAF ${Math.round(v.af * 100)}% · depth ${Math.round(cov(v.p))}×`; }
      }
    });
    out && (out.textContent = "Drag to pan · hover a variant");
    return st;
  }

  window.BioViz = {
    helix, spectrum, molecule, genome,
    refresh() { readColors(); stages.forEach(s => s.redraw()); }
  };
})();
