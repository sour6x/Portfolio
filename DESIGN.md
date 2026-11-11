# Portfolio design system

## Official skill sources

- Anthropic: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- OpenAI: https://github.com/openai/plugins/tree/main/plugins/build-web-apps/skills/frontend-app-builder

Project-local copies live in `.agents/skills/`. No community design skills or third-party design plugins are used.

## Direction and scope

Refine the existing PCB portfolio rather than replace its established design. The signature is the text-free, animated chip and scroll-driven current. Preserve the large personal greeting, actual project imagery, SPECTER-first ordering, alternating desktop project rows, and green/copper palette.

This is a typography/readability fix within the existing design system, so use the OpenAI skill's existing-system exception to image concept generation. Existing layout and the user's approved visual requirements are the reference.

## Tokens

| Token | Value | Role |
| --- | --- | --- |
| Solder mask | `#0c1b16` | Main background |
| Board surface | `#142b21` | Supporting sections and image captions |
| Silkscreen | `#faf8ed` | Primary text |
| Reading text | `#d8e0d3` | Body copy |
| Secondary text | `#bbcbb4` | Metadata and supporting copy |
| Copper | `#efbb87` | Interactive accents and traces |

Manrope is the primary family for headings, body, navigation, and controls. IBM Plex Mono is reserved for technical metadata. Body text is 16px or larger, supporting text is generally 13px or larger, and line lengths stay below 70 characters.

## Layout

Keep all reading content left aligned. Education and toolkit retain a two-column desktop layout; projects retain alternating image placement. Collapse to one column on small screens with image before description.

```text
Desktop                        Mobile
Greeting     Animated chip     Greeting
Education    Toolkit           Animated chip
Image        Project           Education / Toolkit
Project      Image             Image / Project
Contact                        Contact
```

## Review against the brief

Retain copper traces because the user explicitly requested PCB visuals and prominent animation. Remove decorative section numbering and repeated intro labels; these do not explain engineering work. Replace vague section headings with direct descriptions. Keep motion primarily on circuitry, preserve reduced-motion support, and keep moving traces away from reading surfaces. Make text visibly larger and brighter instead of relying on glow or shadows to compensate for weak contrast.

## Accessibility and verification

Use distinct keyboard focus, sufficiently large mobile controls, readable metadata, and text surfaces that remain clear over background traces. Measure contrast using the actual token pairs. Verify the greeting, section hierarchy, project order/layout, palette, body sizing, mobile overflow, menu, project links, resume path, and reduced motion in the browser. A successful build alone is not visual verification.

## Readability pass: verification ledger

The existing user-approved PCB layout was the reference. This was an existing-system refinement rather than a new image concept. Browser/IAB screenshots were reviewed at the current 782px viewport, 390 × 844, and 1440 × 1000. Temporary viewport overrides were reset afterwards.

| Comparison point | Earlier issue | Final verification |
| --- | --- | --- |
| Hero copy | Small muted supporting text and redundant eyebrow | Greeting preserved; eyebrow removed; supporting copy 16px |
| Project copy | Descriptions as small as 12–13px | Computed description size 16px at desktop and mobile |
| Metadata | Frequent 7–10px labels | Tags 13px; toolkit copy 14px; metadata generally 13px |
| Contrast | Low-contrast secondary green | Text token ratios on `#142b21`: primary 14.11:1, body 11.11:1, secondary 8.81:1, copper 8.68:1 |
| Project layout | Alternating layout must survive polish | Image grid column 2 on OCR and pedal; image before text on mobile |
| Mobile navigation | Menu behavior must survive typography changes | Opens, follows Projects, closes; destination is `#projects` |
| Responsive content | Larger text can create overflow | No horizontal document overflow at all three inspected widths |
| Scope and copy | Preserve the engineering story | Name, intro, education, project descriptions/order and links preserved; section headings simplified |

Intentional deviations from the old screenshot: brighter and larger text, sentence-case labels, clearer headings, removal of decorative section numbers, one fewer font family, stronger focus styling, and an SVG arrow. User-requested circuit motion and the text-free chip remain. Existing reduced-motion rules remain in the source. Contrast figures apply to the specified text/surface pairs; they are not a claim of a complete accessibility certification.

## Branching scroll circuit

The side rail is replaced by a connected root network in native page coordinates. A central trunk seeds left/right forks, which seed smaller twigs. Scroll position controls the illuminated length of every branch; scrolling upward retracts it. SVG masks protect text, controls, and project images. Passive scroll listeners and requestAnimationFrame batch updates; geometry is recalculated after responsive layout or font changes.

Browser verification confirmed growth changes when scrolling down and back up, multiple simultaneously active routes, 57 routes at the inspected laptop width and 85 at 390px, and no mobile horizontal overflow. Reduced-motion mode retains direct line-fill feedback while removing traveling sparks and glow. Existing chip and project animations remain unchanged.

The footer is reduced to a single centered, copper-bordered Back to top control with an upward SVG arrow. Name, copyright and tagline are removed; the contact section remains intact.

Certifications and training use a dedicated heading and six individual list entries with copper connector details and subtle dividers. The list has two columns on wider screens and one below 600px, with 16px titles. Browser checks confirmed all six entries, a single mobile column, and no overflow. The projects heading is exactly “My projects”. Contact supporting copy is “For opportunities, collaborations, or a conversation about electronics, get in touch.”
