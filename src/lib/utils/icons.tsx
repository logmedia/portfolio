import { Icon } from "@chakra-ui/react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { BracketsCurly, Question } from "phosphor-react";

/**
 * Resolves an icon component from a string key.
 * Supports FontAwesome (Fa) and SimpleIcons (Si) prefixes.
 */
export function getIconComponent(iconKey: string | undefined | null) {
  if (!iconKey || iconKey.trim() === "") return BracketsCurly;

  const key = iconKey.trim();

  // FontAwesome (case-insensitive prefix check)
  if (key.toLowerCase().startsWith("fa")) {
    const pascalKey = key.charAt(0).toUpperCase() + key.charAt(1).toLowerCase() + key.slice(2);
    // Try original, then pascal case
    const icon = (FaIcons as any)[key] || (FaIcons as any)[pascalKey];
    if (icon) return icon;
  }

  // SimpleIcons (case-insensitive prefix check)
  if (key.toLowerCase().startsWith("si")) {
    const pascalKey = key.charAt(0).toUpperCase() + key.charAt(1).toLowerCase() + key.slice(2);
    const icon = (SiIcons as any)[key] || (SiIcons as any)[pascalKey];
    if (icon) return icon;
  }

  // Common lowercase mapping
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
    github: FaIcons.FaGithub,
    docker: FaIcons.FaDocker,
    database: SiIcons.SiPostgresql,
    aws: FaIcons.FaAws,
    google: SiIcons.SiGoogle,
    apple: FaIcons.FaApple,
    android: FaIcons.FaAndroid,
  };

  const found = (FaIcons as any)[key] || (SiIcons as any)[key] || commonMap[key.toLowerCase()];
  
  return found || Question;
}
