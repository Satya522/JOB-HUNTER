# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a suspected security vulnerability.

Use the repository's private security advisory flow on GitHub, or contact the maintainer through the public profile at [github.com/Satya522](https://github.com/Satya522). Include a clear description, affected area, reproduction steps, and potential impact.

Never include passwords, API keys, JWT secrets, database credentials, uploaded resumes, or other private data in a report.

## Supported versions

The `master` branch is the actively maintained development line. Older commits are not guaranteed to receive security fixes.

## Security expectations

[new_code]
<div align="center">

![Security & Privacy](https://img.shields.io/badge/Security%20%26%20Privacy-AI%20Job%20Hunter-0f766e?style=for-the-badge&logo=shield&logoColor=white)

# Security & Privacy

### Your career data is personal. It should stay under your control.

AI Job Hunter is designed to keep authentication, credentials, resumes, and AI integrations behind clear application boundaries. This document explains what the project handles, what it should never expose, and how to report a concern responsibly.

</div>

---

## 🧭 Our commitment

Job applications contain sensitive professional information: contact details, work history, salary expectations, interview notes, and sometimes private documents. AI Job Hunter follows a **minimum-necessary-data** approach:

- Credentials belong in runtime environment variables, never in source control.
- Authentication is handled through protected backend flows and signed JWT sessions.
- Resume and application data is scoped to the authenticated user in the application layer.
- AI features are opt-in workflow tools, not a reason to collect unrelated personal data.

> **The project is self-hostable.** The organization operating a deployment is responsible for its database, storage, hosting, logs, backups, and provider configuration.

## 📦 Data handled by the application

| Data category | Why it is used | Where it is handled |
| --- | --- | --- |
| **Account information** | Registration, login, profile, and access control | Backend and PostgreSQL |
| **Authentication data** | Password verification and JWT session issuance | Backend security layer; passwords are processed as hashes, not plain text |
| **Resume files** | Resume management and analysis workflows | Backend upload storage and resume records |
| **Application records** | Track jobs, stages, notes, dates, and follow-ups | Backend and PostgreSQL |
| **AI prompts and results** | Resume analysis, cover letters, and interview preparation | Backend AI service integration and persisted AI records where the workflow requires it |
| **Job-feed requests** | Discover external roles and normalize job information | Backend job-feed integrations |
| **Operational logs** | Diagnose application failures and service behavior | Deployment-controlled runtime environment |

Retention depends on the deployment database, upload storage, backups, and logging configuration. Delete or rotate data through the deployment's administrative controls when it is no longer needed.

## 🚫 What must never be committed

- `.env` files and API keys
- Database passwords and JWT signing secrets
- Mail credentials and OAuth tokens
- Uploaded resumes or private application documents
- Production database exports and runtime logs
- Personal access tokens, service-account keys, or private certificates

The repository's `.gitignore` excludes local environment files, generated output, dependency directories, logs, IDE metadata, and the local fixes note. Always inspect `git diff` before pushing.

## 🤖 AI and third-party processing

AI Job Hunter can send selected user-provided context to configured AI providers for features such as resume analysis, cover-letter generation, and interview preparation. Configure only providers you trust, review their current data policies, and avoid submitting information that is not needed for the requested result.

The backend currently integrates with:

- **Google Gemini** for backend AI suggestions and analysis
- **Groq** for the frontend cover-letter route when `GROQ_API_KEY` is configured
- **Firebase Auth providers** for client-side identity provider setup
- **External job feeds** such as Adzuna, Remotive, Jobicy, and The Muse
- **PostgreSQL** for application persistence

Third-party retention, regional processing, and training policies are controlled by the selected provider and deployment configuration. AI Job Hunter does not promise provider-level deletion or zero-retention behavior unless it is explicitly configured and verified by the operator.

## 🛡️ Application safeguards

The project includes the following security boundaries:

1. **JWT-protected API flows** for authenticated backend operations.
2. **BCrypt password hashing** through Spring Security's password encoder.
3. **Environment-based secrets** for databases, JWT, AI providers, mail, and job APIs.
4. **User-scoped resume and application repositories** in the backend service layer.
5. **Upload size limits** for resume files, with a configured maximum of 5 MB at the service layer.
6. **CORS allow-list configuration** through `CORS_ALLOWED_ORIGINS`.
7. **Private security reporting guidance** through GitHub Security Advisories.

These controls are not a substitute for secure production deployment. Use HTTPS, restrict database access, protect backups, rotate credentials, and review infrastructure logs in every public deployment.

## 🔐 Deployment checklist

- [ ] Set a long, unique `JWT_SECRET`.
- [ ] Keep database, AI, mail, and job-feed credentials outside the repository.
- [ ] Set `CORS_ALLOWED_ORIGINS` to trusted production origins only.
- [ ] Use HTTPS for frontend, backend, and third-party callbacks.
- [ ] Restrict PostgreSQL network access and protect backups.
- [ ] Store uploaded resumes outside the public web root.
- [ ] Configure log retention and redact request data where appropriate.
- [ ] Review provider privacy and retention settings before enabling AI features.
- [ ] Rotate any credential that may have appeared in a log, commit, screenshot, or issue.

## 📬 Report a vulnerability privately

Please **do not open a public issue** for a suspected vulnerability.

Use the repository's [private security advisory flow](https://github.com/Satya522/JOB-HUNTER/security/advisories/new). Include:

- A concise description of the issue
- The affected component or endpoint
- Reproduction steps or a proof of concept
- Potential impact and suggested severity
- A safe contact method for follow-up

Never include live credentials, API keys, private resumes, database exports, or other sensitive data in a report.

## ✅ Responsible disclosure

Please allow reasonable time for investigation and remediation before public disclosure. We will acknowledge valid reports, keep the reporter informed where possible, and credit researchers who want attribution after a fix is available.

## 🧩 Supported versions

The `master` branch is the actively maintained development line. Older commits and personal deployments are not guaranteed to receive security fixes. Before reporting a regression, reproduce it against the latest `master` commit when possible.

## 📚 Related project controls

- [Contribution and pull-request guidance](.github/pull_request_template.md)
- [Bug report form](.github/ISSUE_TEMPLATE/bug_report.yml)
- [Repository privacy and secret exclusions](.gitignore)
- [GitHub Security tab](https://github.com/Satya522/JOB-HUNTER/security)

<div align="center">

<br />

**Security is a product feature, not a footer note.**

</div>
