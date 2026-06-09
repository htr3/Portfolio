# Hero background video

Drop your background video here named **`hero.mp4`**:

```
f1-portfolio/assets/hero.mp4
```

The hero will automatically play it (muted, looping) behind the 3D car.
If no file is present, the hero falls back to the 3D scene + dark background —
nothing breaks.

## Tips for a good background video
- **Format:** MP4 (H.264) for broadest browser support. Optionally add a `hero.webm` too.
- **Length:** a short 8–20s seamless loop is ideal.
- **Resolution:** 1080p is plenty; 720p if you want a smaller file.
- **Size:** keep it under ~10–15 MB so it loads fast and stays well within
  GitHub's file-size comfort zone (hard limit is 100 MB per file).
- **Audio:** not needed — it plays muted (autoplay requires muted anyway).

## Optional: a poster image
Add `poster="assets/hero-poster.jpg"` to the `<video>` tag in `index.html`
to show a still frame while the video loads.
