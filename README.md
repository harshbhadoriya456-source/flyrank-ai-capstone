# FlyRank AI Capstone

FlyRank is the capstone project for the FlyRank AI Engineering Track. It is an AI-powered application scaffolded with modern TypeScript, AI-assisted development, and production-ready engineering practices.

## Overview

This repository is a starting point for a domain-driven AI product. The project uses a modular architecture and a clear development workflow to support rapid iteration, automated testing, and future deployment.

**Current status:** Active development.

## Architecture

The application is organized into three primary layers:

- Client: web app, CLI, or API consumers
- Application Core: AI engine, business logic, and data orchestration
- Infrastructure: database, cache, storage, and messaging

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js 20+ | Server-side JavaScript execution |
| Language | TypeScript 5.x | Static typing and safer code |
| Framework | TBD | Web API and application framework |
| AI / ML | TBD | Prompt-driven intelligence and model integration |
| Database | TBD | Persistent data storage |
| ORM | TBD | Database abstraction and migrations |
| Testing | TBD | Unit, integration, and E2E testing |
| CI/CD | GitHub Actions | Automated validation and deployment |
| Containerization | Docker | Local development and consistency |
| Deployment | TBD | Production hosting and release management |

## AI Workflow

AI assistance is incorporated across the development lifecycle to accelerate planning, code generation, debugging, and documentation. Human review remains essential for quality, security, and correctness.

| Phase | Tool | Application |
|---|---|---|
| Planning | AI assistants | Architecture decisions and requirements |
| Code generation | AI tools | Boilerplate scaffolding and feature implementation |
| Debugging | AI-assisted review | Error analysis and root cause diagnosis |
| Testing | AI-generated cases | Edge-case discovery and validation |
| Documentation | Human + AI | README, API docs, and architecture notes |

## Repository Structure

```
flyrank-ai-capstone/
├── README.md
├── LICENSE
├── CLAUDE.md
├── .gitignore
├── package.json
├── tsconfig.json
├── docker-compose.yml
├── src/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── services/
│   └── utils/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/
    ├── ARCHITECTURE.md
    └── API.md
```

## Roadmap

| Milestone | Status | Description |
|---|---|---|
| M0: Repository Setup | ✅ Complete | Repository initialization and documentation |
| M1: Project Scaffolding | 🚧 In Progress | TypeScript setup, folder structure, and tooling |
| M2: Core Feature Definition | ⏳ Pending | Define problem statement and API design |
| M3: AI Integration | ⏳ Pending | Implement AI engine and prompt framework |
| M4: Backend Development | ⏳ Pending | API implementation and database integration |
| M5: Frontend / Interface | ⏳ Pending | UI, CLI, or API consumer implementation |
| M6: Testing & QA | ⏳ Pending | Coverage, regression tests, and performance checks |
| M7: Deployment | ⏳ Pending | Production-ready deployment and observability |
| M8: Documentation & Demo | ⏳ Pending | Final docs, demo assets, and presentation |

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- Git
- Docker (optional for local infrastructure)

### Installation

```bash
git clone https://github.com/harshbhadoriya456-source/flyrank-ai-capstone.git
cd flyrank-ai-capstone
npm install
cp .env.example .env
# edit .env as needed
npm run dev
```

### Typical commands

```bash
npm run dev
npm run build
npm run start
npm run test
npm run lint
npm run format
npm run db:migrate
npm run db:seed
```

## Development Guidelines

- Use descriptive branch names like `feat/...`, `fix/...`, `docs/...`, `refactor/...`
- Follow Conventional Commits
- Prefer strict TypeScript and minimal `any`
- Keep modules focused and testable
- Review AI-generated code carefully before merging

## Contributing

This is a personal capstone project, but feedback is welcome. Open issues for:

- Bug reports
- Feature ideas
- Documentation improvements
- Security concerns

## Author

Harsh

GitHub: @harshbhadoriya456-source

## License

This project is licensed under the MIT License.

_Last updated: August 2026_
