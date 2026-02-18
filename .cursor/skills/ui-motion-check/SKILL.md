---
name: ui-motion-check
description: Reviews and applies lightweight UI motion patterns with accessibility-safe behavior. Use when adding animations, hover/tap interactions, or section reveal effects.
---

# UI Motion Check

## Objective
Keep motion elegant, subtle, and usable across mouse and touch devices.

## Motion Constraints
- Default transition duration: 160ms to 320ms.
- Use `ease-out` or similar soft easing.
- Animate `opacity` and `transform` before layout-affecting properties.
- Avoid infinite decorative loops unless essential.

## Accessibility
- Respect `prefers-reduced-motion` and disable non-essential animation.
- Preserve readability while animating.
- Do not hide key information behind motion-triggered states.

## Interaction Parity
- Provide equivalent touch behavior for hover effects.
- Ensure clickable areas stay large enough on mobile.
- Keep focus-visible styles clear when keyboard navigating.

## Verification Checklist
- No jank on section entry.
- No content shift due to animation.
- Reduced-motion mode is functional.
- Hover-only affordances are not required to complete tasks.
