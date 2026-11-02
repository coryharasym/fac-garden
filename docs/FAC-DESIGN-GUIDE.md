# FAC Digital Garden — Design & Voice Guide

**Status:** Project design direction supplied by the project owner on 2026-11-02.  
**Scope:** FAC Digital Garden site, components, navigation, content summaries and future learning interfaces.  
**Mission:** **Joining Jesus in the renewal of all things.**

This is the standing reference for future design and content work in this repository. Apply it consistently without treating the prototype as an officially authorized FAC publication.

## 1. Visual identity

### Typography
- **Noto Sans** is the default font for **all** user interface text: headings, body copy, menus, buttons, labels, search, form elements and metadata.
- Prefer a font stack like `"Noto Sans", system-ui, sans-serif`.
- Support international readers and multiple writing systems. Load only needed font subsets/weights where practical and specify `font-display: swap` to avoid blocking content.
- Keep type sizes and line heights comfortably readable on narrow mobile screens.

### Colour
Use the exact brand accents supplied by FAC:

| Token | Colour | Hex | Use |
| --- | --- | --- | --- |
| FAC Green | Green | `#87D37C` | Primary accent, growth motifs, selected states |
| FAC Blue | Blue | `#00B2E2` | Secondary primary-brand accent, links, renewal motifs |
| Charcoal Grey | Neutral (proposed token) | `#252D30` | Body text, UI labels, text on brand-colour fills |
| Light Grey | Neutral (proposed token) | `#F3F5F6` | Section backgrounds, subtle blocks and separators |
| White | Neutral | `#FFFFFF` | Default reading surface and content cards |

**Colour accessibility:** The exact green and blue are bright; **don't put white normal-size text on solid FAC Green or FAC Blue**. Example contrast ratios are about 1.80:1 for green/white and 2.48:1 for blue/white. Charcoal text on green is approximately 7.78:1 and on blue about 5.66:1. Use charcoal lettering on these fills or a separately tested darker shade when white lettering is required; don't silently change the supplied brand accent values.

- Ensure normal text reaches **WCAG AA 4.5:1** contrast, and large text/UI components meet their applicable contrast requirements.
- Don't communicate meaning by colour alone; include text, borders, labels or icons.

### Layout and shape
- Simple, clean, uncluttered layout with generous whitespace and padding.
- Use restrained, organic **arc / swoop** motifs for select header edges, hero sections, or buttons to echo FAC brand elements.
- Keep organic forms **subtle**; content, labels and accessible targets take precedence over decoration.
- Use clear hierarchy, short readable line lengths, obvious navigation and consistent spacing.
- Prefer familiar navigation labels: **Home, First Steps, Explore Topics, Blog & Stories, Library**.

### Mobile-first, accessible and fast
- Design for the smallest screens first, with comfortable touch targets and visible keyboard focus.
- Keep JS and page weight low, avoid unnecessary animation, and respect reduced-motion settings.
- Prefer responsive images with meaningful alt text; avoid large background imagery and autoplay media.
- Make navigation and search usable with keyboard and screen readers.
- Support readers with limited bandwidth, older mobile devices, or expensive data connections.
- Retain links to original FAC content rather than duplicating long copyrighted texts.

## 2. Voice and content

- Write in a **welcoming, positive, Jesus-centred** voice aligned with FAC's mission: *Joining Jesus in the renewal of all things*.
- Sound approachable and conversational. Use natural contractions such as **“You'll”**, **“We're”**, and **“Let's”**.
- Prefer plain language to insider terms or unexplained church abbreviations.
- Avoid ornate, flowery, overly formal, or abstract wording.
- Give one clear next step at a time. Use **specific, action-oriented calls to action** like **“Start Lesson”**, **“Explore First Steps”**, **“Read the Story”**, or **“Join Next Step”** where they accurately reflect the action.
- Ensure text makes sense to both FAC attendees and visitors exploring Christian faith for the first time.
- Honour international readers: favour clarity and translatability over idioms; explain unfamiliar concepts.

### Example microcopy
| Avoid | Prefer |
| --- | --- |
| Click here | Explore First Steps |
| Learn more | Read Dawn's Story |
| Access content resources | Browse Teaching & Stories |
| Initiate lesson module | Start Lesson |
| FAC newcomers may enrol | New here? Explore Alpha |

## 3. Product-specific guidance for the garden

- Lead with **First Steps**, then topic exploration and resource browsing.
- Distinguish **original FAC articles and resources** from **garden notes** contributed by an independent editor.
- Prioritize discovery by topic and a helpful search experience over technical Quartz folder structures or graph UI.
- Preserve Quartz backlinks and graph exploration as optional features for deeper reading.
- Keep source URLs, attribution and descriptive summaries with the original material.
- Preserve existing URLs during design updates, or supply intentional redirects.
- Since this repository is public and the garden has been described as a prototype, don't imply official FAC endorsement without authorization.

## 4. Implementation checks

Before publishing a UI change:
- [ ] All UI text uses Noto Sans or a sensible system fallback.
- [ ] Both exact brand accent colours are used meaningfully.
- [ ] Normal text/background combinations satisfy contrast checks.
- [ ] Navigation works on mobile, keyboard and screen-reader flows.
- [ ] Swoop/arc shapes don't interfere with reading or tap targets.
- [ ] Copy uses welcoming, direct, Jesus-centred language.
- [ ] Buttons and links clearly communicate the destination/action.
- [ ] Home, First Steps, Blog & Stories, topic hubs and Library remain easy to find.
- [ ] No unnecessary images, scripts or fonts increase load cost.
- [ ] The Quartz GitHub Actions build succeeds.

**Note:** Charcoal and light-grey hex tokens above are initial implementation suggestions because the original design brief specified the neutral colours by name, not hex code. The green and blue hex values are fixed by the brief.
