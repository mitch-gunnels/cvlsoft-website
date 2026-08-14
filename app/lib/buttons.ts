/**
 * Button styles shared across the site so CTAs stay identical wherever they
 * appear. Pair with the accent node (`<Node />` on the home page) for the full
 * treatment.
 *
 * Outlined is the default; BTN_SOLID is the one filled variant, used where a
 * pair of CTAs sit together and one needs to carry more weight.
 */

export const BTN_BASE =
  "inline-flex items-center gap-2.5 rounded-[6px] border px-4 py-2.5 text-[15px] font-medium transition-colors";

/** Outlined, on dark surfaces — hero, step section, closing CTA. */
export const BTN_DARK = `${BTN_BASE} border-white/30 text-white hover:border-white hover:bg-white/[0.07]`;

/** Solid dark fill. Reads on both surfaces; the border keeps its box identical
    to the outlined variants so a pair of buttons stays the same height. */
export const BTN_SOLID = `${BTN_BASE} border-[#22262a] bg-[#22262a] text-white hover:border-[#31363c] hover:bg-[#31363c]`;
