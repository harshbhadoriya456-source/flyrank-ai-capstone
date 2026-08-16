# FE-03 AI-Assisted Workflow Comparison

## Feature
The selected feature is the **User Settings Form with Field Validation**. It allows users to update their profile settings (Display Name, Email, Theme preference, Timezone, Refresh rate, and Notification preferences). The form submits JSON to a Fastify backend endpoint (`POST /settings`) with schema validation and user-facing feedback.

## Round 1 — Vague Prompt
In Round 1 (`fe-03-vague`), the AI was given the intentionally vague prompt: *"Build a settings form for this app with validation."* Without a clear specification, the AI made arbitrary domain choices—inventing fields like `timezone` and `refreshRate` while missing requested preferences like `theme`. The resulting implementation lacked accessible attributes (`aria-invalid`, `aria-describedby`), had no loading state on submission, missed edge-case validation (such as strict theme validation), and contained minimal test coverage (2 basic test cases).

## Round 2 — Structured Prompt
In Round 2 (`fe-03-structured`), the AI followed a structured **explore → plan → code → test → verify** workflow driven by a detailed technical specification. It added explicit field requirements for Display Name, Email, Theme preference, and Notifications. It implemented accessible HTML labeling, field-level error association via `aria-describedby`, visual loading states on the submit button (`disabled` state during fetch), strict payload normalization rejecting unknown keys, and comprehensive unit tests.

## Concrete Differences
1. **Architecture & Schema**: In `src/settings.ts`, Round 2 defines a strict `ThemeOption` union (`light` | `dark` | `system`) and normalizes input against an explicit allowed keys contract (`allowedSettingsKeys`).
2. **UX & Accessibility**: In `src/server.ts`, Round 2 links error containers using `aria-describedby` and dynamically updates `aria-invalid` on inputs. Round 2 also disables the submit button during submission (`Saving...`), preventing duplicate requests.
3. **Testing**: `src/settings.test.ts` expanded from 2 basic unit tests in Round 1 to 3 comprehensive test suites verifying required fields, invalid formats, invalid theme choices, excessive string lengths, and unknown key rejections.

## AI Mistake Caught
During Round 1, the AI omitted loading and disabled states on the submit button during network requests. A user clicking "Save settings" rapidly could submit duplicate payloads. In Round 2, the AI properly disabled `submitBtn` and updated its text content to `Saving...` during async processing in `src/server.ts`.

## Review Effort
* **Round 1 (Vague)**: Implementation: 12 min | Verification: 5 min | Fixing/Review: 18 min | **Total: 35 min**
* **Round 2 (Structured)**: Implementation: 15 min | Verification: 4 min | Fixing/Review: 3 min | **Total: 22 min**

The structured workflow saved 13 minutes overall by preventing rework during review.

## Conclusion
Vague prompts lead to missing features, incomplete edge-case validation, poor accessibility, and higher review effort. Providing precise specifications with clear validation rules and accessibility constraints yields robust, production-ready code with lower overall engineering time.
