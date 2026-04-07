# shapidesign.com — Bold Redesign Plan
**Inspired by wearezag.com and guts.agency**
**Frameworks: Design Principles · Layout Grid · Visual Hierarchy**

---

## What ZAG and Guts Are Actually Doing

Before prescribing anything, it's worth naming exactly what makes those sites feel the way they do. These aren't random aesthetic choices — they're systematic decisions.

**ZAG:**
- Type at display scale — headlines that occupy the full viewport width
- Radical whitespace — not padding, but deliberate emptiness as a design element
- One typographic idea per section, not many
- The grid breaks intentionally and visibly

**Guts:**
- Dark background with high-contrast elements — everything pops
- Copy that sounds like a person wrote it in a loud room: *"The bold think with their Guts"*
- Work shown at maximum scale — no thumbnails, full bleeds
- The word "bold" appears in the first sentence of their about section — it's a declared identity, not an implied one

**What your site is doing instead:**
- Safe container widths — content sits in a narrow column with lots of unused margin
- Type is appropriately sized, not aggressively sized
- Lots of elements at similar visual weight — nothing dominates
- The personality is in the writing, not the layout

The gap isn't about adding decoration. It's about **scale, commitment, and permission to take up space.**

---

## Design Principles

These are the five principles the redesign should be built on. Every decision gets tested against them.

---

### Principle 1: **Take Up the Room**
> "Your work is large-scale thinking. Your website should feel the same."

Your current site apologizes for itself spatially. The content shrinks into the center. Bold design doesn't ask for permission — it occupies the page.

**In practice:**
- Headlines fill the viewport width, not a comfortable column
- Project images bleed to the edge of the screen, not floating in padding
- Section transitions feel like physical scale shifts — something large, then something intimate, then large again
- White space is deployed in large quantities, not small gaps

**What this kills:** The feeling that someone turned the font size down to be polite.

---

### Principle 2: **One Voice Per Screen**
> "One idea at a time. At full volume."

ZAG and Guts succeed because each scroll stop has a single dominant element — one headline, one image, one statement. Your site currently tries to show multiple things at the same weight simultaneously.

**In practice:**
- Each section has one typographic anchor — everything else is secondary
- No more than two elements competing for attention in any viewport
- The hero asks one question or makes one statement — not two
- Work cards are either big or small — never all the same size

**What this kills:** The feeling of scanning a well-organized document instead of experiencing a designed space.

---

### Principle 3: **Typography IS the Design**
> "You're applying to design jobs. Your type choices are your first portfolio piece."

Both reference sites use type as the primary visual element — not as labels for images, but as the image itself. Your tagline — *"Design is never my style. It's your problem and our solution."* — is strong enough to exist at headline scale across a full viewport.

**In practice:**
- Display type at 10–20vw on key moments (viewport-relative, so it scales with screen size)
- Choose one display font that is visibly, unapologetically itself — not neutral
- Body and UI type can be quieter, but the display moments should be unmistakable
- Experiment with type that breaks the grid — rotated labels, oversized single letters, type as texture

**What this kills:** The current situation where the most interesting text is the same size as everything else.

---

### Principle 4: **Commit to Black**
> "Dark grounds everything. It makes color feel earned."

Guts runs on a near-black background. ZAG uses dramatic contrast. Your purple is distinctive, but it's sitting on white — which makes it feel like an accent rather than a foundation.

Consider a dark homepage or hero section — not necessarily the whole site, but enough to signal that you're making a deliberate choice. Dark backgrounds also make white type feel authoritative, and make your purple feel luminous rather than decorative.

**In practice:**
- Hero section: near-black or very dark background, white headline, purple as the one accent
- Work section: could flip to light to give the project images maximum contrast
- About and Contact: designer's choice — but they should feel different from each other

**What this kills:** The sense that the site could belong to any nice person who uses Figma.

---

### Principle 5: **Let the Work Breathe — or Suffocate It**
> "Either give a project a full page, or pack them together. Never the comfortable middle."

Currently every project card gets the same amount of space and attention. Guts alternates between massive featured work and tight grids. ZAG uses scale contrast to tell you which projects matter most.

**In practice:**
- Lead project (No Gatekeeping) gets a full-bleed feature — image to the edge, title at display scale
- The next two projects sit side by side at half-width
- The last three pack into a tight grid
- Scale = editorial priority. The layout is the opinion.

**What this kills:** The sense that all six projects are equally important (they aren't, and pretending they are makes them all feel lesser).

---

## Layout Grid

### Current Grid Problem
Your site uses an implicit centered column — roughly 60–70% of viewport width on desktop. This is safe and readable. It is also invisible as a design choice. No one ever looked at a website and thought "wow, what a confident centered column."

### Proposed Grid System

**Base unit:** 8px
**Columns:** 12-column grid
**Gutters:** 24px (3 base units)
**Margins:** Fluid — 4vw on desktop, 6vw on tablet, 5% on mobile

The key change isn't the grid itself — it's **permission to break it.**

---

### Grid Zones

**Full bleed** — 0 margins, content touches the viewport edge
- Use for: hero section, featured project image, section-dividing type
- This is what ZAG and Guts do most aggressively

**Container** — max-width 1400px, centered, 4vw margins
- Use for: body copy, case study text, about page content
- This is where readability lives

**Offset** — content starts at column 2 or 3, runs to the edge
- Use for: project titles over full-bleed images, pull quotes, labels
- Creates tension between the grid and the bleed

**Split** — 50/50 or 60/40 columns
- Use for: project pairs, image + text sections
- The columns don't need to be symmetrical

---

### Page-by-Page Grid Spec

**Homepage — Hero**
```
Full viewport height (100vh)
Dark background
Type: display headline, full bleed, ~15vw font size
Subtitle: body text, offset to columns 2–8
CTA buttons: bottom-left, columns 2–4
```

**Homepage — Work Section**
```
Featured project: full bleed, 80vh height
  Title overlaid, columns 2–7, bottom-aligned
  Tag: columns 2–3

Project pair: 50/50 split, full width, 60vh height
  Each title overlaid, bottom-aligned

Bottom three: equal thirds, 40vh height
  Tighter, denser — visually different from the pair above
```

**Work Page**
```
Same logic as homepage work section
Lead project: full bleed feature
Remaining five: mixed — a pair, then a tight three
```

**Project Case Study**
```
Title: display scale, full bleed or columns 1–8
First image: full bleed, 80–100vh
Text sections: container width, max 680px, centered on columns 3–10
Image gallery: alternating — full bleed / offset / split
```

**About**
```
Photo: half-width, left-aligned, tall (portrait orientation)
Copy: right half, columns 7–12
What/Why/How: full width, one per scroll beat, large type
```

**Contact**
```
Full viewport height
One large headline: "Let's talk." — display scale
Form below, container width, minimal
```

---

## Visual Hierarchy

### Current Hierarchy Problem
Everything on your site is roughly the same visual weight. The navigation, the project titles, the body copy, the tags — they exist in a narrow band of scale. Nothing is dramatically larger or smaller than anything else. This creates a calm, organized feeling, but not a memorable one.

### The Hierarchy Stack

Define 5 levels of visual weight and use them deliberately:

| Level | Name | Use | Size |
|-------|------|-----|------|
| 1 | Statement | Full-viewport hero type, section anchors | 10–20vw |
| 2 | Display | Project titles, section headlines | 5–8vw |
| 3 | Title | Card titles, sub-headings | 24–36px |
| 4 | Body | Paragraphs, descriptions | 16–18px |
| 5 | Label | Tags, dates, captions, nav | 11–13px |

The critical insight: **Levels 1 and 5 should feel like different species.** The Statement type and the Label type should look like they come from different planets. If they look related, your hierarchy is too compressed.

---

### Specific Hierarchy Decisions

**Hero Headline**
Your tagline is currently modest. It should be the largest thing on the page by a factor of at least 5x over the body copy. At 1440px wide: roughly 160–200px font size. It should feel uncomfortably large the first time you try it. That's the right size.

**Project Titles on Cards**
Currently: moderate size, similar weight to description text
Should be: the dominant element on the card — large enough to read from across the room, with the description text visibly subordinate

**Navigation**
Currently: same visual weight as everything else
Should be: the quietest thing on the page — smallest type, lowest contrast. It's infrastructure, not content. Let the content win.

**Tags / Labels**
These should be visually quiet — uppercase, tracked out, small. They carry metadata, not meaning. They should whisper.

**The Hierarchy Rule:** If you squint at the page and can't immediately see what's most important, the hierarchy isn't working yet.

---

### Color as Hierarchy

Your purple currently appears as accent — it's used for tags, links, dates. That's fine but it disperses the color's energy across the page.

**Proposed color hierarchy:**
- Purple: **one dominant use per page section** — a single headline, a single CTA, a single graphic element. Not distributed across all tags simultaneously.
- White/light text on dark: **primary reading material** in dark sections
- Dark text on light: **case study body copy** — where you need sustained readability
- Gray/muted: **everything subordinate** — dates, tags, captions, nav items

When purple appears once per section, it becomes a signal. When it appears on every tag, it becomes noise.

---

### Motion as Hierarchy

Both ZAG and Guts use motion to reinforce what's important. Not decoration — emphasis.

**Simple motion rules:**
- **Entrance animations:** content fades and rises on scroll-into-view. Fast (200–300ms), subtle vertical offset (20px). This applies to all elements.
- **Hero type:** could have a slower, more dramatic entrance — type that assembles itself or reveals word by word.
- **Project hover states:** images scale slightly (1.02–1.05x), titles shift color or weight. This signals interactivity.
- **The one moment:** pick one transition on the whole site that is genuinely unexpected — a cursor that changes, a color that floods the screen on hover, a project title that grows. Just one. The rest stays quiet.

---

## Implementation Priority

This is a significant redesign. Do it in layers:

### Layer 1 — Type Scale (1 day)
Increase hero headline to display scale. This alone will change the feeling of the site dramatically. Everything else stays. See if it works. It will.

### Layer 2 — Dark Hero (1–2 days)
Switch the homepage hero to a dark background. Adjust type colors accordingly. Your purple will immediately feel more powerful.

### Layer 3 — Work Section Layout (2–3 days)
Implement the featured lead project at full bleed. Reorganize the remaining five into the pair + three grid. This is the highest-impact UX change.

### Layer 4 — Full-Bleed Project Images (2 days)
In case studies, let the first image run to the viewport edge. Remove the padding around it. This alone makes the work feel more serious.

### Layer 5 — Typography Overhaul (2–3 days)
Choose a new display font that has more personality. Apply the 5-level hierarchy system consistently across every page.

### Layer 6 — Motion (1–2 days)
Add scroll-triggered entrance animations. Add hover states to project cards. Pick your one unexpected moment.

---

## The Single Most Important Sentence

Your site currently respects the visitor. ZAG and Guts **occupy** the visitor.

The redesign isn't about adding things. It's about **giving yourself permission to take up more space** — typographically, spatially, editorially. Your ideas and your writing are already at the right scale. Your layout needs to catch up.

---

*Redesign plan prepared March 2026. References: guts.agency, wearezag.com (how-we-zag page), shapidesign.com.*
