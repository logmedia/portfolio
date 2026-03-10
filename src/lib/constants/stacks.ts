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
  { name: "TypeScript", icon: "SiTypescript", color: "#3178C6", category: "Language" },
  { name: "JavaScript", icon: "SiJavascript", color: "#F7DF1E", category: "Language" },
  { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4", category: "Frontend" },
  { name: "Chakra UI", icon: "Lightning", color: "#319795", category: "Frontend" },
  { name: "HTML5", icon: "FaHtml5", color: "#E34F26", category: "Frontend" },
  { name: "CSS3", icon: "FaCss3Alt", color: "#1572B6", category: "Frontend" },
  { name: "Vite", icon: "Lightning", color: "#646CFF", category: "Frontend" },
  
  // Backend & Database
  { name: "Node.js", icon: "FaNodeJs", color: "#339933", category: "Backend" },
  { name: "PostgreSQL", icon: "SiPostgresql", color: "#4169E1", category: "Database" },
  { name: "Supabase", icon: "SiSupabase", color: "#3ECF8E", category: "Backend" },
  { name: "Firebase", icon: "SiFirebase", color: "#FFCA28", category: "Backend" },
  { name: "PHP", icon: "FaPhp", color: "#777BB4", category: "Backend" },
  { name: "Python", icon: "FaPython", color: "#3776AB", category: "Backend" },
  { name: "Prisma", icon: "SiPrisma", color: "#2D3748", category: "Backend" },
  
  // Design & Tools
  { name: "Figma", icon: "FaFigma", color: "#F24E1E", category: "Design" },
  { name: "Adobe Photoshop", icon: "Palette", color: "#31A8FF", category: "Design" },
  { name: "UI/UX Design", icon: "Desktop", color: "#FF4DA0", category: "Design" },
  
  // DevOps & Others
  { name: "Git", icon: "FaGitAlt", color: "#F05032", category: "Tool" },
  { name: "Docker", icon: "FaDocker", color: "#2496ED", category: "Tool" },
  { name: "AWS", icon: "FaAws", color: "#FF9900", category: "Cloud" },
  { name: "Vercel", icon: "SiVercel", color: "#FFFFFF", category: "Cloud" },
  { name: "WordPress", icon: "FaWordpress", color: "#21759B", category: "CMS" },
  { name: "Shopify", icon: "SiShopify", color: "#7AB55C", category: "CMS" },
];
