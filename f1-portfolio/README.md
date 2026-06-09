# F1 Edition — 3D Portfolio (experimental)

An experimental, Formula 1–inspired version of the portfolio with a 3D hero
scene. Self-contained static site — no build step.

## Stack
- **Three.js** (via CDN import map) — stylized F1 car built from primitive geometry, animated track, lighting, and pointer parallax.
- Vanilla HTML/CSS/JS — racing-broadcast theme (carbon panels, racing red, telemetry/lap-time UI, Orbitron display font).
- Reuses the real resume content (experience, skills, projects, contact).

## Run locally
The 3D scene uses ES module imports, so it must be served over HTTP (not opened as a `file://`).

```bash
# from the f1-portfolio folder
python -m http.server 5173
# then open http://localhost:5173
```

## Structure
```
f1-portfolio/
├── index.html        # F1-themed sections
├── css/style.css     # racing theme
└── js/
    ├── scene.js       # Three.js 3D F1 car hero (ES module)
    └── main.js        # nav, scroll-reveal, active link
```

## Notes
- Resume + favicon are referenced from the parent folder (`../`).
- Respects `prefers-reduced-motion` and pauses rendering when the hero is off-screen.
- This folder is isolated from the live site and is safe to iterate on.
