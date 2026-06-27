# Daedalus Background Restore Patch

This patch restores the original working Antigravity landing background behavior from the earlier frontend zip.

Changed file:

- `frontend/components/AntigravityBackground.tsx`

What changed:

- Removed the later defensive gating that only rendered WebGL under selected conditions.
- Removed the static fallback layer from this component.
- Restored the original fixed full-screen Antigravity canvas layer.
- Restored the original darker color palette and opacity that made the animation visibly appear behind the hero.

Run after applying:

```cmd
cd C:\Projects\Daedalus\frontend
rmdir /s /q .next
npm run dev
```

If the browser still shows old output, hard refresh with `Ctrl + Shift + R`.
