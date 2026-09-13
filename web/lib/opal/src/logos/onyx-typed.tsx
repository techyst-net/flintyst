import type { IconProps } from "@opal/types";

// The Flintyst wordmark.
//
// Set as text rather than traced outlines so it inherits the brand colour the
// same way the previous wordmark did, and stays legible on both themes. The
// viewBox keeps the 152x64 box the mark-plus-wordmark lockup measures its gap
// against, so nothing downstream needs to change.
const SvgOnyxTyped = ({ size, ...props }: IconProps) => (
  <svg
    height={size}
    viewBox="0 0 152 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <text
      x="0"
      y="45"
      fill="var(--theme-primary-05)"
      fontFamily="var(--font-hanken-grotesk), 'Hanken Grotesk', system-ui, sans-serif"
      fontSize="42"
      fontWeight="500"
      letterSpacing="-1.6"
    >
      Flintyst
    </text>
  </svg>
);
export default SvgOnyxTyped;
