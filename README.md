# AI Job Hunter

AI Job Hunter is a full-stack job-search workspace for managing applications, resumes, job feeds, interview preparation, and AI-assisted career tools from one dashboard.

## Features

- User registration and JWT-based authentication
- Job application pipeline and status tracking
- Resume management and resume analysis
- AI-generated cover letters and mock interviews
- Job feed integrations
- Dashboard analytics, calendar, and activity views

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Spring Boot, Java, Spring Data JPA, PostgreSQL
- **Authentication:** JWT and Firebase providers
- **AI:** Gemini API integration through the backend

## Project Structure

```text
frontend/   Next.js application
backend/    Spring Boot API
database/   Database schema and seed scripts
```

## Local Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

### Backend

Configure the required environment variables before starting the API, including database, JWT, and AI credentials. Keep them in a local `.env` file and never commit that file.

```bash
cd backend
mvn spring-boot:run
```

The backend runs at `http://localhost:8080`.

## Security

Secrets and local configuration are excluded through `.gitignore`. Provide API keys, database credentials, and JWT secrets through environment variables at runtime.