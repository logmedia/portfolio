# LESSONS.md
Logmedia Portfolio

This document records **important lessons, decisions, and mistakes discovered during development** of the Logmedia Portfolio project.

Its purpose is to help agents and developers avoid repeating past issues.

Whenever a problem is discovered and solved, it should be documented here.

This file acts as the **project memory**.

---

# HOW TO USE THIS DOCUMENT

When a problem occurs:

1. describe the problem
2. explain why it happened
3. document the correct solution
4. explain how to avoid the issue in the future

Agents must read this document before proposing architectural or design changes.

---

# DESIGN LESSONS

## Avoid Breaking Design Consistency

Problem:

UI components were implemented with custom styles instead of Chakra UI tokens.

Impact:

• inconsistent spacing  
• inconsistent colors  
• design system drift  

Solution:

Always use Chakra UI theme tokens.

Never introduce arbitrary spacing or colors.

Future rule:

All styling must follow:

DESIGN_SYSTEM.md  
FRONTEND_GUIDELINES.md

---

## Glassmorphism Must Remain Subtle

Problem:

Too many glass layers were used in a single interface.

Impact:

• visual noise  
• reduced readability  
• GPU performance issues  

Solution:

Limit glass layers to **two levels maximum**.

Future rule:

Glass elements should only be used for:

• cards  
• panels  
• modals  
• navigation containers

---

# PERFORMANCE LESSONS

## Blur Effects Can Hurt Performance

Problem:

Excessive blur values were used for glass effects.

Impact:

• GPU overload  
• slower rendering on lower-end devices  

Solution:

Use the standard glass configuration:

background: rgba(255,255,255,0.05)  
backdrop-filter: blur(12px)

Future rule:

Never increase blur values without strong justification.

---

## Large Images Caused Slow Page Load

Problem:

Unoptimized images were used in hero sections.

Impact:

• slow LCP  
• poor Core Web Vitals score  

Solution:

Use optimized formats:

AVIF  
WebP

Future rule:

All images must be optimized before being added to the interface.

---

# UX LESSONS

## Too Many UI Elements Increase Cognitive Load

Problem:

Some screens contained too many visual elements.

Impact:

• difficult scanning  
• reduced usability  

Solution:

Simplify layouts.

Future rule:

If a UI element can be removed without losing meaning:

Remove it.

---

## Navigation Must Stay Shallow

Problem:

Too many nested navigation levels.

Impact:

• users became confused about where they were  

Solution:

Keep navigation depth minimal.

Future rule:

Maximum navigation depth:

2 levels.

---

# DEVELOPMENT LESSONS

## Avoid Duplicate Components

Problem:

Multiple similar components were created instead of reusing existing ones.

Impact:

• inconsistent behavior  
• harder maintenance  

Solution:

Create reusable UI components.

Future rule:

Before creating a new component, verify if a reusable version already exists.

---

## Avoid Hardcoded Values

Problem:

Hardcoded spacing and colors appeared in components.

Impact:

• inconsistent UI  
• difficult theme updates  

Solution:

Use Chakra tokens.

Future rule:

Never hardcode spacing, color, radius or typography values.

---

# ACCESSIBILITY LESSONS

## Focus States Were Missing

Problem:

Some interactive components lacked visible focus states.

Impact:

• keyboard users could not navigate properly  

Solution:

Always include visible focus states.

Future rule:

All interactive elements must support:

focus  
hover  
active

---

# MOBILE LESSONS

## Small Touch Targets Caused Usability Problems

Problem:

Some buttons were too small on mobile.

Impact:

• difficult tapping  
• accidental interactions  

Solution:

Minimum touch size:

44px

Future rule:

All interactive elements must respect this minimum size.

---

# AGENT BEHAVIOR LESSONS

## Agents Should Not Break The Design System

Problem:

Agents sometimes suggested UI patterns inconsistent with the project.

Impact:

• design inconsistencies  
• implementation conflicts  

Solution:

Agents must always respect:

DESIGN_SYSTEM.md  
FRONTEND_GUIDELINES.md  
TECH_STACK.md

Future rule:

If a suggestion conflicts with these files, the agent must flag it.

---

# DOCUMENTATION RULE

Whenever a significant issue is solved, document it here.

This ensures that:

• the mistake is not repeated  
• the project knowledge grows over time  
• agents become more accurate in their suggestions