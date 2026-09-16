<div align="center">
	<h1>AI Job Hunter</h1>
	<p><strong>Turn a scattered job search into a focused career command center.</strong></p>
	<p>
		A full-stack workspace for discovering roles, tailoring applications, preparing for interviews,
		and understanding your progress from one calm, data-rich dashboard.
	</p>

	<p>
		<a href="https://github.com/Satya522/JOB-HUNTER"><img src="https://img.shields.io/badge/status-active-16a34a?style=for-the-badge" alt="Project status: active" /></a>
		<a href="#tech-stack"><img src="https://img.shields.io/badge/Next.js-React-111827?style=for-the-badge&logo=next.js" alt="Next.js and React" /></a>
		<a href="#tech-stack"><img src="https://img.shields.io/badge/Spring%20Boot-Java-6b21a8?style=for-the-badge&logo=springboot" alt="Spring Boot and Java" /></a>
		<a href="#security"><img src="https://img.shields.io/badge/secrets-environment%20only-0f766e?style=for-the-badge" alt="Secrets are environment only" /></a>
	</p>

	<p>
		<a href="#capabilities">Capabilities</a> &nbsp;&bull;&nbsp;
		<a href="#architecture">Architecture</a> &nbsp;&bull;&nbsp;
		<a href="#quick-start">Quick Start</a> &nbsp;&bull;&nbsp;
		<a href="#configuration">Configuration</a> &nbsp;&bull;&nbsp;
		<a href="#roadmap">Roadmap</a>
	</p>
</div>

## The idea

Job hunting is not one action. It is a loop of finding the right role, understanding the fit, preparing a strong application, following up, and learning from every outcome.

**AI Job Hunter brings that loop into one place.** The dashboard combines an application pipeline, job feeds, resume tools, interview preparation, calendar planning, and progress signals so the next useful action is always visible.

## Capabilities

| Area | What it does |
| --- | --- |
| **Application pipeline** | Track roles from applied to interview, offer, rejection, or withdrawal with a focused board view. |
| **Job discovery** | Pull remote and external job opportunities through the backend job-feed integrations. |
| **Resume workspace** | Store resumes, select a primary resume, and send resume content through the analysis flow. |
| **AI career tools** | Generate tailored cover letters, analyze resume fit, and run structured mock interviews with Gemini. |
| **Career dashboard** | Surface KPIs, activity, application trends, status distribution, skills, salary signals, and timelines. |
| **Planning layer** | Organize interviews and follow-ups through the integrated calendar view. |
| **Identity and access** | Support registration, login, JWT sessions, and Firebase-backed social provider setup. |

## Product surface

### A single view of momentum

The dashboard is designed around repeated job-search work rather than a collection of disconnected pages:

- **Pipeline board** for moving applications forward
- **Job feed** for scanning and saving relevant opportunities
- **AI tools hub** for resume analysis, cover letters, and interview practice
- **Analytics layer** for application activity, status mix, skills, and salary context
- **Calendar and timeline** for the commitments that turn applications into follow-through

### A practical AI loop

```text
Resume + Target Role
				|
				v
	Resume Analysis ------> Skill and fit signals
				|
				v
	Cover Letter ----------> Role-specific application draft
				|
				v
	Mock Interview --------> Practice feedback and next steps
```

AI is an accelerator inside the workflow, not a replacement for the candidate's judgment. Credentials stay on the backend and are supplied at runtime.

## Architecture

```text
												 +----------------------+
												 |  Next.js Dashboard   |
												 |  React + TypeScript  |
												 +----------+-----------+
																		|
												 REST requests and auth
																		|
												 +----------v-----------+
												 |   Spring Boot API    |
												 | Auth | Jobs | AI     |
												 +----+-----------+-----+
															|           |
										+---------v--+   +----v---------+
										| PostgreSQL  |   | Gemini +     |
										| JPA storage |   | job feeds    |
										+-------------+   +--------------+
```

The frontend owns the responsive product surface and dashboard interactions. The Spring Boot backend owns authentication, persistence, job operations, resume workflows, and integrations that require protected credentials.

## Project structure

```text
JOB HUNTER/
├── frontend/
│   ├── app/                    # Next.js routes and server endpoints
│   ├── components/             # Dashboard, charts, layout, and UI components
│   ├── lib/                    # API client, Firebase setup, and utilities
│   ├── store/                  # Client authentication state
│   └── types/                  # Shared frontend types
├── backend/
│   ├── src/main/java/           # Controllers, services, entities, security
│   └── src/main/resources/      # Spring configuration and schema
├── database/
│   ├── schema.sql               # Database structure
│   └── seed.sql                 # Development seed data
├── .gitignore                   # Local secrets and generated files
└── README.md
```

## Tech stack

| Layer | Technology | Role |
| --- | --- | --- |
| **Web application** | Next.js, React, TypeScript | App routing, UI, and client workflows |
| **Design system** | Tailwind CSS | Responsive dashboard styling |
| **API** | Spring Boot, Java | Business logic and REST endpoints |
| **Persistence** | Spring Data JPA, PostgreSQL | Users, resumes, applications, and AI records |
| **Authentication** | JWT, Firebase Auth providers | Session and identity flows |
| **AI services** | Google Gemini API | Resume analysis, cover letters, and mock interviews |
| **Visualization** | Recharts, Nivo, custom chart components | Activity, pipeline, skills, and salary insights |

## Quick start

### Prerequisites

- Node.js 18 or newer
- npm
- Java 17 or newer
- Maven
- PostgreSQL

### 1. Clone the project

```bash
git clone https://github.com/Satya522/JOB-HUNTER.git
cd JOB-HUNTER
```

### 2. Start the backend

Create local environment variables first, then run:

```bash
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Configuration

The backend reads protected values from environment variables. Typical local configuration includes:

| Variable | Used for |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | PostgreSQL connection |
| `DB_USERNAME`, `DB_PASSWORD` | Database credentials |
| `JWT_SECRET` | Signing authenticated sessions |
| `GEMINI_API_KEY` | AI career tools |
| `ADZUNA_APP_ID`, `ADZUNA_API_KEY` | Adzuna job feed |
| `THE_MUSE_API_KEY` | The Muse job feed |
| `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD` | Optional email delivery |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |

Keep local values in an environment file or shell configuration. Never commit credentials, uploaded resumes, generated build output, or dependency directories.

## Security

- Secrets are resolved at runtime through environment variables.
- Local `.env` files, build output, dependencies, logs, and IDE metadata are ignored.
- The browser Firebase configuration is client-side configuration; server credentials remain backend-only.
- Use a strong unique `JWT_SECRET` outside local development.

## Roadmap

- Add richer application reminders and follow-up automation
- Expand job-feed normalization and duplicate detection
- Add deeper resume-to-role comparison insights
- Improve interview feedback history and progress tracking
- Add deployment documentation for production environments

## Contributing

1. Fork the repository and create a focused branch.
2. Keep secrets and generated files out of commits.
3. Run the relevant frontend or backend checks before opening a pull request.
4. Explain the user workflow affected by your change.

## License

This project is currently maintained as a personal portfolio and product-development project. Add a formal license before distributing it as an open-source package.