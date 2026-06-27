# Daedalus Antigravity Stability Fix

## Fixed

- Removed the `next/dynamic` split chunk around `components/Antigravity.tsx`.
- Restored the landing-page Antigravity background instead of removing it.
- Kept a CSS fallback for mobile, reduced-motion, and low-memory browsers.
- Forced production build to Webpack through `next build --webpack` for consistency with local dev.

## Why

The runtime error was caused by the lazily loaded Antigravity chunk failing to load:

`Loading chunk _app-pages-browser_components_Antigravity_tsx failed`

This was not a product logic bug. It was a Next/Webpack dev-runtime chunk loading issue caused by dynamically splitting the WebGL background component. The safer fix is to import the component directly and only decide at runtime whether to render WebGL or a lightweight CSS fallback.

## After applying

Run:

```cmd
cd C:\Projects\Daedalus\frontend
rmdir /s /q .next
npm install
npm run dev
```
