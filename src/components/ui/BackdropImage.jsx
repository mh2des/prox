import Image from 'next/image';

/**
 * BackdropImage — the full-bleed photo behind a hero or CTA band.
 *
 * Replaces CSS `background-image`. That was the single biggest weight on the
 * site: a CSS background is invisible to next/image, so every one of these
 * shipped as a raw 2000px-wide JPEG (237-427 KB) to every device, phones
 * included, and was only discovered after the stylesheet had parsed. Routed
 * through next/image the same photo is AVIF with a responsive srcset — 15 KB
 * at 640px, 67 KB at 1920px — and the LCP one can be preloaded.
 *
 * The parent MUST be `position: relative` (all the heroes already are) because
 * `fill` positions against the nearest positioned ancestor. The image sits at
 * z-index 0, under the overlay (z-index 1) and the content (z-index 2).
 *
 * Props:
 *   src      : image URL (remote URLs must match next.config remotePatterns)
 *   priority : true for the above-the-fold hero on a page — preloads it as the
 *              LCP candidate. Leave false for CTA bands further down, which
 *              then lazy-load.
 *   position : object-position, e.g. 'center top' (default 'center')
 *   quality  : defaults to 70 — these all sit under a heavy dark scrim, so the
 *              extra bytes of a higher setting buy nothing visible.
 */
export default function BackdropImage({
  src,
  priority = false,
  position = 'center',
  quality = 70,
  className,
}) {
  return (
    <Image
      src={src}
      // Decorative: every one of these sections carries its own heading and
      // copy, so announcing the stock photo would only add noise.
      alt=""
      aria-hidden="true"
      fill
      // Full-bleed in every layout, so the browser can pick straight off the
      // viewport width without waiting for layout.
      sizes="100vw"
      priority={priority}
      quality={quality}
      className={className}
      style={{ objectFit: 'cover', objectPosition: position, zIndex: 0 }}
    />
  );
}
