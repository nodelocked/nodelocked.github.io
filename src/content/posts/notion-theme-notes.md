---
title: Notes on Notion-like Color Systems
date: 2026-02-26
summary: A practical guide to neutral palettes and readable contrast.
tags:
  - ui
  - css
  - accessibility
---

Notion-inspired color systems work because they avoid high saturation by default.

In this blog, I keep the palette neutral, then reserve accent color for interactive intent:

```css
:root {
  --bg: #ffffff;
  --text: #37352f;
  --accent: #2f6feb;
}
```

This keeps hierarchy clear and reduces eye fatigue during long reading sessions.
