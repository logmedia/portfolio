---
name: UX_UI_Design
description: Guidelines and standards for UX/UI design across the Logmedia Portfolio project.
---

# UX/UI Design Guidelines

This skill provides the agent with instructions on how to maintain the visual and functional integrity of the Logmedia Portfolio project.

## Core Principles

- **Glassmorphism**: Use semi-transparent backgrounds with blur effects for a modern, premium feel.
- **Micro-animations**: Implement subtle transitions and hover effects to make the interface feel alive.
- **Typography**: Prioritize legibility and alignment. Use the theme's defined font hierarchy.
- **Color Palette**: Stick to the brand colors (Cyan/Azure accents on dark backgrounds).

## Implementation Rules

1. ALWAYS use the Chakra UI theme tokens for colors and spacing.
2. Ensure high contrast for accessibility.
3. Interactive elements (buttons, tags) must have clear hover and active states.
4. Maintain a consistent border-radius (default to 2xl for cards).
5. STRICT GLASSMORPHISM: Use `whiteAlpha.50` (5% opacity) for card backgrounds and `whiteAlpha.200` for borders to maintain design harmony.

## Resources
- [DESIGN_SYSTEM.md](file:///Users/joserenato/Desktop/portfolioonline/.agents/skills/UX_UI/DESIGN_SYSTEM.md)
- [FRONTEND_GUIDELINES.md](file:///Users/joserenato/Desktop/portfolioonline/.agents/skills/UX_UI/FRONTEND_GUIDELINES.md)
- [TECH_STACK.md](file:///Users/joserenato/Desktop/portfolioonline/.agents/skills/UX_UI/TECH_STACK.md)
- [APP_FLOW.md](file:///Users/joserenato/Desktop/portfolioonline/.agents/skills/UX_UI/APP_FLOW.md)
- [LESSONS.md](file:///Users/joserenato/Desktop/portfolioonline/.agents/skills/UX_UI/LESSONS.md)
- [ROUTES_AUDIT.md](file:///Users/joserenato/Desktop/portfolioonline/.agents/skills/UX_UI/ROUTES_AUDIT.md)
- [progress.md](file:///Users/joserenato/Desktop/portfolioonline/.agents/skills/UX_UI/progress.md)
- [theme/index.ts](file:///Users/joserenato/Desktop/portfolioonline/src/theme/index.ts)
- [globals.css](file:///Users/joserenato/Desktop/portfolioonline/src/app/globals.css)
## Standardized Procedures

1. **Accessibility & Contrast**
   - All text components must maintain a minimum contrast ratio of 4.5:1 against their background.
   - Use solid background variants or high-contrast borders for tags and badges on glassmorphic cards.
   - Never rely solely on color to convey information (add icons or sub-labels).
   - **Native Controls Visibility**: For native input fields (date/time, select arrows), ensure internal decorators/icons are clearly visible using `filter: invert(1)` or similar adjustments on dark backgrounds.

2. **Brand Integrity**
   - Technology icons (Stacks) must preserve their original brand colors to facilitate cognitive recognition.
   - Accents and gradients should complement, not override, the primary colors of integrated technologies.

3. **Data Management & Filtering**
   - Ensure profile-level technologies (stacks) are explicitly editable in the admin dashboard.
   - Global discovery views (Explore) must prioritize these profile stacks for consistent filtering.

4. **Empty State Protocol**
   - Provide friendly feedback with actionable suggestions when a search or filter returns no results.
