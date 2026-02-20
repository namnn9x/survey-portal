---
name: ui-ux-feature
description: Designs and implements UI/UX improvements for survey admin and respondent flows. Use when creating or updating pages, forms, modals, tables, navigation, validation, loading/error states, accessibility, or responsive behavior.
---

# UI/UX Feature

## When to Use

- Building a new screen, modal, or complex component
- Updating user flows, especially form-heavy survey interactions
- Improving usability, visual hierarchy, accessibility, or mobile behavior

## Workflow

1. Clarify objective and constraints
- Identify primary user action and success condition.
- Confirm target context: admin flow, respondent flow, or both.
- Reuse existing components/tokens before introducing new patterns.

2. Define interaction model
- Keep one clear primary action per screen.
- Reduce steps and avoid hidden critical actions.
- Ensure labels, headings, and helper text are unambiguous.

3. Implement complete UI states
- Loading: skeleton/spinner where appropriate.
- Empty: explain why empty and next action.
- Error: human-readable message and recovery path.
- Success: clear confirmation and next step.
- Disabled: show why action is unavailable.

4. Form UX rules
- Always show visible labels; placeholders are not labels.
- Validate with actionable messages near fields.
- Preserve user input on recoverable errors.
- Prevent duplicate submission while request is in flight.

5. Accessibility baseline
- Full keyboard navigation including modal focus behavior.
- Visible focus indicators on interactive controls.
- Semantic HTML and correct ARIA where necessary.
- Sufficient color contrast and non-color status cues.

6. Responsive baseline
- Design mobile-first, then scale up.
- Avoid horizontal overflow at small widths.
- Keep primary actions reachable on narrow screens.

7. Final quality check
- Verify visual consistency with existing spacing, typography, and component patterns.
- Add concise rationale: what changed and why it improves UX.
- Provide a quick manual test checklist for key paths.

## Output Contract

When finishing a UI/UX task, return:

1. Changes made (UI + interaction behavior)
2. UX rationale (1-3 bullets)
3. Accessibility checks performed
4. Responsive checks performed
5. Manual QA checklist
