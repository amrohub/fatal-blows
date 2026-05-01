// ═══════════════════════════════════════════════
//  BOOT LOADING BAR ANIMATION
// ═══════════════════════════════════════════════
(function() {
  const bar    = document.getElementById('boot-bar');
  const veil   = document.getElementById('boot-veil');
  const status = document.getElementById('boot-status');
  const steps  = [
    'LOADING ENGINE...',
    'CALIBRATING BLADES...',
    'RENDERING ARENAS...',
    'CHARGING FIGHTERS...',
    'READY.',
  ];
  let pct = 0, stepIdx = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 12 + 4;
    if (pct >= 100) { pct = 100; clearInterval(iv); }
    bar.style.width = pct + '%';
    const newStep = Math.floor((pct / 100) * (steps.length - 1));
    if (newStep !== stepIdx) {
      stepIdx = newStep;
      status.textContent = steps[stepIdx];
      SFX.chime();
    }
    if (pct >= 100) {
      status.textContent = steps[steps.length - 1];
      SFX.boot();
      setTimeout(() => veil.classList.add('fade-out'), 280);
      setTimeout(() => veil.remove(), 1100);
    }
  }, 80);
})();

// ═══════════════════════════════════════════════
//  GLOBAL CLICK RIPPLE
// ═══════════════════════════════════════════════
document.addEventListener('click', (e) => {
  const rc = document.getElementById('ripple-container');
  if (!rc) return;
  // primary ring
  const ring = document.createElement('div');
  ring.className = 'ripple-ring';
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
  rc.appendChild(ring);
  setTimeout(() => ring.remove(), 600);
  // secondary larger ring (delayed)
  const ring2 = document.createElement('div');
  ring2.className = 'ripple-ring';
  ring2.style.left = e.clientX + 'px';
  ring2.style.top  = e.clientY + 'px';
  ring2.style.animationDelay = '0.1s';
  ring2.style.borderColor = 'rgba(244,213,141,0.45)';
  ring2.style.width = '28px';
  ring2.style.height = '28px';
  rc.appendChild(ring2);
  setTimeout(() => ring2.remove(), 700);
  // starburst
  const burst = document.createElement('div');
  burst.className = 'click-burst gold';
  burst.style.left = e.clientX + 'px';
  burst.style.top  = e.clientY + 'px';
  rc.appendChild(burst);
  setTimeout(() => burst.remove(), 500);
});

// ═══════════════════════════════════════════════
//  PALETTE  (unchanged)
// ═══════════════════════════════════════════════
const C = {
  n: {
    bg:      0x001427,
    navy:    0x001427,
    teal:    0xbf0603,
    mint:    0xf4d58d,
    sand:    0xf4d58d,
    amber:   0xbf0603,
    orange:  0x8d0801,
    rust:    0x8d0801,
    crimson: 0xbf0603,
    wine:    0x8d0801,
    sage:    0x708d81,
  },
  s: {
    bg:      '#001427',
    navy:    '#001427',
    teal:    '#bf0603',
    mint:    '#f4d58d',
    sand:    '#f4d58d',
    amber:   '#bf0603',
    orange:  '#8d0801',
    rust:    '#8d0801',
    crimson: '#bf0603',
    wine:    '#8d0801',
    sage:    '#708d81',
  }
};

// ═══════════════════════════════════════════════
//  SHARED HELPERS
// ═══════════════════════════════════════════════

// ── Animated Background System ──────────────────
function makeParticles(scene, W, H, count = 70) {
  const bg = { orbs: [], stars: [], hexes: [], scanLines: [], driftRings: [], bloodDrops: [], time: 0 };

  // ── Layer 0: subtle grid ──
  const gridG = scene.add.graphics().setDepth(0).setAlpha(0.05);
  gridG.lineStyle(1, C.n.teal, 1);
  for (let y = 0; y < H; y += 52) {
    gridG.beginPath(); gridG.moveTo(0, y); gridG.lineTo(W, y); gridG.strokePath();
  }
  for (let x = 0; x < W; x += 86) {
    gridG.beginPath(); gridG.moveTo(x, 0); gridG.lineTo(x, H); gridG.strokePath();
  }
  bg.gridG = gridG;

  // ── Layer 1: Large slow nebula orbs ──
  const nebCols = [C.n.teal, C.n.navy, C.n.mint, C.n.amber, C.n.rust];
  for (let i = 0; i < 6; i++) {
    const g   = scene.add.graphics().setDepth(1);
    const col = nebCols[i % nebCols.length];
    const r   = Phaser.Math.Between(W * 0.15, W * 0.32);
    const x   = Phaser.Math.Between(-r * 0.3, W + r * 0.3);
    const y   = Phaser.Math.Between(-r * 0.3, H + r * 0.3);
    const a   = Math.random() * 0.055 + 0.015;
    g.fillStyle(col, a); g.fillCircle(0, 0, r); g.setPosition(x, y);
    const vx  = (Math.random() - 0.5) * 0.18;
    const vy  = (Math.random() - 0.5) * 0.12;
    bg.orbs.push({ g, r, x, y, vx, vy, a, col,
      wobT: Math.random() * Math.PI * 2,
      wobS: Math.random() * 0.004 + 0.001,
      wobA: Math.random() * 0.012 + 0.004 });
  }

  // ── Layer 2: Stars ──
  const starCols = [C.n.teal, C.n.mint, C.n.sand, C.n.amber];
  for (let i = 0; i < count; i++) {
    const g   = scene.add.graphics().setDepth(2);
    const r   = Math.random() * 1.6 + 0.4;
    const col = starCols[i % starCols.length];
    const a   = Math.random() * 0.22 + 0.05;
    const x   = Phaser.Math.Between(0, W);
    const y   = Phaser.Math.Between(0, H);
    g.fillStyle(col, a); g.fillCircle(0, 0, r); g.setPosition(x, y);
    if (r > 1.4) {
      g.lineStyle(0.5, col, a * 0.5);
      g.beginPath(); g.moveTo(-r * 2.5, 0); g.lineTo(r * 2.5, 0); g.strokePath();
      g.beginPath(); g.moveTo(0, -r * 2.5); g.lineTo(0, r * 2.5); g.strokePath();
    }
    bg.stars.push({
      g, a, x, y, r,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.15,
      t:  Math.random() * Math.PI * 2,
      s:  Math.random() * 0.018 + 0.004,
    });
  }

  // ── Layer 3: Hexagons / diamonds ──
  const hexCols = [C.n.teal, C.n.mint, C.n.amber, C.n.navy];
  for (let i = 0; i < 14; i++) {
    const g   = scene.add.graphics().setDepth(2);
    const col = hexCols[i % hexCols.length];
    const sz  = Math.random() * 22 + 8;
    const x   = Phaser.Math.Between(0, W);
    const y   = Phaser.Math.Between(0, H);
    const a   = Math.random() * 0.18 + 0.04;
    const sides = [4, 6][Math.floor(Math.random() * 2)];
    drawPolygon(g, 0, 0, sz, sides, col, a);
    g.setPosition(x, y);
    bg.hexes.push({
      g, x, y, sz, col, a, sides,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      rot: Math.random() * Math.PI * 2,
      rotS: (Math.random() - 0.5) * 0.006,
      t:   Math.random() * Math.PI * 2,
      s:   Math.random() * 0.012 + 0.003,
    });
  }

  // ── Layer 4: drift rings ──
  for (let i = 0; i < 4; i++) {
    const g   = scene.add.graphics().setDepth(1);
    const col = [C.n.teal, C.n.mint, C.n.amber, C.n.navy][i];
    const x   = Phaser.Math.Between(W * 0.1, W * 0.9);
    const y   = Phaser.Math.Between(H * 0.1, H * 0.9);
    bg.driftRings.push({
      g, col, x, y,
      baseR: Phaser.Math.Between(40, 130),
      t:     Math.random() * Math.PI * 2,
      speed: Math.random() * 0.007 + 0.002,
      vx:    (Math.random() - 0.5) * 0.12,
      vy:    (Math.random() - 0.5) * 0.08,
    });
  }

  // ── Layer 5: blood drop particles ─ NEW ──
  for (let i = 0; i < 8; i++) {
    const g = scene.add.graphics().setDepth(2);
    const x = Phaser.Math.Between(0, W);
    const a = Math.random() * 0.12 + 0.03;
    const h = Math.random() * 16 + 6;
    g.fillStyle(C.n.wine, a);
    g.fillRect(-1, 0, 2, h);
    g.fillCircle(0, h, 2);
    g.setPosition(x, -20);
    bg.bloodDrops.push({
      g, x, y: -20, vy: Math.random() * 0.6 + 0.3,
      h, a, delay: Math.random() * 400,
    });
  }

  return bg;
}

function drawPolygon(g, cx, cy, r, sides, col, alpha) {
  g.clear();
  g.lineStyle(1, col, alpha);
  g.beginPath();
  for (let s = 0; s <= sides; s++) {
    const angle = (s / sides) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    s === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
  }
  g.strokePath();
}

function tickParticles(bg) {
  const { orbs, stars, hexes, driftRings, bloodDrops } = bg;
  bg.time += 1;
  const t = bg.time;

  if (bg.gridG) bg.gridG.setAlpha(0.025 + 0.02 * Math.sin(t * 0.008));

  orbs.forEach(o => {
    o.x += o.vx; o.y += o.vy;
    o.wobT += o.wobS;
    const scene = o.g.scene;
    const W = scene.scale.width, H = scene.scale.height;
    if (o.x < -o.r * 0.5) o.x = W + o.r * 0.3;
    if (o.x > W + o.r * 0.5) o.x = -o.r * 0.3;
    if (o.y < -o.r * 0.5) o.y = H + o.r * 0.3;
    if (o.y > H + o.r * 0.5) o.y = -o.r * 0.3;
    o.g.setPosition(o.x, o.y);
    o.g.setAlpha(o.a + Math.sin(o.wobT) * o.wobA);
  });

  stars.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.t += p.s;
    const scene = p.g.scene;
    const W = scene.scale.width, H = scene.scale.height;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    p.g.setPosition(p.x, p.y);
    p.g.setAlpha(p.a * (0.35 + 0.65 * Math.abs(Math.sin(p.t))));
  });

  hexes.forEach(h => {
    h.x += h.vx; h.y += h.vy;
    h.rot += h.rotS; h.t += h.s;
    const scene = h.g.scene;
    const W = scene.scale.width, H = scene.scale.height;
    if (h.x < -h.sz * 2) h.x = W + h.sz;
    if (h.x > W + h.sz * 2) h.x = -h.sz;
    if (h.y < -h.sz * 2) h.y = H + h.sz;
    if (h.y > H + h.sz * 2) h.y = -h.sz;
    h.g.setPosition(h.x, h.y).setRotation(h.rot);
    const curA = h.a * (0.3 + 0.7 * Math.abs(Math.sin(h.t)));
    drawPolygon(h.g, 0, 0, h.sz, h.sides, h.col, curA);
  });

  driftRings.forEach(ring => {
    ring.t += ring.speed;
    ring.x += ring.vx; ring.y += ring.vy;
    const scene = ring.g.scene;
    const W = scene.scale.width, H = scene.scale.height;
    if (ring.x < 50 || ring.x > W - 50) ring.vx *= -1;
    if (ring.y < 50 || ring.y > H - 50) ring.vy *= -1;
    const pulse = (ring.t % (Math.PI * 2)) / (Math.PI * 2);
    const r1 = ring.baseR * (0.6 + pulse * 0.7);
    const r2 = r1 * 0.62;
    const a  = Math.sin(pulse * Math.PI) * 0.14;
    ring.g.clear();
    ring.g.lineStyle(1.5, ring.col, a);
    ring.g.strokeCircle(ring.x, ring.y, r1);
    ring.g.lineStyle(0.8, ring.col, a * 0.55);
    ring.g.strokeCircle(ring.x, ring.y, r2);
  });

  // blood drops
  if (bloodDrops) {
    bloodDrops.forEach(d => {
      if (d.delay > 0) { d.delay--; return; }
      d.y += d.vy;
      const scene = d.g.scene;
      const H = scene.scale.height;
      if (d.y > H + 40) {
        d.y = -20;
        d.x = Phaser.Math.Between(0, scene.scale.width);
        d.delay = Math.random() * 600;
        d.g.setAlpha(0);
      }
      d.g.setPosition(d.x, d.y);
      d.g.setAlpha(d.a * Math.min(1, (d.y + 20) / 40));
    });
  }
}

// ── Flash transition ──
function flash(scene, cb) {
  const { width: W, height: H } = scene.scale;
  const r = scene.add.rectangle(W / 2, H / 2, W, H, C.n.teal, 0).setDepth(200);
  scene.tweens.add({ targets: r, alpha: 0.22, duration: 60,
    onComplete: () => scene.tweens.add({ targets: r, alpha: 0, duration: 200, onComplete: cb }) });
}

// ── Divider line ──
function dividerLine(scene, y, W) {
  const g = scene.add.graphics().setDepth(5);
  // main line
  g.lineStyle(1, C.n.teal, 0.4);
  g.beginPath(); g.moveTo(W * 0.2, y); g.lineTo(W * 0.8, y); g.strokePath();
  // center diamond accent
  g.fillStyle(C.n.amber, 0.8);
  g.fillRect(W * 0.5 - 3, y - 3, 6, 6);
  return g;
}

// ── Page title ── Enhanced with glow layers
function pageTitle(scene, text, y) {
  const W = scene.scale.width;
  const fs = Math.round(W * 0.028) + 'px';

  // shadow/glow layer
  const shadow = scene.add.text(W / 2 + 2, y + 2, text, {
    fontFamily: 'Boldonse', fontStyle: 'bold',
    fontSize: fs, color: C.s.wine, letterSpacing: 6,
    alpha: 0.5,
  }).setOrigin(0.5).setDepth(4).setAlpha(0.35);

  // main text
  const t = scene.add.text(W / 2, y, text, {
    fontFamily: 'Boldonse', fontStyle: 'bold',
    fontSize: fs, color: C.s.sand, letterSpacing: 6,
  }).setOrigin(0.5).setDepth(5);

  // Entrance animation
  t.setAlpha(0).setY(y - 20);
  scene.tweens.add({ targets: [t, shadow], alpha: { from: 0, to: 1 }, y: y, duration: 500, ease: 'Back.Out' });

  // idle pulse
  scene.tweens.add({
    targets: t, alpha: { from: 0.85, to: 1 },
    duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.InOut',
  });

  return t;
}

// ── Decorative corner marks (Phaser) ──
function cornerAccents(scene, x, y, w, h, col, depth = 5) {
  const g = scene.add.graphics().setDepth(depth);
  const sz = 12;
  g.lineStyle(1.5, col, 0.7);
  // TL
  g.beginPath(); g.moveTo(x, y + sz); g.lineTo(x, y); g.lineTo(x + sz, y); g.strokePath();
  // TR
  g.beginPath(); g.moveTo(x + w - sz, y); g.lineTo(x + w, y); g.lineTo(x + w, y + sz); g.strokePath();
  // BL
  g.beginPath(); g.moveTo(x, y + h - sz); g.lineTo(x, y + h); g.lineTo(x + sz, y + h); g.strokePath();
  // BR
  g.beginPath(); g.moveTo(x + w - sz, y + h); g.lineTo(x + w, y + h); g.lineTo(x + w, y + h - sz); g.strokePath();
  return g;
}

// ── Tooltip ──
const TIP = document.getElementById('nav-tip');
function showTip(label, cx, barBottom) {
  const cvs  = document.querySelector('canvas');
  const rect = cvs.getBoundingClientRect();
  const sx   = rect.width  / cvs.width;
  const sy   = rect.height / cvs.height;
  TIP.textContent = label;
  TIP.style.left = (rect.left + cx * sx) + 'px';
  TIP.style.top  = (rect.top  + barBottom * sy) + 'px';
  TIP.classList.add('show');
}
function hideTip() { TIP.classList.remove('show'); }

// ═══════════════════════════════════════════════
//  NAV BAR — enhanced
// ═══════════════════════════════════════════════
const NAV = [
  { label: 'CHARACTERS', icon: '⚔', scene: 'FighterSelectScene' },
  { label: 'MAPS',       icon: '◈', scene: 'MapSelectScene'  },
  { label: 'CREDITS',    icon: '★', scene: 'CreditsScene'    },
];

function buildNav(scene, activeIdx) {
  const W   = scene.scale.width;
  const BTN = 35, GAP = 3, PAD = 10;
  const barW = NAV.length * BTN + (NAV.length - 1) * GAP + PAD * 2;
  const barH = BTN + PAD * 2;
  const bx   = W / 2 - barW / 2;
  const cy   = PAD + BTN / 2;

  // bar background with gradient
  const bar = scene.add.graphics().setDepth(60);
  bar.fillGradientStyle(C.n.navy, C.n.navy, 0x0d2235, 0x0d2235, 1);
  bar.fillRoundedRect(bx, 0, barW, barH, { tl: 0, tr: 0, bl: 10, br: 10 });

  // red underline
  bar.lineStyle(2, C.n.teal, 1);
  bar.beginPath(); bar.moveTo(bx, barH); bar.lineTo(bx + barW, barH); bar.strokePath();

  // inner top highlight
  bar.lineStyle(1, C.n.mint, 0.06);
  bar.beginPath(); bar.moveTo(bx + 4, 1); bar.lineTo(bx + barW - 4, 1); bar.strokePath();

  // side accent lines
  bar.lineStyle(1, C.n.teal, 0.25);
  bar.beginPath(); bar.moveTo(bx, 0); bar.lineTo(bx, barH); bar.strokePath();
  bar.beginPath(); bar.moveTo(bx + barW, 0); bar.lineTo(bx + barW, barH); bar.strokePath();

  NAV.forEach((tab, i) => {
    const cx     = bx + PAD + i * (BTN + GAP) + BTN / 2;
    const active = i === activeIdx;

    const btn = scene.add.graphics().setDepth(61);
    const drawBtn = (state) => {
      btn.clear();
      if (state === 'active') {
        // glowing active button
        btn.fillStyle(C.n.amber, 0.12);
        btn.fillRoundedRect(cx - BTN / 2 - 3, cy - BTN / 2 - 3, BTN + 6, BTN + 6, 8);
        btn.fillStyle(C.n.amber, 1);
        btn.fillRoundedRect(cx - BTN / 2, cy - BTN / 2, BTN, BTN, 6);
        btn.lineStyle(1, C.n.mint, 0.3);
        btn.strokeRoundedRect(cx - BTN / 2, cy - BTN / 2, BTN, BTN, 6);
      } else if (state === 'hover') {
        btn.fillStyle(C.n.teal, 0.18);
        btn.fillRoundedRect(cx - BTN / 2, cy - BTN / 2, BTN, BTN, 6);
        btn.lineStyle(1.5, C.n.teal, 0.8);
        btn.strokeRoundedRect(cx - BTN / 2, cy - BTN / 2, BTN, BTN, 6);
      }
    };
    drawBtn(active ? 'active' : 'none');

    const icon = scene.add.text(cx, cy, tab.icon, {
      fontFamily: 'Boldonse',
      fontSize: '18px',
      color: active ? C.s.bg : C.s.mint,
    }).setOrigin(0.5).setDepth(62);

    const hit = scene.add.rectangle(cx, cy, BTN, BTN, 0, 0)
      .setDepth(63).setInteractive({ useHandCursor: !active });

    hit.on('pointerover', () => {
      if (!active) {
        drawBtn('hover');
        icon.setColor(C.s.sand);
        scene.tweens.add({ targets: icon, scaleX: 1.18, scaleY: 1.18, duration: 140, ease: 'Back.Out' });
      }
      showTip(tab.label, cx, barH);
    });
    hit.on('pointerout', () => {
      if (!active) {
        drawBtn('none');
        icon.setColor(C.s.mint);
        scene.tweens.add({ targets: icon, scaleX: 1, scaleY: 1, duration: 140 });
      }
      hideTip();
    });
    if (!active) {
      hit.on('pointerdown', () => {
        SFX.nav();
        scene.tweens.add({ targets: icon, scaleX: 0.8, scaleY: 0.8, duration: 80, yoyo: true });
        hideTip();
        flash(scene, () => scene.scene.start(tab.scene));
      });
    }
  });

  // slide-down entrance
  const navItems = scene.children.list.filter(o => o.depth >= 60);
  navItems.forEach(o => { o.y -= barH + 4; o.alpha = 0; });
  scene.tweens.add({ targets: navItems, y: `+=${barH + 4}`, alpha: 1, duration: 460, ease: 'Back.Out' });

  scene.events.on('shutdown', hideTip);
  scene.scale.on('resize', () => { hideTip(); scene.scene.restart(); });
}

// ═══════════════════════════════════════════════
//  AUDIO MANAGER
// ═══════════════════════════════════════════════
const Audio = {
  music: null, muted: false,
  init(scene) {
    if (this.music) return;
    this.music = scene.sound.add('bgm', { loop: true, volume: 0.55 });
    this.music.play();
  },
  toggle() {
    this.muted = !this.muted;
    if (this.music) this.music.setMute(this.muted);
    return this.muted;
  },
};

// ═══════════════════════════════════════════════
//  SFX ENGINE  — Web Audio API synthesized sounds
// ═══════════════════════════════════════════════
const SFX = (() => {
  let ctx = null;
  let sfxMuted = false;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function play(fn) {
    if (sfxMuted) return;
    try { fn(getCtx()); } catch(e) {}
  }

  // soft metallic tick on hover
  function hover() {
    play(ctx => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.09);
    });
  }

  // sharp metallic blade-draw on card click
  function select() {
    play(ctx => {
      // metallic ring: two high-freq sine partials that fade slowly
      [1040, 1560, 2200].forEach((freq, idx) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.82, ctx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.13 - idx * 0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38 + idx * 0.05);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.44);
      });
      // short transient click (impact body)
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(420, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.06);
      gain2.gain.setValueAtTime(0.28, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.09);
      // thin noise burst (blade hiss)
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.07, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.5);
      const src  = ctx.createBufferSource();
      const hpf  = ctx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 3200;
      const g3   = ctx.createGain(); g3.gain.setValueAtTime(0.18, ctx.currentTime);
      src.buffer = buf;
      src.connect(hpf); hpf.connect(g3); g3.connect(ctx.destination);
      src.start(ctx.currentTime);
    });
  }

  // heroic rising chord on map confirm
  function confirm() {
    play(ctx => {
      [220, 330, 440, 550].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.13, ctx.currentTime + i * 0.04 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.04 + 0.35);
        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + i * 0.04 + 0.38);
      });
    });
  }

  // quick whoosh on nav tab switch
  function nav() {
    play(ctx => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    });
  }

  // reverse whoosh on back button
  function back() {
    play(ctx => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.16);
    });
  }

  // rising power-up on boot complete
  function boot() {
    play(ctx => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    });
  }

  // deep power-charge energy swell (map confirm hold)
  function powerUp() {
    play(ctx => {
      [110, 165, 220, 330].forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + 0.55);
        gain.gain.setValueAtTime(0.0, ctx.currentTime + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.11, ctx.currentTime + i * 0.05 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + 0.7);
      });
      // high shimmer
      const osc2 = ctx.createOscillator();
      const g2   = ctx.createGain();
      osc2.connect(g2); g2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1800, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(3600, ctx.currentTime + 0.5);
      g2.gain.setValueAtTime(0.06, ctx.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.6);
    });
  }

  // heavy impact thud (hit landing)
  function impact() {
    play(ctx => {
      // sub thump
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.55, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
      // noise crack
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.8);
      const src  = ctx.createBufferSource();
      const lpf  = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 2400;
      const g2   = ctx.createGain(); g2.gain.setValueAtTime(0.35, ctx.currentTime);
      src.buffer  = buf;
      src.connect(lpf); lpf.connect(g2); g2.connect(ctx.destination);
      src.start(ctx.currentTime);
    });
  }

  // glassy UI unlock / pickup chime
  function chime() {
    play(ctx => {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.0, ctx.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.07 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.28);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.3);
      });
    });
  }

  // electric buzz / error / denied
  function error() {
    play(ctx => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.setValueAtTime(60, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(80, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.26);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.28);
    });
  }

  // victory fanfare (3-note trumpet-like)
  function victory() {
    play(ctx => {
      const melody = [523, 659, 784, 1047, 784, 1047];
      const timing = [0, 0.12, 0.24, 0.36, 0.52, 0.6];
      melody.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + timing[i]);
        gain.gain.setValueAtTime(0.0, ctx.currentTime + timing[i]);
        gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + timing[i] + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timing[i] + 0.11);
        osc.start(ctx.currentTime + timing[i]);
        osc.stop(ctx.currentTime + timing[i] + 0.13);
      });
    });
  }

  // low ambient rumble / tension
  function rumble() {
    play(ctx => {
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.18 * Math.sin(i / data.length * Math.PI);
      const src  = ctx.createBufferSource();
      const lpf  = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 160;
      const gain = ctx.createGain(); gain.gain.setValueAtTime(0.6, ctx.currentTime);
      src.buffer = buf;
      src.connect(lpf); lpf.connect(gain); gain.connect(ctx.destination);
      src.start(ctx.currentTime);
    });
  }

  function setMuted(val) { sfxMuted = val; }

  return { hover, select, confirm, nav, back, boot, powerUp, impact, chime, error, victory, rumble, setMuted };
})();

// ═══════════════════════════════════════════════
//  RAIDER SPRITE CONFIG
// ═══════════════════════════════════════════════
const RAIDER = {
  basePath: 'F:/game/assets/characters/Raider_1/',
  // Each entry: key, file, frameWidth, frameHeight, frameCount, frameRate
  sheets: [
    { key: 'raider_idle',     file: 'Idle.png',     fw: 128, fh: 128, count: 6,  fps: 8  },
    { key: 'raider_walk',     file: 'Walk.png',     fw: 128, fh: 128, count: 8,  fps: 10 },
    { key: 'raider_run',      file: 'Run.png',      fw: 128, fh: 128, count: 8,  fps: 14 },
    { key: 'raider_jump',     file: 'Jump.png',     fw: 128, fh: 128, count: 11, fps: 12 },
    { key: 'raider_attack1',  file: 'Attack_1.png', fw: 128, fh: 128, count: 6,  fps: 12 },
    { key: 'raider_attack2',  file: 'Attack_2.png', fw: 128, fh: 128, count: 3,  fps: 10 },
    { key: 'raider_shot',     file: 'Shot.png',     fw: 128, fh: 128, count: 12, fps: 16 },
    { key: 'raider_recharge', file: 'Recharge.png', fw: 128, fh: 128, count: 8,  fps: 10 },
    { key: 'raider_hurt',     file: 'Hurt.png',     fw: 128, fh: 128, count: 2,  fps: 8  },
    { key: 'raider_dead',     file: 'Dead.png',     fw: 128, fh: 128, count: 4,  fps: 6  },
  ],
};

// ═══════════════════════════════════════════════
//  FIRE WIZARD SPRITE CONFIG
// ═══════════════════════════════════════════════
const FIRE_WIZARD = {
  basePath: 'assets/characters/Fire Wizard/',
  sheets: [
    { key: 'wizard_idle',      file: 'Idle.png',      fw: 128, fh: 128, count: 7,  fps: 8  },
    { key: 'wizard_walk',      file: 'Walk.png',      fw: 128, fh: 128, count: 6,  fps: 10 },
    { key: 'wizard_run',       file: 'Run.png',       fw: 128, fh: 128, count: 8,  fps: 14 },
    { key: 'wizard_jump',      file: 'Jump.png',      fw: 128, fh: 128, count: 9,  fps: 12 },
    { key: 'wizard_attack1',   file: 'Attack_1.png',  fw: 128, fh: 128, count: 4,  fps: 12 },
    { key: 'wizard_attack2',   file: 'Attack_2.png',  fw: 128, fh: 128, count: 4,  fps: 10 },
    { key: 'wizard_charge',    file: 'Charge.png',    fw: 64,  fh: 64,  count: 12, fps: 14 },
    { key: 'wizard_fireball',  file: 'Fireball.png',  fw: 128, fh: 128, count: 8,  fps: 14 },
    { key: 'wizard_flame_jet', file: 'Flame_jet.png', fw: 128, fh: 128, count: 14, fps: 16 },
    { key: 'wizard_hurt',      file: 'Hurt.png',      fw: 128, fh: 128, count: 3,  fps: 8  },
    { key: 'wizard_dead',      file: 'Dead.png',      fw: 128, fh: 128, count: 6,  fps: 6  },
  ],
};

// ═══════════════════════════════════════════════
//  SAMURAI SPRITE CONFIG
// ═══════════════════════════════════════════════
const SAMURAI = {
  basePath: 'assets/characters/Samurai/',
  sheets: [
    { key: 'samurai_idle',       file: 'Idle.png',       fw: 128, fh: 128, count: 6,  fps: 8  },
    { key: 'samurai_walk',       file: 'Walk.png',       fw: 128, fh: 128, count: 9,  fps: 10 },
    { key: 'samurai_run',        file: 'Run.png',        fw: 128, fh: 128, count: 8,  fps: 14 },
    { key: 'samurai_jump',       file: 'Jump.png',       fw: 128, fh: 128, count: 9,  fps: 12 },
    { key: 'samurai_attack1',    file: 'Attack_1.png',   fw: 128, fh: 128, count: 4,  fps: 12 },
    { key: 'samurai_attack2',    file: 'Attack_2.png',   fw: 128, fh: 128, count: 5,  fps: 12 },
    { key: 'samurai_attack3',    file: 'Attack_3.png',   fw: 128, fh: 128, count: 4,  fps: 12 },
    { key: 'samurai_protection', file: 'Protection.png', fw: 128, fh: 128, count: 2,  fps: 8  },
    { key: 'samurai_hurt',       file: 'Hurt.png',       fw: 128, fh: 128, count: 3,  fps: 8  },
    { key: 'samurai_dead',       file: 'Dead.png',       fw: 128, fh: 128, count: 6,  fps: 6  },
  ],
};

// ═══════════════════════════════════════════════
//  LIGHTNING MAGE SPRITE CONFIG
// ═══════════════════════════════════════════════
const LIGHTNING_MAGE = {
  basePath: 'assets/characters/Lightning Mage/',
  sheets: [
    { key: 'lmage_idle',         file: 'Idle.png',         fw: 128, fh: 128, count: 6,  fps: 8  },
    { key: 'lmage_walk',         file: 'Walk.png',         fw: 128, fh: 128, count: 6,  fps: 10 },
    { key: 'lmage_run',          file: 'Run.png',          fw: 128, fh: 128, count: 8,  fps: 14 },
    { key: 'lmage_jump',         file: 'Jump.png',         fw: 128, fh: 128, count: 7,  fps: 12 },
    { key: 'lmage_attack1',      file: 'Attack_1.png',     fw: 128, fh: 128, count: 9,  fps: 14 },
    { key: 'lmage_attack2',      file: 'Attack_2.png',     fw: 128, fh: 128, count: 4,  fps: 12 },
    { key: 'lmage_charge',       file: 'Charge.png',       fw: 128, fh: 128, count: 11, fps: 14 },
    { key: 'lmage_light_ball',   file: 'Light_ball.png',   fw: 64,  fh: 64,  count: 11, fps: 16 },
    { key: 'lmage_light_charge', file: 'Light_charge.png', fw: 128, fh: 128, count: 11, fps: 14 },
    { key: 'lmage_hurt',         file: 'Hurt.png',         fw: 128, fh: 128, count: 3,  fps: 8  },
    { key: 'lmage_dead',         file: 'Dead.png',         fw: 128, fh: 128, count: 5,  fps: 6  },
  ],
};

// ─── Register Samurai animations ─────────────────────────────────────────────
function _registerSamuraiAnims(scene) {
  const anims = scene.anims;
  const defs = [
    { key: 'samurai-idle',       tex: 'samurai_idle',       start: 0, end: 5,  fps: 8,  repeat: -1 },
    { key: 'samurai-walk',       tex: 'samurai_walk',       start: 0, end: 8,  fps: 10, repeat: -1 },
    { key: 'samurai-run',        tex: 'samurai_run',        start: 0, end: 7,  fps: 14, repeat: -1 },
    { key: 'samurai-jump',       tex: 'samurai_jump',       start: 0, end: 8,  fps: 12, repeat: 0  },
    { key: 'samurai-attack1',    tex: 'samurai_attack1',    start: 0, end: 3,  fps: 12, repeat: 0  },
    { key: 'samurai-attack2',    tex: 'samurai_attack2',    start: 0, end: 4,  fps: 12, repeat: 0  },
    { key: 'samurai-attack3',    tex: 'samurai_attack3',    start: 0, end: 3,  fps: 12, repeat: 0  },
    { key: 'samurai-protection', tex: 'samurai_protection', start: 0, end: 1,  fps: 8,  repeat: -1 },
    { key: 'samurai-hurt',       tex: 'samurai_hurt',       start: 0, end: 2,  fps: 8,  repeat: 0  },
    { key: 'samurai-dead',       tex: 'samurai_dead',       start: 0, end: 5,  fps: 6,  repeat: 0  },
  ];
  defs.forEach(d => {
    if (anims.exists(d.key)) return;
    if (!scene.textures.exists(d.tex)) return;
    try {
      const frames = anims.generateFrameNumbers(d.tex, { start: d.start, end: d.end });
      if (!frames || frames.length === 0) return;
      anims.create({ key: d.key, frames, frameRate: d.fps, repeat: d.repeat });
    } catch (e) {
      console.warn('Could not create animation:', d.key, e);
    }
  });
}

// ─── Register Fire Wizard animations ─────────────────────────────────────────
function _registerWizardAnims(scene) {
  const anims = scene.anims;
  const defs = [
    { key: 'wizard-idle',      tex: 'wizard_idle',      start: 0, end: 6,  fps: 8,  repeat: -1 },
    { key: 'wizard-walk',      tex: 'wizard_walk',      start: 0, end: 5,  fps: 10, repeat: -1 },
    { key: 'wizard-run',       tex: 'wizard_run',       start: 0, end: 7,  fps: 14, repeat: -1 },
    { key: 'wizard-jump',      tex: 'wizard_jump',      start: 0, end: 8,  fps: 12, repeat: 0  },
    { key: 'wizard-attack1',   tex: 'wizard_attack1',   start: 0, end: 3,  fps: 12, repeat: 0  },
    { key: 'wizard-attack2',   tex: 'wizard_attack2',   start: 0, end: 3,  fps: 10, repeat: 0  },
    { key: 'wizard-charge',    tex: 'wizard_charge',    start: 0, end: 11, fps: 14, repeat: 0  },
    { key: 'wizard-fireball',  tex: 'wizard_fireball',  start: 0, end: 7,  fps: 14, repeat: 0  },
    { key: 'wizard-flame_jet', tex: 'wizard_flame_jet', start: 0, end: 13, fps: 16, repeat: 0  },
    { key: 'wizard-hurt',      tex: 'wizard_hurt',      start: 0, end: 2,  fps: 8,  repeat: 0  },
    { key: 'wizard-dead',      tex: 'wizard_dead',      start: 0, end: 5,  fps: 6,  repeat: 0  },
  ];
  defs.forEach(d => {
    if (anims.exists(d.key)) return;
    if (!scene.textures.exists(d.tex)) return;
    try {
      const frames = anims.generateFrameNumbers(d.tex, { start: d.start, end: d.end });
      if (!frames || frames.length === 0) return;
      anims.create({ key: d.key, frames, frameRate: d.fps, repeat: d.repeat });
    } catch (e) {
      console.warn('Could not create animation:', d.key, e);
    }
  });
}

// ─── Register Lightning Mage animations ──────────────────────────────────────
function _registerLightningMageAnims(scene) {
  const anims = scene.anims;
  const defs = [
    { key: 'lmage-idle',         tex: 'lmage_idle',         start: 0, end: 5,  fps: 8,  repeat: -1 },
    { key: 'lmage-walk',         tex: 'lmage_walk',         start: 0, end: 5,  fps: 10, repeat: -1 },
    { key: 'lmage-run',          tex: 'lmage_run',          start: 0, end: 7,  fps: 14, repeat: -1 },
    { key: 'lmage-jump',         tex: 'lmage_jump',         start: 0, end: 6,  fps: 12, repeat: 0  },
    { key: 'lmage-attack1',      tex: 'lmage_attack1',      start: 0, end: 8,  fps: 14, repeat: 0  },
    { key: 'lmage-attack2',      tex: 'lmage_attack2',      start: 0, end: 3,  fps: 12, repeat: 0  },
    { key: 'lmage-charge',       tex: 'lmage_charge',       start: 0, end: 10, fps: 14, repeat: 0  },
    { key: 'lmage-light_ball',   tex: 'lmage_light_ball',   start: 0, end: 10, fps: 16, repeat: 0  },
    { key: 'lmage-light_charge', tex: 'lmage_light_charge', start: 0, end: 10, fps: 14, repeat: 0  },
    { key: 'lmage-hurt',         tex: 'lmage_hurt',         start: 0, end: 2,  fps: 8,  repeat: 0  },
    { key: 'lmage-dead',         tex: 'lmage_dead',         start: 0, end: 4,  fps: 6,  repeat: 0  },
  ];
  defs.forEach(d => {
    if (anims.exists(d.key)) return;
    if (!scene.textures.exists(d.tex)) return;
    try {
      const frames = anims.generateFrameNumbers(d.tex, { start: d.start, end: d.end });
      if (!frames || frames.length === 0) return;
      anims.create({ key: d.key, frames, frameRate: d.fps, repeat: d.repeat });
    } catch (e) {
      console.warn('Could not create animation:', d.key, e);
    }
  });
}

// ═══════════════════════════════════════════════
//  BOOT SCENE
// ═══════════════════════════════════════════════
class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.load.audio('bgm', 'assets/sound.mp3');

    // Load Raider_1 spritesheets
    RAIDER.sheets.forEach(s => {
      this.load.spritesheet(s.key,
        `assets/characters/Raider_1/${s.file}`,
        { frameWidth: s.fw, frameHeight: s.fh, endFrame: s.count - 1 }
      );
    });

    // Load Fire Wizard spritesheets
    FIRE_WIZARD.sheets.forEach(s => {
      this.load.spritesheet(s.key,
        `${FIRE_WIZARD.basePath}${s.file}`,
        { frameWidth: s.fw, frameHeight: s.fh, endFrame: s.count - 1 }
      );
    });

    // Load Samurai spritesheets
    SAMURAI.sheets.forEach(s => {
      this.load.spritesheet(s.key,
        `${SAMURAI.basePath}${s.file}`,
        { frameWidth: s.fw, frameHeight: s.fh, endFrame: s.count - 1 }
      );
    });

    // Load Lightning Mage spritesheets
    LIGHTNING_MAGE.sheets.forEach(s => {
      this.load.spritesheet(s.key,
        `${LIGHTNING_MAGE.basePath}${s.file}`,
        { frameWidth: s.fw, frameHeight: s.fh, endFrame: s.count - 1 }
      );
    });

    // Character select portrait images
    this.load.image('char_raider', 'assets/characters/char1.png');
    this.load.image('char_wizard', 'assets/characters/char2.png');
    this.load.image('char_samurai', 'assets/characters/char3.png');
    this.load.image('char_lmage', 'assets/characters/char4.png');
  }

  create() {
    _registerRaiderAnims(this);
    _registerWizardAnims(this);
    _registerSamuraiAnims(this);
    _registerLightningMageAnims(this);
    this.scene.start('FighterSelectScene');
  }
}

// ─── Register Raider animations on a scene's anims manager ───────────────────
function _registerRaiderAnims(scene) {
  const anims = scene.anims;

  const defs = [
    { key: 'raider-idle',     tex: 'raider_idle',     start: 0, end: 5,  fps: 8,  repeat: -1 },
    { key: 'raider-walk',     tex: 'raider_walk',     start: 0, end: 7,  fps: 10, repeat: -1 },
    { key: 'raider-run',      tex: 'raider_run',      start: 0, end: 7,  fps: 14, repeat: -1 },
    { key: 'raider-jump',     tex: 'raider_jump',     start: 0, end: 10, fps: 12, repeat: 0  },
    { key: 'raider-attack1',  tex: 'raider_attack1',  start: 0, end: 5,  fps: 12, repeat: 0  },
    { key: 'raider-attack2',  tex: 'raider_attack2',  start: 0, end: 2,  fps: 10, repeat: 0  },
    { key: 'raider-shot',     tex: 'raider_shot',     start: 0, end: 11, fps: 16, repeat: 0  },
    { key: 'raider-recharge', tex: 'raider_recharge', start: 0, end: 7,  fps: 10, repeat: 0  },
    { key: 'raider-hurt',     tex: 'raider_hurt',     start: 0, end: 1,  fps: 8,  repeat: 0  },
    { key: 'raider-dead',     tex: 'raider_dead',     start: 0, end: 3,  fps: 6,  repeat: 0  },
  ];

  defs.forEach(d => {
    if (anims.exists(d.key)) return;
    // Only create the animation if the texture actually loaded
    if (!scene.textures.exists(d.tex)) return;
    try {
      const frames = anims.generateFrameNumbers(d.tex, { start: d.start, end: d.end });
      if (!frames || frames.length === 0) return;
      anims.create({ key: d.key, frames, frameRate: d.fps, repeat: d.repeat });
    } catch (e) {
      console.warn('Could not create animation:', d.key, e);
    }
  });
}

// ═══════════════════════════════════════════════
//  FIGHTER SELECT SCENE  — P1 & P2 each pick a character
// ═══════════════════════════════════════════════
//  Flow:  Phase 0 = P1 picks  →  Phase 1 = P2 picks  →  go to MapSelectScene
// ═══════════════════════════════════════════════

const FIGHTER_ROSTER = [
  {
    id: 'raider',
    name: 'RAIDER',
    lore: 'BLADE MASTER',
    accent: C.n.amber, sAccent: C.s.amber,
    idleTex: 'raider_idle',
    idleAnim: 'raider-idle',
    portraitTex: 'char_raider',
    stats: { STR: 92, AGI: 58, DEF: 75, PWR: 80 },
  },
  {
    id: 'wizard',
    name: 'FIRE WIZARD',
    lore: 'ARCANE FLAME',
    accent: C.n.teal, sAccent: C.s.teal,
    idleTex: 'wizard_idle',
    idleAnim: 'wizard-idle',
    portraitTex: 'char_wizard',
    stats: { STR: 65, AGI: 80, DEF: 55, PWR: 98 },
  },
  {
    id: 'samurai',
    name: 'SAMURAI',
    lore: 'SHADOW BLADE',
    accent: C.n.crimson, sAccent: C.s.crimson,
    idleTex: 'samurai_idle',
    idleAnim: 'samurai-idle',
    portraitTex: 'char_samurai',
    stats: { STR: 85, AGI: 95, DEF: 60, PWR: 78 },
  },
  {
    id: 'lmage',
    name: 'LIGHTNING MAGE',
    lore: 'STORM HERALD',
    accent: 0xd4e8ff, sAccent: '#d4e8ff',
    idleTex: 'lmage_idle',
    idleAnim: 'lmage-idle',
    portraitTex: 'char_lmage',
    stats: { STR: 55, AGI: 88, DEF: 50, PWR: 100 },
  },
];

class FighterSelectScene extends Phaser.Scene {
  constructor() { super({ key: 'FighterSelectScene' }); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    Audio.init(this);
    this.pts = makeParticles(this, W, H);

    this._phase = 0;           // 0 = P1 picking, 1 = P2 picking
    this._selections = {};     // { p1: id, p2: id }
    this._cards = [];
    this._previewSprites = []; // live animated previews per card

    // Background band
    const band = this.add.graphics().setDepth(0);
    band.fillGradientStyle(C.n.wine, C.n.wine, C.n.navy, C.n.navy, 0.12);
    band.fillRect(0, H * 0.22, W, H * 0.60);

    // Phase label (updated each phase)
    this._phaseLabel = pageTitle(this, 'P1 — SELECT YOUR FIGHTER', H * 0.18);

    dividerLine(this, H * 0.21 + 32, W);

    // VS divider text (shown after P1 picks)
    this._vsLabel = this.add.text(W / 2, H * 0.50, '', {
      fontFamily: 'Boldonse', fontSize: '32px',
      color: C.s.teal, letterSpacing: 6,
    }).setOrigin(0.5).setDepth(20).setAlpha(0);

    // P1 chosen display (bottom left)
    this._p1ChosenLabel = this.add.text(W * 0.18, H * 0.88, '', {
      fontFamily: 'Boldonse', fontSize: '10px',
      color: C.s.amber, letterSpacing: 3,
    }).setOrigin(0.5).setDepth(20);

    this._buildCards(W, H);
    buildNav(this, 0);
  }

  _buildCards(W, H) {
    const R = Math.min(W * 0.10, 96);
    const gap = R * 0.85;
    const n = FIGHTER_ROSTER.length;
    const totalW = n * R * 2 + (n - 1) * gap;
    const startX = W / 2 - totalW / 2 + R;
    const cy = H * 0.52;

    this._cards = [];

    FIGHTER_ROSTER.forEach((fighter, i) => {
      const cx = startX + i * (R * 2 + gap);
      const delay = 160 + i * 120;

      // ── Ring ──
      const ringG = this.add.graphics().setDepth(5).setAlpha(0);
      const glowG = this.add.graphics().setDepth(4).setAlpha(0);

      const drawRing = (state) => {
        ringG.clear(); glowG.clear();
        if (state === 'hover' || state === 'selected' || state === 'disabled') {
          const a = state === 'selected' ? 0.22 : state === 'hover' ? 0.12 : 0.04;
          glowG.fillStyle(fighter.accent, a);
          glowG.fillCircle(cx, cy, R + 14);
          glowG.lineStyle(state === 'selected' ? 3 : 2, fighter.accent, state === 'selected' ? 1 : 0.55);
          glowG.strokeCircle(cx, cy, R + 14);
          glowG.lineStyle(1, fighter.accent, 0.22);
          glowG.strokeCircle(cx, cy, R + 22);
        }
        const opacity = state === 'disabled' ? 0.35 : 0.85;
        ringG.fillStyle(C.n.navy, state === 'hover' || state === 'selected' ? 0.95 : opacity);
        ringG.fillCircle(cx, cy, R);
        ringG.fillStyle(0xffffff, 0.03);
        ringG.fillCircle(cx, cy - R * 0.25, R * 0.7);
        const col = state === 'hover' || state === 'selected' ? fighter.accent : state === 'disabled' ? C.n.teal : C.n.teal;
        const thick = state === 'hover' || state === 'selected' ? 2.5 : 1.5;
        const alpha = state === 'hover' || state === 'selected' ? 1 : state === 'disabled' ? 0.2 : 0.4;
        ringG.lineStyle(thick, col, alpha);
        ringG.strokeCircle(cx, cy, R);
        if (state === 'selected') {
          [0, 90, 180, 270].forEach(deg => {
            const rad = Phaser.Math.DegToRad(deg);
            ringG.lineStyle(2, fighter.accent, 0.9);
            ringG.beginPath();
            ringG.moveTo(cx + Math.cos(rad) * (R - 1), cy + Math.sin(rad) * (R - 1));
            ringG.lineTo(cx + Math.cos(rad) * (R + 7), cy + Math.sin(rad) * (R + 7));
            ringG.strokePath();
          });
        }
      };
      drawRing('idle');

      // ── Portrait image (masked to circle) ──
      const maskShape = this.make.graphics({ x: cx, y: cy, add: false });
      maskShape.fillStyle(0xffffff);
      maskShape.fillCircle(0, 0, R - 2);
      const mask = maskShape.createGeometryMask();

      let sprite = null;
      if (this.textures.exists(fighter.portraitTex)) {
        sprite = this.add.image(cx, cy, fighter.portraitTex)
          .setDepth(6).setAlpha(0).setMask(mask);
        // Scale to fill circle — portraits are square pixel art
        const sc = (R * 2.1) / Math.min(sprite.width, sprite.height);
        sprite.setScale(sc);
        // Shift up slightly so the face is centered in the circle
        sprite.setY(cy - R * 0.08);
      } else if (this.textures.exists(fighter.idleTex)) {
        // Fallback: use first frame of idle spritesheet
        sprite = this.add.sprite(cx, cy, fighter.idleTex, 0)
          .setDepth(6).setAlpha(0).setMask(mask);
        const sc = (R * 2) / 128;
        sprite.setScale(sc);
      }

      // ── Name ──
      const nameT = this.add.text(cx, cy + R + 18, fighter.name, {
        fontFamily: 'Boldonse', fontSize: Math.round(R * 0.19) + 'px',
        color: C.s.mint, letterSpacing: 3,
      }).setOrigin(0.5).setDepth(6).setAlpha(0);

      const loreT = this.add.text(cx, cy + R + 34, fighter.lore, {
        fontFamily: 'Boldonse', fontSize: Math.round(R * 0.13) + 'px',
        color: fighter.sAccent, letterSpacing: 2,
      }).setOrigin(0.5).setDepth(6).setAlpha(0);

      // ── Stat bars ──
      const statKeys = Object.keys(fighter.stats);
      const barAreaX = cx - R;
      const barMaxW  = R * 2;
      const statStartY = cy + R + 50;
      const statObjs = [];
      statKeys.forEach((key, si) => {
        const sy  = statStartY + si * 14;
        const pct = fighter.stats[key] / 100;
        const lbl = this.add.text(barAreaX, sy, key, {
          fontFamily: 'Boldonse', fontSize: '7px', color: fighter.sAccent, letterSpacing: 1,
        }).setOrigin(0, 0.5).setDepth(6).setAlpha(0);
        const track = this.add.graphics().setDepth(6).setAlpha(0);
        track.fillStyle(0xffffff, 0.06);
        track.fillRoundedRect(barAreaX + 24, sy - 3, barMaxW - 24, 6, 3);
        const fill = this.add.graphics().setDepth(6).setAlpha(0);
        const valT = this.add.text(cx + R, sy, fighter.stats[key], {
          fontFamily: 'Boldonse', fontSize: '7px', color: C.s.sage, letterSpacing: 1,
        }).setOrigin(1, 0.5).setDepth(6).setAlpha(0);
        statObjs.push({ lbl, track, fill, valT, pct, barAreaX, barMaxW, sy });
      });
      const allStatObjs = statObjs.flatMap(s => [s.lbl, s.track, s.fill, s.valT]);

      // ── Entrance tween ──
      const enterTargets = [ringG, glowG, nameT, loreT, ...allStatObjs];
      if (sprite) enterTargets.push(sprite);
      this.tweens.add({
        targets: enterTargets,
        alpha: 1, duration: 420, delay, ease: 'Back.Out',
        onComplete: () => {
          statObjs.forEach((s, si) => {
            const fillW = (s.barMaxW - 24) * s.pct;
            this.tweens.add({
              targets: { w: 0 }, w: fillW,
              duration: 600, delay: si * 80, ease: 'Cubic.Out',
              onUpdate(tw) {
                s.fill.clear();
                s.fill.fillStyle(fighter.accent, 0.85);
                s.fill.fillRoundedRect(s.barAreaX + 24, s.sy - 3, tw.targets[0].w, 6, 3);
              }
            });
          });
        }
      });

      // Floating idle
      if (sprite) {
        this.tweens.add({
          targets: sprite, y: cy - 5,
          duration: 1600 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.InOut', delay: i * 300,
        });
      }

      const hit = this.add.circle(cx, cy, R, 0, 0).setDepth(8).setInteractive({ useHandCursor: true });

      const card = { fighter, cx, cy, R, ringG, glowG, sprite, nameT, drawRing, hit, statObjs };
      this._cards.push(card);

      hit.on('pointerover', () => {
        const alreadyChosen = this._phase === 1 && this._selections.p1 === fighter.id;
        if (alreadyChosen) return;
        SFX.hover();
        drawRing('hover');
        if (sprite) {
          this.tweens.killTweensOf(sprite);
          this.tweens.add({ targets: sprite, y: cy - 8, duration: 160, ease: 'Back.Out' });
        }
        nameT.setColor(C.s.sand);
      });

      hit.on('pointerout', () => {
        const isSelected =
          (this._phase === 1 && this._selections.p1 === fighter.id) ||
          this._selections.p2 === fighter.id;
        if (isSelected) return;
        drawRing('idle');
        if (sprite) {
          this.tweens.killTweensOf(sprite);
          this.tweens.add({
            targets: sprite, y: cy, duration: 160,
            onComplete: () => {
              this.tweens.add({ targets: sprite, y: cy - 5, duration: 1600 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
            }
          });
        }
        nameT.setColor(C.s.mint);
      });

      hit.on('pointerdown', () => {
        const alreadyChosen = this._phase === 1 && this._selections.p1 === fighter.id;
        if (alreadyChosen) { SFX.error(); return; }

        SFX.select();
        SFX.impact();
        drawRing('selected');
        this.tweens.add({ targets: ringG, scaleX: 0.9, scaleY: 0.9, duration: 80, yoyo: true, ease: 'Quad.Out' });
        flash(this, () => {});

        if (this._phase === 0) {
          // P1 just picked
          this._selections.p1 = fighter.id;
          this._phase = 1;
          this._onP1Picked(fighter);
        } else {
          // P2 just picked
          this._selections.p2 = fighter.id;
          this._onBothPicked();
        }
      });
    });
  }

  _onP1Picked(fighter) {
    // Update title
    this._phaseLabel.setText('P2 — SELECT YOUR FIGHTER');
    this._phaseLabel.setAlpha(0).setY(this._phaseLabel.y - 12);
    this.tweens.add({ targets: this._phaseLabel, alpha: 1, y: `+=12`, duration: 380, ease: 'Back.Out' });

    // Show P1 chosen badge
    this._p1ChosenLabel.setText(`P1: ${fighter.name}`).setAlpha(0);
    this.tweens.add({ targets: this._p1ChosenLabel, alpha: 1, duration: 400 });

    // Dim p1's card slightly so P2 knows it's taken
    const p1Card = this._cards.find(c => c.fighter.id === fighter.id);
    if (p1Card) {
      p1Card.hit.disableInteractive();
      p1Card.drawRing('disabled');
      if (p1Card.sprite) {
        this.tweens.add({ targets: p1Card.sprite, alpha: 0.45, duration: 300 });
      }
      p1Card.nameT.setAlpha(0.4);
    }
  }

  _onBothPicked() {
    const p1 = this._selections.p1;
    const p2 = this._selections.p2;
    // Store globally so GameScene can pick up
    window._fightSelections = { p1, p2 };

    // Brief VS flash, then go to map select
    const W = this.scale.width, H = this.scale.height;
    const p1f = FIGHTER_ROSTER.find(f => f.id === p1);
    const p2f = FIGHTER_ROSTER.find(f => f.id === p2);

    this._vsLabel
      .setText(`${p1f.name}  VS  ${p2f.name}`)
      .setAlpha(0).setScale(0.6);
    this.tweens.add({
      targets: this._vsLabel, alpha: 1, scaleX: 1, scaleY: 1,
      duration: 500, ease: 'Back.Out',
    });

    SFX.powerUp();
    this.time.delayedCall(900, () => {
      flash(this, () => this.scene.start('MapSelectScene'));
    });
  }

  update() { tickParticles(this.pts); }
}

// ═══════════════════════════════════════════════
//  CHARACTER SCENE — Enhanced
// ═══════════════════════════════════════════════
class CharacterScene extends Phaser.Scene {
  constructor() { super({ key: 'CharacterScene' }); }

  preload() {
    this.load.image('char1', 'assets/characters/char1.png');
    this.load.image('char2', 'assets/characters/char2.png');
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    Audio.init(this);
    this.pts = makeParticles(this, W, H);

    // Background gradient band
    const band = this.add.graphics().setDepth(0);
    band.fillGradientStyle(C.n.wine, C.n.wine, C.n.navy, C.n.navy, 0.12);
    band.fillRect(0, H * 0.28, W, H * 0.54);

    pageTitle(this, 'SELECT FIGHTER', H * 0.20);
    dividerLine(this, H * 0.21 + 32, W);

    const chars = [
      { name: 'RAIDER',  img: 'char1', accent: C.n.amber,   sAccent: C.s.amber,   lore: 'BLADE MASTER',   stats: { STR: 92, AGI: 58, DEF: 75, PWR: 80 } },
      { name: 'WIZARD',   img: 'char2', accent: C.n.teal,    sAccent: C.s.teal,    lore: 'FRONT LINER',    stats: { STR: 80, AGI: 72, DEF: 65, PWR: 60 } },
      { name: 'SAMURAI', img: 'char3', accent: C.n.crimson, sAccent: C.s.crimson, lore: 'SHADOW HUNTER',  stats: { STR: 62, AGI: 96, DEF: 54, PWR: 70 } },
      { name: 'MAGE',   img: 'char4', accent: C.n.mint,    sAccent: C.s.mint,    lore: 'IRON GENERAL',   stats: { STR: 88, AGI: 50, DEF: 95, PWR: 76 } },
    ];

    // ── Circle portrait layout ──────────────────────────────────
    const R = Math.min(W * 0.085, 80);      // circle radius
    const gap = R * 0.9;                     // gap between circles
    const totalW = chars.length * R * 2 + (chars.length - 1) * gap;
    const startX = W / 2 - totalW / 2 + R;
    const cy = H * 0.50;
    let selectedIdx = -1;

    chars.forEach((ch, i) => {
      const cx = startX + i * (R * 2 + gap);
      const delay = 180 + i * 110;

      // ── Ring graphics (drawn behind portrait) ──
      const ringG = this.add.graphics().setDepth(5).setAlpha(0);
      const glowG = this.add.graphics().setDepth(4).setAlpha(0);

      const drawRing = (state) => {
        ringG.clear(); glowG.clear();

        // outer glow / selection halo
        if (state === 'hover' || state === 'selected') {
          glowG.fillStyle(ch.accent, state === 'selected' ? 0.18 : 0.10);
          glowG.fillCircle(cx, cy, R + 14);
          glowG.lineStyle(state === 'selected' ? 3 : 2, ch.accent, state === 'selected' ? 1 : 0.6);
          glowG.strokeCircle(cx, cy, R + 14);
          // second pulsing ring
          glowG.lineStyle(1, ch.accent, 0.25);
          glowG.strokeCircle(cx, cy, R + 22);
        }

        // dark backdrop fill inside circle
        ringG.fillStyle(C.n.navy, state === 'hover' || state === 'selected' ? 0.95 : 0.75);
        ringG.fillCircle(cx, cy, R);

        // inner highlight arc (top)
        ringG.fillStyle(0xffffff, 0.04);
        ringG.fillCircle(cx, cy - R * 0.25, R * 0.7);

        // main border ring
        const borderAlpha = state === 'hover' ? 1 : state === 'selected' ? 1 : 0.4;
        const borderThick = state === 'hover' || state === 'selected' ? 2.5 : 1.5;
        const borderCol   = state === 'hover' || state === 'selected' ? ch.accent : C.n.teal;
        ringG.lineStyle(borderThick, borderCol, borderAlpha);
        ringG.strokeCircle(cx, cy, R);

        // accent tick marks around the ring (4 cardinal positions)
        if (state === 'hover' || state === 'selected') {
          [0, 90, 180, 270].forEach(deg => {
            const rad = Phaser.Math.DegToRad(deg);
            const ix  = cx + Math.cos(rad) * (R - 1);
            const iy  = cy + Math.sin(rad) * (R - 1);
            const ox  = cx + Math.cos(rad) * (R + 6);
            const oy  = cy + Math.sin(rad) * (R + 6);
            ringG.lineStyle(2, ch.accent, 0.9);
            ringG.beginPath(); ringG.moveTo(ix, iy); ringG.lineTo(ox, oy); ringG.strokePath();
          });
        }
      };

      drawRing('idle');

      // ── Portrait image (masked to circle via RenderTexture) ──
      // We use a RenderTexture so we can clip the image into a circle
      const rt = this.add.renderTexture(cx - R, cy - R, R * 2, R * 2).setDepth(6).setAlpha(0);

      // Create a circular mask graphic
      const maskShape = this.make.graphics({ x: cx, y: cy, add: false });
      maskShape.fillStyle(0xffffff);
      maskShape.fillCircle(0, 0, R);
      const mask = maskShape.createGeometryMask();

      const portrait = this.add.image(cx, cy, ch.img).setDepth(6).setAlpha(0).setMask(mask);
      // Scale to fill circle
      const imgScale = (R * 2.1) / Math.min(portrait.width, portrait.height);
      portrait.setScale(imgScale);
      // Crop faces: shift slightly upward so face is centered
      portrait.setY(cy - R * 0.15);

      // ── Name text ──
      const nameT = this.add.text(cx, cy + R + 18, ch.name, {
        fontFamily: 'Boldonse', fontStyle: 'bold',
        fontSize: Math.round(R * 0.22) + 'px', color: C.s.mint, letterSpacing: 3,
      }).setOrigin(0.5).setDepth(6).setAlpha(0);

      // ── Lore subtitle ──
      const loreT = this.add.text(cx, cy + R + 34, ch.lore, {
        fontFamily: 'Boldonse', fontSize: Math.round(R * 0.14) + 'px',
        color: ch.sAccent, letterSpacing: 2,
      }).setOrigin(0.5).setDepth(6).setAlpha(0);

      // ── Stat bar strip (compact, below lore) ──
      const statKeys   = Object.keys(ch.stats);
      const barAreaX   = cx - R;
      const barMaxW    = R * 2;
      const statStartY = cy + R + 50;
      const statObjs   = [];

      statKeys.forEach((key, si) => {
        const sy  = statStartY + si * 14;
        const pct = ch.stats[key] / 100;

        const lbl = this.add.text(barAreaX, sy, key, {
          fontFamily: 'Boldonse', fontSize: '7px', color: ch.sAccent, letterSpacing: 1,
        }).setOrigin(0, 0.5).setDepth(6).setAlpha(0);

        const track = this.add.graphics().setDepth(6).setAlpha(0);
        track.fillStyle(0xffffff, 0.06);
        track.fillRoundedRect(barAreaX + 22, sy - 3, barMaxW - 22, 6, 3);

        const fill = this.add.graphics().setDepth(6).setAlpha(0);

        const valT = this.add.text(cx + R, sy, ch.stats[key], {
          fontFamily: 'Boldonse', fontSize: '7px', color: C.s.sage, letterSpacing: 1,
        }).setOrigin(1, 0.5).setDepth(6).setAlpha(0);

        statObjs.push({ lbl, track, fill, valT, pct, barAreaX, barMaxW, sy });
      });

      const allStatObjs = statObjs.flatMap(s => [s.lbl, s.track, s.fill, s.valT]);

      // ── Entrance animation ──
      this.tweens.add({
        targets: [ringG, glowG, portrait, nameT, loreT, ...allStatObjs],
        alpha: 1, duration: 420, delay, ease: 'Back.Out',
        onComplete: () => {
          statObjs.forEach((s, si) => {
            const fillW = (s.barMaxW - 22) * s.pct;
            this.tweens.add({
              targets: { w: 0 }, w: fillW,
              duration: 600, delay: si * 80, ease: 'Cubic.Out',
              onUpdate(tw) {
                s.fill.clear();
                s.fill.fillStyle(ch.accent, 0.85);
                s.fill.fillRoundedRect(s.barAreaX + 22, s.sy - 3, tw.targets[0].w, 6, 3);
              }
            });
          });
        }
      });

      // ── Invisible hit circle ──
      const hit = this.add.circle(cx, cy, R, 0, 0).setDepth(8).setInteractive({ useHandCursor: true });

      // portrait base position & scale for animations
      const portraitBaseY     = portrait.y;
      const portraitBaseScale = portrait.scaleX;

      // ── Idle floating tween ──
      this.tweens.add({
        targets: portrait,
        y: portraitBaseY - 5,
        duration: 1600 + i * 200,
        yoyo: true, repeat: -1, ease: 'Sine.InOut',
        delay: i * 250,
      });

      hit.on('pointerover', () => {
        if (selectedIdx === i) return;
        SFX.hover();
        drawRing('hover');
        this.tweens.killTweensOf(portrait);
        this.tweens.add({ targets: portrait, y: portraitBaseY - 8, duration: 160, ease: 'Back.Out' });
        nameT.setColor(C.s.sand);
      });

      hit.on('pointerout', () => {
        if (selectedIdx === i) return;
        drawRing('idle');
        this.tweens.killTweensOf(portrait);
        this.tweens.add({ targets: portrait, y: portraitBaseY, duration: 160,
          onComplete: () => {
            this.tweens.add({ targets: portrait, y: portraitBaseY - 5, duration: 1600 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
          }
        });
        nameT.setColor(C.s.mint);
      });

      hit.on('pointerdown', () => {
        SFX.select();
        SFX.impact();
        selectedIdx = i;
        // re-draw all rings
        chars.forEach((_, j) => {
          // rings will be redrawn on next event; force idle redraw
        });
        drawRing('selected');
        // Bounce punch
        this.tweens.add({ targets: [portrait, ringG], scaleX: 0.9, scaleY: 0.9, duration: 80, yoyo: true, ease: 'Quad.Out' });
        // flash burst
        flash(this, () => {});
      });
    });

    // ── Difficulty Selector ──────────────────────────────────
    const diffLevels = [
      { id: 'easy',     label: 'EASY',     color: 0x27c93f, sColor: '#27c93f', desc: 'RELAXED PACE'    },
      { id: 'moderate', label: 'MODERATE', color: 0xe07820, sColor: '#e07820', desc: 'BALANCED FIGHT'  },
      { id: 'hard',     label: 'HARD',     color: 0xcc2200, sColor: '#cc2200', desc: 'MERCILESS FOE'   },
    ];

    let selectedDiff = window._difficulty || 'moderate';

    const diffY     = H * 0.82;
    const btnW      = Math.min(W * 0.14, 130);
    const btnH      = 34;
    const btnGap    = btnW * 0.22;
    const totalDiffW = btnW * 3 + btnGap * 2;
    const diffStartX = W / 2 - totalDiffW / 2;

    this.add.text(W / 2, diffY - 22, 'ENEMY DIFFICULTY', {
      fontFamily: 'Boldonse', fontSize: '9px', color: C.s.sage, letterSpacing: 4,
    }).setOrigin(0.5).setDepth(6);

    const diffDesc = this.add.text(W / 2, diffY + btnH + 14, '', {
      fontFamily: 'Boldonse', fontSize: '8px', color: C.s.sand, letterSpacing: 3,
    }).setOrigin(0.5).setDepth(6);

    const diffBtnGraphics = [];

    diffLevels.forEach((d, i) => {
      const bx = diffStartX + i * (btnW + btnGap);
      const bg = this.add.graphics().setDepth(6);
      diffBtnGraphics.push({ bg, d });

      const drawBtn = (state) => {
        bg.clear();
        const isActive = selectedDiff === d.id;
        const isHover  = state === 'hover';

        // Shadow
        bg.fillStyle(0x000000, 0.35);
        bg.fillRoundedRect(bx + 2, diffY + 2, btnW, btnH, 8);

        // Fill
        if (isActive) {
          bg.fillStyle(d.color, 0.9);
          bg.fillRoundedRect(bx, diffY, btnW, btnH, 8);
          // Inner shine
          bg.fillStyle(0xffffff, 0.15);
          bg.fillRoundedRect(bx + 2, diffY + 2, btnW - 4, btnH * 0.45, 6);
        } else {
          bg.fillStyle(0x0a0a18, isHover ? 0.95 : 0.75);
          bg.fillRoundedRect(bx, diffY, btnW, btnH, 8);
        }

        // Border
        bg.lineStyle(isActive ? 2.5 : 1.5, d.color, isActive ? 1 : isHover ? 0.8 : 0.35);
        bg.strokeRoundedRect(bx, diffY, btnW, btnH, 8);

        // Corner accent dots
        if (isActive) {
          [[bx + 6, diffY + 6], [bx + btnW - 6, diffY + 6],
           [bx + 6, diffY + btnH - 6], [bx + btnW - 6, diffY + btnH - 6]].forEach(([ax, ay]) => {
            bg.fillStyle(0xffffff, 0.5);
            bg.fillCircle(ax, ay, 2);
          });
        }
      };

      drawBtn('idle');

      const label = this.add.text(bx + btnW / 2, diffY + btnH / 2, d.label, {
        fontFamily: 'Boldonse', fontSize: '10px',
        color: selectedDiff === d.id ? '#ffffff' : d.sColor,
        letterSpacing: 2,
      }).setOrigin(0.5).setDepth(7);

      const hit = this.add.rectangle(bx + btnW / 2, diffY + btnH / 2, btnW, btnH, 0, 0)
        .setDepth(8).setInteractive({ useHandCursor: true });

      const refreshAll = () => {
        diffBtnGraphics.forEach(({ bg: b, d: dd }, j) => {
          b.clear();
          const active = selectedDiff === dd.id;
          b.fillStyle(0x000000, 0.35);
          b.fillRoundedRect(diffStartX + j * (btnW + btnGap) + 2, diffY + 2, btnW, btnH, 8);
          b.fillStyle(active ? dd.color : 0x0a0a18, active ? 0.9 : 0.75);
          b.fillRoundedRect(diffStartX + j * (btnW + btnGap), diffY, btnW, btnH, 8);
          if (active) {
            b.fillStyle(0xffffff, 0.15);
            b.fillRoundedRect(diffStartX + j * (btnW + btnGap) + 2, diffY + 2, btnW - 4, btnH * 0.45, 6);
          }
          b.lineStyle(active ? 2.5 : 1.5, dd.color, active ? 1 : 0.35);
          b.strokeRoundedRect(diffStartX + j * (btnW + btnGap), diffY, btnW, btnH, 8);
          if (active) {
            [[diffStartX + j*(btnW+btnGap)+6,diffY+6],[diffStartX+j*(btnW+btnGap)+btnW-6,diffY+6],
             [diffStartX+j*(btnW+btnGap)+6,diffY+btnH-6],[diffStartX+j*(btnW+btnGap)+btnW-6,diffY+btnH-6]
            ].forEach(([ax,ay])=>{ b.fillStyle(0xffffff,0.5); b.fillCircle(ax,ay,2); });
          }
        });
        // Refresh all label colors
        diffLevels.forEach((dd, j) => {
          // labels array aligned by closure — use diffLabelObjs
        });
      };

      hit.on('pointerover', () => {
        if (selectedDiff !== d.id) { drawBtn('hover'); }
        diffDesc.setText(d.desc);
      });
      hit.on('pointerout', () => {
        if (selectedDiff !== d.id) { drawBtn('idle'); }
        diffDesc.setText(diffLevels.find(dd => dd.id === selectedDiff)?.desc || '');
      });
      hit.on('pointerdown', () => {
        SFX.select();
        selectedDiff = d.id;
        window._difficulty = d.id;
        refreshAll();
        label.setColor('#ffffff');
        diffDesc.setText(d.desc);
        // Punch scale feedback
        this.tweens.add({ targets: bg, scaleX: 0.93, scaleY: 0.93, duration: 70, yoyo: true });
      });

      // Keep label color in sync after selection
      this.events.on('update', () => {
        label.setColor(selectedDiff === d.id ? '#ffffff' : d.sColor);
      });
    });

    // Show desc for current default
    diffDesc.setText(diffLevels.find(d => d.id === selectedDiff)?.desc || '');

    // ── "Coming soon" label ──────────────────────────────────
    const comingSoon = this.add.text(W / 2, H * 0.88, 'MORE FIGHTERS COMING SOON', {
      fontFamily: 'Boldonse', fontStyle: 'bold',
      fontSize: '10px', color: C.s.sage, letterSpacing: 4, alpha: 0.6,
    }).setOrigin(0.5).setDepth(5);
    this.tweens.add({ targets: comingSoon, alpha: { from: 0.3, to: 0.7 }, duration: 1800, yoyo: true, repeat: -1 });

    buildNav(this, 0);
  }

  update() { tickParticles(this.pts); }
}

// ═══════════════════════════════════════════════
//  MAP SELECT SCENE — Enhanced
// ═══════════════════════════════════════════════
class MapSelectScene extends Phaser.Scene {
  constructor() { super({ key: 'MapSelectScene' }); }

  preload() {
    ['game_background_1','game_background_2','game_background_3','game_background_4'].forEach(k => this.load.image(k, `assets/${k}.png`));
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    Audio.init(this);
    this.pts = makeParticles(this, W, H);

    pageTitle(this, 'SELECT MAP', H * 0.20);
    dividerLine(this, H * 0.21 + 32, W);

    // large faded preview
    this.preview = this.add.image(W / 2, H * 0.50, 'game_background_1')
      .setAlpha(0).setDisplaySize(W * 0.58, H * 0.52).setDepth(1);

    const maps = [
      { key: 'game_background_1', label: 'MAP 1', sublabel: 'DOJO OF FATE',   accent: C.n.amber,   sAccent: C.s.amber   },
      { key: 'game_background_2', label: 'MAP 2', sublabel: 'BLOOD CANYON',   accent: C.n.teal,    sAccent: C.s.teal    },
      { key: 'game_background_3', label: 'MAP 3', sublabel: 'SHADOW PALACE',  accent: C.n.rust,    sAccent: C.s.rust    },
      { key: 'game_background_4', label: 'MAP 4', sublabel: 'DEATH ARENA',    accent: C.n.crimson, sAccent: C.s.crimson },
    ];

    const R     = Math.min(W, H) * 0.082;
    const GAP   = R * 2.85;
    const totalW = GAP * 3;
    const sx    = W / 2 - totalW / 2;
    const cy    = H * 0.50;

    this.prompt = this.add.text(W / 2, H * 0.79, 'HOVER TO PREVIEW  ·  CLICK TO ENTER', {
      fontFamily: 'Boldonse', fontStyle: 'bold',
      fontSize: Math.round(W * 0.011) + 'px',
      color: C.s.sage, letterSpacing: 3,
    }).setOrigin(0.5).setDepth(10);

    maps.forEach((map, i) => {
      const cx = sx + GAP * i;
      const delay = 180 + i * 90;

      // outer deco ring (rotating)
      const deco = this.add.graphics().setDepth(3).setAlpha(0);
      deco.lineStyle(1, map.accent, 0.22);
      deco.strokeCircle(cx, cy, R + 15);

      // tick marks on deco ring
      for (let ti = 0; ti < 8; ti++) {
        const angle = (ti / 8) * Math.PI * 2;
        const x1 = cx + Math.cos(angle) * (R + 12);
        const y1 = cy + Math.sin(angle) * (R + 12);
        const x2 = cx + Math.cos(angle) * (R + 18);
        const y2 = cy + Math.sin(angle) * (R + 18);
        deco.lineStyle(1.5, map.accent, 0.5);
        deco.beginPath(); deco.moveTo(x1, y1); deco.lineTo(x2, y2); deco.strokePath();
      }

      // glow ring
      const glow = this.add.graphics().setDepth(3).setAlpha(0);

      // thumbnail
      const thumb = this.add.image(cx, cy, map.key)
        .setDepth(4).setDisplaySize(R * 2, R * 2).setAlpha(0);
      const msk = this.make.graphics({ x: cx, y: cy, add: false });
      msk.fillStyle(0xffffff); msk.fillCircle(0, 0, R);
      thumb.setMask(msk.createGeometryMask());

      // border ring
      const border = this.add.graphics().setDepth(5).setAlpha(0);
      const drawBorder = (color, thick, alpha) => {
        border.clear();
        border.lineStyle(thick, color, alpha);
        border.strokeCircle(cx, cy, R);
      };
      drawBorder(map.accent, 2, 0.7);

      // accent dot
      const dot = this.add.graphics().setDepth(6).setAlpha(0);
      dot.fillStyle(map.accent, 1);
      dot.fillCircle(cx, cy - R - 8, 4);

      // map label
      const label = this.add.text(cx, cy + R + 20, map.label, {
        fontFamily: 'Boldonse', fontStyle: 'bold',
        fontSize: Math.round(W * 0.013) + 'px',
        color: C.s.sage, letterSpacing: 3,
      }).setOrigin(0.5).setDepth(6).setAlpha(0);

      // sublabel
      const subLbl = this.add.text(cx, cy + R + 36, map.sublabel, {
        fontFamily: 'Boldonse', fontSize: Math.round(W * 0.0085) + 'px',
        color: map.sAccent, letterSpacing: 2,
      }).setOrigin(0.5).setDepth(6).setAlpha(0);

      const hit = this.add.circle(cx, cy, R, 0, 0)
        .setDepth(9).setInteractive({ useHandCursor: true });

      // entrance tweens
      this.tweens.add({
        targets: [thumb, border, deco, dot, label, subLbl],
        alpha: 1, duration: 420, delay, ease: 'Cubic.Out',
      });

      hit.on('pointerover', () => {
        SFX.hover();
        SFX.rumble();
        glow.clear().setAlpha(1);
        glow.lineStyle(20, map.accent, 0.12); glow.strokeCircle(cx, cy, R + 8);
        glow.lineStyle(4, map.accent, 0.65);  glow.strokeCircle(cx, cy, R + 1);
        drawBorder(map.accent, 2.5, 1);
        label.setColor(map.sAccent);
        this.tweens.add({
          targets: thumb,
          scaleX: (R * 2.1) / thumb.width, scaleY: (R * 2.1) / thumb.height,
          duration: 180, ease: 'Cubic.Out',
        });
        // scale up the dot
        this.tweens.add({ targets: dot, scaleX: 1.4, scaleY: 1.4, duration: 150 });
        this.preview.setTexture(map.key).setAlpha(0);
        this.tweens.add({ targets: this.preview, alpha: 0.16, duration: 300 });
        this.prompt.setText('CLICK TO ENTER ' + map.label).setColor(map.sAccent);
      });

      hit.on('pointerout', () => {
        glow.clear().setAlpha(0);
        drawBorder(map.accent, 2, 0.7);
        label.setColor(C.s.sage);
        this.tweens.add({
          targets: thumb,
          scaleX: (R * 2) / thumb.width, scaleY: (R * 2) / thumb.height,
          duration: 180, ease: 'Cubic.Out',
        });
        this.tweens.add({ targets: dot, scaleX: 1, scaleY: 1, duration: 150 });
        this.tweens.add({ targets: this.preview, alpha: 0, duration: 200 });
        this.prompt.setText('HOVER TO PREVIEW  ·  CLICK TO ENTER').setColor(C.s.sage);
      });

      hit.on('pointerdown', () => {
        SFX.powerUp();
        SFX.confirm();
        this.tweens.add({ targets: thumb, scaleX: (R * 1.9) / thumb.width, scaleY: (R * 1.9) / thumb.height, duration: 80, yoyo: true });
        flash(this, () => this.scene.start('GameScene', { mapKey: map.key, ...(window._fightSelections || { p1: 'raider', p2: 'raider' }) }));
      });
    });

    buildNav(this, 1);
  }

  update() { tickParticles(this.pts); }
}

// ═══════════════════════════════════════════════
//  CREDITS SCENE — Enhanced
// ═══════════════════════════════════════════════
class CreditsScene extends Phaser.Scene {
  constructor() { super({ key: 'CreditsScene' }); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.add.rectangle(W / 2, H / 2, W, H, C.n.bg);
    Audio.init(this);
    this.pts = makeParticles(this, W, H, 50);

    // center glow band
    const band = this.add.graphics().setDepth(0);
    band.fillGradientStyle(C.n.wine, C.n.wine, C.n.navy, C.n.navy, 0.0);
    band.fillRect(0, H * 0.30, W, H * 0.46);

    pageTitle(this, 'CREDITS', H * 0.20);
    dividerLine(this, H * 0.21 + 32, W);

    const entries = [
      { role: 'GAME DESIGN',   name: 'Amro',  accent: C.s.amber,   icon: '🎮' },
      { role: 'PROGRAMMING',   name: 'Hazem',  accent: C.s.teal,    icon: '💻' },
      { role: 'ART & ASSETS',  name: 'Ismael',  accent: C.s.orange,  icon: '🎨' },
      { role: 'SOUND & MUSIC', name: 'Abdul Rahman',  accent: C.s.rust,    icon: '🎵' },
      { role: 'SPECIAL THANKS',name: 'Everyone ♥', accent: C.s.sand,    icon: '❤' },
    ];

    const rowH  = H * 0.076;
    const startY = H * 0.35;
    const midX   = W / 2;

    entries.forEach((e, i) => {
      const y = startY + i * rowH;
      const delay = 120 + i * 90;

      // row background
      const rowBg = this.add.graphics().setDepth(4).setAlpha(0);
      rowBg.fillStyle(parseInt(e.accent.replace('#',''), 16), 0.05);
      rowBg.fillRoundedRect(midX - 225, y - 14, 450, 28, 4);

      // accent bar
      const bar = this.add.graphics().setDepth(5).setAlpha(0);
      bar.fillStyle(parseInt(e.accent.replace('#',''), 16), 1);
      bar.fillRect(midX - 220, y - 8, 3, 16);

      // corner dots
      const dotG = this.add.graphics().setDepth(5).setAlpha(0);
      dotG.fillStyle(parseInt(e.accent.replace('#',''), 16), 0.6);
      dotG.fillCircle(midX - 224, y, 2);
      dotG.fillCircle(midX + 224, y, 2);

      this.add.text(midX - 206, y, e.role, {
        fontFamily: 'Boldonse', fontStyle: 'bold',
        fontSize: Math.round(W * 0.011) + 'px',
        color: e.accent, letterSpacing: 3,
      }).setOrigin(0, 0.5).setDepth(5).setAlpha(0).__delay = delay;

      this.add.text(midX + 22, y, e.name, {
        fontFamily: 'Boldonse',
        fontSize: Math.round(W * 0.013) + 'px',
        color: C.s.sand,
      }).setOrigin(0, 0.5).setDepth(5).setAlpha(0).__delay = delay;

      // separator
      this.add.text(midX + 8, y, '·', {
        fontFamily: 'Boldonse', fontSize: '14px', color: e.accent,
      }).setOrigin(0, 0.5).setDepth(5).setAlpha(0).__delay = delay;

      this.tweens.add({ targets: [bar, rowBg, dotG], alpha: 1, duration: 320, delay });
    });

    this.children.list
      .filter(o => o.depth === 5 && o.alpha === 0 && o.__delay !== undefined)
      .forEach(o => this.tweens.add({ targets: o, alpha: 1, duration: 320, delay: o.__delay }));

    // version
    this.add.text(W / 2, H * 0.82, 'v0.1.0  ·  PHASER 3  ·  FATAL BLOWS', {
      fontFamily: 'Boldonse', fontStyle: 'bold',
      fontSize: '9px', color: C.s.sage, letterSpacing: 3, alpha: 0.5,
    }).setOrigin(0.5).setDepth(5);

    buildNav(this, 2);
  }

  update() { tickParticles(this.pts); }
}

// ═══════════════════════════════════════════════
//  GAME SCENE — Full Raider_1 Gameplay
// ═══════════════════════════════════════════════
class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }
  init(data) {
    this.mapKey     = data.mapKey     || 'game_background_1';
    this.p1Id       = data.p1         || 'raider';
    this.p2Id       = data.p2         || 'raider';
    this._round     = data.round      || 1;
    this._diffLevel = data.diffLevel  || 0;  // 0=easy,1=moderate,2=hard,3=nightmare
  }

  preload() {
    // Load map backgrounds if not already loaded
    ['game_background_1','game_background_2','game_background_3','game_background_4'].forEach(k => {
      if (!this.textures.exists(k))
        this.load.image(k, `assets/${k}.png`);
    });
    // Animated background assets for map 1
    const animAssets = { sky:'assets/game_background_1/layers/sky.png', 
      clouds1:'assets/game_background_1/layers/clouds_1.png', 
      clouds2:'assets/game_background_1/layers/clouds_2.png', 
      clouds3:'assets/game_background_1/layers/clouds_3.png', 
      clouds4:'assets/game_background_1/layers/clouds_4.png', 
      rocks1:'assets/game_background_1/layers/rocks_1.png', 
      rocks2:'assets/game_background_1/layers/rocks_2.png' };
    Object.entries(animAssets).forEach(([k,v]) => { if (!this.textures.exists(k)) this.load.image(k, v); });
    // Animated background assets for map 2
    const animAssets2 = {
      b2_sky:    'assets/game_background_2/layers/sky.png',
      b2_clouds1:'assets/game_background_2/layers/clouds_1.png',
      b2_clouds2:'assets/game_background_2/layers/clouds_2.png',
      b2_clouds3:'assets/game_background_2/layers/clouds_3.png',
      b2_rocks1: 'assets/game_background_2/layers/rocks_1.png',
      b2_rocks2: 'assets/game_background_2/layers/rocks_2.png',
      b2_rocks3: 'assets/game_background_2/layers/rocks_3.png',
      b2_pines:  'assets/game_background_2/layers/pines.png',
      b2_birds:  'assets/game_background_2/layers/birds.png',
    };
    Object.entries(animAssets2).forEach(([k,v]) => { if (!this.textures.exists(k)) this.load.image(k, v); });
    // Animated background assets for map 3
    const animAssets3 = {
      b3_sky:     'assets/game_background_3/layers/sky.png',
      b3_clouds1: 'assets/game_background_3/layers/clouds_1.png',
      b3_clouds2: 'assets/game_background_3/layers/clouds_2.png',
      b3_ground1: 'assets/game_background_3/layers/ground_1.png',
      b3_ground2: 'assets/game_background_3/layers/ground_2.png',
      b3_ground3: 'assets/game_background_3/layers/ground_3.png',
      b3_plant:   'assets/game_background_3/layers/plant.png',
      b3_rocks:   'assets/game_background_3/layers/rocks.png',
    };
    Object.entries(animAssets3).forEach(([k,v]) => { if (!this.textures.exists(k)) this.load.image(k, v); });
    // Animated background assets for map 4
    const animAssets4 = {
      b4_sky:     'assets/game_background_4/layers/sky.png',
      b4_clouds1: 'assets/game_background_4/layers/clouds_1.png',
      b4_clouds2: 'assets/game_background_4/layers/clouds_2.png',
      b4_rocks:   'assets/game_background_4/layers/rocks.png',
      b4_ground:  'assets/game_background_4/layers/ground.png',
    };
    Object.entries(animAssets4).forEach(([k,v]) => { if (!this.textures.exists(k)) this.load.image(k, v); });
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    Audio.init(this);

    // Sync AI difficulty from round progression level
    const _DIFF_IDS = ['easy', 'moderate', 'hard', 'hard'];
    window._difficulty = _DIFF_IDS[this._diffLevel] || 'moderate';

    // ── Background ──────────────────────────────────────────
    if (this.mapKey === 'game_background_1' && this.textures.exists('sky')) {
      // ── Animated parallax background for Map 1 ──
      this._animBg = {};

      // Sky
      this._animBg.sky = this.add.image(W/2, H/2, 'sky').setDisplaySize(W, H).setDepth(0);

      // Atmospheric dusk overlay
      this._animBg.atmGfx = this.add.graphics().setDepth(0);
      this._drawMap1Atm();

      // Rocks layer 1 — distant mountains (slow scroll)
      this._animBg.r1a = this.add.image(0, H, 'rocks1').setOrigin(0,1).setDisplaySize(W, H).setAlpha(0.95).setDepth(1);
      this._animBg.r1b = this.add.image(W, H, 'rocks1').setOrigin(0,1).setDisplaySize(W, H).setAlpha(0.95).setFlipX(true).setDepth(1);

      // Rocks layer 2 — foreground cliffs/trees (faster scroll)
      this._animBg.r2a = this.add.image(0, H, 'rocks2').setOrigin(0,1).setDisplaySize(W, H).setAlpha(1).setDepth(2);
      this._animBg.r2b = this.add.image(W, H, 'rocks2').setOrigin(0,1).setDisplaySize(W, H).setAlpha(1).setFlipX(true).setDepth(2);

      // Cloud layers
      const cloudDefs = [
        { key:'clouds1', yRatio:0.04, speed:12, alpha:0.55 },
        { key:'clouds2', yRatio:0.18, speed:18, alpha:0.65 },
        { key:'clouds3', yRatio:0.35, speed:28, alpha:0.75 },
        { key:'clouds4', yRatio:0.28, speed:35, alpha:0.80 },
      ];
      this._animBg.cloudDefs   = cloudDefs;
      this._animBg.cloudLayers = [];
      cloudDefs.forEach(def => {
        const a = this.add.image(W*0.5,  def.yRatio*H, def.key).setDisplaySize(W, H*0.5).setAlpha(def.alpha).setOrigin(0.5,0).setDepth(3);
        const b = this.add.image(W*1.5,  def.yRatio*H, def.key).setDisplaySize(W, H*0.5).setAlpha(def.alpha).setOrigin(0.5,0).setDepth(3);
        this._animBg.cloudLayers.push({ a, b, speed: def.speed });
      });

      // Wind streaks graphics
      this._animBg.windGfx  = this.add.graphics().setDepth(4);
      this._animBg.windLines = Array.from({length:28}, () => this._newMap1Wind(true));

      // Dust particles
      this._animBg.dustGfx       = this.add.graphics().setDepth(4);
      this._animBg.dustParticles  = Array.from({length:60}, () => this._newMap1Dust(true));

      // Embers
      this._animBg.emberGfx = this.add.graphics().setDepth(4);
      this._animBg.embers   = Array.from({length:20}, () => this._newMap1Ember(true));

      // Lightning flash rectangle (behind HUD)
      this._animBg.lightning = this.add.rectangle(W/2, H/2, W, H, 0xffffff, 0).setDepth(5);
      this._scheduleMap1Lightning();

      // Handle resize
      this.scale.on('resize', (gs) => {
        const nW = gs.width, nH = gs.height;
        const ab = this._animBg;
        ab.sky.setPosition(nW/2, nH/2).setDisplaySize(nW, nH);
        this._drawMap1Atm();
        ab.r1a.setPosition(0,  nH).setDisplaySize(nW, nH);
        ab.r1b.setPosition(nW, nH).setDisplaySize(nW, nH);
        ab.r2a.setPosition(0,  nH).setDisplaySize(nW, nH);
        ab.r2b.setPosition(nW, nH).setDisplaySize(nW, nH);
        ab.cloudLayers.forEach((layer, i) => {
          const def = ab.cloudDefs[i];
          layer.a.setPosition(nW*0.5, def.yRatio*nH).setDisplaySize(nW, nH*0.5);
          layer.b.setPosition(nW*1.5, def.yRatio*nH).setDisplaySize(nW, nH*0.5);
        });
        ab.lightning.setPosition(nW/2, nH/2).setSize(nW, nH);
        this._resizeHUD();
      }, this);

      this.bg = null; // no static bg needed
    } else if (this.mapKey === 'game_background_2' && this.textures.exists('b2_sky')) {
      // ── Animated parallax background for Map 2 ──
      this._animBg2 = {};
      const ab2 = this._animBg2;

      // Sky (full fill)
      ab2.sky = this.add.image(W/2, H/2, 'b2_sky').setDisplaySize(W, H).setDepth(0);

      // Rocks layer 1 — farthest distant hills (static, centered)
      ab2.rocks1 = this.add.image(W/2, H, 'b2_rocks1').setOrigin(0.5,1).setDisplaySize(W, H).setDepth(1);

      // Rocks layer 2 — mid mountains (very slow drift)
      ab2.rocks2a = this.add.image(0,   H, 'b2_rocks2').setOrigin(0,1).setDisplaySize(W, H).setDepth(2);
      ab2.rocks2b = this.add.image(W,   H, 'b2_rocks2').setOrigin(0,1).setDisplaySize(W, H).setDepth(2).setFlipX(true);

      // Rocks layer 3 — close mountains (slow drift)
      ab2.rocks3a = this.add.image(0,   H, 'b2_rocks3').setOrigin(0,1).setDisplaySize(W, H).setDepth(3);
      ab2.rocks3b = this.add.image(W,   H, 'b2_rocks3').setOrigin(0,1).setDisplaySize(W, H).setDepth(3).setFlipX(true);

      // Pines — foreground tree line (static, centered, grounded)
      ab2.pines = this.add.image(W/2, H, 'b2_pines').setOrigin(0.5,1).setDisplaySize(W, H).setDepth(4);

      // Cloud layers (scroll left, different speeds/heights)
      const b2CloudDefs = [
        { key:'b2_clouds1', yRatio:0.05, speed:8,  alpha:0.70 },
        { key:'b2_clouds2', yRatio:0.20, speed:14, alpha:0.80 },
        { key:'b2_clouds3', yRatio:0.12, speed:20, alpha:0.60 },
      ];
      ab2.cloudDefs   = b2CloudDefs;
      ab2.cloudLayers = [];
      b2CloudDefs.forEach(def => {
        const a = this.add.image(W*0.5,  def.yRatio*H, def.key).setDisplaySize(W, H*0.55).setAlpha(def.alpha).setOrigin(0.5,0).setDepth(5);
        const b = this.add.image(W*1.5,  def.yRatio*H, def.key).setDisplaySize(W, H*0.55).setAlpha(def.alpha).setOrigin(0.5,0).setDepth(5);
        ab2.cloudLayers.push({ a, b, speed: def.speed });
      });

      // Birds — flock that flies across from right to left
      ab2.birdGroups = [];
      for (let g = 0; g < 3; g++) {
        const bx  = Phaser.Math.Between(W * 0.2, W * 1.4);
        const by  = Phaser.Math.Between(H * 0.08, H * 0.38);
        const spd = Phaser.Math.FloatBetween(18, 45);
        const sc  = Phaser.Math.FloatBetween(0.22, 0.55);
        const img = this.add.image(bx, by, 'b2_birds')
          .setScale(sc).setAlpha(Phaser.Math.FloatBetween(0.55, 0.9)).setDepth(6);
        ab2.birdGroups.push({ img, spd, sc, startY: by });
      }

      // Wind / mist streaks (lighter, more horizontal)
      ab2.windGfx  = this.add.graphics().setDepth(7);
      ab2.windLines = Array.from({length:20}, () => this._newMap2Wind(true));

      // Fine dust motes drifting in the breeze
      ab2.dustGfx      = this.add.graphics().setDepth(7);
      ab2.dustParticles = Array.from({length:45}, () => this._newMap2Dust(true));

      // Subtle light-ray / bokeh orbs
      ab2.bokehGfx  = this.add.graphics().setDepth(5);
      ab2.bokehs    = Array.from({length:18}, () => this._newMap2Bokeh(true));

      // Resize handler
      this.scale.on('resize', (gs) => {
        const nW = gs.width, nH = gs.height;
        ab2.sky.setPosition(nW/2, nH/2).setDisplaySize(nW, nH);
        ab2.rocks1.setPosition(nW/2, nH).setDisplaySize(nW, nH);
        ab2.rocks2a.setPosition(0,   nH).setDisplaySize(nW, nH);
        ab2.rocks2b.setPosition(nW,  nH).setDisplaySize(nW, nH);
        ab2.rocks3a.setPosition(0,   nH).setDisplaySize(nW, nH);
        ab2.rocks3b.setPosition(nW,  nH).setDisplaySize(nW, nH);
        ab2.pines.setPosition(nW/2,  nH).setDisplaySize(nW, nH);
        ab2.cloudLayers.forEach((layer, i) => {
          const def = ab2.cloudDefs[i];
          layer.a.setPosition(nW*0.5, def.yRatio*nH).setDisplaySize(nW, nH*0.55);
          layer.b.setPosition(nW*1.5, def.yRatio*nH).setDisplaySize(nW, nH*0.55);
        });
        this._resizeHUD();
      }, this);

      this.bg = null;
    } else if (this.mapKey === 'game_background_3' && this.textures.exists('b3_sky')) {
      // ── Animated parallax background for Map 3 ──
      this._animBg3 = {};
      const ab3 = this._animBg3;

      // Sky — full-screen starry night
      ab3.sky = this.add.image(W/2, H/2, 'b3_sky').setDisplaySize(W, H).setDepth(0);

      // Rocks — distant jagged mountains (very slow drift)
      ab3.rocksA = this.add.image(0,   H, 'b3_rocks').setOrigin(0,1).setDisplaySize(W, H).setDepth(1);
      ab3.rocksB = this.add.image(W,   H, 'b3_rocks').setOrigin(0,1).setDisplaySize(W, H).setDepth(1).setFlipX(true);

      // Ground layers (depth-sorted: farthest → nearest)
      ab3.gnd1A = this.add.image(0,   H, 'b3_ground1').setOrigin(0,1).setDisplaySize(W, H).setDepth(2);
      ab3.gnd1B = this.add.image(W,   H, 'b3_ground1').setOrigin(0,1).setDisplaySize(W, H).setDepth(2).setFlipX(true);

      ab3.gnd2A = this.add.image(0,   H, 'b3_ground2').setOrigin(0,1).setDisplaySize(W, H).setDepth(3);
      ab3.gnd2B = this.add.image(W,   H, 'b3_ground2').setOrigin(0,1).setDisplaySize(W, H).setDepth(3).setFlipX(true);

      ab3.gnd3A = this.add.image(0,   H, 'b3_ground3').setOrigin(0,1).setDisplaySize(W, H).setDepth(4);
      ab3.gnd3B = this.add.image(W,   H, 'b3_ground3').setOrigin(0,1).setDisplaySize(W, H).setDepth(4).setFlipX(true);

      // Plant — foreground flora, grounded (static, dual-tile slow scroll)
      ab3.plantA = this.add.image(0,   H, 'b3_plant').setOrigin(0,1).setDisplaySize(W, H).setDepth(5);
      ab3.plantB = this.add.image(W,   H, 'b3_plant').setOrigin(0,1).setDisplaySize(W, H).setDepth(5).setFlipX(true);

      // Cloud layers (scroll left at different speeds/heights)
      const b3CloudDefs = [
        { key:'b3_clouds1', yRatio:0.05, speed:6,  alpha:0.80 },
        { key:'b3_clouds2', yRatio:0.22, speed:12, alpha:0.65 },
      ];
      ab3.cloudDefs   = b3CloudDefs;
      ab3.cloudLayers = [];
      b3CloudDefs.forEach(def => {
        const a = this.add.image(W*0.5,  def.yRatio*H, def.key).setDisplaySize(W, H*0.55).setAlpha(def.alpha).setOrigin(0.5,0).setDepth(6);
        const b = this.add.image(W*1.5,  def.yRatio*H, def.key).setDisplaySize(W, H*0.55).setAlpha(def.alpha).setOrigin(0.5,0).setDepth(6);
        ab3.cloudLayers.push({ a, b, speed: def.speed });
      });

      // Cold wind streaks (pale blue/white)
      ab3.windGfx   = this.add.graphics().setDepth(7);
      ab3.windLines = Array.from({length:22}, () => this._newMap3Wind(true));

      // Fine frost/snow motes drifting diagonally
      ab3.dustGfx      = this.add.graphics().setDepth(7);
      ab3.dustParticles = Array.from({length:55}, () => this._newMap3Dust(true));

      // Ethereal fog orbs pulsing near the ground
      ab3.fogGfx  = this.add.graphics().setDepth(4);
      ab3.fogOrbs = Array.from({length:14}, () => this._newMap3Fog(true));

      // Resize handler
      this.scale.on('resize', (gs) => {
        const nW = gs.width, nH = gs.height;
        ab3.sky.setPosition(nW/2, nH/2).setDisplaySize(nW, nH);
        ab3.rocksA.setPosition(0,   nH).setDisplaySize(nW, nH);
        ab3.rocksB.setPosition(nW,  nH).setDisplaySize(nW, nH);
        ab3.gnd1A.setPosition(0,    nH).setDisplaySize(nW, nH);
        ab3.gnd1B.setPosition(nW,   nH).setDisplaySize(nW, nH);
        ab3.gnd2A.setPosition(0,    nH).setDisplaySize(nW, nH);
        ab3.gnd2B.setPosition(nW,   nH).setDisplaySize(nW, nH);
        ab3.gnd3A.setPosition(0,    nH).setDisplaySize(nW, nH);
        ab3.gnd3B.setPosition(nW,   nH).setDisplaySize(nW, nH);
        ab3.plantA.setPosition(0,   nH).setDisplaySize(nW, nH);
        ab3.plantB.setPosition(nW,  nH).setDisplaySize(nW, nH);
        ab3.cloudLayers.forEach((layer, i) => {
          const def = ab3.cloudDefs[i];
          layer.a.setPosition(nW*0.5, def.yRatio*nH).setDisplaySize(nW, nH*0.55);
          layer.b.setPosition(nW*1.5, def.yRatio*nH).setDisplaySize(nW, nH*0.55);
        });
        this._resizeHUD();
      }, this);

      this.bg = null;
    } else if (this.mapKey === 'game_background_4' && this.textures.exists('b4_sky')) {
      // ── Animated parallax background for Map 4 ──
      this._animBg4 = {};
      const ab4 = this._animBg4;

      // Sky — starry purple/teal aurora night
      ab4.sky = this.add.image(W/2, H/2, 'b4_sky').setDisplaySize(W, H).setDepth(0);

      // Rocks — icy cliffs with waterfalls (slow drift)
      ab4.rocksA = this.add.image(0,   H, 'b4_rocks').setOrigin(0,1).setDisplaySize(W, H).setDepth(1);
      ab4.rocksB = this.add.image(W,   H, 'b4_rocks').setOrigin(0,1).setDisplaySize(W, H).setDepth(1).setFlipX(true);

      // Ground — icy teal floor (faster scroll, nearest layer)
      ab4.gndA = this.add.image(0,   H, 'b4_ground').setOrigin(0,1).setDisplaySize(W, H).setDepth(2);
      ab4.gndB = this.add.image(W,   H, 'b4_ground').setOrigin(0,1).setDisplaySize(W, H).setDepth(2).setFlipX(true);

      // Cloud layers (ominous dark storm clouds scroll left)
      const b4CloudDefs = [
        { key:'b4_clouds1', yRatio:0.02, speed:7,  alpha:0.85 },
        { key:'b4_clouds2', yRatio:0.28, speed:14, alpha:0.70 },
      ];
      ab4.cloudDefs   = b4CloudDefs;
      ab4.cloudLayers = [];
      b4CloudDefs.forEach(def => {
        const a = this.add.image(W*0.5,  def.yRatio*H, def.key).setDisplaySize(W, H*0.55).setAlpha(def.alpha).setOrigin(0.5,0).setDepth(3);
        const b = this.add.image(W*1.5,  def.yRatio*H, def.key).setDisplaySize(W, H*0.55).setAlpha(def.alpha).setOrigin(0.5,0).setDepth(3);
        ab4.cloudLayers.push({ a, b, speed: def.speed });
      });

      // Icy wind streaks (sharper, faster than Map 3)
      ab4.windGfx   = this.add.graphics().setDepth(4);
      ab4.windLines = Array.from({length:25}, () => this._newMap4Wind(true));

      // Snowflake / ice crystal dust motes
      ab4.dustGfx      = this.add.graphics().setDepth(4);
      ab4.dustParticles = Array.from({length:60}, () => this._newMap4Dust(true));

      // Glowing waterfall shimmer orbs near ground
      ab4.fogGfx  = this.add.graphics().setDepth(2);
      ab4.fogOrbs = Array.from({length:16}, () => this._newMap4Fog(true));

      // Resize handler
      this.scale.on('resize', (gs) => {
        const nW = gs.width, nH = gs.height;
        ab4.sky.setPosition(nW/2, nH/2).setDisplaySize(nW, nH);
        ab4.rocksA.setPosition(0,   nH).setDisplaySize(nW, nH);
        ab4.rocksB.setPosition(nW,  nH).setDisplaySize(nW, nH);
        ab4.gndA.setPosition(0,     nH).setDisplaySize(nW, nH);
        ab4.gndB.setPosition(nW,    nH).setDisplaySize(nW, nH);
        ab4.cloudLayers.forEach((layer, i) => {
          const def = ab4.cloudDefs[i];
          layer.a.setPosition(nW*0.5, def.yRatio*nH).setDisplaySize(nW, nH*0.55);
          layer.b.setPosition(nW*1.5, def.yRatio*nH).setDisplaySize(nW, nH*0.55);
        });
        this._resizeHUD();
      }, this);

      this.bg = null;
    } else if (this.textures.exists(this.mapKey)) {
      this.bg = this.add.image(W / 2, H / 2, this.mapKey).setDepth(0);
      this.fitBg();
      this.scale.on('resize', () => { this.fitBg(); this._resizeHUD(); }, this);
    } else {
      // Fallback gradient background if image asset is missing
      const bgFill = this.add.graphics().setDepth(0);
      bgFill.fillGradientStyle(C.n.navy, C.n.navy, 0x0a0e1a, 0x0a0e1a, 1);
      bgFill.fillRect(0, 0, W, H);
      this.bg = bgFill;
      this.bg.width = W; this.bg.height = H;
      this.scale.on('resize', () => { this.fitBg(); this._resizeHUD(); }, this);
    }

    // ── Physics world ──────────────────────────────────────
    this.physics.world.gravity.y = 900;
    this.physics.world.setBounds(0, 0, W, H);

    // Ground platform (invisible physics floor)
    const groundY = H - 80;
    this.ground = this.physics.add.staticGroup();
    // A wide thin slab — center it below groundY so its top surface = groundY
    const groundTile = this.add.rectangle(W / 2, groundY + 25, W, 50, 0x000000, 0).setDepth(1);
    this.physics.add.existing(groundTile, true);
    this.ground.add(groundTile);

    // Visible black ground — fills from groundY to bottom of screen
    const groundVis = this.add.graphics().setDepth(3);
    groundVis.fillStyle(0x000000, 1);
    groundVis.fillRect(0, groundY, W, H - groundY);
    // Subtle top edge highlight so it doesn't look like a hard cut
    groundVis.lineStyle(2, 0x222222, 1);
    groundVis.beginPath();
    groundVis.moveTo(0, groundY);
    groundVis.lineTo(W, groundY);
    groundVis.strokePath();

    // ── PLAYER — feet placed exactly on groundY ─────────────
    this._spawnPlayer(W * 0.15, groundY);

    // ── ENEMY — feet placed exactly on groundY ──────────────
    this._spawnEnemy(W * 0.80, groundY);

    // ── Bullet group ──────────────────────────────────────
    this.bullets = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();

    // ── Colliders ─────────────────────────────────────────
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.enemy,  this.ground);
    this.physics.add.collider(this.bullets, this.ground, (b) => this._destroyBullet(b));
    this.physics.add.collider(this.enemyBullets, this.ground, (b) => this._destroyBullet(b));

    this.physics.add.overlap(this.bullets, this.enemy, (enemy, bullet) => {
      this._destroyBullet(bullet);
      this._hitEnemy(6);   // player bullet: reduced from 14 → 6
    });
    this.physics.add.overlap(this.enemyBullets, this.player, (player, bullet) => {
      this._destroyBullet(bullet);
      this._hurtPlayer(18);  // enemy bullet: increased from 10 → 18
    });
    this.physics.add.overlap(this.player, this.enemy, () => {
      if (this._attackState === 'attack1' || this._attackState === 'attack2') {
        this._hitEnemy(3);   // player melee: reduced from 8 → 3
      }
    });

    // ── Mobile flags (initialize before mobile controls build) ─
    this._mobileLeft  = false;
    this._mobileRight = false;
    this._mobileJump  = false;
    this._mobileAtk1  = false;
    this._mobileAtk2  = false;
    this._mobileShoot = false;

    // ── Input ─────────────────────────────────────────────
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd    = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      attack1: Phaser.Input.Keyboard.KeyCodes.Z,
      attack2: Phaser.Input.Keyboard.KeyCodes.X,
      shoot:   Phaser.Input.Keyboard.KeyCodes.C,
    });
    // Mobile / on-screen touch buttons
    // ── Game state — must be set BEFORE _buildHUD ─────────
    this._attackCooldown  = 0;
    this._shootCooldown   = 0;
    this._iFrameTimer     = 0;
    this._attackState     = 'none';
    this._isDead          = false;
    this._isEnemyDead     = false;
    this._recharging      = false;
    this._ammo            = 12;
    this._maxAmmo         = 12;
    this._playerHp        = 100;
    this._enemyHp         = 100;

    this._buildMobileControls();

    // ── HUD ────────────────────────────────────────────────
    this._buildHUD();

    // ── Particle emitters ─────────────────────────────────
    this._muzzleFlash = null;

    // ── Enemy AI timer ────────────────────────────────────
    this._enemyAiTimer = 0;
    this._enemyCooldown = 0;
    // Advanced AI state
    this._aiTimer      = 0;
    this._aiAttackCD   = 0;
    this._aiDodgeCD    = 0;
    this._aiJumpCD     = 0;
    this._aiRangedCD   = 0;
    this._aiComboCount = 0;
    this._aiState      = 'approach';
    this._aiHitMemory  = 0;
    this._aiAggrTimer  = 0;
    this._aiAggressive = false;
    this._aiStrafeDir  = 1;
    this._aiStrafTimer = 0;
    this._prevEnemyHp  = 100;

    // ── Character Animation FX Systems ────────────────────
    this._initCharacterFX();

    // ── Fade in ────────────────────────────────────────────
    const veil = this.add.rectangle(W / 2, H / 2, W, H, C.n.bg).setDepth(200);
    this.tweens.add({ targets: veil, alpha: 0, duration: 500, ease: 'Cubic.Out',
      onComplete: () => veil.destroy() });

    // ── Controls hint ─────────────────────────────────────
    const _isTouchDev = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const _hintText = _isTouchDev
      ? 'D-PAD: MOVE  ·  Z: PUNCH  ·  X: KICK  ·  SHOT: FIRE  ·  JUMP'
      : 'ARROWS/WASD: MOVE  ·  Z: PUNCH  ·  X: KICK  ·  C/SPACE: SHOOT  ·  W/↑: JUMP';
    const hint = this.add.text(W / 2, H - 30, _hintText,
      { fontFamily: 'Boldonse', fontSize: '8px', color: C.s.sage, letterSpacing: 2, alpha: 0.6 }
    ).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets: hint, alpha: 0, duration: 600, delay: 4000 });

    // ── Round & Difficulty indicator ──────────────────────
    const _DIFF_LABELS = ['EASY', 'MODERATE', 'HARD', 'NIGHTMARE'];
    const _DIFF_COLORS = [C.s.sage, C.s.amber, C.s.teal, C.s.crimson];
    const diffLabel = _DIFF_LABELS[this._diffLevel] || 'MODERATE';
    const diffColor = _DIFF_COLORS[this._diffLevel] || C.s.amber;
    const roundIndicator = this.add.text(W / 2, 6,
      `ROUND  ${this._round}   ·   ${diffLabel}`,
      { fontFamily: 'Boldonse', fontSize: '9px', color: diffColor, letterSpacing: 4, alpha: 0 }
    ).setOrigin(0.5, 0).setDepth(20);
    this.tweens.add({ targets: roundIndicator, alpha: 0.75, duration: 500, delay: 600 });
  }

  // ─────────────────────────────────────────────
  // Returns the anim-key map for a given character id
  _animsForChar(id) {
    if (id === 'wizard') return {
      idle: 'wizard-idle', walk: 'wizard-walk', run: 'wizard-run', jump: 'wizard-jump',
      attack1: 'wizard-attack1', attack2: 'wizard-attack2',
      shot: 'wizard-fireball', recharge: 'wizard-charge',
      hurt: 'wizard-hurt', dead: 'wizard-dead',
    };
    if (id === 'samurai') return {
      idle: 'samurai-idle', walk: 'samurai-walk', run: 'samurai-run', jump: 'samurai-jump',
      attack1: 'samurai-attack1', attack2: 'samurai-attack2',
      shot: 'samurai-attack3',   recharge: 'samurai-protection',
      hurt: 'samurai-hurt',      dead: 'samurai-dead',
    };
    if (id === 'lmage') return {
      idle: 'lmage-idle', walk: 'lmage-walk', run: 'lmage-run', jump: 'lmage-jump',
      attack1: 'lmage-attack1', attack2: 'lmage-attack2',
      shot: 'lmage-light_ball', recharge: 'lmage-light_charge',
      hurt: 'lmage-hurt',      dead: 'lmage-dead',
    };
    // default: raider
    return {
      idle: 'raider-idle', walk: 'raider-walk', run: 'raider-run', jump: 'raider-jump',
      attack1: 'raider-attack1', attack2: 'raider-attack2',
      shot: 'raider-shot', recharge: 'raider-recharge',
      hurt: 'raider-hurt', dead: 'raider-dead',
    };
  }

  _idleTexForChar(id) {
    if (id === 'wizard')  return 'wizard_idle';
    if (id === 'samurai') return 'samurai_idle';
    if (id === 'lmage')   return 'lmage_idle';
    return 'raider_idle';
  }

  _spawnPlayer(x, y) {
    const idleKey    = this._idleTexForChar(this.p1Id);
    const textureKey = this.textures.exists(idleKey) ? idleKey : '__DEFAULT';

    this.player = this.physics.add.sprite(x, y, textureKey)
      .setDepth(5)
      .setOrigin(0.5, 1)
      .setCollideWorldBounds(true)
      .setGravityY(200)
      .setScale(3.2);
    // Thin body at feet: 40px wide, 8px tall, sitting at the very bottom of the 128px frame
    this.player.body.setSize(40, 8).setOffset(44, 120);

    this._p1Anims    = this._animsForChar(this.p1Id);
    if (this.anims.exists(this._p1Anims.idle)) this.player.play(this._p1Anims.idle);
    this._playerFacing = 1;
    this._isOnGround   = false;
    this._isJumping    = false;
  }

  _spawnEnemy(x, y) {
    const idleKey    = this._idleTexForChar(this.p2Id);
    const textureKey = this.textures.exists(idleKey) ? idleKey : '__DEFAULT';

    this.enemy = this.physics.add.sprite(x, y, textureKey)
      .setDepth(5)
      .setOrigin(0.5, 1)
      .setCollideWorldBounds(true)
      .setGravityY(200)
      .setScale(3.2)
      .setFlipX(true);
    // Same thin body at feet as player
    this.enemy.body.setSize(40, 8).setOffset(44, 120);

    this._p2Anims = this._animsForChar(this.p2Id);
    if (this.anims.exists(this._p2Anims.idle)) this.enemy.play(this._p2Anims.idle);

    this._enemyLabel = this.add.text(x, y - 128 * 3.2 - 10, '', {
      fontFamily: 'Boldonse', fontSize: '10px', color: C.s.amber, letterSpacing: 2,
    }).setOrigin(0.5).setDepth(15);

    this.enemy.setTint(0xff7777);
  }

  // ═══════════════════════════════════════════
  //  CHARACTER ANIMATION ENHANCEMENT SYSTEMS
  // ═══════════════════════════════════════════

  // ── Initialize all enhancement systems after spawning ──
  _initCharacterFX() {
    const W = this.scale.width, H = this.scale.height;
    const BASE_SCALE = 3.2;

    // ── Drop shadows (ellipse beneath each character) ──
    this._shadowP1 = this.add.graphics().setDepth(4);
    this._shadowP2 = this.add.graphics().setDepth(4);

    // ── Motion trail pool (ghost copies for run/jump) ──
    this._trailPool = [];
    for (let i = 0; i < 8; i++) {
      const ghost = this.add.image(0, 0, '__DEFAULT')
        .setDepth(4).setAlpha(0).setOrigin(0.5, 1);
      this._trailPool.push(ghost);
    }
    this._trailIdx = 0;
    this._trailTimer = 0;

    // ── Separate attack ghost pool ──
    this._attackGhostPool = [];
    for (let i = 0; i < 4; i++) {
      const g = this.add.image(0, 0, '__DEFAULT')
        .setDepth(4).setAlpha(0).setOrigin(0.5, 1);
      this._attackGhostPool.push(g);
    }
    this._attackGhostIdx = 0;

    // ── Landing state tracking ──
    this._p1WasOnGround   = true;
    this._p2WasOnGround   = true;
    this._p1LandCooldown  = 0;
    this._p2LandCooldown  = 0;

    // ── Squash/stretch targets ──
    this._p1BaseScale = BASE_SCALE;
    this._p2BaseScale = BASE_SCALE;

    // ── Idle breathing timers ──
    this._idleBreathT  = 0;
    this._idleBreathT2 = Math.PI; // offset enemy

    // ── Footstep dust ──
    this._dustGfxFeet = this.add.graphics().setDepth(4);
    this._footDusts   = [];
    this._footstepTimer  = 0;
    this._footstepTimer2 = 0.15;

    // ── After-image / attack trail ──
    this._attackTrailTimer  = 0;
    this._attackTrailTimer2 = 0;

    // ── Screen shake state ──
    this._shakeTime     = 0;
    this._shakeAmp      = 0;
    this._shakeDuration = 0; // total duration for proper decay ratio

    // ── Chromatic aberration flash (hit effect layers) ──
    const fx = this.add.graphics().setDepth(199).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);
    this._chromaFx = fx;
    this._chromaTimer = 0;

    // ── Depth-based 3D parallax — player scales with Y ──
    // Fighters closer to ground bottom = slightly larger
    this._p1DepthScale = 1.0;
    this._p2DepthScale = 1.0;
  }

  // ── Tick all enhancement systems every frame ──
  _tickCharacterFX(time, delta) {
    const dt = delta / 1000;
    const p  = this.player;
    const e  = this.enemy;
    const H  = this.scale.height;
    const W  = this.scale.width;
    const BASE = 3.2;

    // ── 1. DROP SHADOWS ──────────────────────────────────
    // Shadow always stays at ground level; shrinks and fades as character rises
    const groundY = H * 0.88; // approximate floor Y
    [{ sprite: p, gfx: this._shadowP1, col: 0x000000 },
     { sprite: e, gfx: this._shadowP2, col: 0x220000 }].forEach(({ sprite, gfx, col }) => {
      gfx.clear();
      if (!sprite || !sprite.active) return;
      const onGnd   = sprite.body && sprite.body.blocked.down;
      const shadowY = onGnd ? sprite.y : groundY; // stick to floor when airborne
      // Height above ground → shrink shadow
      const heightAbove = Math.max(0, groundY - sprite.y);
      const shrink  = Math.max(0.35, 1 - heightAbove / (H * 0.4));
      const alpha   = onGnd ? 0.22 : Math.max(0.05, 0.18 * shrink);
      const rx = 28 * sprite.scaleX * shrink;
      const ry = 7  * sprite.scaleX * shrink;
      gfx.fillStyle(col, alpha);
      gfx.fillEllipse(sprite.x, shadowY + 2, rx * 2, ry * 2);
      gfx.fillStyle(0x000000, alpha * 0.4);
      gfx.fillEllipse(sprite.x, shadowY + 2, rx * 1.4, ry * 1.4);
    });

    // ── 2. IDLE BREATHING ────────────────────────────────
    this._idleBreathT  += dt * 1.8;
    this._idleBreathT2 += dt * 1.6;
    const isP1Idle = this._attackState === 'none' && p.body && Math.abs(p.body.velocity.x) < 20 && p.body.blocked.down;
    const isP2Idle = !this._isEnemyDead && e.body && Math.abs(e.body.velocity.x) < 20 && e.body.blocked.down;

    if (isP1Idle && !this._isDead) {
      const breathY = Math.sin(this._idleBreathT) * 0.018;
      p.setScale(BASE * (1 + breathY), BASE * (1 - breathY * 0.4));
    }
    if (isP2Idle) {
      const breathY2 = Math.sin(this._idleBreathT2) * 0.018;
      e.setScale(BASE * (1 + breathY2), BASE * (1 - breathY2 * 0.4));
    }

    // ── 3. SQUASH & STRETCH on Jump / Land ───────────────
    const p1OnGround = p.body && p.body.blocked.down;
    const p2OnGround = e.body && e.body.blocked.down;
    this._p1LandCooldown  = Math.max(0, this._p1LandCooldown  - dt);
    this._p2LandCooldown  = Math.max(0, this._p2LandCooldown  - dt);

    // Player — stretch up when jumping, squash on land
    if (!p1OnGround && !this._isDead) {
      const vy = p.body.velocity.y;
      if (vy < -100) {
        // Ascending: stretch tall & thin
        p.setScale(BASE * 0.88, BASE * 1.10);
      } else if (vy > 80) {
        // Descending: squash slightly
        p.setScale(BASE * 1.05, BASE * 0.96);
      }
    }
    if (p1OnGround && !this._p1WasOnGround && this._p1LandCooldown <= 0) {
      // Just landed
      this._p1LandCooldown = 0.22;
      this._spawnLandDust(p.x, p.y, 0xe8c87a);
      this.tweens.add({
        targets: p, scaleX: BASE * 1.16, scaleY: BASE * 0.82,
        duration: 70, ease: 'Quad.Out',
        onComplete: () => this.tweens.add({
          targets: p, scaleX: BASE, scaleY: BASE,
          duration: 180, ease: 'Back.Out',
        })
      });
      SFX.nav();
    }

    // Enemy — same treatment
    if (!p2OnGround && !this._isEnemyDead) {
      const vy = e.body.velocity.y;
      if (vy < -100) {
        e.setScale(BASE * 0.88, BASE * 1.10);
      } else if (vy > 80) {
        e.setScale(BASE * 1.05, BASE * 0.96);
      }
    }
    if (p2OnGround && !this._p2WasOnGround && this._p2LandCooldown <= 0) {
      this._p2LandCooldown = 0.22;
      this._spawnLandDust(e.x, e.y, 0xbf0603);
      this.tweens.add({
        targets: e, scaleX: BASE * 1.16, scaleY: BASE * 0.82,
        duration: 70, ease: 'Quad.Out',
        onComplete: () => this.tweens.add({
          targets: e, scaleX: BASE, scaleY: BASE,
          duration: 180, ease: 'Back.Out',
        })
      });
    }

    this._p1WasOnGround = p1OnGround;
    this._p2WasOnGround = p2OnGround;

    // ── 4. MOTION TRAIL (ghosts on run/jump) ─────────────
    this._trailTimer -= dt;
    const p1Moving = (this._attackState === 'none' || this._attackState === 'attack1' || this._attackState === 'attack2') &&
                     Math.abs(p.body.velocity.x) > 180;
    const p1Jumping = !p1OnGround;

    if ((p1Moving || p1Jumping) && this._trailTimer <= 0 && !this._isDead) {
      this._trailTimer = 0.045;
      const ghost = this._trailPool[this._trailIdx % this._trailPool.length];
      this._trailIdx++;
      if (p.texture && p.texture.key !== '__DEFAULT') {
        const frame = p.anims.currentFrame ? p.anims.currentFrame.frame.name : 0;
        ghost.setTexture(p.texture.key, frame);
        ghost.setPosition(p.x, p.y);
        ghost.setScale(p.scaleX, p.scaleY);
        ghost.setFlipX(p.flipX);
        ghost.setAlpha(0.30);
        ghost.setTint(p1Jumping ? 0x88ddff : 0xffd080);
        this.tweens.add({ targets: ghost, alpha: 0, duration: 180, ease: 'Cubic.In',
          onComplete: () => ghost.setAlpha(0) });
      }
    }

    // ── 5. FOOTSTEP DUST (when running on ground) ────────
    this._footstepTimer  -= dt;
    this._footstepTimer2 -= dt;
    if (p1OnGround && Math.abs(p.body.velocity.x) > 100 && this._footstepTimer <= 0 && !this._isDead) {
      this._footstepTimer = 0.12;
      this._spawnFootDust(p.x, p.y, p.flipX ? 1 : -1);
    }
    if (p2OnGround && Math.abs(e.body.velocity.x) > 100 && this._footstepTimer2 <= 0 && !this._isEnemyDead) {
      this._footstepTimer2 = 0.12;
      this._spawnFootDust(e.x, e.y, e.flipX ? 1 : -1);
    }

    // ── Tick foot dust particles ──
    this._dustGfxFeet.clear();
    this._footDusts = this._footDusts.filter(d => {
      d.life -= dt;
      if (d.life <= 0) return false;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vy += 60 * dt;
      const a = (d.life / d.maxLife) * d.alpha;
      this._dustGfxFeet.fillStyle(d.col, a);
      this._dustGfxFeet.fillCircle(d.x, d.y, d.r * (d.life / d.maxLife));
      return true;
    });

    // ── 6. DEPTH-BASED 3D SCALE ──────────────────────────
    // Characters further up (smaller Y relative to floor) appear slightly smaller
    // Gives a sense of a 3D plane
    const floorY = H * 0.88;
    if (!this._isDead && p1OnGround) {
      const depthT = Phaser.Math.Clamp((p.y - H * 0.5) / (floorY - H * 0.5), 0, 1);
      const depthScale = Phaser.Math.Linear(0.82, 1.0, depthT);
      // Only apply if not currently squash/stretching from landing
      if (this._p1LandCooldown <= 0 && isP1Idle) {
        p.setScale(BASE * depthScale);
        this._p1DepthScale = depthScale;
      }
    }
    if (!this._isEnemyDead && p2OnGround) {
      const depthT2 = Phaser.Math.Clamp((e.y - H * 0.5) / (floorY - H * 0.5), 0, 1);
      const depthScale2 = Phaser.Math.Linear(0.82, 1.0, depthT2);
      if (this._p2LandCooldown <= 0 && isP2Idle) {
        e.setScale(BASE * depthScale2);
        this._p2DepthScale = depthScale2;
      }
    }

    // ── 7. SCREEN SHAKE ──────────────────────────────────
    if (this._shakeTime > 0) {
      this._shakeTime -= dt;
      const decay = this._shakeDuration > 0 ? (this._shakeTime / this._shakeDuration) : 0;
      const amp = this._shakeAmp * Math.max(0, decay);
      const ox  = (Math.random() - 0.5) * amp * 2;
      const oy  = (Math.random() - 0.5) * amp;
      this.cameras.main.setScroll(ox, oy);
    } else {
      this.cameras.main.setScroll(0, 0);
    }

    // ── 8. CHROMATIC ABERRATION FLASH ────────────────────
    if (this._chromaTimer > 0) {
      this._chromaTimer -= dt;
      const t   = this._chromaTimer / 0.18;
      const off = t * 6;
      this._chromaFx.clear();
      this._chromaFx.fillStyle(0xff0000, t * 0.12);
      this._chromaFx.fillRect(-off, 0, W + off * 2, H);
      this._chromaFx.fillStyle(0x0000ff, t * 0.10);
      this._chromaFx.fillRect(off, 0, W, H);
      this._chromaFx.setAlpha(Math.min(1, t * 2));
    } else {
      this._chromaFx.clear().setAlpha(0);
    }

    // ── 9. ATTACK WIND-UP ANTICIPATION LEAN ──────────────
    if (this._attackState === 'attack1' || this._attackState === 'attack2') {
      this._attackTrailTimer -= dt;
      if (this._attackTrailTimer <= 0) {
        this._attackTrailTimer = 0.055;
        const ghost2 = this._attackGhostPool[this._attackGhostIdx % this._attackGhostPool.length];
        this._attackGhostIdx++;
        if (p.texture && p.texture.key !== '__DEFAULT') {
          const frame = p.anims.currentFrame ? p.anims.currentFrame.frame.name : 0;
          ghost2.setTexture(p.texture.key, frame);
          ghost2.setPosition(p.x, p.y);
          ghost2.setScale(p.scaleX * 0.85, p.scaleY);
          ghost2.setFlipX(p.flipX);
          ghost2.setAlpha(0.22);
          ghost2.setTint(0xff5500);
          this.tweens.add({ targets: ghost2, alpha: 0, duration: 100, ease: 'Cubic.In' });
        }
      }
    } else {
      this._attackTrailTimer = 0;
    }
  }

  // ── Spawn landing dust burst ──
  _spawnLandDust(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 0.9;
      const speed = Math.random() * 90 + 30;
      this._footDusts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.5 - 20,
        r:  Math.random() * 5 + 2,
        alpha: Math.random() * 0.45 + 0.15,
        col: color,
        life: Math.random() * 0.25 + 0.15,
        maxLife: Math.random() * 0.25 + 0.15,
      });
    }
  }

  // ── Spawn footstep dust puff ──
  _spawnFootDust(x, y, dir) {
    for (let i = 0; i < 4; i++) {
      const angle = Math.PI * (0.75 + Math.random() * 0.5);
      const speed = Math.random() * 40 + 15;
      this._footDusts.push({
        x: x + dir * Math.random() * 12,
        y: y - 2,
        vx: Math.cos(angle) * speed * dir,
        vy: Math.sin(angle) * speed - 10,
        r:  Math.random() * 3 + 1,
        alpha: Math.random() * 0.25 + 0.08,
        col: 0xc8a870,
        life: Math.random() * 0.18 + 0.10,
        maxLife: Math.random() * 0.18 + 0.10,
      });
    }
  }

  // ── Trigger screen shake ──
  _shakeScreen(amplitude, duration) {
    this._shakeAmp      = amplitude;
    this._shakeTime     = duration;
    this._shakeDuration = duration;
  }

  // ── Trigger chromatic aberration ──
  _triggerChroma() {
    this._chromaTimer = 0.18;
  }

  // ─────────────────────────────────────────────
  _buildHUD() {
    const W = this.scale.width, H = this.scale.height;
    this._hudGroup = this.add.group();

    const BAR_H    = 14;
    const CIR_R    = 40;
    const CIR_CY   = CIR_R + 4;
    const BAR_Y    = 10;

    const nameMap  = { raider: 'RAIDER', wizard: 'FIRE WIZARD', samurai: 'SAMURAI', lmage: 'LTN. MAGE' };
    const portMap  = { raider: 'char_raider', wizard: 'char_wizard', samurai: 'char_samurai', lmage: 'char_lmage' };
    const p1Name   = nameMap[this.p1Id]  || 'PLAYER';
    const p2Name   = nameMap[this.p2Id]  || 'ENEMY';
    const p1Port   = portMap[this.p1Id]  || null;
    const p2Port   = portMap[this.p2Id]  || null;

    // ── P1 Portrait circle (left) ────────────────────────────
    const p1CX = CIR_R + 4;
    const circP1 = this.add.graphics().setDepth(12);
    // Outer glow ring
    circP1.lineStyle(5, 0xe07820, 0.35);
    circP1.strokeCircle(p1CX, CIR_CY, CIR_R + 4);
    // Main ring
    circP1.lineStyle(3, 0xe07820, 1);
    circP1.strokeCircle(p1CX, CIR_CY, CIR_R);
    circP1.fillStyle(0x111118, 1);
    circP1.fillCircle(p1CX, CIR_CY, CIR_R - 2);
    if (p1Port && this.textures.exists(p1Port)) {
      const mask1 = this.make.graphics({ add: false });
      mask1.fillStyle(0xffffff); mask1.fillCircle(p1CX, CIR_CY, CIR_R - 3);
      const p1Img = this.add.image(p1CX, CIR_CY, p1Port)
        .setDepth(13).setMask(mask1.createGeometryMask());
      p1Img.setScale((CIR_R * 2) / Math.min(p1Img.width, p1Img.height));
    }

    // ── P2 Portrait circle (right) ───────────────────────────
    const p2CX = W - CIR_R - 4;
    const circP2 = this.add.graphics().setDepth(12);
    circP2.lineStyle(5, 0xe07820, 0.35);
    circP2.strokeCircle(p2CX, CIR_CY, CIR_R + 4);
    circP2.lineStyle(3, 0xe07820, 1);
    circP2.strokeCircle(p2CX, CIR_CY, CIR_R);
    circP2.fillStyle(0x111118, 1);
    circP2.fillCircle(p2CX, CIR_CY, CIR_R - 2);
    if (p2Port && this.textures.exists(p2Port)) {
      const mask2 = this.make.graphics({ add: false });
      mask2.fillStyle(0xffffff); mask2.fillCircle(p2CX, CIR_CY, CIR_R - 3);
      const p2Img = this.add.image(p2CX, CIR_CY, p2Port)
        .setDepth(13).setFlipX(true).setMask(mask2.createGeometryMask());
      p2Img.setScale((CIR_R * 2) / Math.min(p2Img.width, p2Img.height));
    }

    // ── Bar layout ───────────────────────────────────────────
    const barLX   = p1CX + CIR_R + 8;
    const centerX = W / 2;
    const barMaxW = centerX - barLX - 18;

    this._barLX   = barLX;
    this._barMaxW = barMaxW;
    this._barY    = BAR_Y + 16;
    this._barH    = BAR_H;

    // ── P1 Name ──────────────────────────────────────────────
    this.add.text(barLX, BAR_Y + 2, p1Name, {
      fontFamily: 'Boldonse', fontSize: '10px', color: '#e8c87a', letterSpacing: 2,
    }).setDepth(14);

    // ── P2 Name ──────────────────────────────────────────────
    this.add.text(W - barLX, BAR_Y + 2, p2Name, {
      fontFamily: 'Boldonse', fontSize: '10px', color: '#e8c87a', letterSpacing: 2,
    }).setOrigin(1, 0).setDepth(14);

    // ── HP bar BG tracks ─────────────────────────────────────
    // Dark pill with subtle inner shadow
    this._hpBarBg = this.add.graphics().setDepth(11);
    this._hpBarBg.fillStyle(0x000000, 0.55);
    this._hpBarBg.fillRoundedRect(barLX, this._barY, barMaxW, BAR_H, BAR_H / 2);
    this._hpBarBg.lineStyle(1.5, 0x000000, 0.8);
    this._hpBarBg.strokeRoundedRect(barLX, this._barY, barMaxW, BAR_H, BAR_H / 2);

    this._enemyHpBarBg = this.add.graphics().setDepth(11);
    this._enemyHpBarBg.fillStyle(0x000000, 0.55);
    this._enemyHpBarBg.fillRoundedRect(centerX + 18, this._barY, barMaxW, BAR_H, BAR_H / 2);
    this._enemyHpBarBg.lineStyle(1.5, 0x000000, 0.8);
    this._enemyHpBarBg.strokeRoundedRect(centerX + 18, this._barY, barMaxW, BAR_H, BAR_H / 2);

    // Filled bars
    this._hpBar      = this.add.graphics().setDepth(12);
    this._enemyHpBar = this.add.graphics().setDepth(12);
    this._drawHpBar();
    this._drawEnemyHpBar();

    // ── Ammo display ─────────────────────────────────────────
    this._ammoText = this.add.text(W / 2, CIR_CY * 2 + 8, `⬡ ${this._ammo}/${this._maxAmmo}`, {
      fontFamily: 'Boldonse', fontSize: '9px', color: '#e8c87a', letterSpacing: 2,
    }).setOrigin(0.5, 0).setDepth(13);

    // ── Force full redraw now that layout is settled ─────
    this._drawHpBar();
    this._drawEnemyHpBar();

    this._hudBuilt = true;
  }

  _drawHpBar() {
    this._hpBar.clear();
    if (!this._barMaxW) return;
    const pct  = Math.max(0, this._playerHp / 100);
    const x    = this._barLX;
    const y    = this._barY;
    const maxW = this._barMaxW;
    const h    = this._barH;
    const r    = h / 2;
    const fillW = Math.max(0, maxW * pct);

    if (fillW > 1) {
      // Base color: green → orange → red
      const base = pct > 0.55 ? 0x27c93f : pct > 0.28 ? 0xe07820 : 0xcc2200;
      // Shadow layer (slightly darker, offset down 1px)
      this._hpBar.fillStyle(0x000000, 0.35);
      this._hpBar.fillRoundedRect(x + 1, y + 2, fillW, h - 1, r);
      // Main fill
      this._hpBar.fillStyle(base, 1);
      this._hpBar.fillRoundedRect(x, y, fillW, h, r);
      // Bright inner highlight (top 35%)
      this._hpBar.fillStyle(0xffffff, 0.22);
      this._hpBar.fillRoundedRect(x + 2, y + 1, Math.max(0, fillW - 4), h * 0.38, r);
      // Edge glow on right tip
      this._hpBar.fillStyle(0xffffff, 0.55);
      this._hpBar.fillRect(x + fillW - 3, y + 2, 2, h - 4);
    }

  }

  _drawEnemyHpBar() {
    this._enemyHpBar.clear();
    if (!this._barMaxW) return;
    const W    = this.scale.width;
    const pct  = Math.max(0, this._enemyHp / 100);
    const maxW = this._barMaxW;
    const h    = this._barH;
    const r    = h / 2;
    const bx   = W / 2 + 18;   // bar left edge
    const y    = this._barY;
    const fillW = Math.max(0, maxW * pct);
    // P2 bar fills right→left so draw from the right side
    const fx   = bx + maxW - fillW;

    if (fillW > 1) {
      const base = pct > 0.55 ? 0x27c93f : pct > 0.28 ? 0xe07820 : 0xcc2200;
      this._enemyHpBar.fillStyle(0x000000, 0.35);
      this._enemyHpBar.fillRoundedRect(fx - 1, y + 2, fillW, h - 1, r);
      this._enemyHpBar.fillStyle(base, 1);
      this._enemyHpBar.fillRoundedRect(fx, y, fillW, h, r);
      this._enemyHpBar.fillStyle(0xffffff, 0.22);
      this._enemyHpBar.fillRoundedRect(fx + 2, y + 1, Math.max(0, fillW - 4), h * 0.38, r);
      // Edge glow on left tip (the draining edge)
      this._enemyHpBar.fillStyle(0xffffff, 0.55);
      this._enemyHpBar.fillRect(fx + 1, y + 2, 2, h - 4);
    }

  }

  _resizeHUD() {
    // Simplest: restart scene on resize to rebuild HUD
    // Only if game is live
  }

  // ─────────────────────────────────────────────
  _buildMobileControls() {
    const W = this.scale.width;
    // Show mobile controls on touch devices OR small screens
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isSmallScreen = W < 900;
    if (!isTouchDevice && !isSmallScreen) return;

    // Show the HTML overlay
    const overlay = document.getElementById('mobile-controls');
    if (!overlay) return;
    overlay.classList.add('active');

    // ── Helper: bind a DOM button with multi-touch support ──
    const bindBtn = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;
      const down = (e) => {
        e.preventDefault();
        el.classList.add('pressed');
        onDown();
      };
      const up = (e) => {
        e.preventDefault();
        el.classList.remove('pressed');
        if (onUp) onUp();
      };
      el.addEventListener('touchstart', down,  { passive: false });
      el.addEventListener('touchend',   up,    { passive: false });
      el.addEventListener('touchcancel', up,   { passive: false });
      // Mouse fallback for desktop testing
      el.addEventListener('mousedown',  down);
      el.addEventListener('mouseup',    up);
      el.addEventListener('mouseleave', up);
    };

    // D-Pad
    bindBtn('dpad-left',
      () => { this._mobileLeft  = true;  },
      () => { this._mobileLeft  = false; }
    );
    bindBtn('dpad-right',
      () => { this._mobileRight = true;  },
      () => { this._mobileRight = false; }
    );
    bindBtn('dpad-jump',
      () => { this._mobileJump  = true;  },
      () => { /* jump is consumed in update */ }
    );

    // Action buttons
    bindBtn('btn-atk1',  () => { this._mobileAtk1  = true; }, null);
    bindBtn('btn-atk2',  () => { this._mobileAtk2  = true; }, null);
    bindBtn('btn-shoot', () => { this._mobileShoot = true; }, null);

    // Prevent default scrolling on canvas
    this.game.canvas.style.touchAction = 'none';

    // Cleanup when scene shuts down
    this.events.once('shutdown', () => { overlay.classList.remove('active'); });
    this.events.once('destroy',  () => { overlay.classList.remove('active'); });
  }

  // ─────────────────────────────────────────────
  _destroyBullet(b) {
    if (b && b.active) {
      // spark effect
      this._spawnSpark(b.x, b.y);
      b.destroy();
    }
  }

  _spawnSpark(x, y) {
    for (let i = 0; i < 5; i++) {
      const spark = this.add.graphics().setDepth(30);
      const angle = Math.random() * Math.PI * 2;
      const dist  = Math.random() * 18 + 4;
      const ex    = x + Math.cos(angle) * dist;
      const ey    = y + Math.sin(angle) * dist;
      spark.lineStyle(1.5, C.n.amber, 0.9);
      spark.beginPath(); spark.moveTo(x, y); spark.lineTo(ex, ey); spark.strokePath();
      this.tweens.add({ targets: spark, alpha: 0, duration: 200 + Math.random() * 150,
        onComplete: () => spark.destroy() });
    }
  }

  _fireBullet(fromX, fromY, dir) {
    if (this._ammo <= 0) {
      // trigger recharge
      if (!this._recharging) this._startRecharge();
      return;
    }
    this._ammo--;
    this._ammoText.setText(`⬡ ${this._ammo}/${this._maxAmmo}`);

    const bullet = this.add.rectangle(fromX, fromY, 12, 4, C.n.amber).setDepth(8);
    this.physics.add.existing(bullet);
    bullet.body.setVelocityX(dir * 720).setGravityY(-900);
    bullet.body.setAllowGravity(false);
    this.bullets.add(bullet);

    // Muzzle flash
    this._spawnSpark(fromX + dir * 20, fromY);
    SFX.powerUp();

    // Auto-destroy after 1.5s
    this.time.delayedCall(1500, () => { if (bullet && bullet.active) bullet.destroy(); });
  }

  _fireEnemyBullet(fromX, fromY, dir) {
    const bullet = this.add.rectangle(fromX, fromY, 16, 5, C.n.crimson).setDepth(8);
    this.physics.add.existing(bullet);
    bullet.body.setVelocityX(dir * 750).setGravityY(-900);
    bullet.body.setAllowGravity(false);
    this.enemyBullets.add(bullet);
    this._spawnSpark(fromX + dir * 20, fromY);
    this.time.delayedCall(1500, () => { if (bullet && bullet.active) bullet.destroy(); });
  }

  _startRecharge() {
    this._recharging = true;
    const rechargeAnim = this._p1Anims.recharge;
    if (this.anims.exists(rechargeAnim)) {
      this.player.play(rechargeAnim);
      this.player.once('animationcomplete', () => {
        this._ammo = this._maxAmmo;
        this._ammoText.setText(`⬡ ${this._ammo}/${this._maxAmmo}`);
        this._recharging = false;
        this._attackState = 'none';
      });
    } else {
      this.time.delayedCall(1200, () => {
        this._ammo = this._maxAmmo;
        this._ammoText.setText(`⬡ ${this._ammo}/${this._maxAmmo}`);
        this._recharging = false;
        this._attackState = 'none';
      });
    }
    this._attackState = 'recharge';
    SFX.chime();
  }

  _hurtPlayer(dmg) {
    if (this._isDead || this._attackState === 'hurt') return;
    // Invincibility frames — can't be hit again for 0.4s after hurt starts
    if (this._iFrameTimer > 0) return;
    this._iFrameTimer = 0.4;
    this._playerHp = Math.max(0, this._playerHp - dmg);
    this._drawHpBar();
    SFX.impact();

    // ── FX: screen shake + chromatic aberration ──
    this._shakeScreen(7, 0.20);
    this._triggerChroma();
    // Knockback pop
    this.tweens.add({
      targets: this.player, scaleX: 3.2 * 1.08, scaleY: 3.2 * 0.90,
      duration: 55, ease: 'Quad.Out',
      onComplete: () => this.tweens.add({ targets: this.player, scaleX: 3.2, scaleY: 3.2, duration: 120, ease: 'Back.Out' })
    });

    this._attackState = 'hurt';
    const hurtAnim = this._p1Anims.hurt;
    if (this.anims.exists(hurtAnim)) {
      this.player.play(hurtAnim);
      this.player.once('animationcomplete', () => {
        if (!this._isDead) this._attackState = 'none';
      });
    } else {
      this.time.delayedCall(300, () => { if (!this._isDead) this._attackState = 'none'; });
    }

    // Flash red
    this.player.setTint(0xff0000);
    this.time.delayedCall(200, () => { if (!this._isDead) this.player.clearTint(); });

    if (this._playerHp <= 0) this._playerDie();
  }

  _playerDie() {
    this._isDead = true;
    this._attackState = 'dead';
    const deadAnim = this._p1Anims.dead;
    if (this.anims.exists(deadAnim)) this.player.play(deadAnim);
    SFX.error();

    // Death FX: massive shake + chroma + dust burst
    this._shakeScreen(14, 0.45);
    this._triggerChroma();
    for (let i = 0; i < 20; i++) {
      this._spawnLandDust(this.player.x, this.player.y, 0xcc2200);
    }

    this.time.delayedCall(1800, () => {
      const W = this.scale.width, H = this.scale.height;
      const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7).setDepth(100);
      this.add.text(W / 2, H / 2 - 30, 'YOU DIED', {
        fontFamily: 'Boldonse', fontSize: '48px', color: C.s.teal, letterSpacing: 8,
      }).setOrigin(0.5).setDepth(101);

      const retryHit = this.add.text(W / 2, H / 2 + 40, 'TAP TO RETRY', {
        fontFamily: 'Boldonse', fontSize: '16px', color: C.s.sand, letterSpacing: 4,
      }).setOrigin(0.5).setDepth(101).setInteractive({ useHandCursor: true });
      this.tweens.add({ targets: retryHit, alpha: { from: 0.4, to: 1 }, duration: 700, yoyo: true, repeat: -1 });
      retryHit.on('pointerdown', () => {
        this.scene.restart({
          mapKey:    this.mapKey,
          p1:        this.p1Id,
          p2:        this.p2Id,
          round:     this._round,
          diffLevel: this._diffLevel,
        });
      });
    });
  }

  _hitEnemy(dmg) {
    if (this._isEnemyDead) return;
    this._enemyHp = Math.max(0, this._enemyHp - dmg);
    this._drawEnemyHpBar();
    SFX.impact();

    // ── FX: camera punch + enemy knockback pop ──
    this._shakeScreen(5, 0.15);
    this.tweens.add({
      targets: this.enemy, scaleX: 3.2 * 1.10, scaleY: 3.2 * 0.88,
      duration: 55, ease: 'Quad.Out',
      onComplete: () => this.tweens.add({ targets: this.enemy, scaleX: 3.2, scaleY: 3.2, duration: 120, ease: 'Back.Out' })
    });

    // Enemy hurt flash
    this.enemy.setTint(0xff4444);
    this.time.delayedCall(150, () => {
      if (!this._isEnemyDead) this.enemy.setTint(0xff7777);
    });

    if (this._enemyHp <= 0) this._enemyDie();
  }

  _enemyDie() {
    this._isEnemyDead = true;
    if (this.anims.exists(this._p2Anims.dead)) this.enemy.play(this._p2Anims.dead);
    this._enemyLabel.setText('');
    // Death FX
    this._shakeScreen(12, 0.40);
    this._triggerChroma();
    for (let i = 0; i < 20; i++) {
      this._spawnLandDust(this.enemy.x, this.enemy.y, 0xff4400);
    }
    SFX.victory();

    // ── Difficulty progression ───────────────────────────
    // diffLevel: 0=easy → 1=moderate → 2=hard → 3=nightmare (final)
    const DIFF_LABELS  = ['EASY', 'MODERATE', 'HARD', 'NIGHTMARE'];
    const DIFF_IDS     = ['easy', 'moderate', 'hard', 'hard'];      // maps to AI diffStats keys
    const DIFF_COLORS  = [C.s.sage, C.s.amber, C.s.teal, C.s.crimson];
    const DIFF_SUBTITLES = [
      'THE FOE GROWS STRONGER…',
      'DANGER INTENSIFIES…',
      'BRACE YOURSELF…',
      '',   // final — no next
    ];

    const nextDiffLevel = this._diffLevel + 1;
    const isFinalRound  = this._diffLevel >= DIFF_LABELS.length - 1;
    const currentLabel  = DIFF_LABELS[this._diffLevel]  || 'HARD';
    const nextLabel     = DIFF_LABELS[nextDiffLevel]     || '';
    const nextDiffId    = DIFF_IDS[nextDiffLevel]        || 'hard';
    const nextColor     = DIFF_COLORS[nextDiffLevel]     || C.s.crimson;
    const nextRound     = this._round + 1;

    this.time.delayedCall(1800, () => {
      const W = this.scale.width, H = this.scale.height;
      const cx = W / 2, cy = H / 2;

      // ── Dark overlay ──
      const overlay = this.add.rectangle(cx, cy, W, H, 0x000000, 0).setDepth(100);
      this.tweens.add({ targets: overlay, fillAlpha: 0.72, duration: 400 });

      // ── Decorative horizontal bars ──
      const barTop = this.add.rectangle(cx, cy - 90, W, 2, C.n.amber, 0).setDepth(101);
      const barBot = this.add.rectangle(cx, cy + 90, W, 2, C.n.amber, 0).setDepth(101);
      this.tweens.add({ targets: [barTop, barBot], fillAlpha: 0.5, duration: 500, delay: 200 });

      // ── ROUND COMPLETE label ──
      const roundLabel = this.add.text(cx, cy - 65, `ROUND  ${this._round}  COMPLETE`, {
        fontFamily: 'Boldonse', fontSize: '13px', color: C.s.sage, letterSpacing: 5,
      }).setOrigin(0.5).setDepth(101).setAlpha(0);
      this.tweens.add({ targets: roundLabel, alpha: 1, y: cy - 60, duration: 380, delay: 180, ease: 'Back.Out' });

      // ── VICTORY! headline ──
      const victoryT = this.add.text(cx, cy - 22, 'VICTORY!', {
        fontFamily: 'Boldonse', fontSize: '52px', color: C.s.amber, letterSpacing: 10,
      }).setOrigin(0.5).setDepth(101).setAlpha(0).setScale(0.7);
      this.tweens.add({ targets: victoryT, alpha: 1, scaleX: 1, scaleY: 1, duration: 480, delay: 300, ease: 'Back.Out' });

      // ── Difficulty beaten tag ──
      const defeatedT = this.add.text(cx, cy + 28, `DEFEATED ON  ${currentLabel}`, {
        fontFamily: 'Boldonse', fontSize: '10px', color: DIFF_COLORS[this._diffLevel] || C.s.sage, letterSpacing: 4,
      }).setOrigin(0.5).setDepth(101).setAlpha(0);
      this.tweens.add({ targets: defeatedT, alpha: 0.85, duration: 350, delay: 550 });

      if (!isFinalRound) {
        // ── "NEXT ROUND" info ──
        const subtitleT = this.add.text(cx, cy + 52, DIFF_SUBTITLES[this._diffLevel] || '', {
          fontFamily: 'Boldonse', fontSize: '9px', color: C.s.sage, letterSpacing: 3,
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        this.tweens.add({ targets: subtitleT, alpha: 0.7, duration: 350, delay: 650 });

        // ── Next difficulty badge ──
        const nextDiffBadge = this.add.text(cx, cy + 68, `NEXT: ${nextLabel}`, {
          fontFamily: 'Boldonse', fontSize: '12px', color: nextColor, letterSpacing: 5,
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        this.tweens.add({ targets: nextDiffBadge, alpha: 1, duration: 350, delay: 750, ease: 'Back.Out' });

        // Pulse glow on the next difficulty badge
        this.tweens.add({
          targets: nextDiffBadge, alpha: { from: 0.6, to: 1 },
          duration: 600, yoyo: true, repeat: -1, delay: 900,
        });

        // ── NEXT ROUND button ──
        const nextBtn = this.add.text(cx, cy + 108, '▶  NEXT ROUND', {
          fontFamily: 'Boldonse', fontSize: '18px', color: C.s.sand, letterSpacing: 6,
          backgroundColor: 'rgba(0,0,0,0)',
          padding: { x: 18, y: 10 },
        }).setOrigin(0.5).setDepth(102).setAlpha(0).setInteractive({ useHandCursor: true });

        // Draw button border
        const btnBorder = this.add.graphics().setDepth(101).setAlpha(0);
        this.tweens.add({ targets: [nextBtn, btnBorder], alpha: 1, duration: 350, delay: 900 });

        // Button pulse
        this.tweens.add({
          targets: nextBtn, alpha: { from: 0.55, to: 1 },
          duration: 700, yoyo: true, repeat: -1, delay: 1100,
        });

        nextBtn.on('pointerover', () => { nextBtn.setColor('#ffffff'); SFX.hover(); });
        nextBtn.on('pointerout',  () => { nextBtn.setColor(C.s.sand); });
        nextBtn.on('pointerdown', () => {
          SFX.confirm();
          // Set the next difficulty on the global so AI picks it up
          window._difficulty = nextDiffId;
          flash(this, () => this.scene.restart({
            mapKey:    this.mapKey,
            p1:        this.p1Id,
            p2:        this.p2Id,
            round:     nextRound,
            diffLevel: nextDiffLevel,
          }));
        });

        // ── "Back to map select" secondary link ──
        const exitT = this.add.text(cx, cy + 145, 'EXIT TO MAP SELECT', {
          fontFamily: 'Boldonse', fontSize: '9px', color: C.s.sage, letterSpacing: 3, alpha: 0.5,
        }).setOrigin(0.5).setDepth(102).setAlpha(0).setInteractive({ useHandCursor: true });
        this.tweens.add({ targets: exitT, alpha: 0.45, duration: 350, delay: 1100 });
        exitT.on('pointerover', () => { exitT.setAlpha(0.9); exitT.setColor(C.s.sand); });
        exitT.on('pointerout',  () => { exitT.setAlpha(0.45); exitT.setColor(C.s.sage); });
        exitT.on('pointerdown', () => {
          SFX.back();
          flash(this, () => this.scene.start('MapSelectScene'));
        });

      } else {
        // ── FINAL VICTORY — all rounds cleared ──
        const finalT = this.add.text(cx, cy + 52, 'ALL ROUNDS CLEARED!', {
          fontFamily: 'Boldonse', fontSize: '14px', color: C.s.amber, letterSpacing: 5,
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        this.tweens.add({ targets: finalT, alpha: 1, duration: 400, delay: 600, ease: 'Back.Out' });

        // Trophy star row
        const stars = '★  ★  ★  ★';
        const starT = this.add.text(cx, cy + 74, stars, {
          fontFamily: 'Boldonse', fontSize: '18px', color: C.s.amber, letterSpacing: 8,
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        this.tweens.add({ targets: starT, alpha: 1, duration: 400, delay: 800, ease: 'Back.Out' });
        this.tweens.add({ targets: starT, alpha: { from: 0.5, to: 1 }, duration: 900, yoyo: true, repeat: -1, delay: 1100 });

        const mapBtn = this.add.text(cx, cy + 115, '▶  CHOOSE NEW MAP', {
          fontFamily: 'Boldonse', fontSize: '16px', color: C.s.sand, letterSpacing: 5,
          padding: { x: 16, y: 10 },
        }).setOrigin(0.5).setDepth(102).setAlpha(0).setInteractive({ useHandCursor: true });
        this.tweens.add({ targets: mapBtn, alpha: 1, duration: 350, delay: 1000 });
        this.tweens.add({ targets: mapBtn, alpha: { from: 0.5, to: 1 }, duration: 700, yoyo: true, repeat: -1, delay: 1300 });
        mapBtn.on('pointerover', () => { mapBtn.setColor('#ffffff'); SFX.hover(); });
        mapBtn.on('pointerout',  () => { mapBtn.setColor(C.s.sand); });
        mapBtn.on('pointerdown', () => {
          SFX.confirm();
          flash(this, () => this.scene.start('MapSelectScene'));
        });
      }
    });
  }

  // ── Map 1 animated background helpers ────────
  _drawMap1Atm() {
    const W = this.scale.width, H = this.scale.height;
    this._animBg.atmGfx.clear();
    this._animBg.atmGfx.fillGradientStyle(0x1a0530,0x1a0530,0xff6030,0xff8050, 0,0,0.45,0.45);
    this._animBg.atmGfx.fillRect(0, H*0.35, W, H*0.65);
  }
  _newMap1Wind(rand) {
    const W = this.scale.width, H = this.scale.height;
    return { x: rand ? Phaser.Math.Between(0,W) : -200, y: Phaser.Math.Between(H*0.05,H*0.82),
      len: Phaser.Math.Between(40,180), speed: Phaser.Math.FloatBetween(180,420),
      alpha: Phaser.Math.FloatBetween(0.04,0.18), thick: Phaser.Math.FloatBetween(0.5,2),
      life: Phaser.Math.FloatBetween(0,1), maxLife: Phaser.Math.FloatBetween(0.4,1.2) };
  }
  _newMap1Dust(rand) {
    const W = this.scale.width, H = this.scale.height;
    return { x: rand ? Phaser.Math.Between(0,W) : -5, y: Phaser.Math.Between(H*0.05,H*0.88),
      size: Phaser.Math.FloatBetween(1,3.5), speed: Phaser.Math.FloatBetween(30,110),
      vy: Phaser.Math.FloatBetween(-8,8), alpha: Phaser.Math.FloatBetween(0.05,0.28),
      color: Phaser.Utils.Array.GetRandom([0xffeedd,0xaaddff,0xffd080,0xffffff,0x88ccff]) };
  }
  _newMap1Ember(rand) {
    const W = this.scale.width, H = this.scale.height;
    return { x: rand ? Phaser.Math.Between(0,W) : W+5, y: Phaser.Math.Between(H*0.55,H*0.85),
      size: Phaser.Math.FloatBetween(1.5,3.5), speed: Phaser.Math.FloatBetween(40,130),
      vy: Phaser.Math.FloatBetween(-20,-60), alpha: Phaser.Math.FloatBetween(0.3,0.9),
      life: 0, maxLife: Phaser.Math.FloatBetween(1.5,3.5),
      color: Phaser.Utils.Array.GetRandom([0xff6600,0xffaa00,0xff3300,0xffdd44]) };
  }
  _scheduleMap1Lightning() {
    this.time.delayedCall(Phaser.Math.Between(5000,14000), () => {
      if (!this._animBg) return;
      this.tweens.add({ targets: this._animBg.lightning, alpha:{ from:0, to:0.14 },
        duration:55, yoyo:true, repeat:1,
        onComplete: () => {
          this.tweens.add({ targets: this._animBg.lightning, alpha:0, duration:100,
            onComplete: () => this._scheduleMap1Lightning() });
        }
      });
    });
  }
  _tickMap1Bg(time, delta) {
    const dt  = delta / 1000;
    const W   = this.scale.width, H = this.scale.height;
    const ab  = this._animBg;

    // Scroll clouds
    ab.cloudLayers.forEach(layer => {
      layer.a.x -= layer.speed * dt;
      layer.b.x -= layer.speed * dt;
      if (layer.a.x + W*0.5 <= 0) layer.a.x = layer.b.x + W;
      if (layer.b.x + W*0.5 <= 0) layer.b.x = layer.a.x + W;
    });

    // Scroll rocks 1
    ab.r1a.x -= 8 * dt; ab.r1b.x -= 8 * dt;
    if (ab.r1a.x <= -W) ab.r1a.x = ab.r1b.x + W;
    if (ab.r1b.x <= -W) ab.r1b.x = ab.r1a.x + W;

    // Scroll rocks 2
    ab.r2a.x -= 20 * dt; ab.r2b.x -= 20 * dt;
    if (ab.r2a.x <= -W) ab.r2a.x = ab.r2b.x + W;
    if (ab.r2b.x <= -W) ab.r2b.x = ab.r2a.x + W;

    // Wind streaks
    ab.windGfx.clear();
    ab.windLines.forEach((w, i) => {
      w.x += w.speed * dt; w.life += dt;
      if (w.x > W + w.len || w.life > w.maxLife) { ab.windLines[i] = this._newMap1Wind(false); return; }
      const fade = Math.sin((w.life / w.maxLife) * Math.PI);
      ab.windGfx.lineStyle(w.thick, 0xaaddff, w.alpha * fade);
      ab.windGfx.beginPath(); ab.windGfx.moveTo(w.x, w.y); ab.windGfx.lineTo(w.x - w.len, w.y); ab.windGfx.strokePath();
    });

    // Dust particles
    ab.dustGfx.clear();
    ab.dustParticles.forEach((p, i) => {
      p.x += p.speed * dt; p.y += p.vy * dt;
      if (p.x > W + 10) { ab.dustParticles[i] = this._newMap1Dust(false); return; }
      ab.dustGfx.fillStyle(p.color, p.alpha * Math.abs(Math.sin(time*0.001 + i)));
      ab.dustGfx.fillCircle(p.x, p.y, p.size);
    });

    // Embers
    ab.emberGfx.clear();
    ab.embers.forEach((e, i) => {
      e.x -= e.speed * dt; e.y += e.vy * dt; e.life += dt; e.vy *= 0.99;
      if (e.x < -10 || e.life > e.maxLife || e.y < H*0.1) { ab.embers[i] = this._newMap1Ember(false); return; }
      const lf = e.life / e.maxLife;
      ab.emberGfx.fillStyle(e.color, e.alpha * (1 - lf));
      ab.emberGfx.fillCircle(e.x, e.y, e.size * (1 - lf*0.5));
    });
  }

  // ── Map 2 animated background helpers ────────
  _newMap2Wind(rand) {
    const W = this.scale.width, H = this.scale.height;
    return {
      x:       rand ? Phaser.Math.Between(0, W) : -250,
      y:       Phaser.Math.Between(H * 0.05, H * 0.75),
      len:     Phaser.Math.Between(60, 220),
      speed:   Phaser.Math.FloatBetween(120, 300),
      alpha:   Phaser.Math.FloatBetween(0.03, 0.14),
      thick:   Phaser.Math.FloatBetween(0.4, 1.5),
      life:    Phaser.Math.FloatBetween(0, 1),
      maxLife: Phaser.Math.FloatBetween(0.6, 1.8),
    };
  }
  _newMap2Dust(rand) {
    const W = this.scale.width, H = this.scale.height;
    return {
      x:     rand ? Phaser.Math.Between(0, W) : -5,
      y:     Phaser.Math.Between(H * 0.1, H * 0.9),
      size:  Phaser.Math.FloatBetween(1, 2.8),
      speed: Phaser.Math.FloatBetween(15, 70),
      vy:    Phaser.Math.FloatBetween(-5, 5),
      alpha: Phaser.Math.FloatBetween(0.06, 0.30),
      color: Phaser.Utils.Array.GetRandom([0xc8e8ff, 0xdff5f5, 0xffffff, 0xa8d8ea, 0xe0f0ff]),
    };
  }
  _newMap2Bokeh(rand) {
    const W = this.scale.width, H = this.scale.height;
    return {
      x:     rand ? Phaser.Math.Between(0, W) : Phaser.Math.Between(0, W),
      y:     Phaser.Math.Between(H * 0.05, H * 0.65),
      r:     Phaser.Math.FloatBetween(4, 18),
      alpha: Phaser.Math.FloatBetween(0.02, 0.10),
      speed: Phaser.Math.FloatBetween(5, 25),
      vy:    Phaser.Math.FloatBetween(-4, -12),
      life:  Phaser.Math.FloatBetween(0, Math.PI * 2),
      pulse: Phaser.Math.FloatBetween(0.004, 0.012),
      color: Phaser.Utils.Array.GetRandom([0x88ccff, 0xaaddcc, 0xffffff, 0x66bbdd]),
    };
  }
  _tickMap2Bg(time, delta) {
    const dt = delta / 1000;
    const W  = this.scale.width, H = this.scale.height;
    const ab = this._animBg2;

    // Scroll rocks 2 — very slow drift (distant mountains)
    ab.rocks2a.x -= 2 * dt; ab.rocks2b.x -= 2 * dt;
    if (ab.rocks2a.x <= -W) ab.rocks2a.x = ab.rocks2b.x + W;
    if (ab.rocks2b.x <= -W) ab.rocks2b.x = ab.rocks2a.x + W;

    // Scroll rocks 3 — slow drift (closer mountains)
    ab.rocks3a.x -= 5 * dt; ab.rocks3b.x -= 5 * dt;
    if (ab.rocks3a.x <= -W) ab.rocks3a.x = ab.rocks3b.x + W;
    if (ab.rocks3b.x <= -W) ab.rocks3b.x = ab.rocks3a.x + W;

    // Scroll clouds
    ab.cloudLayers.forEach(layer => {
      layer.a.x -= layer.speed * dt;
      layer.b.x -= layer.speed * dt;
      if (layer.a.x + W * 0.5 <= 0) layer.a.x = layer.b.x + W;
      if (layer.b.x + W * 0.5 <= 0) layer.b.x = layer.a.x + W;
    });

    // Birds — fly left, gentle vertical bob, wrap around
    ab.birdGroups.forEach((bird, i) => {
      bird.img.x -= bird.spd * dt;
      bird.img.y = bird.startY + Math.sin(time * 0.0008 + i * 2.1) * 12;
      if (bird.img.x < -bird.img.displayWidth * 0.5) {
        bird.img.x = W + bird.img.displayWidth * 0.5;
        bird.startY = Phaser.Math.Between(H * 0.08, H * 0.38);
        bird.spd    = Phaser.Math.FloatBetween(18, 45);
        bird.img.setScale(Phaser.Math.FloatBetween(0.22, 0.55));
        bird.img.setAlpha(Phaser.Math.FloatBetween(0.55, 0.9));
      }
    });

    // Wind streaks
    ab.windGfx.clear();
    ab.windLines.forEach((w, i) => {
      w.x += w.speed * dt; w.life += dt;
      if (w.x > W + w.len || w.life > w.maxLife) { ab.windLines[i] = this._newMap2Wind(false); return; }
      const fade = Math.sin((w.life / w.maxLife) * Math.PI);
      ab.windGfx.lineStyle(w.thick, 0xc8e8ff, w.alpha * fade);
      ab.windGfx.beginPath(); ab.windGfx.moveTo(w.x, w.y); ab.windGfx.lineTo(w.x - w.len, w.y); ab.windGfx.strokePath();
    });

    // Dust motes
    ab.dustGfx.clear();
    ab.dustParticles.forEach((p, i) => {
      p.x += p.speed * dt; p.y += p.vy * dt;
      if (p.x > W + 10) { ab.dustParticles[i] = this._newMap2Dust(false); return; }
      ab.dustGfx.fillStyle(p.color, p.alpha * Math.abs(Math.sin(time * 0.0008 + i * 0.7)));
      ab.dustGfx.fillCircle(p.x, p.y, p.size);
    });

    // Bokeh light orbs
    ab.bokehGfx.clear();
    ab.bokehs.forEach((b, i) => {
      b.life += b.pulse; b.x -= b.speed * dt * 0.3; b.y += b.vy * dt;
      if (b.x < -b.r * 2 || b.y < -b.r * 2) {
        ab.bokehs[i] = this._newMap2Bokeh(false);
        ab.bokehs[i].x = Phaser.Math.Between(0, W);
        ab.bokehs[i].y = H * 0.65;
        return;
      }
      const pulse = 0.5 + 0.5 * Math.sin(b.life);
      ab.bokehGfx.fillStyle(b.color, b.alpha * pulse);
      ab.bokehGfx.fillCircle(b.x, b.y, b.r * (0.8 + 0.2 * pulse));
    });
  }

  // ── Map 3 animated background helpers ────────
  _newMap3Wind(rand) {
    const W = this.scale.width, H = this.scale.height;
    return {
      x:       rand ? Phaser.Math.Between(0, W) : -280,
      y:       Phaser.Math.Between(H * 0.04, H * 0.78),
      len:     Phaser.Math.Between(50, 200),
      speed:   Phaser.Math.FloatBetween(100, 260),
      alpha:   Phaser.Math.FloatBetween(0.03, 0.13),
      thick:   Phaser.Math.FloatBetween(0.4, 1.4),
      life:    Phaser.Math.FloatBetween(0, 1),
      maxLife: Phaser.Math.FloatBetween(0.5, 1.6),
    };
  }
  _newMap3Dust(rand) {
    const W = this.scale.width, H = this.scale.height;
    return {
      x:     rand ? Phaser.Math.Between(0, W) : -5,
      y:     Phaser.Math.Between(H * 0.05, H * 0.92),
      size:  Phaser.Math.FloatBetween(0.8, 2.6),
      speed: Phaser.Math.FloatBetween(20, 80),
      vy:    Phaser.Math.FloatBetween(-6, 2),   // mostly float down or sideways
      alpha: Phaser.Math.FloatBetween(0.06, 0.32),
      color: Phaser.Utils.Array.GetRandom([0xd0e8ff, 0xb0ccee, 0xffffff, 0x8899cc, 0xcce0ff]),
    };
  }
  _newMap3Fog(rand) {
    const W = this.scale.width, H = this.scale.height;
    return {
      x:     rand ? Phaser.Math.Between(0, W) : Phaser.Math.Between(0, W),
      y:     Phaser.Math.Between(H * 0.60, H * 0.90),
      r:     Phaser.Math.FloatBetween(30, 90),
      alpha: Phaser.Math.FloatBetween(0.03, 0.10),
      speedX: Phaser.Math.FloatBetween(4, 18),
      vy:    Phaser.Math.FloatBetween(-2, 2),
      life:  Phaser.Math.FloatBetween(0, Math.PI * 2),
      pulse: Phaser.Math.FloatBetween(0.003, 0.009),
      color: Phaser.Utils.Array.GetRandom([0x4488aa, 0x336699, 0x5599bb, 0x335577]),
    };
  }
  _tickMap3Bg(time, delta) {
    const dt = delta / 1000;
    const W  = this.scale.width, H = this.scale.height;
    const ab = this._animBg3;

    // Scroll rocks — very slow (distant silhouette)
    ab.rocksA.x -= 3 * dt; ab.rocksB.x -= 3 * dt;
    if (ab.rocksA.x <= -W) ab.rocksA.x = ab.rocksB.x + W;
    if (ab.rocksB.x <= -W) ab.rocksB.x = ab.rocksA.x + W;

    // Scroll ground 1 — slow (far tree line)
    ab.gnd1A.x -= 6 * dt; ab.gnd1B.x -= 6 * dt;
    if (ab.gnd1A.x <= -W) ab.gnd1A.x = ab.gnd1B.x + W;
    if (ab.gnd1B.x <= -W) ab.gnd1B.x = ab.gnd1A.x + W;

    // Scroll ground 2 — medium (mid tree line)
    ab.gnd2A.x -= 12 * dt; ab.gnd2B.x -= 12 * dt;
    if (ab.gnd2A.x <= -W) ab.gnd2A.x = ab.gnd2B.x + W;
    if (ab.gnd2B.x <= -W) ab.gnd2B.x = ab.gnd2A.x + W;

    // Scroll ground 3 — faster (near tree line)
    ab.gnd3A.x -= 22 * dt; ab.gnd3B.x -= 22 * dt;
    if (ab.gnd3A.x <= -W) ab.gnd3A.x = ab.gnd3B.x + W;
    if (ab.gnd3B.x <= -W) ab.gnd3B.x = ab.gnd3A.x + W;

    // Scroll plant — fastest foreground flora
    ab.plantA.x -= 35 * dt; ab.plantB.x -= 35 * dt;
    if (ab.plantA.x <= -W) ab.plantA.x = ab.plantB.x + W;
    if (ab.plantB.x <= -W) ab.plantB.x = ab.plantA.x + W;

    // Scroll clouds
    ab.cloudLayers.forEach(layer => {
      layer.a.x -= layer.speed * dt;
      layer.b.x -= layer.speed * dt;
      if (layer.a.x + W * 0.5 <= 0) layer.a.x = layer.b.x + W;
      if (layer.b.x + W * 0.5 <= 0) layer.b.x = layer.a.x + W;
    });

    // Cold wind streaks (pale icy blue)
    ab.windGfx.clear();
    ab.windLines.forEach((w, i) => {
      w.x += w.speed * dt; w.life += dt;
      if (w.x > W + w.len || w.life > w.maxLife) { ab.windLines[i] = this._newMap3Wind(false); return; }
      const fade = Math.sin((w.life / w.maxLife) * Math.PI);
      ab.windGfx.lineStyle(w.thick, 0x99ccee, w.alpha * fade);
      ab.windGfx.beginPath(); ab.windGfx.moveTo(w.x, w.y); ab.windGfx.lineTo(w.x - w.len, w.y); ab.windGfx.strokePath();
    });

    // Snow/frost dust motes
    ab.dustGfx.clear();
    ab.dustParticles.forEach((p, i) => {
      p.x += p.speed * dt; p.y += p.vy * dt;
      if (p.x > W + 10) { ab.dustParticles[i] = this._newMap3Dust(false); return; }
      ab.dustGfx.fillStyle(p.color, p.alpha * Math.abs(Math.sin(time * 0.0009 + i * 0.6)));
      ab.dustGfx.fillCircle(p.x, p.y, p.size);
    });

    // Ground-hugging ethereal fog orbs
    ab.fogGfx.clear();
    ab.fogOrbs.forEach((o, i) => {
      o.life += o.pulse;
      o.x    -= o.speedX * dt;
      o.y    += o.vy * dt;
      if (o.x < -o.r * 2) {
        ab.fogOrbs[i] = this._newMap3Fog(false);
        ab.fogOrbs[i].x = W + 10;
        return;
      }
      const pulse = 0.5 + 0.5 * Math.sin(o.life);
      ab.fogGfx.fillStyle(o.color, o.alpha * pulse);
      ab.fogGfx.fillCircle(o.x, o.y, o.r * (0.85 + 0.15 * pulse));
    });
  }

  // ── Map 4 animated background helpers ────────
  _newMap4Wind(rand) {
    const W = this.scale.width, H = this.scale.height;
    return {
      x:       rand ? Phaser.Math.Between(0, W) : -300,
      y:       Phaser.Math.Between(H * 0.03, H * 0.80),
      len:     Phaser.Math.Between(60, 240),
      speed:   Phaser.Math.FloatBetween(130, 320),
      alpha:   Phaser.Math.FloatBetween(0.04, 0.16),
      thick:   Phaser.Math.FloatBetween(0.4, 1.6),
      life:    Phaser.Math.FloatBetween(0, 1),
      maxLife: Phaser.Math.FloatBetween(0.4, 1.4),
    };
  }
  _newMap4Dust(rand) {
    const W = this.scale.width, H = this.scale.height;
    return {
      x:     rand ? Phaser.Math.Between(0, W) : -5,
      y:     Phaser.Math.Between(H * 0.04, H * 0.95),
      size:  Phaser.Math.FloatBetween(0.6, 2.8),
      speed: Phaser.Math.FloatBetween(18, 90),
      vy:    Phaser.Math.FloatBetween(-4, 4),
      alpha: Phaser.Math.FloatBetween(0.07, 0.35),
      color: Phaser.Utils.Array.GetRandom([0xaaeeff, 0x88ddff, 0xffffff, 0x66ccee, 0xbbf0ff]),
    };
  }
  _newMap4Fog(rand) {
    const W = this.scale.width, H = this.scale.height;
    return {
      x:      rand ? Phaser.Math.Between(0, W) : Phaser.Math.Between(0, W),
      y:      Phaser.Math.Between(H * 0.50, H * 0.88),
      r:      Phaser.Math.FloatBetween(25, 80),
      alpha:  Phaser.Math.FloatBetween(0.04, 0.13),
      speedX: Phaser.Math.FloatBetween(3, 16),
      vy:     Phaser.Math.FloatBetween(-1.5, 1.5),
      life:   Phaser.Math.FloatBetween(0, Math.PI * 2),
      pulse:  Phaser.Math.FloatBetween(0.003, 0.010),
      color:  Phaser.Utils.Array.GetRandom([0x44ccdd, 0x22aacc, 0x55eeff, 0x33bbcc]),
    };
  }
  _tickMap4Bg(time, delta) {
    const dt = delta / 1000;
    const W  = this.scale.width, H = this.scale.height;
    const ab = this._animBg4;

    // Scroll rocks — slow (icy cliff face)
    ab.rocksA.x -= 4 * dt; ab.rocksB.x -= 4 * dt;
    if (ab.rocksA.x <= -W) ab.rocksA.x = ab.rocksB.x + W;
    if (ab.rocksB.x <= -W) ab.rocksB.x = ab.rocksA.x + W;

    // Scroll ground — faster (nearest icy floor)
    ab.gndA.x -= 20 * dt; ab.gndB.x -= 20 * dt;
    if (ab.gndA.x <= -W) ab.gndA.x = ab.gndB.x + W;
    if (ab.gndB.x <= -W) ab.gndB.x = ab.gndA.x + W;

    // Scroll clouds
    ab.cloudLayers.forEach(layer => {
      layer.a.x -= layer.speed * dt;
      layer.b.x -= layer.speed * dt;
      if (layer.a.x + W * 0.5 <= 0) layer.a.x = layer.b.x + W;
      if (layer.b.x + W * 0.5 <= 0) layer.b.x = layer.a.x + W;
    });

    // Icy wind streaks (sharp cyan/white)
    ab.windGfx.clear();
    ab.windLines.forEach((w, i) => {
      w.x += w.speed * dt; w.life += dt;
      if (w.x > W + w.len || w.life > w.maxLife) { ab.windLines[i] = this._newMap4Wind(false); return; }
      const fade = Math.sin((w.life / w.maxLife) * Math.PI);
      ab.windGfx.lineStyle(w.thick, 0x88eeff, w.alpha * fade);
      ab.windGfx.beginPath(); ab.windGfx.moveTo(w.x, w.y); ab.windGfx.lineTo(w.x - w.len, w.y); ab.windGfx.strokePath();
    });

    // Snow / ice crystal motes
    ab.dustGfx.clear();
    ab.dustParticles.forEach((p, i) => {
      p.x += p.speed * dt; p.y += p.vy * dt;
      if (p.x > W + 10) { ab.dustParticles[i] = this._newMap4Dust(false); return; }
      ab.dustGfx.fillStyle(p.color, p.alpha * Math.abs(Math.sin(time * 0.001 + i * 0.55)));
      ab.dustGfx.fillCircle(p.x, p.y, p.size);
    });

    // Waterfall shimmer / glowing ice orbs near ground
    ab.fogGfx.clear();
    ab.fogOrbs.forEach((o, i) => {
      o.life += o.pulse;
      o.x    -= o.speedX * dt;
      o.y    += o.vy * dt;
      if (o.x < -o.r * 2) {
        ab.fogOrbs[i] = this._newMap4Fog(false);
        ab.fogOrbs[i].x = W + 10;
        return;
      }
      const pulse = 0.5 + 0.5 * Math.sin(o.life);
      ab.fogGfx.fillStyle(o.color, o.alpha * pulse);
      ab.fogGfx.fillCircle(o.x, o.y, o.r * (0.85 + 0.15 * pulse));
    });
  }

  // ─────────────────────────────────────────────
  fitBg() {
    const { width: W, height: H } = this.scale;
    if (!this.bg || !this.bg.width || !this.bg.height) return;
    const s = Math.max(W / this.bg.width, H / this.bg.height);
    this.bg.setScale(s).setPosition(W / 2, H / 2);
  }

  // ─────────────────────────────────────────────
  update(time, delta) {
    if (this._isDead) return;

    // Tick animated map 1 background
    if (this._animBg) this._tickMap1Bg(time, delta);
    // Tick animated map 2 background
    if (this._animBg2) this._tickMap2Bg(time, delta);
    // Tick animated map 3 background
    if (this._animBg3) this._tickMap3Bg(time, delta);
    // Tick animated map 4 background
    if (this._animBg4) this._tickMap4Bg(time, delta);

    const dt = delta / 1000;
    const cursors = this.cursors;
    const wasd    = this.wasd;
    const p       = this.player;

    // Tick character animation enhancement systems
    if (this._shadowP1) this._tickCharacterFX(time, delta);

    // Cool down timers
    if (this._attackCooldown > 0) this._attackCooldown -= dt;
    if (this._shootCooldown  > 0) this._shootCooldown  -= dt;
    if (this._iFrameTimer    > 0) this._iFrameTimer    -= dt;

    // On-ground check
    this._isOnGround = p.body.blocked.down;

    // ── Locked states ────────────────────────────────────
    const locked = ['attack1','attack2','shot','hurt','dead','recharge'].includes(this._attackState);

    // ── Move ─────────────────────────────────────────────
    const left  = cursors.left.isDown  || wasd.left.isDown  || this._mobileLeft;
    const right = cursors.right.isDown || wasd.right.isDown || this._mobileRight;
    const jump  = Phaser.Input.Keyboard.JustDown(cursors.up) ||
                  Phaser.Input.Keyboard.JustDown(wasd.up)     || this._mobileJump;
    const atk1  = Phaser.Input.Keyboard.JustDown(wasd.attack1) || this._mobileAtk1;
    const atk2  = Phaser.Input.Keyboard.JustDown(wasd.attack2) || this._mobileAtk2;
    const shoot = Phaser.Input.Keyboard.JustDown(cursors.space) ||
                  Phaser.Input.Keyboard.JustDown(wasd.shoot)     || this._mobileShoot;

    // Reset one-frame mobile flags
    this._mobileJump = false; this._mobileAtk1 = false;
    this._mobileAtk2 = false; this._mobileShoot = false;

    if (!locked) {
      // Horizontal move
      if (left) {
        p.setVelocityX(-260);
        this._playerFacing = -1;
        p.setFlipX(true);
        if (this._isOnGround) {
          this._playAnim(p, this._p1Anims.run);
          p.setAngle(-5); // lean forward
        }
      } else if (right) {
        p.setVelocityX(260);
        this._playerFacing = 1;
        p.setFlipX(false);
        if (this._isOnGround) {
          this._playAnim(p, this._p1Anims.run);
          p.setAngle(5); // lean forward
        }
      } else {
        p.setVelocityX(0);
        p.setAngle(0);
        if (this._isOnGround) this._playAnim(p, this._p1Anims.idle);
      }

      // Jump
      if (jump && this._isOnGround) {
        p.setVelocityY(-580);
        this._isJumping = true;
        this._playAnim(p, this._p1Anims.jump);
        SFX.nav();
        // Jump launch: squash then stretch
        this.tweens.add({
          targets: p, scaleX: 3.2 * 1.15, scaleY: 3.2 * 0.80,
          duration: 55, ease: 'Quad.Out',
          onComplete: () => this.tweens.add({
            targets: p, scaleX: 3.2 * 0.88, scaleY: 3.2 * 1.12,
            duration: 120, ease: 'Back.Out'
          })
        });
        this._spawnLandDust(p.x, p.y, 0xe8c87a);
      }

      // Attack 1 (melee punch)
      if (atk1 && this._attackCooldown <= 0) {
        this._attackState  = 'attack1';
        this._attackCooldown = 0.7;
        p.setVelocityX(0);
        p.setAngle(0);
        this._playAnim(p, this._p1Anims.attack1);
        SFX.select();
        p.once('animationcomplete', () => { this._attackState = 'none'; });
      }

      // Attack 2 (melee kick)
      if (atk2 && this._attackCooldown <= 0) {
        this._attackState  = 'attack2';
        this._attackCooldown = 0.6;
        p.setVelocityX(this._playerFacing * 80);
        p.setAngle(0);
        this._playAnim(p, this._p1Anims.attack2);
        SFX.hover();
        p.once('animationcomplete', () => { this._attackState = 'none'; });
      }

      // Shoot
      if (shoot && this._shootCooldown <= 0 && !this._recharging) {
        this._attackState  = 'shot';
        this._shootCooldown = 0.22;
        p.setVelocityX(0);
        this._playAnim(p, this._p1Anims.shot);

        const bx = p.x + this._playerFacing * 60;
        const by = p.y - 10;
        this._fireBullet(bx, by, this._playerFacing);

        this.time.delayedCall(350, () => {
          if (this._attackState === 'shot') this._attackState = 'none';
        });
      }
    }

    // In-air idle / jump pose
    if (!this._isOnGround && !locked) {
      this._playAnim(p, this._p1Anims.jump);
      p.setAngle(0);
    }

    // ── Enemy AI ──────────────────────────────────────────
    if (!this._isEnemyDead) {
      this._updateEnemyAI(dt);
      this._enemyLabel.setPosition(this.enemy.x, this.enemy.y - 128 * 3.2 - 10);
    }
  }

  _playAnim(sprite, key) {
    // Guard: only play if the animation exists and the texture is loaded
    if (!this.anims.exists(key)) return;
    if (sprite.anims.currentAnim && sprite.anims.currentAnim.key === key
        && sprite.anims.isPlaying) return;
    sprite.play(key, true);
  }

  // ── Advanced Enemy AI ─────────────────────────────────
  // State machine: idle | approach | retreat | strafe | attack_melee | attack_ranged | dodge_back | dodge_jump | recharge | stunned
  _updateEnemyAI(dt) {
    const e    = this.enemy;
    const p    = this.player;
    const dx   = p.x - e.x;
    const dist = Math.abs(dx);
    const dir  = dx > 0 ? 1 : -1;   // direction toward player
    const W    = this.scale.width;

    // Always face the player
    e.setFlipX(dir < 0);

    // Tick all cooldown timers
    this._aiTimer        = (this._aiTimer        || 0) - dt;
    this._aiAttackCD     = (this._aiAttackCD     || 0) - dt;
    this._aiDodgeCD      = (this._aiDodgeCD      || 0) - dt;
    this._aiJumpCD       = (this._aiJumpCD       || 0) - dt;
    this._aiRangedCD     = (this._aiRangedCD     || 0) - dt;
    this._aiComboCount   = this._aiComboCount    || 0;
    this._aiState        = this._aiState         || 'approach';
    this._aiHitMemory    = (this._aiHitMemory    || 0) - dt;  // remembers being hit recently
    this._aiAggrTimer    = (this._aiAggrTimer    || 0) - dt;  // aggression burst timer
    this._aiStrafeDir    = this._aiStrafeDir     || 1;
    this._aiStrafTimer   = (this._aiStrafTimer   || 0) - dt;
    this._prevEnemyHp    = this._prevEnemyHp     !== undefined ? this._prevEnemyHp : this._enemyHp;

    const onGround = e.body.blocked.down;

    // ── Difficulty scaling — must be defined before any DS usage ──
    const diff = window._difficulty || 'moderate';
    const hpPct = this._enemyHp / 100;
    const desperateFight = hpPct < 0.4;
    const diffStats = {
      easy:     { attackRange: 130, retreatRange: 80,  meleeSpeed: 150, approachSpeed: 140, rangedCDMin: 1.6, rangedCDMid: 1.4, dodgeChance: 0.25, jumpChanceMid: 0.06, jumpChanceClose: 0.10, aggrChance: 0.45, comboChance: 0.25, dmgMult: 1.20 },
      moderate: { attackRange: 165, retreatRange: 60,  meleeSpeed: 220, approachSpeed: 195, rangedCDMin: 1.1, rangedCDMid: 0.9, dodgeChance: 0.55, jumpChanceMid: 0.14, jumpChanceClose: 0.20, aggrChance: 0.70, comboChance: 0.45, dmgMult: 1.80 },
      hard:     { attackRange: 210, retreatRange: 35,  meleeSpeed: 310, approachSpeed: 275, rangedCDMin: 0.5, rangedCDMid: 0.4, dodgeChance: 0.82, jumpChanceMid: 0.28, jumpChanceClose: 0.45, aggrChance: 0.90, comboChance: 0.72, dmgMult: 2.60 },
    };
    const DS = diffStats[diff] || diffStats.moderate;

    // ── React when hit ────────────────────────────────────
    const justHit = this._enemyHp < this._prevEnemyHp;
    this._prevEnemyHp = this._enemyHp;
    if (justHit) {
      this._aiHitMemory = 1.2;
      if (this._aiDodgeCD <= 0 && onGround) {
        const reaction = Math.random();
        if (reaction < DS.dodgeChance) {
          this._aiState  = 'dodge_back';
          this._aiTimer  = 0.45;
          this._aiDodgeCD = Phaser.Math.Between(12, 22) / 10;
        } else if (reaction < DS.dodgeChance + 0.25 && this._aiJumpCD <= 0) {
          this._aiState  = 'dodge_jump';
          this._aiTimer  = 0.6;
          this._aiDodgeCD = Phaser.Math.Between(8, 16) / 10;
          this._aiJumpCD  = 1.2;
        } else {
          this._aiAttackCD = Math.min(this._aiAttackCD, 0.1);
          this._aiState    = 'approach';
        }
      }
    }

    // ── Player is attacking? Trigger evasion ─────────────
    const playerAttacking = ['attack1','attack2','shot'].includes(this._attackState);
    if (playerAttacking && dist < 280 && this._aiDodgeCD <= 0 && onGround) {
      const evade = Math.random();
      if (evade < DS.dodgeChance * 0.9) {
        this._aiState   = 'dodge_back';
        this._aiTimer   = 0.4;
        this._aiDodgeCD = Phaser.Math.Between(14, 24) / 10;
      } else if (evade < DS.dodgeChance * 1.5 && this._aiJumpCD <= 0) {
        this._aiState   = 'dodge_jump';
        this._aiTimer   = 0.55;
        this._aiDodgeCD = Phaser.Math.Between(10, 18) / 10;
        this._aiJumpCD  = 1.5;
      }
    }

    // ── Aggression burst ─────────────────────────────────
    if (this._aiAggrTimer <= 0) {
      this._aiAggressive = Math.random() < DS.aggrChance;
      this._aiAggrTimer  = Phaser.Math.Between(18, 40) / 10;
    }

    // ── Strafe direction change ───────────────────────────
    if (this._aiStrafTimer <= 0) {
      this._aiStrafeDir  = Math.random() < 0.5 ? 1 : -1;
      this._aiStrafTimer = Phaser.Math.Between(8, 22) / 10;
    }

    // Desperate fight boosts (low HP aggression) — suppressed on easy
    const attackRange   = desperateFight && diff !== 'easy' ? DS.attackRange  + 25 : DS.attackRange;
    const retreatRange  = desperateFight && diff !== 'easy' ? DS.retreatRange - 15 : DS.retreatRange;
    const meleeSpeed    = desperateFight && diff !== 'easy' ? DS.meleeSpeed   + 35 : DS.meleeSpeed;
    const approachSpeed = desperateFight && diff !== 'easy' ? DS.approachSpeed + 30 : DS.approachSpeed;

    // ── STATE MACHINE ─────────────────────────────────────
    if (this._aiTimer > 0 && !justHit) {
      // Execute current locked state
      switch (this._aiState) {
        case 'dodge_back':
          e.setVelocityX(-dir * 300);
          this._playAnim(e, this._p2Anims.walk);
          break;
        case 'dodge_jump':
          if (onGround) {
            e.setVelocityY(-560);
            e.setVelocityX(-dir * 180);   // jump away from player
          }
          this._playAnim(e, this._p2Anims.jump);
          break;
        case 'stunned':
          e.setVelocityX(0);
          this._playAnim(e, this._p2Anims.hurt);
          break;
      }
      return;
    }

    // ── Choose next state ─────────────────────────────────
    // Zone definitions:
    //   far    > 500px  → ranged
    //   mid    200–500  → approach / strafe / ranged
    //   close  < 200    → melee / retreat
    //   melee  < attackRange → attack

    if (dist > 500) {
      if (this._aiRangedCD <= 0) {
        const bx = e.x + dir * 60;
        this._fireEnemyBullet(bx, e.y - 10, dir);
        this._playAnim(e, this._p2Anims.shot);
        e.setVelocityX(0);
        this._aiRangedCD = desperateFight && diff !== 'easy' ? DS.rangedCDMin * 0.7 : DS.rangedCDMin;
        this._aiTimer    = 0.5;
        this._aiState    = 'attack_ranged';
      } else {
        const sx = e.x + this._aiStrafeDir * approachSpeed * 0.5;
        const clampedX = Phaser.Math.Clamp(sx, 80, W - 80);
        e.setVelocityX(clampedX !== e.x ? this._aiStrafeDir * approachSpeed * 0.5 : 0);
        this._playAnim(e, this._p2Anims.walk);
        this._aiTimer = 0.25;
        this._aiState = 'strafe';
      }

    } else if (dist > 200) {
      if (this._aiRangedCD <= 0 && Math.random() < (desperateFight && diff !== 'easy' ? DS.aggrChance * 0.6 : 0.30)) {
        const bx = e.x + dir * 60;
        this._fireEnemyBullet(bx, e.y - 10, dir);
        this._playAnim(e, this._p2Anims.shot);
        e.setVelocityX(0);
        this._aiRangedCD = desperateFight && diff !== 'easy' ? DS.rangedCDMid * 0.7 : DS.rangedCDMid;
        this._aiTimer    = 0.5;
        this._aiState    = 'attack_ranged';
      } else if (this._aiAggressive) {
        e.setVelocityX(dir * approachSpeed);
        this._playAnim(e, this._p2Anims.run || this._p2Anims.walk);
        this._aiTimer = 0.28;
        this._aiState = 'approach';
      } else {
        const sway = Math.sin(this.time.now * 0.003) * 40;
        e.setVelocityX(dir * approachSpeed * 0.7 + sway);
        this._playAnim(e, this._p2Anims.walk);
        this._aiTimer = 0.3;
        this._aiState = 'approach';
      }

      if (onGround && this._aiJumpCD <= 0 && Math.random() < DS.jumpChanceMid) {
        e.setVelocityY(-520);
        e.setVelocityX(dir * 160);
        this._playAnim(e, this._p2Anims.jump);
        this._aiJumpCD = Phaser.Math.Between(22, 40) / 10;
      }

    } else {
      if (dist < retreatRange && !this._aiAggressive) {
        e.setVelocityX(-dir * 180);
        this._playAnim(e, this._p2Anims.walk);
        this._aiTimer = 0.22;
        this._aiState = 'retreat';

      } else if (dist < attackRange && this._aiAttackCD <= 0) {
        this._aiComboCount++;
        const useAlt = this._aiComboCount % 2 === 0 && this._p2Anims.attack2;
        const animKey = useAlt ? this._p2Anims.attack2 : this._p2Anims.attack1;
        const dmg     = Math.round((useAlt ? 14 : 18) * DS.dmgMult);

        e.setVelocityX(dir * meleeSpeed * 0.4);
        this._playAnim(e, animKey);
        this._hitAttackOnPlayer(dmg);

        if (this._aiAggressive && this._aiComboCount % 3 === 0 && Math.random() < DS.comboChance) {
          this.time.delayedCall(400, () => {
            if (!this._isEnemyDead && Math.abs(this.player.x - this.enemy.x) < attackRange + 20) {
              this._playAnim(e, this._p2Anims.attack2 || this._p2Anims.attack1);
              this._hitAttackOnPlayer(Math.round(12 * DS.dmgMult));
            }
          });
          this._aiAttackCD = desperateFight && diff !== 'easy' ? 0.5 : 0.85;
        } else {
          this._aiAttackCD = desperateFight && diff !== 'easy' ? 0.45 : 0.80;
        }

        if (Math.random() < DS.jumpChanceClose && onGround && this._aiJumpCD <= 0) {
          this.time.delayedCall(300, () => {
            if (!this._isEnemyDead && this.enemy.body.blocked.down) {
              this.enemy.setVelocityY(-500);
              this.enemy.setVelocityX(-dir * 200);
              this._playAnim(this.enemy, this._p2Anims.jump);
              this._aiJumpCD = 1.0;
            }
          });
        }

        this._aiTimer = 0.55;
        this._aiState = 'attack_melee';

      } else {
        const cx = e.x + this._aiStrafeDir * approachSpeed * 0.55;
        e.setVelocityX(Phaser.Math.Clamp(cx - e.x, -approachSpeed, approachSpeed));
        this._playAnim(e, this._p2Anims.walk);
        this._aiTimer = 0.2;
        this._aiState = 'strafe';

        if (onGround && this._aiJumpCD <= 0 && dist < 160 && Math.random() < DS.jumpChanceClose * 2.5) {
          e.setVelocityY(-560);
          e.setVelocityX(dir * 250);
          this._playAnim(e, this._p2Anims.jump);
          this._aiJumpCD = Phaser.Math.Between(18, 32) / 10;
        }
      }
    }

    // ── Last-stand ranged burst ───────────────────────────
    if (desperateFight && diff !== 'easy' && this._aiRangedCD <= 0 && dist > 100 && Math.random() < DS.aggrChance * 0.55) {
      const bx = e.x + dir * 60;
      this._fireEnemyBullet(bx, e.y - 10, dir);
      this._playAnim(e, this._p2Anims.shot);
      this._aiRangedCD = DS.rangedCDMin * 0.6;
    }
  }

  _hitAttackOnPlayer(dmg) {
    const dist = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
    const diff  = window._difficulty || 'moderate';
    const range = diff === 'hard' ? 210 : diff === 'easy' ? 130 : 165;
    if (dist < range) this._hurtPlayer(dmg);
  }
}

// ═══════════════════════════════════════════════
//  PHASER CONFIG
// ═══════════════════════════════════════════════
const _phaserGame = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#001427',
  scene: [BootScene, FighterSelectScene, CharacterScene, MapSelectScene, CreditsScene, GameScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  parent: document.body,
});

// ═══════════════════════════════════════════════
//  FIGHT SCENE UI — show pause btn, hide gear btn
// ═══════════════════════════════════════════════
(function () {
  const gearBtn  = document.getElementById('settings-btn');
  const pauseBtn = document.getElementById('pause-btn');
  setInterval(() => {
    const inFight = _phaserGame.scene.isActive('GameScene');
    gearBtn.classList.toggle('fight-hidden', inFight);
    pauseBtn.classList.toggle('fight-visible', inFight);
  }, 150);
})();

// ═══════════════════════════════════════════════
//  SHARED STATE (synced between both panels)
// ═══════════════════════════════════════════════
window._sfxMuted = false;
window._voiceOn  = true;

// ═══════════════════════════════════════════════
//  SETTINGS PANEL INTERACTIONS  (gear btn / non-fight)
// ═══════════════════════════════════════════════
(function () {
  const overlay  = document.getElementById('settings-overlay');
  const closeBtn = document.getElementById('settings-close');
  const gearBtn  = document.getElementById('settings-btn');

  const _resumeGame = () => {
    const gs = _phaserGame.scene.getScene('GameScene');
    if (gs && _phaserGame.scene.isPaused('GameScene')) { gs.scene.resume(); gs.physics.resume(); }
  };

  gearBtn.addEventListener('click', () => { overlay.classList.add('open'); });
  closeBtn.addEventListener('click', () => { overlay.classList.remove('open'); _resumeGame(); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.classList.remove('open'); _resumeGame(); } });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) { overlay.classList.remove('open'); _resumeGame(); }
  });

  // Soundtrack
  document.getElementById('btn-soundtrack').addEventListener('click', function () {
    const muted = Audio.toggle();
    this.classList.toggle('muted', muted);
    this.querySelector('i').className = muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-music';
    const p = document.getElementById('pause-btn-soundtrack');
    p.classList.toggle('muted', muted);
    p.querySelector('i').className = this.querySelector('i').className;
  });

  // SFX
  document.getElementById('btn-sfx').addEventListener('click', function () {
    window._sfxMuted = !window._sfxMuted;
    SFX.setMuted(window._sfxMuted);
    this.classList.toggle('muted', window._sfxMuted);
    this.querySelector('i').className = window._sfxMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    if (!window._sfxMuted) SFX.chime();
    const p = document.getElementById('pause-btn-sfx');
    p.classList.toggle('muted', window._sfxMuted);
    p.querySelector('i').className = this.querySelector('i').className;
  });

  // Combat effects
  document.getElementById('btn-combat').addEventListener('click', function () {
    const on = this.classList.toggle('on'); this.classList.toggle('off', !on);
    const p  = document.getElementById('pause-btn-combat');
    p.classList.toggle('on', on); p.classList.toggle('off', !on);
  });

  // Color swatches (settings panel only)
  document.querySelectorAll('.s-swatch:not(.pause-swatch)').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.s-swatch:not(.pause-swatch)').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
    });
  });

  // Zoom
  const zoomSlider = document.getElementById('zoom-slider');
  const zoomLabel  = document.getElementById('zoom-label');
  zoomSlider.addEventListener('input', () => {
    const val = (zoomSlider.value / 100).toFixed(2);
    zoomLabel.textContent = 'ZOOM: ' + val;
    document.getElementById('pause-zoom-label').textContent = 'ZOOM: ' + val;
    document.getElementById('pause-zoom-slider').value = zoomSlider.value;
  });

  // Voiceover
  document.getElementById('btn-voiceover').addEventListener('click', function () {
    window._voiceOn = !window._voiceOn;
    this.classList.toggle('on', window._voiceOn); this.classList.toggle('off', !window._voiceOn);
    const html = window._voiceOn ? '<i class="fa-solid fa-check" style="font-size:11px;"></i>' : '';
    this.querySelector('.s-voiceover-check').innerHTML = html;
    const p = document.getElementById('pause-btn-voiceover');
    p.classList.toggle('on', window._voiceOn); p.classList.toggle('off', !window._voiceOn);
    p.querySelector('.s-voiceover-check').innerHTML = html;
  });
})();

// ═══════════════════════════════════════════════
//  PAUSE MODAL INTERACTIONS
// ═══════════════════════════════════════════════
(function () {
  const overlay  = document.getElementById('pause-overlay');
  const pauseBtn = document.getElementById('pause-btn');

  const _pauseGame = () => {
    const gs = _phaserGame.scene.getScene('GameScene');
    if (gs && _phaserGame.scene.isActive('GameScene')) { gs.physics.pause(); gs.scene.pause(); }
  };
  const _resumeGame = () => {
    const gs = _phaserGame.scene.getScene('GameScene');
    if (gs && _phaserGame.scene.isPaused('GameScene')) { gs.scene.resume(); gs.physics.resume(); }
  };
  const _close = () => { overlay.classList.remove('open'); _resumeGame(); };

  // Open
  pauseBtn.addEventListener('click', () => { overlay.classList.add('open'); _pauseGame(); SFX.chime(); });

  // Resume
  document.getElementById('pause-return-btn').addEventListener('click', () => { SFX.nav(); _close(); });

  // Restart
  document.getElementById('pause-restart-btn').addEventListener('click', () => {
    SFX.confirm();
    overlay.classList.remove('open');
    const gs = _phaserGame.scene.getScene('GameScene');
    if (gs) { _resumeGame(); gs.scene.restart({ mapKey: gs.mapKey, p1: gs.p1Id, p2: gs.p2Id, round: gs._round || 1, diffLevel: gs._diffLevel || 0 }); }
  });

  // Exit to map select
  document.getElementById('pause-exit-btn').addEventListener('click', () => {
    SFX.back();
    overlay.classList.remove('open');
    const gs = _phaserGame.scene.getScene('GameScene');
    if (gs) { _resumeGame(); gs.scene.start('MapSelectScene'); }
  });

  // Backdrop / Escape
  overlay.addEventListener('click', (e) => { if (e.target === overlay) { SFX.back(); _close(); } });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) { SFX.back(); _close(); }
  });

  // ── Pause panel settings controls ───────────

  // Soundtrack
  document.getElementById('pause-btn-soundtrack').addEventListener('click', function () {
    const muted = Audio.toggle();
    this.classList.toggle('muted', muted);
    this.querySelector('i').className = muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-music';
    const m = document.getElementById('btn-soundtrack');
    m.classList.toggle('muted', muted); m.querySelector('i').className = this.querySelector('i').className;
  });

  // SFX
  document.getElementById('pause-btn-sfx').addEventListener('click', function () {
    window._sfxMuted = !window._sfxMuted;
    SFX.setMuted(window._sfxMuted);
    this.classList.toggle('muted', window._sfxMuted);
    this.querySelector('i').className = window._sfxMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    if (!window._sfxMuted) SFX.chime();
    const m = document.getElementById('btn-sfx');
    m.classList.toggle('muted', window._sfxMuted); m.querySelector('i').className = this.querySelector('i').className;
  });

  // Combat effects
  document.getElementById('pause-btn-combat').addEventListener('click', function () {
    const on = this.classList.toggle('on'); this.classList.toggle('off', !on);
    const m  = document.getElementById('btn-combat');
    m.classList.toggle('on', on); m.classList.toggle('off', !on);
  });

  // Color swatches (pause panel)
  document.querySelectorAll('.pause-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.pause-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
    });
  });

  // Zoom
  const pZoom  = document.getElementById('pause-zoom-slider');
  const pLabel = document.getElementById('pause-zoom-label');
  pZoom.addEventListener('input', () => {
    const val = (pZoom.value / 100).toFixed(2);
    pLabel.textContent = 'ZOOM: ' + val;
    document.getElementById('zoom-label').textContent  = 'ZOOM: ' + val;
    document.getElementById('zoom-slider').value = pZoom.value;
  });

  // Voiceover
  document.getElementById('pause-btn-voiceover').addEventListener('click', function () {
    window._voiceOn = !window._voiceOn;
    this.classList.toggle('on', window._voiceOn); this.classList.toggle('off', !window._voiceOn);
    const html = window._voiceOn ? '<i class="fa-solid fa-check" style="font-size:11px;"></i>' : '';
    this.querySelector('.s-voiceover-check').innerHTML = html;
    const m = document.getElementById('btn-voiceover');
    m.classList.toggle('on', window._voiceOn); m.classList.toggle('off', !window._voiceOn);
    m.querySelector('.s-voiceover-check').innerHTML = html;
  });
})();