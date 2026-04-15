# Codentra

Premium, futuristic website for Codentra — a Sweden-based software studio. Built as a read-only, statically-generated marketing site for Vercel.

## Stack

- **Next.js 16** (App Router, Turbopack, SSG — every page prerendered)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (New York, zinc base, customized)
- **Framer Motion** (page-level animations, orbital hero scene)
- **Lucide** icons (strict — no other icon libraries)
- **next-themes** (dark/light toggle; dark is default)
- **React Three Fiber** + **drei** (real WebGL hero scene — custom, procedural)
- **@splinetool/react-spline** (optional — pluggable Spline scene via env var)
- **Geist Sans** + **JetBrains Mono** type pairing

## Scripts

```bash
npm run dev     # dev server (http://localhost:3000)
npm run build   # production build (verifies SSG)
npm run start   # run the built app
npm run lint
```

## Pages

- `/` — hero, tech stack marquee, services, process, compliance, CTA
- `/services` — all six service pillars with anchors (`#web`, `#mobile`, `#backend`, `#commerce`, `#cloud`, `#compliance`)
- `/about` — studio story, stats, values
- `/contact` — contact info + form (opens the visitor's mail client)

## 3D hero scene

The hero ships with a **custom React Three Fiber scene** (real WebGL — not CSS tricks). What's in it:

- A distorted icosahedron **core** with metallic violet material + animated distortion shader
- A **wireframe outer shell** in cyan that counter-rotates
- Three **orbital rings** at different tilts, each carrying a glowing node
- A **spherical particle field** (600 points) + **drei `Sparkles`** for ambient dust
- Two colored point lights (violet + cyan) for brand-accurate rim lighting
- Subtle **mouse parallax** on the camera

Source: `src/components/three/tech-scene.tsx`. Tweak geometry, colors, speeds there.

To swap in a Spline scene instead:

1. Build / pick a scene on [spline.design](https://spline.design).
2. **Export → Code Export → React**, copy the `scene.splinecode` URL.
3. Set it in `.env.local`:

   ```
   NEXT_PUBLIC_SPLINE_SCENE=https://prod.spline.design/XXXXX/scene.splinecode
   ```

4. Restart dev; the hero will load the Spline scene instead of the R3F one.

Or to use a `.glb` model: drop it in `public/models/yourmodel.glb` and replace `TechScene` with a drei `<useGLTF>` loader — tell me the file and I'll wire it up.

Other sources for 3D assets:

- **Spline community** — ready-made tech scenes (orbs, holograms, abstract shapes)
- **Sketchfab** — filter for `Downloadable + Free + CC`, export as `.glb`
- **Poly Pizza** — free low-poly `.glb`
- **Kenney.nl** — CC0 assets

## Theme

Custom CSS variables in `src/app/globals.css` drive both themes:

- **Dark** (default): near-black `oklch(0.09 0.015 265)` base, violet → cyan gradient accents, subtle glow + grid.
- **Light**: off-white with charcoal ink, same accent palette.

Use the utility classes:

- `bg-gradient-tech` — primary brand gradient background
- `text-gradient` — gradient text fill
- `bg-grid` / `bg-grid-sm` — background grid lines
- `bg-radial-fade` — mask that fades edges to transparent
- `shadow-glow` — ambient violet glow
- `gradient-border` — 1px gradient outline on any rounded element
- `glass` — frosted-glass background
- `animate-aurora`, `animate-float`, `marquee` — motion utilities

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import into Vercel — no config needed. Framework preset: Next.js.
3. (Optional) Add `NEXT_PUBLIC_SPLINE_SCENE` under Project → Settings → Environment Variables.
4. Deploy. All pages are prerendered; no runtime server work.

## Conventions

- **UI components**: strictly from `src/components/ui/` (shadcn). Don't introduce other UI libraries.
- **Icons**: strictly from `lucide-react`. Brand icons (GitHub/LinkedIn) are hand-inlined in `footer.tsx` because Lucide 1.x removed brand marks.
- **Client/server split**: pages are server components with `export const metadata`; any `motion.*` or stateful UI lives in a `"use client"` component. Don't pass icon components as props across the server→client boundary — wrap them in a client component (see `services-grid.tsx`, `values-grid.tsx`).
