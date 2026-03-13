# TECH_STACK.md
Logmedia Portfolio

This document defines the approved technology stack, architectural constraints, implementation standards and technical boundaries for the Logmedia Portfolio project.

The goal is to ensure:

• technical consistency  
• predictable implementation decisions  
• compatibility with the design system  
• high performance  
• maintainable frontend architecture  

All agents and developers must respect this document before proposing any implementation.

---

# PROJECT STACK OVERVIEW

The Logmedia Portfolio frontend is built with a modern component-based architecture focused on:

• performance  
• scalability  
• maintainability  
• design consistency  
• mobile-first UX  

Core stack:

Frontend Framework: React  
UI Library: Chakra UI  
Styling System: Chakra theme tokens  
Design Style: Glassmorphism  
Theme: Dark UI  
Accent Colors: Menta / Verde Água (#22b99d)  

---

# APPROVED TECHNOLOGIES

The following technologies are approved for this project.

## Frontend

React

Used for:

• component architecture  
• page composition  
• UI rendering  

---

## UI Library

Chakra UI

Used for:

• layout primitives  
• typography  
• spacing  
• theme tokens  
• accessible UI foundations  

All UI should be built with Chakra primitives whenever possible.

Preferred primitives:

Box  
Flex  
Stack  
Grid  
SimpleGrid  
Button  
Text  
Heading  
Image  
Card  
Tag  
Modal  
Drawer  

---

## Styling System

Chakra theme tokens only.

Use tokens for:

• spacing  
• colors  
• typography  
• radii  
• shadows  
• component variants  

Never use arbitrary style values when a theme token exists.

---

# DESIGN CONSTRAINTS

All technical implementation must preserve the visual identity.

Required design standards:

• Dark UI  
• Glassmorphism  
• Cyan/Azure accent palette  
• border-radius 2xl for cards and floating containers  
• subtle micro-animations  
• calm visual hierarchy  

Any technical choice that breaks this identity is not allowed.

---

# ARCHITECTURE PRINCIPLES

The application architecture must prioritize:

• separation of concerns  
• reusable components  
• predictable state flow  
• minimal duplication  
• performance-first rendering  

Avoid complex abstractions unless they clearly improve maintainability.

---

# COMPONENT STRUCTURE

Recommended hierarchy:

UI Components  
Layout Components  
Feature Components  
Page Components

## UI Components

Small reusable building blocks.

Examples:

Button  
Card  
Input  
Tag  
Badge  
Avatar  

Rules:

• no business logic  
• highly reusable  
• theme token compliant  

## Layout Components

Used to structure screens.

Examples:

Container  
Section  
PageShell  
Navbar  
Sidebar  
GridLayout  

Rules:

• layout responsibility only  
• no domain logic  

## Feature Components

Used for product-specific behaviors.

Examples:

PortfolioGrid  
ProjectCard  
FilterPanel  
ContactForm  

Rules:

• can contain local state  
• should remain modular  
• avoid unnecessary coupling  

## Page Components

Responsible for composing screens.

Examples:

HomePage  
ProjectsPage  
ProjectDetailPage  
AboutPage  
ContactPage  

Rules:

• orchestration only  
• avoid dense business logic inside pages  

---

# STATE MANAGEMENT

Preferred state strategy:

1. local component state first  
2. lifted state only when necessary  
3. shared state only when clearly justified  

Use the simplest possible state model.

Avoid global state unless needed for true cross-page or cross-feature behavior.

Preferred approach:

• React local state  
• prop composition  
• controlled component state  

Avoid introducing complex state libraries unless explicitly approved.

---

# DATA FLOW

Data flow must be predictable.

Rules:

• pass data downward  
• keep side effects isolated  
• avoid hidden dependencies  
• avoid unnecessary prop drilling by restructuring components first  

If shared state becomes necessary, document why before adding abstraction.

---

# STYLING RULES

All styling must be implemented using Chakra UI props and theme tokens.

Correct approach:

<Box p={6} borderRadius="2xl" bg="background.glass">

Avoid:

<div style={{ padding: "23px", borderRadius: "19px" }}>

Rules:

• avoid inline style objects unless absolutely necessary  
• avoid hardcoded pixel values  
• avoid random colors outside theme tokens  

---

# SPACING SYSTEM

Approved spacing scale:

4  
8  
12  
16  
24  
32  
48  
64  

Rules:

• always use Chakra spacing tokens  
• keep vertical rhythm consistent  
• do not mix arbitrary spacing values  

---

# BORDER RADIUS SYSTEM

Default radius for premium UI surfaces:

2xl

Use for:

• cards  
• glass panels  
• modals  
• floating containers  

Smaller radii may be used for minor controls when needed, but 2xl is the project default for premium containers.

---

# GLASSMORPHISM IMPLEMENTATION

Glassmorphism is a required visual pattern.

Approved glass style baseline:

background: rgba(255,255,255,0.5)  
backdrop-filter: blur(16px)  
border: 1px solid rgba(255,255,255,0.2)

Rules:

• do not stack more than two glass layers  
• avoid glass behind large dense text blocks  
• avoid excessive blur values  
• avoid noisy backgrounds behind glass panels  

Technical decisions must consider blur cost and readability.

---

# RESPONSIVE STRATEGY

The project is mobile-first.

Primary breakpoints:

base  
sm  
md  
lg  
xl  
2xl  

Must validate on:

360px  
375px  
390px  

Rules:

• avoid horizontal scrolling  
• ensure touch-friendly spacing  
• prioritize vertical flow  
• keep primary actions reachable on mobile  

---

# ACCESSIBILITY BASELINE

All implementation must support WCAG AA level standards.

Required:

• visible focus states  
• keyboard accessibility  
• sufficient contrast  
• readable text sizes  
• touch targets at least 44px  

Accessibility is not optional.

Do not sacrifice accessibility for visual polish.

---

# MOTION SYSTEM

Motion must be subtle and performance-conscious.

Approved motion use cases:

• hover transitions  
• focus transitions  
• card elevation  
• page transitions  
• feedback states  

Timing scale:

120ms  
180ms  
240ms  

Default easing:

ease-out

Must support:

prefers-reduced-motion

Avoid long or decorative-only animations.

---

# PERFORMANCE RULES

The frontend must protect Core Web Vitals.

Target metrics:

LCP < 2.5s  
INP < 200ms  
CLS < 0.1  

Avoid:

• large unoptimized media  
• heavy animation libraries without need  
• blocking scripts  
• layout shifts  
• excessive blur layers  
• oversized bundles  

Performance must be considered in every UI decision.

---

# IMAGE HANDLING

Preferred formats:

AVIF  
WebP  

Rules:

• compress assets  
• lazy load below-the-fold images  
• avoid oversized source files  
• reserve space for images to avoid layout shift  

Do not use large decorative images unless they are optimized and justified.

---

# CODE ORGANIZATION

Recommended project structure:

src/
  components/
    ui/
    layout/
    features/
  pages/
  hooks/
  utils/
  theme/

Guidelines:

• keep files focused  
• separate concerns clearly  
• group related logic close to the component  
• avoid giant multipurpose files  

---

# NAMING CONVENTIONS

Components:

PascalCase

Examples:

ProjectCard  
PortfolioGrid  
ContactForm  

Hooks:

camelCase starting with use

Examples:

useProjects  
useFilters  
useContactForm  

Utility functions:

camelCase

Examples:

formatDate  
buildProjectLink  

---

# ERROR HANDLING

Errors must be clear and user-friendly.

Rules:

• never expose raw technical errors to users  
• provide actionable messages  
• keep visual error states consistent with the design system  

Examples:

• form submission failed  
• content unavailable  
• network issue  

---

# FORMS

Forms must prioritize clarity and low friction.

Rules:

• always show labels  
• placeholders do not replace labels  
• show inline validation clearly  
• show success and error states clearly  
• keep required fields minimal  

Form components must remain accessible and visually consistent.

---

# DEPENDENCY POLICY

Do not introduce new dependencies unless there is a clear benefit.

Before proposing a new dependency, confirm:

• Chakra cannot already solve it  
• React native patterns cannot already solve it  
• the dependency does not hurt performance  
• the dependency does not conflict with the design system  

Avoid unnecessary libraries.

---

# DISALLOWED PATTERNS

The following are discouraged or disallowed unless explicitly approved:

• multiple competing styling systems  
• arbitrary CSS values everywhere  
• inline random colors  
• heavy global state without need  
• inconsistent component APIs  
• duplicated UI components with slight variations  
• decorative motion that harms performance  
• deep navigation complexity  

---

# AGENT IMPLEMENTATION RULES

When an agent proposes technical changes, it must:

1. respect DESIGN_SYSTEM.md  
2. respect FRONTEND_GUIDELINES.md  
3. respect APP_FLOW.md  
4. stay within this approved stack  
5. avoid introducing alternative tooling unnecessarily  

If a requested implementation conflicts with these documents, the agent must flag the conflict.

---

# FINAL PRINCIPLE

Technical implementation must always serve:

• user experience  
• design consistency  
• maintainability  
• performance  

If something can be implemented in a simpler, cleaner and faster way without harming the product:

Choose the simpler solution.