# React Bits component audit

No React Bits or shadcn tool was exposed in the available MCP tool inventory. Codex config listed node_repl and computer-use only; Claude's global MCP server list was empty, and this workspace had no `.mcp.json` or `components.json`. No configuration or secrets were changed. The official free registry URL was attempted, but `curl` failed DNS resolution; component discovery, source retrieval, installation and MCP refresh could not be verified. No component is claimed installed.

The official [React Bits Pro MCP instructions](https://pro.reactbits.dev/docs/mcp) describe shadcn MCP and require a license key and configured registries. Premium access was not verified; no attempt was made to bypass licensing. No free or premium component could be examined in this environment. Candidate categories for a later review: a subtle hero/background (performance and reduced-motion requirements), interaction cards (avoid obscuring data), and progress feedback (only reflect real work). A conventional semantic form, native navigation and local CSS were used for this prototype. There are no React Bits dependencies. Once network and a React environment are available, configure the official free `@react-bits` registry, connect shadcn MCP, restart the client, search and inspect a suitable component, then evaluate accessibility and bundle cost before installation.

## Retry on 2026-11-01
With authorized network access, the initial `SpotlightCard.json` URL returned 404. The documented variant URL `https://reactbits.dev/r/SpotlightCard-TS-TW.json` returned HTTP 200 and a registry item containing `SpotlightCard.tsx` (12,423 characters), with no listed dependencies or registry dependencies. A pointer-following spotlight is a possible landing-card effect but should be reviewed for keyboard/reduced-motion behavior and performance. It was not installed: the current frontend is not React and no MCP tool appeared in the session. This verifies registry retrieval only, not MCP connectivity, a working installation, or Pro access.

## Iteration 3
The official `SpotlightCard-TS-CSS` registry variant returned HTTP 200 and supplied a TypeScript component and CSS with no listed dependencies. Its source was incorporated into `frontend/src/components/SpotlightCard.tsx` and `SpotlightCard.css`, and used for the output feature card with ambient animation, flare and grain disabled. Its source checks reduced-motion preference; React/TypeScript build and desktop/mobile Chrome workflow passed, including rendering the desktop card. Full motion and assistive-technology audit remains outstanding. No shadcn/React Bits MCP tool was exposed and premium access was not verified.

## Iteration 4: Production Integration of React Bits Components
Four complementary, accessible React Bits components from [https://reactbits.dev/](https://reactbits.dev/) were integrated into the enterprise UI:

1. **SpotlightCard (`SpotlightCard.tsx`):**
   - **Role:** Interactive pointer-following radial illumination on key feature cards.
   - **Integration:** Featured prominently in the **Overview / Dashboard** methodology card and the **Builder** right rail output preview card.
   - **Aesthetics & Access:** Configured with emerald/teal spotlight glow (`#10b981`), reduced intensity (`0.10`), no distracting flares or grain, and graceful fallback for touch and reduced-motion environments.

2. **CountUp (`CountUp.tsx`):**
   - **Role:** Smooth cubic-bezier numerical counter transition for primary financial figures and KPI metric cards.
   - **Integration:** Used across the **Analysis Workspace** for Annualized Net Change, Proposed TCO, and One-Time Migration costs.
   - **Accessibility:** Honors `prefers-reduced-motion` media queries by immediately presenting formatted target numbers with zero animation lag; formats numbers using `tabular-nums` and standard locale separators.

3. **ShinyText (`ShinyText.tsx`):**
   - **Role:** Subtle, metallic gradient light sweep across category headings, status badges, and decision tags.
   - **Integration:** Used on the TopBar brand tagline ("A CLEARER CASE FOR CHANGE"), Overview hero eyebrow, and section headers.
   - **Accessibility:** Pure CSS keyframe implementation (`@keyframes shine`) that is completely disabled when `prefers-reduced-motion: reduce` is detected.

4. **StarBorder (`StarBorder.tsx`):**
   - **Role:** Animated perimeter light beam tracing the contour of primary call-to-action buttons.
   - **Integration:** Powers primary action buttons: "Create New Business Case" on Overview, "Build business case" on the Buyer Intake form, and "Save case" confirmation.
   - **Accessibility:** Preserves semantic HTML button behaviors, keyboard focus rings, and disables rotation animations under reduced motion.

