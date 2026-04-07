# shapidesign.com — Full Revision Spec
**Prepared for Yehonatan Shapira | March 2026**

---

## 1. Global / Site-Wide

### Navigation
- Add an **active state** to the current nav item. When on `/work`, the "Work" link should be visually distinguished — underline, color change, or weight shift. Whatever matches your design language, but it must exist.
- Ensure mobile nav **transitions smoothly** (CSS transition on the menu open/close). If it currently snaps, add `transition: opacity 0.2s ease, transform 0.2s ease`.
- No new nav items needed. Four is the right number.

### Titles
- Change `<title>` tag on every page from "Yehonatan Shapira - Designer" to something more specific per page:
  - Home: `Yehonatan Shapira — Product & Visual Designer`
  - Work: `Work — Yehonatan Shapira`
  - Each project: `[Project Name] — Yehonatan Shapira`
  - About: `About — Yehonatan Shapira`
  - Contact: `Contact — Yehonatan Shapira`

### CV Link
- Update `/assets/YehonatanShapira-CV-Sep2025.pdf` to the new CV file once it's finalized.
- This link appears in **both** the About page and the Contact page. Update both.

### Title Consistency
- Website currently says "Visual & Graphic Designer" in the `<title>` tag.
- CV now says "Product & Visual Designer".
- Align these. Recommended: **"Product & Visual Designer"** everywhere.

---

## 2. Homepage (`/`)

### CTA Hierarchy
**Problem:** "View Work" and "Let's Collaborate" are visually equal. One should lead.

**Fix:**
- "View Work" → **primary button**: filled, full color, your purple.
- "Let's Collaborate" → **secondary button**: outlined or text-only, lower visual weight.

This tells the visitor what you want them to do first.

### Work Grid — Editorial Curation
**Problem:** The homepage shows all 6 projects, making it a duplicate of the Work page.

**Fix:** Show only your **3 strongest projects** on the homepage. Suggested selection:
1. No Gatekeeping
2. Keeping It Clean
3. The Misfit Market

Keep the "See all projects →" link. The homepage should feel like a curated intro, not an index.

### Project Card Subtitles
Update all project card subtitles to the new versions (see Section 6 below).

### "Student Work" Tag
Remove the "Student Work" tag from all **card views** (homepage and Work page grid). Keep it inside the individual case study if relevant. The tag signals "this is lesser work" before anyone has seen it.

---

## 3. Work Page (`/work`)

### Project Order
Reorder projects to lead with credibility, close with personality:

| New Order | Project | Why |
|-----------|---------|-----|
| 1 | No Gatekeeping | Systems thinking + independent dev |
| 2 | Keeping It Clean | Real client, real deliverable |
| 3 | The Misfit Market | Strong concept, sustainable angle |
| 4 | Animal to Logo | Craft and reduction |
| 5 | Digital Handprint | Experimental, shows coding ability |
| 6 | Small World Problems | Clever last impression, keeps curiosity |

### Remove "Student Work" Tags from Cards
Same as above — strip from card view, keep inside case study only.

---

## 4. Project Pages — Structural Fixes (All Projects)

### Consistent Structure
Apply this structure uniformly across all 6 case studies:

```
[Subtitle — one punchy line]
[Project title]
[One-paragraph description]
[Tags] [Year]
[Visit project link if applicable]

--- images / interactive element ---

THE BRIEF
[1-2 sentences: what was asked or what problem existed]

THE INSIGHT / APPROACH
[What you noticed or decided, and why]

THE SOLUTION
[What you made, and the key design decisions]

THE RESULT (if applicable)
[Outcome, reception, or what it's used for now]
```

Currently: No Gatekeeping and Small World Problems follow this well. The Misfit Market, Animal to Logo, Digital Handprint, and Keeping It Clean are inconsistent. Standardize all six.

### Image Captions
Add a **one-line caption** beneath each image in every gallery. Examples:
- "Final packaging for the laundry strips, ready for retail"
- "Stork logo with wings shaped as an open book"
- "Color system — primary purple, neutral grays, warm accent"

Captions cost 10 minutes and double the value of the visual work for someone who doesn't know your context.

### Interactive Elements — Signposting
**No Gatekeeping** and **Digital Handprint** have live interactive elements embedded in the page. Add a visible prompt above each one:

For Digital Handprint:
> "Move your cursor across the canvas below."

For No Gatekeeping (if the live site is embedded):
> "Explore the directory →" with an arrow or button.

Visitors won't interact with something they don't know is interactive.

### Next Project Navigation
Add a clear **"Next project →"** CTA at the bottom of every case study, before the footer. The current back/next arrows between projects exist but are visually subtle. Elevate them — visitors who reach the end of a case study are your most engaged audience. Don't let them dead-end.

Suggested treatment: full-width card or banner at the bottom showing the next project's name and thumbnail.

---

## 5. About Page (`/about`)

### Add a Photo
The About page is the most personal page on the site and it has no photo. Add the same photo from your CV. Place it either:
- At the top beside your name, or
- As a full-width or half-width image before the copy

A face builds trust faster than any paragraph.

### Deepen the Copy
The What/Why/How structure is good but the answers are currently generic.

**Current:**
> "Great design starts with asking the right questions."

**Better — make it specific to you:**
> "My first instinct on any brief is to ask what's *not* being said. In the Air Force, the brief was always the mission objective — but the real question was always what the team actually needed. I bring that same habit to design."

Each answer should contain **one concrete example or story** that only you could write. Generic statements can come from anyone; specifics prove it.

### Skills Section
Consider adding **"Copywriting"** explicitly — it's listed on your site already but not on the CV, and your writing voice is genuinely one of your differentiators.

---

## 6. Updated Project Subtitles (All Pages)

| Project | Old Subtitle | New Subtitle |
|---------|-------------|--------------|
| Small World Problems | "A small change can make all the difference" | "The font that tricks the system — by design" |
| The Misfit Market | "Embracing the Imperfect" | "One third of produce is thrown away. This brand is for the other side of that statistic." |
| Animal to Logo | "Merging two worlds" | "From creature to concept — reduction as a design method" |
| Digital Handprint | "A moving self-portrait" | "What if your cursor was a confession?" |
| Keeping It Clean | "Designs for The Clean Dot" | "Cleaning products that deserve to be on the counter, not under it" |
| No Gatekeeping | "The Design Student's Survival Kit" | "Everything seniors know and juniors have to figure out the hard way — in one place" |

---

## 7. Contact Page (`/contact`)

### Remove the "Website" Field
The form currently has: Name, Email, Message, **Website**.

Remove Website. Your visitors are recruiters or clients — neither needs to submit their website to reach you. Every extra field reduces conversion.

### Update the Button Label
Change "Send message" → **"Let's talk"** or **"Send it"**

Match your tone. "Send message" is generic form language.

### Add a Success State
After form submission, the visitor needs to know it worked. Add either:
- An inline success message replacing the form: "Got it — I'll be in touch."
- Or a redirect to a simple `/thanks` page.

Without this, people submit twice or assume it failed.

### Update the CV Link
The Contact page links to `YehonatanShapira-CV-Sep2025.pdf`. Update this once the new CV is ready.

---

## 8. Typos & Copy Fixes

These appear across the site and CV. Fix them all:

| Wrong | Correct |
|-------|---------|
| enviromental | environmental |
| oppurtunity | opportunity |
| "Visual & Graphic Designer" (site title tag) | "Product & Visual Designer" (align with CV) |

---

## 9. Priority Order

If you're doing this in phases, here's the suggested order by impact:

1. **Immediate** — Fix typos, update CV link, fix CTA hierarchy on homepage
2. **This week** — Update all project subtitles, reorder Work page, remove "Student Work" tags from cards
3. **Next** — Add photo to About, deepen About copy, add image captions, add success state to contact form
4. **Polish** — Active nav state, next-project navigation cards, standardize case study structure

---

*Document prepared in March 2026. All content recommendations are based on live review of shapidesign.com.*
