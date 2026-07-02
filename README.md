# Yehonatan Shapira - Portfolio

Minimal multi-page portfolio built with Next.js for creative work presentation.

## Stack
- Next.js (App Router)
- TypeScript
- CSS with design tokens

## Local Setup
1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm run dev`
3. Open:
   - `http://localhost:3000`

## Shopify + Printify Store Pages
To connect `/shirts` and `/merch` to Shopify (with Printify fulfillment), set these in `.env.local`:

- `NEXT_PUBLIC_SHOPIFY_STORE_URL=your-store.myshopify.com`
- `NEXT_PUBLIC_SHOPIFY_SHIRTS_URL=your-store.myshopify.com/collections/shirts` (optional)
- `NEXT_PUBLIC_SHOPIFY_MERCH_URL=your-store.myshopify.com/collections/merch` (optional)

If collection links are missing, each page falls back to `NEXT_PUBLIC_SHOPIFY_STORE_URL`.

## Project Structure
- `src/app/` page routes
- `src/components/` reusable UI and layout
- `src/data/projects.ts` project content source
- `src/styles/tokens.css` color and spacing tokens
- `.cursor/rules/` project guidance rules
- `.cursor/skills/` project-local workflow skills
- `docs/` planning and content documentation

## Contact Form
The contact form submits to:
- `https://formspree.io/f/meolqyap`

## CV
Place CV file in:
- `public/assets/YehonatanShapira-CV-Sep2025.pdf`

Then expose download links in the About/Contact pages.
