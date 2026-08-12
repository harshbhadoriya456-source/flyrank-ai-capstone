# CLAUDE.md

# FlyRank AI Capstone

## Project Goal

Build a production-ready AI application as part of the FlyRank AI Engineering Track.

## Development Rules

- Follow Conventional Commits.
- Write clean, modular, and maintainable code.
- Prefer TypeScript where applicable.
- Keep documentation updated.
- Review all AI-generated code before committing.
- Avoid unnecessary dependencies.

## Coding Standards

- Small reusable functions
- Clear folder structure
- Meaningful variable names
- Handle errors properly

## AI Development Rules

- Forms must declare explicit validation rules for every required field before implementation; unsupported fields or empty values must be rejected by validation logic.
- User-facing validation messages must be associated with their corresponding input fields and remain accessible through keyboard navigation and screen-reader-friendly labeling.
- Tests must cover at least one valid input case and important failure cases, including invalid email values, empty required fields, invalid refresh-rate ranges, and excessive display-name lengths.
- AI-generated changes must preserve the existing project architecture and avoid unnecessary dependencies or unrelated files when a focused fix is sufficient.
- Unknown or unexpected input must be rejected where the schema is strict, especially for HTTP payloads and form submissions that include extra keys not defined by the application contract.