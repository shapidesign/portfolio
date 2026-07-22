# shapidesign.com — Full Redesign Spec
### UX Review · Design Principles · Experience Map · Implementation Guide

> Grounded in: /design-principles · /experience-map  
> Inspired by: dousanmiao.com · toan.framer.website  
> Built for: Yehonatan Shapira — visual communication designer, Rishon Le-Zion

---

## Part 0 — Honest Diagnosis

### What's Working
- The hero typography concept is genuinely distinctive — the broken-word lockup is memorable
- Star motif as a theme device has real potential
- Project writing is strong — the *Misfit Market* brief is excellent, *Keeping It Clean* is clear
- The work itself is good. The frame around it isn't yet earning it.

### What Reads as AI-Built (and Why)
These are the specific tells — each one fixable:

| Signal | Why it reads generic | Fix |
|---|---|---|
| Nav: Home / Work / About / Contact — horizontal, centered | Every Webflow template does this | Left-align nav, remove "Home," add a functional detail |
| Project cards: just a title + stacked images | No hierarchy, no status, no descriptor | Add a proper 3-layer card system |
| Project pages: subtitle → image gallery → text block | This is the default CMS layout | Restructure with a cinematic opener + sectioned narrative |
| Tag pills (Package Design · Sustainable · Brand Identity) | Look like Notion tags, not editorial choices | Replace with a single bold discipline line |
| "Previous / Next project" footer | Generic pagination | Replace with a contextual "next" card with a reason to click |
| Body text is one paragraph dump | No hierarchy inside the writing | Break into problem / approach / result sections |
| Image gallery is just a grid | No pacing, no storytelling | Sequence images as a visual argument |
| "Back to work / Start a project" footer | Template footer copy | Make it yours — one voice, one CTA per page |

### The Core Problem
The site has a strong concept (the star, the broken typography, the tone) but the **execution collapses into generic structure** the moment you go below the hero. The visitor gets excited by the hero and then lands in a Webflow template.

The fix isn't visual. It's **structural**. The redesign is about hierarchy, narrative, and motion — not colors.

---

## Part 1 — Design Principles

*Specific to shapidesign.com — opinionated, testable, prioritized.*

---

### Principle 01 — The Work Leads, You Follow

> "The portfolio exists to show the work. Every design decision must accelerate that encounter."

**In practice:**
- Nothing between the visitor and the first project image should require effort
- Nav, intros, and metadata are servants — not equals — to the visual work
- Project pages open on impact, not on context

**Counter-example:** A hero that spends 400px on your name before anything visual. Cut it.

**Test:** Can a visitor reach the first project image within one scroll or two clicks from any page?

---

### Principle 02 — One Voice, All the Way Down

> "The typography-forward tone established in the hero must survive the entire site."

**In practice:**
- The informal, confident copywriting in the hero (`designisnevermystyle.itsyourchallengeandoursolution`) must echo in project titles, descriptions, and even the contact page
- No template copy anywhere. Nothing that could appear on any other portfolio.
- CTAs are written in your voice, not in convention ("Start a project" → "Let's make something")

**Counter-example:** Strong hero voice, then "Package Design · Sustainable · Brand Identity 2024" as pill tags. The voice breaks.

**Test:** Read the site aloud. Does it sound like one person or does it shift registers?

---

### Principle 03 — Stars Don't Decorate, They Anchor

> "The star motif is the site's visual signature — use it precisely, not liberally."

The star is already your logo, your favicon, and your visual character. The risk is overuse turning it into wallpaper.

**In practice:**
- The star appears in three specific contexts only: navigation logo, section transitions, and as a divider between project metadata items
- It should feel like punctuation — rare enough that you notice it
- The star rotates 45° on hover where it appears — the only animation it needs

**Counter-example:** Stars scattered as background decoration or repeated in every card. Noise, not signature.

**Test:** Count the stars on any one page. If you can see more than 3 without scrolling, reduce.

---

### Principle 04 — Show the Thinking, Not Just the Output

> "A portfolio without process is a catalog. Process is what separates a designer from a decorator."

**In practice:**
- Every project page must answer: What was the challenge? What did you decide and why? What does it look like?
- The constraint, the insight, or the reframe is as important as the final image
- One sentence that describes the design decision — not the client brief

**Counter-example:** "My work with clean includes Package design, business presentation and instructional brochures." This describes deliverables, not thinking.

**Test:** After reading a project page, can the visitor say: "The interesting design decision here was ___"?

---

### Principle 05 — Motion Has a Budget

> "Every animation earns its place or it doesn't run. The site moves with intention, not decoration."

One curve, site-wide: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — physical, settling.

**In practice:**
- Page load: hero text staggers in (one time, never repeats)
- Cards: lift + image scale on hover (together, not independently)
- Project page: first image parallaxes on scroll — nothing else does
- The star: 45° rotation on hover, nowhere else
- That's the entire motion budget. Spent.

**Counter-example:** Scroll animations on every section. Hover effects on every element. Motion as decoration rather than emphasis.

**Test:** List every animation on the page. If the list has more than 5 items, cut the least impactful ones.

---

### Principle 06 — Honest About What Exists

> "Missing or unavailable work is shown as present-but-quiet, not hidden."

Student work is labeled. Concept work is labeled. Work in progress is labeled.

**In practice:**
- Status tags replace the year as the primary metadata marker
- Status vocabulary: `DELIVERED` · `SELF-INITIATED` · `STUDENT WORK` · `IN PROGRESS` · `CONCEPT`
- NDA work: blurred image, lock mark, discipline visible
- No pretending. The visitor trusts you more for it.

**Test:** Does every project card tell the truth about what kind of work it is?

---

## Part 2 — Experience Map

*Who visits, why, what they need at each moment.*

---

### The Visitor

Not one type — three distinct journeys happening on the same site:

**A — The Potential Client** (agency, startup, brand)
Arrives via LinkedIn or referral. Has 90 seconds. Needs: proof of range, evidence of thinking, a frictionless path to contact.

**B — The Peer Designer** (colleagues, students, competitors)
Arrives via Instagram, Behance, or word of mouth. Interested in process and taste. Needs: honesty, specificity, something worth learning from.

**C — The Recruiter / Hiring Manager**
Arrives from a job application link. Scans for category + quality + communication. Needs: fast orientation, clear discipline, professional tone.

One site, three valid paths. The redesign must serve all three without optimizing for only one.

---

### Phase Map

```
[ARRIVE] → [ORIENT] → [EXPLORE] → [DECIDE] → [ACT]
```

---

#### Phase 01 — ARRIVE
*"Where am I and is this worth my time?"*

**Touchpoint:** Hero section  
**Time budget:** 4 seconds  
**User actions:** Read name, read headline, scan visual

**Current pain:** The hero works — the typography is strong and distinctive. ✓

**One improvement:** Add a single line below the headline that does orientation work:

```
Visual communication — branding · digital product · experimental type
```

Small. Muted. Tells the three peers which category this is without breaking the hero's energy.

**Emotion:** Curiosity → "this is unusual"  
**Success signal:** They scroll down instead of back.

---

#### Phase 02 — ORIENT
*"What kind of work does this person do?"*

**Touchpoint:** Project cards / Selected Work section  
**Time budget:** 15–30 seconds  
**User actions:** Scan card titles + images, read status tags, decide which project to open

**Current pain:** Cards have no hierarchy. All projects look equally important. There's no fast way to understand range (branding vs. product vs. experimental). The year alone as metadata tells you almost nothing.

**Redesigned card anatomy:**

```
[STATUS TAG]              ← small-caps, muted — DELIVERED / STUDENT WORK / CONCEPT
[Project Image]           ← fills card, scales 1.03 on hover
[★  Project Name]         ← star as bullet, display font, ~20px
[One-line descriptor]     ← what it did, not what it is — 12px, muted, italic
[Discipline]              ← single word right-aligned — BRANDING / PRODUCT / TYPE
```

**Emotion:** Recognition — "I understand what I'm looking at"  
**Success signal:** They open a project, not the generic Work page.

---

#### Phase 03 — EXPLORE
*"Tell me about this specific project."*

**Touchpoint:** Project pages  
**Time budget:** 2–5 minutes  
**User actions:** Read the brief, look at images, understand the thinking

**Current pain (detailed):**

1. **The opener is weak.** Every project page opens with a small subtitle line ("Designs for The Clean Dot"), then a big title, then a paragraph, then images. The visual work doesn't appear until you've read. Backwards.

2. **The body text is a wall.** One paragraph with bold phrases. No sections, no pacing, no visual hierarchy inside the text.

3. **Images have no sequence logic.** They appear in a grid without any editorial decision about which one should be first, which should be largest, which tells the story.

4. **The tag pills are doing nothing.** "Package Design · Sustainable · Brand Identity · 2024" — this metadata is present but invisible because it has no visual weight or purpose.

5. **Navigation at the bottom is template defaults.** "←Previous project / Next project→" with no reason to click.

**Redesigned project page structure:**

```
─────────────────────────────────────────────
OPENER (full-width, cinematic)
  [Project title — large, display font]
  [One-line challenge statement — italic]
  [Status · Discipline · Year — inline, muted]
  [Hero image — full bleed, slight parallax on scroll]
─────────────────────────────────────────────
THE CHALLENGE (narrow column, left-aligned)
  [One paragraph — the problem, the constraint, 
   or the reframe. What made this interesting.]
─────────────────────────────────────────────
THE WORK (editorial image layout)
  [Alternating: full-bleed image → 2-column image grid]
  [Caption beneath key images — 1 sentence max]
  [No uniform grid. Images sized by importance.]
─────────────────────────────────────────────
THE DECISION (narrow column)
  [One paragraph — the key design choice and why.
   This is the process moment. Keep it honest.]
─────────────────────────────────────────────
NEXT PROJECT (full-width card)
  [Next project image — blurred background]
  [★ Next project name]
  ["What it was about" descriptor]
  [→ View project]
─────────────────────────────────────────────
```

**Emotion:** Engagement → "I understand how this person thinks"  
**Success signal:** They read past the images into the text.

---

#### Phase 04 — DECIDE
*"Is this the right person for what I need?"*

**Touchpoint:** About page + Contact page  
**Time budget:** 60 seconds  
**User actions:** Read bio, check discipline fit, find contact

**Current pain:** About page not reviewed in full, but the bio on the homepage is strong: "good design starts by understanding the challenge, not the tool." Keep that energy — don't water it down on the About page with a résumé-style format.

**Redesigned About page principle:**
- One photograph (not a headshot — a working photo or a photo that says something)
- Three-paragraph structure: who I am · how I work · what I'm doing now
- No skills list. No tools list. The work shows the skills.
- One statement about working in Israel / Rishon — not hidden, not prominent. Just honest.

**Emotion:** Trust → "this person knows what they're doing"

---

#### Phase 05 — ACT
*"I want to get in touch."*

**Touchpoint:** Contact page + email  
**Time budget:** 30 seconds  
**User actions:** Write or copy email address, send message

**Current pain:** "Let's Collaborate" is the CTA everywhere. It's fine. But nothing on the contact page gives a reason to reach out *right now*.

**One small fix:** Add a line that signals current availability.

```
Available for new projects — branding, product design, experimental work.
→ shapira97@gmail.com
```

**Emotion:** Confidence → "this is the right moment to reach out"

---

## Part 3 — Implementation Spec

### Typography

Keep what you have — the broken-word headline is the site's personality.  
Extend the rule: **display font for all project titles, all section headers, all CTAs.**  
Body text in a different weight of the same family, or a clean serif for contrast.

The star `★` as typographic punctuation in project titles — not as a decoration but as a visual bullet, part of the text flow.

---

### Color System

```css
:root {
  --ink:        #1A1A18;   /* near-black — all body text */
  --paper:      #F7F4EF;   /* warm white — background */
  --muted:      #8A8680;   /* metadata, captions, tags */
  --accent:     #1A1A18;   /* same as ink — no color accent */
  --star:       #1A1A18;   /* the star is black, never colored */
  --ease:       cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

**The logic:** No accent color. The star motif works because it's pure form — adding color to it makes it decorative. The contrast comes from type weight, scale, and spacing — not hue.

---

### Motion Budget (Complete List)

```
1. Hero text:         stagger in on page load — 80ms per line, once only
2. Nav star:          rotates 45° on hover, 200ms
3. Project cards:     lift (shadow) + image scale(1.03) on hover, together
4. Card arrow ★→:     shifts to diagonal ↗ on hover, 220ms
5. Project hero img:  parallax on scroll — translateY at 0.15 speed ratio
6. Page transitions:  fade out → fade in, 300ms (if your CMS supports it)
```

That's six. No more.

---

### Project Card — Full CSS Spec

```css
.project-card {
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.25s var(--ease);
  cursor: pointer;
}

.project-card:hover {
  box-shadow: 0 16px 48px rgba(26, 26, 24, 0.10);
}

.project-card img {
  width: 100%;
  transition: transform 0.4s var(--ease);
}

.project-card:hover img {
  transform: scale(1.03);
}

.status-tag {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
  font-weight: 500;
}

.project-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.project-descriptor {
  font-size: 13px;
  color: var(--muted);
  font-style: italic;
  margin-top: 4px;
  line-height: 1.4;
}

.project-arrow {
  display: inline-block;
  transition: transform 0.22s var(--ease);
}

.project-card:hover .project-arrow {
  transform: rotate(-45deg) translate(3px, -3px);
}
```

---

### Project Page — Body Text Rewrite Template

**Current (Keeping It Clean):**
> "As a sustainable lifestyle brand, The Clean Dot requires a visual identity that communicates both purity and modern efficiency..."

**Redesigned structure:**

```markdown
## The Challenge
Cleaning products hide under the sink. The Clean Dot makes products
that belong on the counter — but the packaging had to earn that place.

## The Approach
Rather than borrowing from the wellness aesthetic (soft, pastel, botanical),
the identity leans into precision and clarity. The packaging is confident
enough to be displayed, humble enough to serve the product.

## The Work
[images]

## The Decision
The choice to use a limited black-and-white palette on the packaging
was a deliberate refusal to compete with the colors of the products
themselves. The design gets out of the way.
```

Apply this template to every project. Three sections. No more. Each one is a paragraph, not a bullet list.

---

### The Descriptor Rewrite — All Projects

| Project | Current descriptor | Redesigned descriptor |
|---|---|---|
| Keeping It Clean | "Packaging system for The Clean Dot..." | *Making cleaning products earn their place on the counter* |
| The Misfit Market | "Research and brand identity for a concept sustainable grocery..." | *Reframing waste as an identity before it became fashionable* |
| Animal to Logo | *(not seen)* | *From a living form to a mark that lasts* |
| No Gatekeeping | *(not seen)* | *Design as a public service — information without gatekeepers* |

The pattern: **verb + reframe + stakes.** Not what it is. What it does.

---

### Navigation — Minimal Revision

```
Current:  [Logo]  Home · Work▾ · About · Contact  [EN] [Menu]

Redesigned:
[★ Yehonatan Shapira]                    [Work · About · Contact]
```

- Remove "Home" — the logo is the home link
- Remove language toggle from nav — move to footer if needed
- Remove hamburger "Menu" text — the nav is already visible on desktop
- Left-align logo, right-align links — the oldest, most legible nav pattern

---

### Work Page — Year as Section Marker

Add one typographic marker above the project grid:

```
'23 — '26
```

80px, weight 200, opacity 0.12, full-width bleed behind the grid.  
It's architectural — it tells the visitor this is a body of work across time, not a one-off showcase.

---

## Part 4 — What Not to Change

| Element | Why it stays |
|---|---|
| Hero broken-word typography | This is the site's personality. Don't touch it. |
| Star motif | Strong signature. Just use it less. |
| Project writing tone | The Misfit Market brief is excellent. Keep this voice. |
| Dark background on hover / nav | Creates depth without adding color |
| The site's overall restraint | It's right. Don't add color or illustration to solve problems. |

---

## Summary — Priority Order

**Do first (biggest impact, least effort):**
1. Rewrite all project descriptors using the verb/reframe/stakes formula
2. Add status tags to all project cards
3. Restructure project page body text into three named sections
4. Fix the nav (remove "Home," left/right alignment)

**Do second (structural improvements):**
5. Redesign project card anatomy with full 5-layer hierarchy
6. Replace image galleries with sequenced editorial layouts
7. Rewrite the "next project" footer on every project page

**Do third (motion + polish):**
8. Implement the 6-item motion budget consistently
9. Add the year marker to the Work page
10. Revise the About page with the 3-paragraph structure

---

> The site already has a strong voice in the hero.  
> The job is to make the rest of the site worthy of the first impression it creates.
