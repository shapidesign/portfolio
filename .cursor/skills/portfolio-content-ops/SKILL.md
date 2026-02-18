---
name: portfolio-content-ops
description: Structures and updates portfolio project content, metadata, and case-study copy for this website. Use when adding new projects, editing project text, or preparing project assets and placeholders.
---

# Portfolio Content Ops

## Purpose
Maintain consistent project content structure for the portfolio site.

## Workflow
1. Locate project data source in `src/data/projects.ts`.
2. Ensure each project includes:
   - slug
   - title
   - category
   - summary
   - services/tags
   - hero image reference
   - challenge, process, outcome sections
3. Keep summaries short and benefit-oriented.
4. Use consistent naming for categories and tags.

## Placeholder Strategy
- If final assets are missing, use placeholders with explicit TODO markers.
- Never leave broken paths.
- Keep dimensions consistent with image container ratios.

## Copy Style
- Use plain, confident English.
- Prefer specific outcomes over generic claims.
- Keep paragraph length short for scanning.

## Quality Checks
- Verify each project page renders without missing fields.
- Ensure Work index cards and detail pages show aligned metadata.
- Confirm slugs are unique and URL-safe.
