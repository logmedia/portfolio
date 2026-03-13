# Design System

Logmedia Portfolio

This document defines the visual language, layout system, components,
and interaction patterns used across the Logmedia Portfolio project.

The goal is to ensure:

• visual consistency\
• usability\
• accessibility\
• performance\
• maintainable UI architecture

The interface must feel modern, premium, calm and intuitive.

------------------------------------------------------------------------

# Core Design Philosophy

The UI should feel:

• premium\
• minimal\
• calm\
• modern\
• fast

The user must instantly understand the interface.

If a user needs to think to understand an interface element, the design
failed.

The system prioritizes:

• clarity\
• hierarchy\
• calm visual rhythm\
• usability\
• performance

------------------------------------------------------------------------

# Visual Style

The Logmedia interface is based on:

• Dark UI\
• Glassmorphism\
• Subtle micro-animations\
• Menta/Verde Água accent colors (#22b99d)

The interface should feel like a modern SaaS dashboard with a premium
aesthetic.

------------------------------------------------------------------------

# Color System

The design system uses semantic color tokens from the Chakra UI theme.

Accent palette:

• Menta / Verde Água (#22b99d)

Background layers:

background.primary\
background.secondary\
background.glass

Foreground tokens:

text.primary\
text.secondary\
text.muted

State colors:

success\
warning\
error\
info

Rules:

• accent colors highlight interaction\
• avoid large areas with accent colors\
• keep backgrounds visually calm

------------------------------------------------------------------------

# Glassmorphism

Glass surfaces are core visual elements.

Use glass backgrounds only for structural elements:

• cards\
• floating panels\
• navigation containers\
• modals

Glass properties:

background: var(--chakra-colors-whiteAlpha-500) (rgba(255, 255, 255, 0.5))\
backdrop-filter: blur(16px)\
border: 1px solid var(--chakra-colors-whiteAlpha-200)

Rules:

• avoid stacking more than two glass layers\
• avoid glass behind dense text blocks\
• avoid glass over complex backgrounds

Glass should create depth without visual noise.

------------------------------------------------------------------------

# Typography

Typography must prioritize readability and hierarchy.

Font family: 'Space Grotesk'\

Heading XL → Page titles\
Heading LG → Section titles\
Heading MD → Card titles\
Text MD → Body text\
Text SM → Secondary text\
Text XS → Metadata

Guidelines:

• maximum line length: 70 characters\
• avoid dense paragraphs\
• maintain vertical rhythm

Never mix random font sizes.

Always use Chakra UI typography tokens.

------------------------------------------------------------------------

# Layout System

The layout is mobile-first.

Breakpoints:

base\
sm\
md\
lg\
xl\
2xl

Spacing tokens:

4\
8\
12\
16\
24\
32\
48\
64

Rules:

• always use theme spacing tokens\
• avoid arbitrary spacing values\
• maintain consistent layout rhythm

------------------------------------------------------------------------

# Container Layout

Default container width:

max-width: 1280px

Padding:

Mobile: 16px\
Tablet: 24px\
Desktop: 32px

Content must remain centered and readable.

------------------------------------------------------------------------

# Component Architecture

Components should always follow Chakra UI patterns.

Preferred components:

• Box\
• Flex\
• Stack\
• Card\
• Button\
• Tag\
• Modal

------------------------------------------------------------------------

# Cards

Cards are the primary layout container.

Default card style:

border-radius: 2xl\
glass background\
padding: 24px

Mobile card padding:

16px

Card structure:

1.  Card title\
2.  Card content\
3.  Card actions

Cards should remain visually calm.

Avoid overcrowding cards.

------------------------------------------------------------------------

# Buttons

Buttons must communicate interaction clearly.

Variants:

solid\
outline\
ghost\
glass

Required states:

hover\
focus\
active\
disabled\
loading

Mobile touch height: 44px

------------------------------------------------------------------------

# Tags

Tags must remain lightweight.

Use cases:

• categories\
• status indicators\
• metadata

Avoid excessive tag clusters.

------------------------------------------------------------------------

# Interaction Design

Interactive elements must always provide feedback.

Required interaction states:

hover\
focus\
active\
disabled\
loading

Users must always know when something is interactive.

------------------------------------------------------------------------

# Motion Design

Motion should support usability.

Allowed uses:

• hover feedback\
• transitions between states\
• card elevation\
• page transitions

Animation durations:

120ms\
180ms\
240ms

Default easing:

ease-out

------------------------------------------------------------------------

# Motion Accessibility

Respect user accessibility preferences.

Support:

prefers-reduced-motion

Animations must degrade gracefully if motion is disabled.

------------------------------------------------------------------------

# Mobile First

Primary target widths:

360px\
375px\
390px

Mobile rules:

• avoid horizontal scrolling\
• ensure buttons remain tappable\
• maintain comfortable spacing

Minimum touch target: 44px

------------------------------------------------------------------------

# Accessibility

Interface must comply with WCAG AA.

Requirements:

• sufficient color contrast\
• visible focus states\
• keyboard navigation support\
• readable text sizes

Accessibility must never be optional.

------------------------------------------------------------------------

# Performance

Design must respect performance constraints.

Avoid:

• heavy blur effects\
• large background images\
• unnecessary animations

Target Core Web Vitals:

LCP \< 2.5s\
INP \< 200ms\
CLS \< 0.1

------------------------------------------------------------------------

# Images

Preferred formats:

AVIF\
WebP

Rules:

• lazy load images below the fold\
• avoid oversized images

------------------------------------------------------------------------

# Microcopy

User-facing text must be:

• concise\
• clear\
• human

Avoid technical language.

------------------------------------------------------------------------

# UX Principles

Always apply:

• progressive disclosure\
• cognitive load reduction\
• clear visual hierarchy\
• minimal interface

If an element can be removed without loss of meaning:

Remove it.

------------------------------------------------------------------------

# Final Principle

The interface must feel:

• effortless\
• calm\
• natural

Users should complete tasks without needing instructions.
