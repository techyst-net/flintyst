import type { IconProps } from "@opal/types";

// The Flintyst mark: a four-point spark with concave edges, carrying the brand
// gradient from deep blue at the lower left to bright blue at the upper right.
//
// The gradient id is derived from a module-level counter rather than being a
// fixed string, because several of these render at once (sidebar, avatars, auth)
// and duplicate ids in one document make every instance take the first one's
// gradient.
let gradientSeq = 0;

const SvgOnyxLogo = ({ size, ...props }: IconProps) => {
  const gradientId = `flintyst-mark-${(gradientSeq += 1)}`;
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="8"
          y1="56"
          x2="56"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#17318C" />
          <stop offset="0.45" stopColor="#2456B8" />
          <stop offset="1" stopColor="#4D9CFF" />
        </linearGradient>
      </defs>
      <path
        d="M32 2C34.1 17.6 46.4 29.9 62 32C46.4 34.1 34.1 46.4 32 62C29.9 46.4 17.6 34.1 2 32C17.6 29.9 29.9 17.6 32 2Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};
export default SvgOnyxLogo;
