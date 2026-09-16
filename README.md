<div align="center">

<p align="center">
    <sub>CAREER OPERATING SYSTEM · AI-ASSISTED JOB SEARCH</sub>
</p>

<p align="center">
    <img src="docs/job-hunter-mark.svg" width="104" alt="AI Job Hunter compass mark" />
</p>

<h1 align="center">AI Job Hunter</h1>

<p align="center">
    <strong>Discover the right role. Build the right story. Move forward with intent.</strong>
</p>

<p align="center">
    A focused command center for the full job-search loop — from the first job signal<br />
    to a tailored application, a prepared interview, and measurable momentum.
</p>

<p align="center">
    <a href="#-quick-start">Launch locally</a>
    &nbsp; · &nbsp;
    <a href="#-capabilities">Explore capabilities</a>
    &nbsp; · &nbsp;
    <a href="https://github.com/Satya522/JOB-HUNTER">View repository</a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/DISCOVER-0f172a?style=for-the-badge" alt="Discover" />
    <img src="https://img.shields.io/badge/TAILOR-1d4ed8?style=for-the-badge" alt="Tailor" />
    <img src="https://img.shields.io/badge/PREPARE-7c3aed?style=for-the-badge" alt="Prepare" />
    <img src="https://img.shields.io/badge/ADVANCE-059669?style=for-the-badge" alt="Advance" />
</p>

<p align="center">
    <em>One workspace for applications, resumes, AI tools, interviews, analytics, and follow-through.</em>
</p>

<br />

[![Next.js](https://img.shields.io/badge/-NEXT.JS-000000?style=for-the-badge&logo=next.js&logoColor=white)](#-tech-stack)
[![TypeScript](https://img.shields.io/badge/-TYPESCRIPT-000000?style=for-the-badge&logo=typescript&logoColor=3178C6)](#-tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/-TAILWIND_CSS-000000?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)](#-tech-stack)
[![Spring Boot](https://img.shields.io/badge/-SPRING_BOOT-000000?style=for-the-badge&logo=springboot&logoColor=6DB33F)](#-tech-stack)

<br />

[![Overview](https://img.shields.io/badge/-%F0%9F%93%96_OVERVIEW-16a34a?style=for-the-badge)](#-the-idea)
[![Capabilities](https://img.shields.io/badge/-%E2%9A%A1_CAPABILITIES-000000?style=for-the-badge)](#-capabilities)
[![Architecture](https://img.shields.io/badge/-%F0%9F%8F%97%EF%B8%8F_ARCHITECTURE-000000?style=for-the-badge)](#-architecture)
[![Tech Stack](https://img.shields.io/badge/-%F0%9F%9B%A0%EF%B8%8F_TECH_STACK-000000?style=for-the-badge)](#-tech-stack)
[![Quick Start](https://img.shields.io/badge/-%F0%9F%9A%80_QUICK_START-000000?style=for-the-badge)](#-quick-start)
[![Contributing](https://img.shields.io/badge/-%F0%9F%A4%9D_CONTRIBUTING-000000?style=for-the-badge)](#-contributing)

<br />

[![GitHub last commit](https://img.shields.io/github/last-commit/Satya522/JOB-HUNTER?style=flat-square&color=6366f1)](https://github.com/Satya522/JOB-HUNTER/commits/master)
[![GitHub repo size](https://img.shields.io/github/repo-size/Satya522/JOB-HUNTER?style=flat-square&color=6366f1)](https://github.com/Satya522/JOB-HUNTER)
[![GitHub stars](https://img.shields.io/github/stars/Satya522/JOB-HUNTER?style=flat-square&color=eab308)](https://github.com/Satya522/JOB-HUNTER/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Satya522/JOB-HUNTER?style=flat-square&color=eab308)](https://github.com/Satya522/JOB-HUNTER/forks)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ec4899?style=flat-square)](#-contributing)

</div>

<br />

## 📌 Table of Contents

- [The Idea](#-the-idea)
- [Capabilities](#-capabilities)
- [Product Surface](#-product-surface)
- [How the AI Loop Works](#-how-the-ai-loop-works)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

<br />

## 💡 The Idea

Job hunting is not one action. It is a loop of finding the right role, understanding the fit, preparing a strong application, following up, and learning from every outcome.

> **AI Job Hunter brings that entire loop into one place.** The dashboard combines an application pipeline, job feeds, resume tools, interview preparation, calendar planning, and progress signals so the next useful action is always visible.

<br />

## ⚡ Capabilities

| Area | What it does |
| --- | --- |
| 🗂️ **Application pipeline** | Track roles from applied to interview, offer, rejection, or withdrawal with a focused board view. |
| 🔍 **Job discovery** | Pull remote and external job opportunities through backend job-feed integrations. |
| 📄 **Resume workspace** | Store resumes, select a primary resume, and send resume content through the analysis flow. |
| 🤖 **AI career tools** | Generate tailored cover letters, analyze resume fit, and run structured mock interviews with Gemini. |
| 📊 **Career dashboard** | Surface KPIs, activity, application trends, status distribution, skills, salary signals, and timelines. |
| 🗓️ **Planning layer** | Organize interviews and follow-ups through an integrated calendar view. |
| 🔐 **Identity and access** | Registration, login, JWT sessions, and Firebase-backed social provider setup. |

<br />

## 🖥️ Product Surface

The dashboard is designed around repeated job-search work rather than a collection of disconnected pages:

- **Pipeline board** — for moving applications forward
- **Job feed** — for scanning and saving relevant opportunities
- **AI tools hub** — for resume analysis, cover letters, and interview practice
- **Analytics layer** — for application activity, status mix, skills, and salary context
- **Calendar and timeline** — for the commitments that turn applications into follow-through

<br />

## 🔄 How the AI Loop Works

```mermaid
flowchart LR
    A["📄 Resume + Target Role"] --> B["🔎 Resume Analysis"]
    B --> C["🎯 Skill & Fit Signals"]
    C --> D["✍️ Cover Letter"]
    D --> E["📤 Role-specific Draft"]
    E --> F["🎤 Mock Interview"]
    F --> G["📈 Practice Feedback & Next Steps"]

    style A fill:#eef2ff,stroke:#6366f1,color:#1e1b4b
    style B fill:#eef2ff,stroke:#6366f1,color:#1e1b4b
    style C fill:#ecfdf5,stroke:#16a34a,color:#052e16
    style D fill:#fdf4ff,stroke:#c026d3,color:#4a044e
    style E fill:#fdf4ff,stroke:#c026d3,color:#4a044e
    style F fill:#fff7ed,stroke:#ea580c,color:#431407
    style G fill:#fff7ed,stroke:#ea580c,color:#431407
```

AI is an accelerator inside the workflow, not a replacement for the candidate's judgment. Credentials stay on the backend and are supplied at runtime.

<br />

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph Client["🖥️ Client"]
        FE["Next.js Dashboard<br/>React + TypeScript"]
    end

    subgraph Server["⚙️ Server"]
        API["Spring Boot API<br/>Auth · Jobs · AI"]
    end

    subgraph Data["🗄️ Data & Integrations"]
        DB[("PostgreSQL<br/>JPA Storage")]
        AI["Gemini API +<br/>Job Feeds"]
    end

    FE -->|"REST requests + Auth (JWT)"| API
    API --> DB
    API --> AI
```

The **frontend** owns the responsive product surface and dashboard interactions. The **Spring Boot backend** owns authentication, persistence, job operations, resume workflows, and integrations that require protected credentials.

<br />

## 📁 Project Structure

```text
JOB-HUNTER/
├── frontend/
│   ├── app/                     # Next.js routes and server endpoints
│   ├── components/              # Dashboard, charts, layout, and UI components
│   ├── lib/                     # API client, Firebase setup, and utilities
│   ├── store/                   # Client authentication state
│   └── types/                   # Shared frontend types
├── backend/
│   ├── src/main/java/           # Controllers, services, entities, security
│   └── src/main/resources/      # Spring configuration and schema
├── database/
│   ├── schema.sql               # Database structure
│   └── seed.sql                 # Development seed data
├── .gitignore                   # Local secrets and generated files
└── README.md
```

<br />

## 🛠️ Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)

</div>

| Layer | Technology | Role |
| --- | --- | --- |
| **Web application** | Next.js, React, TypeScript | App routing, UI, and client workflows |
| **Design system** | Tailwind CSS | Responsive dashboard styling |
| **API** | Spring Boot, Java | Business logic and REST endpoints |
| **Persistence** | Spring Data JPA, PostgreSQL | Users, resumes, applications, and AI records |
| **Authentication** | JWT, Firebase Auth providers | Session and identity flows |
| **AI services** | Google Gemini API | Resume analysis, cover letters, and mock interviews |
| **Visualization** | Recharts, Nivo, custom components | Activity, pipeline, skills, and salary insights |

<br />

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
| --- | --- |
| Node.js | 18+ |
| npm | Latest stable |
| Java | 17+ |
| Maven | Latest stable |
| PostgreSQL | 14+ recommended |

### 1️⃣ Clone the project

```bash
git clone https://github.com/Satya522/JOB-HUNTER.git
cd JOB-HUNTER
```

### 2️⃣ Start the backend

Create your local environment variables first, then run:

```bash
cd backend
mvn spring-boot:run
```

The API starts at **`http://localhost:8080`**.

### 3️⃣ Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:3000`** in your browser.

<br />

## ⚙️ Configuration

The backend reads protected values from environment variables — nothing sensitive should be hardcoded.

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

> Keep local values in an environment file or shell configuration. **Never** commit credentials, uploaded resumes, generated build output, or dependency directories.

<br />

## 🔒 Security

- ✅ Secrets are resolved at runtime through environment variables.
- ✅ Local `.env` files, build output, dependencies, logs, and IDE metadata are `.gitignore`d.
- ✅ The browser Firebase config is client-side configuration only — server credentials remain backend-only.
- ✅ Use a strong, unique `JWT_SECRET` outside local development.

<br />

## 🗺️ Roadmap

- [ ] Richer application reminders and follow-up automation
- [ ] Expanded job-feed normalization and duplicate detection
- [ ] Deeper resume-to-role comparison insights
- [ ] Improved interview feedback history and progress tracking
- [ ] Deployment documentation for production environments

<br />

## 🤝 Contributing

1. **Fork** the repository and create a focused branch.
2. Keep secrets and generated files **out of commits**.
3. Run the relevant frontend or backend checks before opening a pull request.
4. Explain the **user workflow** affected by your change in the PR description.

<br />

## 📄 License

This project is currently maintained as a **personal portfolio and product-development project**. A formal license will be added before it is distributed as an open-source package.

<br />

<div align="center">
  Built with focus by **[Satya522](https://github.com/Satya522)**

  ⭐ If this project is useful, consider starring the repo!
</div>