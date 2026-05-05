<div align="center">

</div><img width="2400" height="1080" alt="Fatal Blows Bannergithub posters5" src="https://github.com/user-attachments/assets/b0283cfe-f6ae-4a8f-8546-f6a769e566b8" />

```
 ███████╗ █████╗ ████████╗ █████╗ ██╗
 ██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██║
 █████╗  ███████║   ██║   ███████║██║
 ██╔══╝  ██╔══██║   ██║   ██╔══██║██║
 ██║     ██║  ██║   ██║   ██║  ██║███████╗
 ╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝

 ██████╗ ██╗      ██████╗ ██╗    ██╗███████╗
 ██╔══██╗██║     ██╔═══██╗██║    ██║██╔════╝
 ██████╔╝██║     ██║   ██║██║ █╗ ██║███████╗
 ██╔══██╗██║     ██║   ██║██║███╗██║╚════██║
 ██████╔╝███████╗╚██████╔╝╚███╔███╔╝███████║
 ╚═════╝ ╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝
```

### ⚔ &nbsp; CHOOSE YOUR FIGHTER. CHOOSE YOUR FATE. &nbsp; ⚔

![Version](https://img.shields.io/badge/VERSION-v0.1.0-bf0603?style=for-the-badge)
![Engine](https://img.shields.io/badge/ENGINE-PHASER%203-f4d58d?style=for-the-badge)
![Status](https://img.shields.io/badge/STATUS-IN%20DEVELOPMENT-708d81?style=for-the-badge)
![Language](https://img.shields.io/badge/LANGUAGE-JAVASCRIPT-001427?style=for-the-badge)

### 🎮 &nbsp; [**PLAY NOW → fatal-blows.vercel.app**](https://fatal-blows.vercel.app/) &nbsp; 🎮

</div>

---

## ◈ &nbsp; OVERVIEW

**Fatal Blows** is a browser-based 2D fighting game with arcade atmosphere, pixel-art fighters, and procedurally synthesized audio — all running in vanilla JavaScript powered by **Phaser 3**.

No downloads. No installs. Open the browser, pick your fighter, and enter the arena.

> **▶ Play it live:** [https://fatal-blows.vercel.app/](https://fatal-blows.vercel.app/)

---

## ⚔ &nbsp; ROSTER

Four fighters. Four playstyles. One survives.

| Fighter | Class | Specialty | STR | AGI | DEF | PWR |
|---|---|---|---|---|---|---|
| **RAIDER** | Blade Master | Sword combos + gunshot | 92 | 58 | 75 | 80 |
| **FIRE WIZARD** | Front Liner | Fireballs + flame jet | 80 | 72 | 65 | 60 |
| **SAMURAI** | Shadow Hunter | Triple-strike swordplay | 62 | 96 | 54 | 70 |
| **LIGHTNING MAGE** | Iron General | Lightning charge + orbs | 88 | 50 | 95 | 76 |

---

## ◈ &nbsp; FEATURES

**Combat**
- Two-player local versus — P1 picks first, P2 picks second
- Multi-hit combos: light attack, heavy attack, and a ranged special move per fighter
- Physics-driven movement with jump, run, land, and hurt states
- Full animation state machines (idle → walk → run → attack → hurt → dead)

**Audio**
- 100% procedurally synthesized SFX via the Web Audio API — zero audio files
- Unique weapon sounds: sword slash, sword fast, sword impact, gunshot, fireball cast, flame jet, lightning charge, lightning strike
- Full soundtrack manager with mute toggle
- Name voiceover toggle

**Presentation**
- Cinematic boot screen with animated loading bar and status messages
- Animated particle background system: nebula orbs, drifting stars, hexagons, drift rings, and falling blood drops
- Scan-line overlay for CRT atmosphere
- Click ripple and starburst effects on every interaction
- Flash transitions between scenes
- Tooltips on all navigation buttons

**Settings**
- Soundtrack on/off
- SFX on/off
- Combat visual effects on/off
- Five color themes for combat effects: Sand, Red, Wine, Sage, Navy
- Camera zoom slider (0.20 to 1.00)
- Name voiceover toggle
- In-fight pause panel with Resume / Restart / Exit

**Mobile**
- On-screen virtual joystick with jump arc indicator
- Three action buttons: SHOT, ATK2 (X), ATK1 (Z)
- Viewport clamped and touch-optimized

---

## ◈ &nbsp; CONTROLS

### Keyboard (default)

| Action | Player 1 | Player 2 |
|---|---|---|
| Move | `A` / `D` | `Arrow Left` / `Arrow Right` |
| Jump | `W` | `Arrow Up` |
| Attack 1 | `Z` | `U` |
| Attack 2 | `X` | `I` |
| Special / Shot | `C` | `O` |
| Pause | `Escape` | — |

### Gamepad
Connect a gamepad — it is detected automatically. Use the **CONTROL** button in Settings to remap.

### Mobile
Use the on-screen joystick for movement and the three action buttons on the right side.

---

## ◈ &nbsp; PROJECT STRUCTURE

```
fatal-blows/
│
├── index.html          — Game shell, HUD overlays, modals
├── style.css           — All UI styling, animations, scan-line overlay
├── script.js           — Full game logic (Phaser 3 scenes, audio, fighters)
│
└── assets/
    └── characters/
        ├── Raider_1/           — Raider sprite sheets (128x128 px)
        │   ├── Idle.png  /  Walk.png  /  Run.png  /  Jump.png
        │   ├── Attack_1.png  /  Attack_2.png
        │   ├── Shot.png  /  Recharge.png
        │   └── Hurt.png  /  Dead.png
        │
        ├── Fire Wizard/        — Fire Wizard sprite sheets (128x128 px)
        │   ├── Idle.png  /  Walk.png  /  Run.png  /  Jump.png
        │   ├── Attack_1.png  /  Attack_2.png
        │   ├── Charge.png  /  Fireball.png  /  Flame_jet.png
        │   └── Hurt.png  /  Dead.png
        │
        ├── Samurai/            — Samurai sprite sheets (128x128 px)
        │   ├── Idle.png  /  Walk.png  /  Run.png  /  Jump.png
        │   ├── Attack_1.png  /  Attack_2.png  /  Attack_3.png
        │   ├── Protection.png
        │   └── Hurt.png  /  Dead.png
        │
        └── Lightning Mage/     — Lightning Mage sprite sheets (128x128 px)
            ├── Idle.png  /  Walk.png  /  Run.png  /  Jump.png
            ├── Attack_1.png  /  Attack_2.png
            ├── Charge.png  /  Light_ball.png  /  Light_charge.png
            └── Hurt.png  /  Dead.png
```

---

## ◈ &nbsp; TECH STACK

| Layer | Technology |
|---|---|
| Game Engine | [Phaser 3.60](https://phaser.io) |
| Language | Vanilla JavaScript (ES6+) |
| Audio | Web Audio API (procedural synthesis — no audio files) |
| Fonts | [Boldonse](https://fonts.google.com/specimen/Boldonse) via Google Fonts |
| Icons | [Font Awesome 6](https://fontawesome.com) |
| Renderer | WebGL / Canvas (Phaser auto-selects) |
| Deployment | [Vercel](https://vercel.com) |

---

## ◈ &nbsp; GETTING STARTED

### ▶ Play Online

No setup needed — just open your browser and fight:

**[https://fatal-blows.vercel.app/](https://fatal-blows.vercel.app/)**

### Run locally

Clone the repo and serve it over HTTP. The game uses asset loading that **will not work** opened directly as a `file://` URL — you need a local server.

```bash
git clone https://github.com/your-username/fatal-blows.git
cd fatal-blows

# Option A — Python (no install needed)
python -m http.server 8080

# Option B — Node.js
npx serve .

# Option C — VS Code
# Install the "Live Server" extension and click "Go Live"
```

Then open `http://localhost:8080` in your browser.

### Asset setup

Place your sprite sheets in `assets/characters/` following the folder structure above. Each sprite sheet is a horizontal strip of 128×128 px frames.

---

## ◈ &nbsp; SCENE FLOW

```
BootScene
    │
    └── FighterSelectScene   <--- P1 picks, then P2 picks
            │
            └── MapSelectScene
                    │
                    └── GameScene   <--- the fight
                            │
                            └── CreditsScene
```

---

## ◈ &nbsp; ROADMAP

- [ ] Online multiplayer (WebSocket)
- [ ] Additional fighters and arenas
- [ ] Special move meter / super attacks
- [ ] Combo counter display
- [ ] Win/loss tracking and leaderboard
- [ ] Tournament bracket mode
- [ ] Full gamepad remapping UI
- [ ] Mobile layout polish

---

## ◈ &nbsp; CONTRIBUTING

Pull requests are welcome. For major changes, please open an issue first.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## ◈ &nbsp; LICENSE

This project is licensed under the [MIT License](LICENSE).

---

## ◈ &nbsp; GAMEPLAY

<div align="center">

![Gameplay](assets/gameplay.gif)

</div>

---

<div align="center">

**Built with ⚔ and the Web Audio API**

*v0.1.0 · Phaser 3 · [Play Now](https://fatal-blows.vercel.app/)*



