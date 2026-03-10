import { Icon } from "@chakra-ui/react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { BracketsCurly } from "phosphor-react";

/**
 * Resolves an icon component from a string key.
 * Supports FontAwesome (Fa) and SimpleIcons (Si) prefixes.
 * Falls back to a default icon if not found.
 */
export function getIconComponent(iconKey: string | undefined | null) {
  if (!iconKey) return BracketsCurly;

  // FontAwesome
  if (iconKey.startsWith("Fa")) {
    const icon = (FaIcons as any)[iconKey];
    if (icon) return icon;
  }

  // SimpleIcons
  if (iconKey.startsWith("Si")) {
    const icon = (SiIcons as any)[iconKey];
    if (icon) return icon;
  }

  // Case-insensitive fallback check for some common names
  const commonMap: Record<string, any> = {
    react: FaIcons.FaReact,
    nextjs: SiIcons.SiNextdotjs,
    typescript: SiIcons.SiTypescript,
    javascript: SiIcons.SiJavascript,
    node: FaIcons.FaNodeJs,
    tailwind: SiIcons.SiTailwindcss,
    figma: FaIcons.FaFigma,
    wordpress: FaIcons.FaWordpress,
    php: FaIcons.FaPhp,
    python: FaIcons.FaPython,
    git: FaIcons.FaGitAlt,
  };

  return commonMap[iconKey.toLowerCase()] || BracketsCurly;
}
