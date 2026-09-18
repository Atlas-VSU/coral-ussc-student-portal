# Design Tokens

The Student Portal takes its visual design from **Coral-USSC**. Every color, radius and
font decision flows from one file, `src/app/globals.css`, whose `:root` values are kept
identical to Coral's `:root` (`coral-ussc/src/app/globals.css`). `veris-frontend` ships the
same `:root` values, so all three apps render the same USSC palette.

```
Coral :root values  ──►  src/app/globals.css  ──►  @theme inline (Tailwind utilities)  ──►  components/ui/*  ──►  features/*
   (source)               :root CSS variables      bg-primary, text-muted-foreground…      Coral's primitives     page code
```

## Keeping the portal in sync with Coral

- **Token values:** the `:root` block in `globals.css` must match Coral's `:root`. When Coral
  changes a value, copy it here. This check should print nothing:

  ```bash
  diff <(sed -n '/--radius:/,/--success-muted/p' ../coral-ussc/src/app/globals.css | tr -d '\r') \
       <(sed -n '/--radius:/,/--success-muted/p' src/app/globals.css | tr -d '\r')
  ```

- **Primitives:** `components/ui/button.tsx`, `card.tsx` and `input.tsx` are byte-identical to
  Coral's, and the other `components/ui/*` files match too, apart from import paths
  (`badge.tsx` imports `@radix-ui/react-slot`; `sonner.tsx` pins the light theme because the
  portal has no `next-themes`). Don't restyle primitives here; change Coral and copy them over.
- **Fonts:** Montserrat is the only family, loaded in `app/layout.tsx` with Coral's weights
  (200–900) and forced onto every element, as Coral does.
- **Theme:** light only. `@variant dark (false)` compiles `dark:` utilities away, as in Coral.

## Token inventory

All values come from Coral's `:root`.

| Token | Value | Role |
|---|---|---|
| `background` / `foreground` | `oklch(1 0 0)` / `oklch(0.14 0.06 148)` | Page canvas and body text (white, near-black green) |
| `card`, `popover` (+ `-foreground`) | same as background/foreground | Raised and overlay surfaces |
| `primary` / `primary-foreground` | `#058c11` / `#ffffff` | USSCPrimaryGreen: primary actions, links, selection, focus accents |
| `secondary` / `secondary-foreground` | `#38b000` / `#ffffff` | SecondaryGreen: second brand hue (secondary buttons, acronym badges, GCash instruction tint, hover accents) |
| `accent` / `accent-foreground` | `#87d300` / `#05621e` | FreshLime: ghost-button and menu hover surfaces |
| `muted` / `muted-foreground` | `#f8f9fa` / `#6c757d` | Quiet surfaces, secondary text, inactive/cleared states |
| `destructive` | `oklch(0.55 0.22 25)` | Errors, declined status, and the Fines & Penalties category (Coral renders fines in red) |
| `border` / `input` | `oklch(0.88 0.04 142)` | Light-green dividers, card edges, field borders |
| `ring` | `oklch(0.5 0.19 145)` | Focus rings (`ring-ring/50`) and focused field borders |
| `warning` / `-foreground` / `-muted` | `#facc15` / `#713f12` / `#fef9c3` | Pending, cautions, view-only notices |
| `success` / `-foreground` / `-muted` | `#16a34a` / `#ffffff` / `#dcfce7` | Approved, settled, uploaded |
| `radius` | `0.65rem` | `rounded-sm/md/lg/xl` = 6.4 / 8.4 / 10.4 / 14.4px |

**Brand tokens, landing page only.** These are the greens Coral's homepage renders
(`HomePageLayout`, `LoginCard`, `DesktopHeader`). They are registered the way `veris-frontend`
registers its `--color-brand-*` palette:

| Utility | Value | Used for |
|---|---|---|
| `brand-ink` | `#1f7700` | Hero headline and copy, the "USSC Connect" wordmark |
| `brand-green` | `#2e7d32` | Landing nav links, end of the CTA gradient |
| `brand-leaf` | `#8bc34a` | Start of the CTA gradient |
| `brand-meadow` | `#66bd4a` | End of the white→green page gradient |

## Where the portal intentionally differs from Coral's CSS

These change how tokens are *wired*, never their values.

1. **Status tokens are registered.** Coral declares `--warning*` and `--success*`, but its
   `@theme inline` never maps them. As a result, classes Coral already uses, such as
   `bg-warning/10` and `text-success`, compile to nothing there. The portal registers them,
   as `veris-frontend` does.
2. **Base defaults live in `@layer base`.** Coral's `* { border-color: var(--border) }` sits
   outside any cascade layer, so it outranks every Tailwind utility. `border-primary`,
   `border-input` and `aria-invalid:border-destructive` never apply, which is why Coral's
   forms fall back to `!border-[#2E7D32]/30`. The portal layers the rule like
   `veris-frontend`, so selection, focus and error borders render.
3. **Brand tokens** (above) replace hex literals the Coral homepage hardcodes.

## Rules for new components

- Use semantic utilities (`bg-primary`, `text-muted-foreground`, `border-border`). Don't use hex
  values, Tailwind palette colors (`green-600`, `amber-50`), or arbitrary radii
  (`rounded-[1.5rem]`).
- Pair text with its surface. `*-foreground` tokens go on their solid partner (`bg-primary
  text-primary-foreground`). On white, `success`/`warning` fills are too light for text, so
  use the status patterns below.
- Use `rounded-full` only for circles and pills (avatars, step dots, badges). Everything
  rectangular uses the radius scale: cards `rounded-xl`, rows and callouts `rounded-lg`,
  controls `rounded-md` via the primitives.
- Elevation uses Tailwind's scale, as Coral does: `shadow-xs` controls, `shadow-sm` cards,
  `shadow-md` hover lifts, `shadow-lg` dialogs and sticky bars.
- Keyboard focus must stay visible. Custom clickable elements that set `outline-none` need
  `focus-visible:ring-[3px] focus-visible:ring-ring/50` (the primitives' treatment).

### Status vocabulary

| State | Classes |
|---|---|
| Payable / Unpaid | `border-primary/20 bg-primary/10 text-primary` |
| Pending / caution | `border-warning bg-warning-muted text-warning-foreground` |
| Approved / Verified | `border-success/40 bg-success-muted text-success` |
| Declined / error | `border-destructive/20 bg-destructive/10 text-destructive` |
| Cleared / inactive | `border-muted bg-muted text-muted-foreground` |
| Fees category | `primary` family · Fines category: `destructive` family |

## Mapping from the retired "wabi-sabi" tokens

| Old portal token | Old value | Now | Notes |
|---|---|---|---|
| `--primary` | `#5D7052` moss | `#058c11` | Same role |
| `--secondary` | `#C18C5D` clay | `#38b000` | Same role (saturated second hue). Clay had also stood in for **warning** (pending badges, "Important:") and **fines**; those call sites now use `warning` and `destructive` |
| `--accent` | `#E6DCCD` sand | `#87d300` | Hover surface |
| `--background` / `--card` | `#FDFCF8` / `#FEFEFA` | white | |
| `--muted*`, `--border`, `--input`, `--ring`, `--destructive` | earth tones | Coral values | Same roles |
| `--warning` / `--success` | aliases of clay / moss | Coral values | Now registered as utilities |
| `--radius` | `1.5rem` | `0.65rem` | |
| Nunito / Fraunces (`--font-serif`) | two families | Montserrat only | `font-serif` removed everywhere |
| `shadow-soft` / `shadow-float` | custom | `shadow-sm` / `shadow-md`/`-lg` | Utilities deleted |
| `organic-card-*`, `blob-shape-*`, noise overlay | custom | removed | |

## Intentional literals

- `app/layout.tsx` `theme-color` (`#2E7D32`) and `lib/email.ts`: meta tags and email clients
  can't read CSS variables. Both use Coral's own values.
- `bg-white` behind QR codes and org logos: QR codes need a true white backdrop to scan
  reliably, whatever the theme. `bg-black/60` on the receipt-image remove button is a scrim
  over arbitrary photos.
- Literals inside `components/ui/*` (the `success` Button/Badge variants use `green-600`,
  outline hover uses `gray-200`, `recaptcha` uses amber, `loading-screen` uses a gradient)
  belong to Coral's primitives and are kept verbatim so the files stay in sync.

## Known contrast gaps in Coral's palette

Measured on the values above (WCAG AA needs 4.5:1 for body text and 3:1 for large text and UI
boundaries). They are left as Coral defines them; fix them in Coral and re-sync.

| Pair | Ratio |
|---|---|
| `primary` text on white; `primary-foreground` on `primary` | 4.41 |
| `accent-foreground` on `accent` | 4.09 |
| `success` on `success-muted` (Approved badge) | 3.00 |
| `secondary-foreground` on `secondary`; `secondary` text | 2.85 |
| White on `brand-leaf` (start of the landing CTA gradient; same as Coral's homepage) | 2.10 |
| `border`/`input` on white (field boundaries) | 1.42 |
