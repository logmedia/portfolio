export type PredefinedStack = {
  name: string;
  icon: string;
  color: string;
  category: string;
};

export const PREDEFINED_STACKS: PredefinedStack[] = [
  // Frontend
  { name: "React", icon: "FaReact", color: "#61DAFB", category: "Frontend" },
  { name: "Next.js", icon: "SiNextdotjs", color: "#FFFFFF", category: "Frontend" },
  { name: "TypeScript", icon: "SiTypescript", color: "#3178C6", category: "Frontend" },
  { name: "JavaScript", icon: "SiJavascript", color: "#F7DF1E", category: "Frontend" },
  { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4", category: "Frontend" },
  { name: "Chakra UI", icon: "SiChakraui", color: "#319795", category: "Frontend" },
  { name: "Framer Motion", icon: "SiFramer", color: "#0055FF", category: "Frontend" },
  { name: "Three.js", icon: "SiThreedotjs", color: "#FFFFFF", category: "Frontend" },
  { name: "Redux", icon: "SiRedux", color: "#764ABC", category: "Frontend" },
  { name: "Vue.js", icon: "FaVuejs", color: "#4FC08D", category: "Frontend" },
  { name: "Angular", icon: "FaAngular", color: "#DD0031", category: "Frontend" },
  { name: "SASS", icon: "FaSass", color: "#CC6699", category: "Frontend" },
  
  // Backend & Database
  { name: "Node.js", icon: "FaNodeJs", color: "#339933", category: "Backend" },
  { name: "Express", icon: "SiExpress", color: "#FFFFFF", category: "Backend" },
  { name: "NestJS", icon: "SiNestjs", color: "#E0234E", category: "Backend" },
  { name: "PostgreSQL", icon: "SiPostgresql", color: "#4169E1", category: "Database" },
  { name: "Supabase", icon: "SiSupabase", color: "#3ECF8E", category: "Database" },
  { name: "Firebase", icon: "SiFirebase", color: "#FFCA28", category: "Database" },
  { name: "MongoDB", icon: "SiMongodb", color: "#47A248", category: "Database" },
  { name: "MySQL", icon: "SiMysql", color: "#4479A1", category: "Database" },
  { name: "Redis", icon: "SiRedis", color: "#DC382D", category: "Database" },
  { name: "Prisma", icon: "SiPrisma", color: "#2D3748", category: "ORM" },
  { name: "PHP", icon: "FaPhp", color: "#777BB4", category: "Backend" },
  { name: "Laravel", icon: "FaLaravel", color: "#FF2D20", category: "Backend" },
  { name: "Python", icon: "FaPython", color: "#3776AB", category: "Backend" },
  { name: "Django", icon: "SiDjango", color: "#092E20", category: "Backend" },
  { name: "Go", icon: "FaGolang", color: "#00ADD8", category: "Backend" },
  
  // Design & UI
  { name: "Figma", icon: "FaFigma", color: "#F24E1E", category: "Design" },
  { name: "Adobe Photoshop", icon: "SiAdobephotoshop", color: "#31A8FF", category: "Design" },
  { name: "Adobe Illustrator", icon: "SiAdobeillustrator", color: "#FF9A00", category: "Design" },
  { name: "Canva", icon: "SiCanva", color: "#00C4CC", category: "Design" },
  { name: "Rive", icon: "SiRive", color: "#FFFFFF", category: "Animation" },
  
  // DevOps & Analytics
  { name: "Git", icon: "FaGitAlt", color: "#F05032", category: "DevOps" },
  { name: "GitHub", icon: "FaGithub", color: "#FFFFFF", category: "DevOps" },
  { name: "Docker", icon: "FaDocker", color: "#2496ED", category: "DevOps" },
  { name: "Kubernetes", icon: "SiKubernetes", color: "#326CE5", category: "DevOps" },
  { name: "AWS", icon: "FaAws", color: "#FF9900", category: "Cloud" },
  { name: "Vercel", icon: "SiVercel", color: "#FFFFFF", category: "Cloud" },
  { name: "Google Analytics", icon: "SiGoogleanalytics", color: "#E37400", category: "Analytics" },
  
  // Others
  { name: "WordPress", icon: "FaWordpress", color: "#21759B", category: "CMS" },
  { name: "Shopify", icon: "SiShopify", color: "#7AB55C", category: "E-commerce" },
  { name: "Stripe", icon: "FaStripe", color: "#008CDD", category: "Payments" },
  { name: "Discord API", icon: "FaDiscord", color: "#5865F2", category: "API" },
  { name: "Telegram Bot", icon: "FaTelegram", color: "#26A5E4", category: "API" },
];
