import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/icons/types";

// Paths fill with `currentColor` (RN can't read a CSS var), tinted via the `Icon` color class.
const SvgOnyxLogo = ({ size = 16, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="currentColor"
    {...props}
  >
    <Path d="M18 18 H46 V26 L31 38 H46 V46 H18 V38 L33 26 H18 Z" />
  </Svg>
);

export default SvgOnyxLogo;
