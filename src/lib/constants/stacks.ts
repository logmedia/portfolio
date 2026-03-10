export type PredefinedStack = {
  name: string;
  icon: string;
  color: string;
  category: string;
};

export const PREDEFINED_STACKS: PredefinedStack[] = [
  // Frontend Frameworks & UI
  { name: "React", icon: "FaReact", color: "#61DAFB", category: "Frontend" },
  { name: "Next.js", icon: "SiNextdotjs", color: "#FFFFFF", category: "Frontend" },
  { name: "Vue.js", icon: "FaVuejs", color: "#4FC08D", category: "Frontend" },
  { name: "Nuxt.js", icon: "SiNuxtdotjs", color: "#00DC82", category: "Frontend" },
  { name: "Angular", icon: "SiAngular", color: "#DD0031", category: "Frontend" },
  { name: "Svelte", icon: "SiSvelte", color: "#FF3E00", category: "Frontend" },
  { name: "Remix", icon: "SiRemix", color: "#FFFFFF", category: "Frontend" },
  { name: "Astro", icon: "SiAstro", color: "#FF5D01", category: "Frontend" },
  { name: "Solid.js", icon: "SiSolid", color: "#2C4F7C", category: "Frontend" },
  
  // CSS & Styling
  { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4", category: "Frontend" },
  { name: "Chakra UI", icon: "SiChakraui", color: "#319795", category: "Frontend" },
  { name: "MUI (Material UI)", icon: "SiMui", color: "#007FFF", category: "Frontend" },
  { name: "Styled Components", icon: "SiStyledcomponents", color: "#DB7093", category: "Frontend" },
  { name: "SASS", icon: "SiSass", color: "#CC6699", category: "Frontend" },
  { name: "Bootstrap", icon: "SiBootstrap", color: "#7952B3", category: "Frontend" },
  { name: "Framer Motion", icon: "SiFramer", color: "#0055FF", category: "Frontend" },

  // Languages
  { name: "TypeScript", icon: "SiTypescript", color: "#3178C6", category: "Language" },
  { name: "JavaScript", icon: "SiJavascript", color: "#F7DF1E", category: "Language" },
  { name: "Python", icon: "SiPython", color: "#3776AB", category: "Language" },
  { name: "Rust", icon: "SiRust", color: "#FFFFFF", category: "Language" },
  { name: "Go", icon: "SiGo", color: "#00ADD8", category: "Language" },
  { name: "PHP", icon: "SiPhp", color: "#777BB4", category: "Language" },
  { name: "C#", icon: "SiCsharp", color: "#239120", category: "Language" },
  { name: "Java", icon: "FaJava", color: "#007396", category: "Language" },
  { name: "Kotlin", icon: "SiKotlin", color: "#7F52FF", category: "Language" },
  { name: "Swift", icon: "SiSwift", color: "#F05138", category: "Language" },
  { name: "Dart", icon: "SiDart", color: "#0175C2", category: "Language" },

  // Backend & API
  { name: "Node.js", icon: "SiNodedotjs", color: "#339933", category: "Backend" },
  { name: "Express", icon: "SiExpress", color: "#FFFFFF", category: "Backend" },
  { name: "NestJS", icon: "SiNestjs", color: "#E0234E", category: "Backend" },
  { name: "FastAPI", icon: "SiFastapi", color: "#05998B", category: "Backend" },
  { name: "Django", icon: "SiDjango", color: "#092E20", category: "Backend" },
  { name: "Laravel", icon: "SiLaravel", color: "#FF2D20", category: "Backend" },
  { name: "Spring Boot", icon: "SiSpringboot", color: "#6DB33F", category: "Backend" },
  { name: "GraphQL", icon: "SiGraphql", color: "#E10098", category: "Backend" },
  { name: "Apollo GraphQL", icon: "SiApollographql", color: "#311C87", category: "Backend" },
  { name: "TRPC", icon: "SiTrpc", color: "#2596BE", category: "Backend" },

  // Database & Cache
  { name: "PostgreSQL", icon: "SiPostgresql", color: "#4169E1", category: "Database" },
  { name: "Supabase", icon: "SiSupabase", color: "#3ECF8E", category: "Database" },
  { name: "MongoDB", icon: "SiMongodb", color: "#47A248", category: "Database" },
  { name: "MySQL", icon: "SiMysql", color: "#4479A1", category: "Database" },
  { name: "Redis", icon: "SiRedis", color: "#DC382D", category: "Database" },
  { name: "Firebase", icon: "SiFirebase", color: "#FFCA28", category: "Database" },
  { name: "Prisma", icon: "SiPrisma", color: "#2D3748", category: "ORM" },
  { name: "Drizzle ORM", icon: "SiDrizzle", color: "#C5F74F", category: "ORM" },

  // Design
  { name: "Figma", icon: "SiFigma", color: "#F24E1E", category: "Design" },
  { name: "Adobe Photoshop", icon: "SiAdobephotoshop", color: "#31A8FF", category: "Design" },
  { name: "Adobe Illustrator", icon: "SiAdobeillustrator", color: "#FF9A00", category: "Design" },
  { name: "Adobe Premiere Pro", icon: "SiAdobepremierepro", color: "#9999FF", category: "Design" },
  { name: "Adobe After Effects", icon: "SiAdobeaftereffects", color: "#9999FF", category: "Design" },
  { name: "Canva", icon: "SiCanva", color: "#00C4CC", category: "Design" },
  { name: "Spline", icon: "SiSpline", color: "#FFFFFF", category: "Design" },

  // Tools & DevOps
  { name: "Git", icon: "SiGit", color: "#F05032", category: "DevOps" },
  { name: "Docker", icon: "SiDocker", color: "#2496ED", category: "DevOps" },
  { name: "Kubernetes", icon: "SiKubernetes", color: "#326CE5", category: "DevOps" },
  { name: "Vercel", icon: "SiVercel", color: "#FFFFFF", category: "Cloud" },
  { name: "AWS", icon: "SiAmazonaws", color: "#FF9900", category: "Cloud" },
  { name: "Google Cloud", icon: "SiGooglecloud", color: "#4285F4", category: "Cloud" },
  { name: "Azure", icon: "SiMicrosoftazure", color: "#0078D4", category: "Cloud" },
  { name: "Netlify", icon: "SiNetlify", color: "#00C7B7", category: "Cloud" },

  // Payments & Marketing
  { name: "Stripe", icon: "SiStripe", color: "#008CDD", category: "Business" },
  { name: "PayPal", icon: "SiPaypal", color: "#003087", category: "Business" },
  { name: "Google Analytics", icon: "SiGoogleanalytics", color: "#E37400", category: "Analytics" },
  { name: "Hotjar", icon: "SiHotjar", color: "#FD3F00", category: "Analytics" },

  // CMS
  { name: "WordPress", icon: "SiWordpress", color: "#21759B", category: "CMS" },
  { name: "Shopify", icon: "SiShopify", color: "#7AB55C", category: "CMS" },
  { name: "Strapi", icon: "SiStrapi", color: "#2F2E8B", category: "CMS" },
  { name: "Contentful", icon: "SiContentful", color: "#2478CC", category: "CMS" },
  { name: "Sanity", icon: "SiSanity", color: "#F03E2F", category: "CMS" },
];
