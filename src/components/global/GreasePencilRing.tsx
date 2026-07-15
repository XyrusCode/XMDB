import { cn } from '@/lib/utils';

/**
 * Total length of the path below, from getTotalLength() in user units. The dash
 * has to be at least this for the ring to close.
 *
 * It cannot be normalised with pathLength, and the stroke cannot use
 * non-scaling-stroke: either one makes the browser resolve dash units in screen
 * space, where they no longer match the path and the ring draws only part-way.
 * Keep this in step with `d`.
 */
const PATH_LENGTH = 380;

/**
 * The signature: a chinagraph ellipse of the kind an editor draws around a
 * select on a contact sheet. Shown on hover and on keyboard focus, so the
 * accessible affordance and the brand mark are one thing.
 *
 * The path is deliberately not a true ellipse — it overshoots where it closes,
 * the way a hand does. Purely decorative, so aria-hidden.
 */
export const GreasePencilRing = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 140"
    preserveAspectRatio="none"
    className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
  >
    <path
      d="M50 6 C22 6 8 38 8 70 C8 108 24 134 50 134 C78 134 92 104 92 70 C92 36 76 8 50 7 C36 6.5 26 14 20 26"
      fill="none"
      stroke="var(--color-grease)"
      // Scales with the frame, so it lands around 3px — and unevenly, because
      // the viewBox is stretched, which is what a pencil does.
      strokeWidth="1.6"
      strokeLinecap="round"
      className="ring-stroke"
      style={{ strokeDasharray: PATH_LENGTH, strokeDashoffset: PATH_LENGTH }}
    />
  </svg>
);
