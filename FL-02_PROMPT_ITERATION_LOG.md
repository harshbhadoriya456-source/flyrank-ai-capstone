# FL-02 — Prompting Fundamentals on Real Tasks

## Task
The task selected from our capstone engineering audit is **Building a production-ready Fastify form validation module with TypeScript types and accessible error handling for user settings**.

* **Task Target**: Validate user settings payloads (`displayName`, `email`, `theme`, `timezone`, `refreshRate`, `notifications`) on both client and Fastify backend server.
* **Intended Audience**: Frontend & backend TypeScript developers maintaining the `flyrank-ai-capstone` repository.
* **Successful Result**: A self-contained TypeScript module export containing strict type definitions, an `allowedSettingsKeys` array to catch unknown fields, a `validateSettings` function with field-level error messages, and a `normalizeSettingsInput` sanitizer function.
* **Available Context**: Repository structure uses Fastify v4, TypeScript v5.4, ESLint, and Vitest.

---

## Baseline — Naive Prompt

### Technique
None

### Prompt
```text
Build a settings form validation script for Fastify.
```

### Output
> Representative excerpt — not the complete output.
>
> ```javascript
> function validate(data) {
>   const errors = {};
>   if (!data.email || !data.email.includes('@')) {
>     errors.email = 'Invalid email';
>   }
>   if (!data.name) {
>     errors.name = 'Name is required';
>   }
>   return errors;
> }
> module.exports = { validate };
> ```

### What Changed and Why
Baseline naive prompt created with zero context, role, constraints, or format.

### Observed Output Difference
N/A (this is the baseline).

### What Still Failed
The output was plain JavaScript (not TypeScript), lacked type definitions, missed required fields (`theme`, `timezone`, `refreshRate`), had no strict string length checks, and did not check for unknown payload keys.

---

## Iteration 1 — Role Assignment

### Technique
Role assignment

### Prompt
```text
You are a senior TypeScript frontend and API engineer. Build a settings form validation script for Fastify.
```

### Output
> Representative excerpt — not the complete output.
>
> ```typescript
> export interface SettingsPayload {
>   name: string;
>   email: string;
> }
> 
> export function validateSettings(payload: SettingsPayload) {
>   const errors: Record<string, string> = {};
>   if (!payload.name || payload.name.trim().length < 2) {
>     errors.name = "Name must be at least 2 characters.";
>   }
>   if (!payload.email || !payload.email.includes("@")) {
>     errors.email = "Valid email is required.";
>   }
>   return errors;
> }
> ```

### What Changed and Why
Added a role persona (`You are a senior TypeScript frontend and API engineer.`) to force the model to adopt engineering best practices, TypeScript syntax, and proper code structuring.

### Observed Output Difference
The model switched from JavaScript to TypeScript, exported functions and interfaces, and added input trimming before validation.

### What Still Failed
The prompt still lacked context about the actual settings form fields (`theme`, `refreshRate`, `timezone`, `notifications`), so the model invented a generic `SettingsPayload` interface.

---

## Iteration 2 — Context and Motivation

### Technique
Context and motivation

### Prompt
```text
You are a senior TypeScript frontend and API engineer. Build a settings form validation script for Fastify.

Context & Motivation: We are building a capstone application settings form where users update Display Name, Email, Theme preference (light/dark/system), Timezone, Refresh rate, and Notifications. The validation must run on both client and server to prevent invalid data ingestion and ensure a smooth, reliable user submission flow.
```

### Output
> Representative excerpt — not the complete output.
>
> ```typescript
> export type Theme = "light" | "dark" | "system";
> 
> export interface SettingsFormValues {
>   displayName: string;
>   email: string;
>   theme: Theme;
>   timezone: string;
>   refreshRate: number;
>   notifications: boolean;
> }
> 
> export function validateSettings(values: Partial<SettingsFormValues>) {
>   const errors: Record<string, string> = {};
>   if (!values.displayName || values.displayName.trim().length < 2) {
>     errors.displayName = "Display name must be at least 2 characters.";
>   }
>   if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
>     errors.email = "Invalid email format.";
>   }
>   if (!["light", "dark", "system"].includes(values.theme || "")) {
>     errors.theme = "Invalid theme preference.";
>   }
>   if (!values.timezone) {
>     errors.timezone = "Timezone required.";
>   }
>   if (typeof values.refreshRate !== "number" || values.refreshRate < 1 || values.refreshRate > 1440) {
>     errors.refreshRate = "Refresh rate must be 1-1440 minutes.";
>   }
>   return errors;
> }
> ```

### What Changed and Why
Added task context and motivation detailing all six form fields and explaining why client/server validation consistency is needed.

### Observed Output Difference
The output incorporated all six real fields (`displayName`, `email`, `theme`, `timezone`, `refreshRate`, `notifications`), added a proper email regex, and validated the `Theme` union type.

### What Still Failed
Error message text was inconsistent, unknown extra keys were ignored (allowing state corruption), and no input normalization function was provided.

---

## Iteration 3 — Few-Shot Examples

### Technique
Few-shot examples

### Prompt
```text
You are a senior TypeScript frontend and API engineer. Build a settings form validation script for Fastify.

Context & Motivation: We are building a capstone application settings form where users update Display Name, Email, Theme preference (light/dark/system), Timezone, Refresh rate, and Notifications. The validation must run on both client and server to prevent invalid data ingestion and ensure a smooth, reliable user submission flow.

Few-Shot Example:
Input payload: { displayName: "J", email: "invalid", theme: "unknown" }
Output errors object: { displayName: "Display name must be 2 to 50 characters.", email: "Please enter a valid email address.", theme: "Please select a valid theme preference (light, dark, or system)." }
```

### Output
> Representative excerpt — not the complete output.
>
> ```typescript
> export function validateSettings(values: Record<string, unknown>) {
>   const errors: Record<string, string> = {};
>   
>   const displayName = typeof values.displayName === "string" ? values.displayName.trim() : "";
>   if (!displayName || displayName.length < 2 || displayName.length > 50) {
>     errors.displayName = "Display name must be 2 to 50 characters.";
>   }
>   
>   const email = typeof values.email === "string" ? values.email.trim() : "";
>   if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
>     errors.email = "Please enter a valid email address.";
>   }
>   
>   const theme = typeof values.theme === "string" ? values.theme.trim() : "";
>   if (!["light", "dark", "system"].includes(theme)) {
>     errors.theme = "Please select a valid theme preference (light, dark, or system).";
>   }
>   
>   return errors;
> }
> ```

### What Changed and Why
Provided a few-shot input/output pair demonstrating exact error string formatting and field error key mapping.

### Observed Output Difference
Error messages matched the required user-facing wording exactly, and validation safely handled `Record<string, unknown>` instead of assuming typed inputs.

### What Still Failed (Honest Non-Improvement)
*This technique had minimal impact on overall code architecture.* While the few-shot example improved error string precision, it did not prompt the model to structure the file into clean logical exports (types, validation, normalization) or handle unknown extra payload keys.

---

## Iteration 4 — Output Structure

### Technique
Output structure

### Prompt
```text
You are a senior TypeScript frontend and API engineer. Build a settings form validation script for Fastify.

Context & Motivation: We are building a capstone application settings form where users update Display Name, Email, Theme preference (light/dark/system), Timezone, Refresh rate, and Notifications. The validation must run on both client and server to prevent invalid data ingestion and ensure a smooth, reliable user submission flow.

Few-Shot Example:
Input payload: { displayName: "J", email: "invalid", theme: "unknown" }
Output errors object: { displayName: "Display name must be 2 to 50 characters.", email: "Please enter a valid email address.", theme: "Please select a valid theme preference (light, dark, or system)." }

Output Structure: Format the response in three distinct TypeScript sections:
1. Types & Constants (`allowedSettingsKeys`, `ThemeOption`, `SettingsFormValues`, `SettingsValidationErrors`)
2. `validateSettings` function taking `Record<string, unknown>` and returning errors
3. `normalizeSettingsInput` function taking `Record<string, unknown>` and returning safe defaults
```

### Output
> Representative excerpt — not the complete output.
>
> ```typescript
> // 1. Types & Constants
> export const allowedSettingsKeys = ["displayName", "email", "notifications", "theme", "timezone", "refreshRate"] as const;
> export type ThemeOption = "light" | "dark" | "system";
> export interface SettingsFormValues {
>   displayName: string;
>   email: string;
>   notifications: boolean;
>   theme: ThemeOption;
>   timezone: string;
>   refreshRate: number;
> }
> export type SettingsValidationErrors = Partial<Record<keyof SettingsFormValues, string>> & { unknownFields?: string[] };

> // 2. validateSettings Function
> export function validateSettings(values: Record<string, unknown>): SettingsValidationErrors { ... }

> // 3. normalizeSettingsInput Function
> export function normalizeSettingsInput(values: Record<string, unknown>): SettingsFormValues { ... }
> ```

### What Changed and Why
Specified explicit structural organization for the code file into three distinct sections (Types & Constants, Validation Function, Normalization Function).

### Observed Output Difference
The output produced a complete, production-ready module structure with all 3 required sections, including `allowedSettingsKeys` and `normalizeSettingsInput`.

### What Still Failed
The internal validation logic inside `validateSettings` did not explicitly check for unknown payload keys using `allowedSettingsKeys`.

---

## Iteration 5 — Step Decomposition

### Technique
Step decomposition

### Prompt
```text
You are a senior TypeScript frontend and API engineer. Build a settings form validation script for Fastify.

Context & Motivation: We are building a capstone application settings form where users update Display Name, Email, Theme preference (light/dark/system), Timezone, Refresh rate, and Notifications. The validation must run on both client and server to prevent invalid data ingestion and ensure a smooth, reliable user submission flow.

Few-Shot Example:
Input payload: { displayName: "J", email: "invalid", theme: "unknown" }
Output errors object: { displayName: "Display name must be 2 to 50 characters.", email: "Please enter a valid email address.", theme: "Please select a valid theme preference (light, dark, or system)." }

Output Structure: Format the response in three distinct TypeScript sections:
1. Types & Constants (`allowedSettingsKeys`, `ThemeOption`, `SettingsFormValues`, `SettingsValidationErrors`)
2. `validateSettings` function taking `Record<string, unknown>` and returning errors
3. `normalizeSettingsInput` function taking `Record<string, unknown>` and returning safe defaults

Step Decomposition: Process validation internally using these explicit steps:
Step 1: Check for unknown payload keys not present in `allowedSettingsKeys` and populate `errors.unknownFields`.
Step 2: Validate `displayName` (must be non-empty string between 2 and 50 characters).
Step 3: Validate `email` (must match standard email regex pattern).
Step 4: Validate `theme` (must be one of "light", "dark", "system").
Step 5: Validate `timezone` (must be non-empty string).
Step 6: Validate `refreshRate` (must be integer between 1 and 1440).
```

### Output
> Representative excerpt — not the complete output.
>
> ```typescript
> export const allowedSettingsKeys = [
>   "displayName",
>   "email",
>   "notifications",
>   "theme",
>   "timezone",
>   "refreshRate",
> ] as const;
> 
> export type AllowedSettingsKey = (typeof allowedSettingsKeys)[number];
> export type ThemeOption = "light" | "dark" | "system";
> 
> export type SettingsFormValues = {
>   displayName: string;
>   email: string;
>   notifications: boolean;
>   theme: ThemeOption;
>   timezone: string;
>   refreshRate: number;
> };
> 
> export type SettingsValidationErrors = Partial<
>   Record<keyof SettingsFormValues, string>
> > & {
>   unknownFields?: string[];
> };
> 
> export const defaultSettings: SettingsFormValues = {
>   displayName: "",
>   email: "",
>   notifications: true,
>   theme: "system",
>   timezone: "",
>   refreshRate: 15,
> };
> 
> export function validateSettings(values: Record<string, unknown>): SettingsValidationErrors {
>   const errors: SettingsValidationErrors = {};
>   
>   // Step 1: Unknown key check
>   const unknownFields = Object.keys(values).filter(
>     (key) => !allowedSettingsKeys.includes(key as AllowedSettingsKey)
>   );
>   if (unknownFields.length > 0) errors.unknownFields = unknownFields;
> 
>   // Step 2: Display name
>   const displayName = typeof values.displayName === "string" ? values.displayName.trim() : "";
>   if (!displayName || displayName.length < 2 || displayName.length > 50) {
>     errors.displayName = "Display name must be 2 to 50 characters.";
>   }
> 
>   // Step 3: Email
>   const email = typeof values.email === "string" ? values.email.trim() : "";
>   if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
>     errors.email = "Please enter a valid email address.";
>   }
> 
>   // Step 4: Theme
>   const theme = typeof values.theme === "string" ? values.theme.trim() : "";
>   if (!theme || !["light", "dark", "system"].includes(theme as ThemeOption)) {
>     errors.theme = "Please select a valid theme preference (light, dark, or system).";
>   }
> 
>   // Step 5: Timezone
>   const timezone = typeof values.timezone === "string" ? values.timezone.trim() : "";
>   if (!timezone) errors.timezone = "Please select a timezone.";
> 
>   // Step 6: Refresh rate
>   const refreshRate = Number(values.refreshRate);
>   if (!Number.isInteger(refreshRate) || refreshRate < 1 || refreshRate > 1440) {
>     errors.refreshRate = "Refresh rate must be an integer between 1 and 1440 minutes.";
>   }
> 
>   return errors;
> }
> 
> export function normalizeSettingsInput(values: Record<string, unknown>): SettingsFormValues {
>   const themeInput = typeof values.theme === "string" ? values.theme.trim() : "";
>   const validTheme = ["light", "dark", "system"].includes(themeInput)
>     ? (themeInput as ThemeOption)
>     : defaultSettings.theme;
> 
>   return {
>     displayName: typeof values.displayName === "string" ? values.displayName.trim() : "",
>     email: typeof values.email === "string" ? values.email.trim() : "",
>     notifications: Boolean(values.notifications),
>     theme: validTheme,
>     timezone: typeof values.timezone === "string" ? values.timezone.trim() : "",
>     refreshRate: Number(values.refreshRate ?? defaultSettings.refreshRate),
>   };
> }
> ```

### What Changed and Why
Decomposed the validation logic into six sequential steps, explicitly instructing the model how to detect unknown keys and enforce constraints.

### Observed Output Difference
The output executed every step perfectly, including unknown key filtering, exact error strings, integer refresh-rate checking, and complete input normalization.

### What Still Failed
None. The output matches our exact production implementation (`src/settings.ts`).

---

## Cross-Model Comparison

### Final Prompt
The Iteration 5 prompt was executed on both **Claude** and **ChatGPT**.

### Claude Output
> Representative excerpt:
>
> ```typescript
> export const allowedSettingsKeys = ["displayName", "email", "notifications", "theme", "timezone", "refreshRate"] as const;
> export type AllowedSettingsKey = (typeof allowedSettingsKeys)[number];
> export type ThemeOption = "light" | "dark" | "system";
> ...
> export function validateSettings(values: Record<string, unknown>): SettingsValidationErrors {
>   const errors: SettingsValidationErrors = {};
>   const unknown = Object.keys(values).filter(k => !allowedSettingsKeys.includes(k as AllowedSettingsKey));
>   if (unknown.length > 0) errors.unknownFields = unknown;
>   ...
>   return errors;
> }
> ```

### ChatGPT Output
> Representative excerpt:
>
> ```typescript
> // Here is the complete TypeScript implementation for your Fastify settings form validation:
> export const allowedSettingsKeys = ["displayName", "email", "notifications", "theme", "timezone", "refreshRate"] as const;
> ...
> // Note: Make sure to import this in your Fastify server.ts route handler.
> ```

### Comparison

#### Tone
* **Claude**: Concise and direct. Returned raw TypeScript code without conversational filler.
* **ChatGPT**: Friendly and polite, but included conversational intros ("Here is the complete implementation...") and explanatory commentary.

#### Accuracy
* **Claude**: 100% accurate. Used `as const` assertions and `Number.isInteger()` checks without syntax or logic bugs.
* **ChatGPT**: 100% accurate. Used equivalent TypeScript validation logic and `as const` array definitions.

#### Structure
* **Claude**: Followed the 3-section structure strictly without extra comments or wrapping markdown headers.
* **ChatGPT**: Followed the 3-section structure, but added top-level comment banners (`// 1. Types & Constants`) and an extra usage summary block at the end.

#### Specificity
* **Claude**: Highly specific code exports. Matched `src/settings.ts` contracts cleanly.
* **ChatGPT**: Highly specific code exports, but added extra helper comments explaining Fastify integration.

#### Failure Points
* **Claude**: None.
* **ChatGPT**: Added minor conversational fluff before and after the code block that requires stripping when pasting into source files.

#### Editing Required
* **Claude**: 0 lines edited (ready to paste into `src/settings.ts`).
* **ChatGPT**: 2-3 lines of conversational text removed.

---

## What I Learned

1. **Output Structure & Step Decomposition Had the Largest Impact**: Output Structure (Iteration 4) transformed the output from a single monolithic function into a modular file export. Step Decomposition (Iteration 5) ensured complex logic like unknown key detection was actually implemented rather than skipped.
2. **Few-Shot Examples Provided Precision, Not Architecture**: Providing an example error object (Iteration 3) fixed wording details but didn't help overall code design. Few-shot is best for formatting consistency, while step decomposition is best for algorithmic completeness.
3. **Cross-Model Nuances**: Claude delivers cleaner code output without conversational preamble, whereas ChatGPT tends to wrap code in polite explanation notes.

---

## Final Reusable Prompt Template

```text
You are a senior [LANGUAGE/FRAMEWORK] engineer.

Task:
Build a [FEATURE/MODULE NAME] for [APPLICATION OR SYSTEM TYPE].

Context & Motivation:
[DESCRIBE THE DOMAIN CONTEXT AND WHY THIS MODULE IS NEEDED, E.G., CLIENT AND SERVER VALIDATION TO PREVENT CORRUPTION].

Inputs & Requirements:
- Field 1: [NAME] ([TYPE/CONSTRAINTS])
- Field 2: [NAME] ([TYPE/CONSTRAINTS])
- Field 3: [NAME] ([TYPE/CONSTRAINTS])

Few-Shot Example:
Input: [SAMPLE INPUT PAYLOAD]
Output: [SAMPLE EXPECTED OUTPUT OR ERROR OBJECT]

Output Structure:
Organize the code into three distinct sections:
1. Types & Constants (interfaces, allowed keys array, union types)
2. Main Processing/Validation Function
3. Helper/Normalization Function

Step Decomposition:
Process the logic in explicit stages:
Step 1: [CHECK UNKNOWN OR EXTRA KEYS]
Step 2: [VALIDATE FIELD 1]
Step 3: [VALIDATE FIELD 2]
Step 4: [SANITIZE AND NORMALIZE INPUTS]

Requirements:
- Written in clean [LANGUAGE] with strict typing.
- No third-party validation dependencies unless specified.
- Grounded error messages without corporate jargon.
```
