# FRONTEND_GUIDELINES.md
Logmedia Portfolio

This document defines the frontend architecture, component standards, styling rules and performance guidelines used across the Logmedia Portfolio project.

The goal is to ensure:

• maintainable code  
• consistent UI behavior  
• scalable architecture  
• high performance  
• strict adherence to the design system  

These rules must be respected by all agents and developers.

---

# CORE PRINCIPLES

Frontend code must prioritize:

• clarity  
• modularity  
• performance  
• consistency  

Code should be easy to read, easy to scale and predictable.

Avoid unnecessary complexity.

---

# TECHNOLOGY STACK

Frontend Framework: React  
UI Library: Chakra UI  
Design Style: Glassmorphism  
Theme: Dark UI  
Accent Colors: Menta / Verde Água (#22b99d)  

All UI must follow this stack.

Do not introduce additional styling systems.

Avoid CSS frameworks outside Chakra.

---

# COMPONENT ARCHITECTURE

Components must follow a structured hierarchy.

UI Components  
Layout Components  
Feature Components  
Page Components

---

# UI COMPONENTS

Small reusable elements.

Examples:

Button  
Card  
Tag  
Badge  
Avatar  
Input  

Rules:

• reusable  
• minimal logic  
• use design tokens  

---

# LAYOUT COMPONENTS

Responsible for structural layout.

Examples:

Container  
Section  
Stack  
Grid  
Navbar  
Sidebar  

Rules:

• layout only  
• no business logic  

---

# FEATURE COMPONENTS

Components tied to specific product functionality.

Examples:

PortfolioGrid  
ProjectCard  
FilterPanel  

Rules:

• may contain local state  
• must remain modular  

---

# PAGE COMPONENTS

Pages assemble components.

Examples:

HomePage  
ProjectsPage  
DashboardPage  

Rules:

• orchestrate components  
• avoid complex logic  

---

# CHAKRA UI RULES

Always use Chakra UI primitives.

Preferred primitives:

Box  
Flex  
Stack  
Grid  

Spacing must use Chakra tokens.

Spacing scale:

4  
8  
12  
16  
24  
32  
48  
64  

Never hardcode spacing values.

---

# STYLING RULES

All styling must use Chakra props.

Correct example:

<Box p={6} borderRadius="2xl">

Avoid:

<Box style={{padding: "23px"}}>

Avoid inline CSS unless absolutely necessary.

---

# GLASSMORPHISM IMPLEMENTATION

Glass panels define the visual identity.

Glass style:

background: rgba(255, 255, 255, 0.05) (whiteAlpha.50)  
backdrop-filter: blur(16px)  
border: 1px solid rgba(255, 255, 255, 0.2) (whiteAlpha.200)

Use glass for:

• cards  
• panels  
• modals  
• navigation containers  

Avoid stacking too many glass layers.

Avoid heavy blur effects.

---

# BORDER RADIUS STANDARD

Default radius:

2xl

Used for:

cards  
panels  
modals  
floating containers  

---

# COLOR SYSTEM

Primary accent colors:

Menta / Verde Água (#22b99d)  

Usage:

• CTA buttons  
• active states  
• focus indicators  

Do not use accent colors as large backgrounds.

Dark surfaces should remain calm.

---

# TYPOGRAPHY

Use Chakra typography tokens.

Hierarchy:

Heading XL → Page titles  
Heading LG → Section titles  
Heading MD → Card titles  
Text MD → Body  
Text SM → Secondary text  
Text XS → Metadata  

Rules:

• maximum line length: 70 characters  
• avoid dense paragraphs  
• maintain vertical rhythm  

---

# LAYOUT SYSTEM

Layout must be mobile-first.

Breakpoints:

base  
sm  
md  
lg  
xl  
2xl  

Always test layouts at:

360px  
375px  
390px  

Avoid horizontal scrolling.

---

# SPACING SYSTEM

Spacing tokens:

4  
8  
12  
16  
24  
32  
48  
64  

Maintain consistent vertical rhythm.

Never mix arbitrary spacing.

---

# PERFORMANCE RULES

Frontend must respect Core Web Vitals.

Targets:

LCP < 2.5s  
INP < 200ms  
CLS < 0.1  

Avoid:

• oversized images  
• layout shifts  
• heavy scripts  

---

# IMAGE OPTIMIZATION

Preferred formats:

AVIF  
WebP  

Rules:

• lazy load images below the fold  
• compress images  
• avoid oversized assets  

---

# ACCESSIBILITY

Follow WCAG AA.

Requirements:

• high contrast  
• visible focus states  
• keyboard navigation  
• readable font sizes  

Touch targets:

44px minimum.

---

# INTERACTION STATES

Interactive components must support:

hover  
focus  
active  
disabled  
loading  

Users must always understand when something is interactive.

---

# MICRO-ANIMATIONS

Motion should support usability.

Allowed animations:

• hover transitions  
• button feedback  
• card elevation  
• page transitions  

Timing scale:

120ms  
180ms  
240ms  

Default easing:

ease-out

Respect:

prefers-reduced-motion

---

# FILE STRUCTURE

Recommended structure:

src

components
ui
layout
features

pages

hooks

utils

Each component should live in its own folder if complex.

---

# NAMING CONVENTIONS

Components:

PascalCase

Examples:

ProjectCard  
PortfolioGrid  

Hooks:

camelCase

Examples:

useProjects  
useFilters  

---

# ERROR HANDLING

User-facing errors must be:

• clear  
• friendly  
• actionable  

Avoid technical error messages.

---

# UX CONSISTENCY

All interactions must behave consistently across the application.

Buttons, cards and navigation should behave identically across pages.

---

# FINAL PRINCIPLE

Frontend code must prioritize:

• user experience  
• performance  
• visual consistency  
• maintainability  

If something can be simplified without losing functionality:

Simplify it.