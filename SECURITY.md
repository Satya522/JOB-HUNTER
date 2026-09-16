# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a suspected security vulnerability.

Use the repository's private security advisory flow on GitHub, or contact the maintainer through the public profile at [github.com/Satya522](https://github.com/Satya522). Include a clear description, affected area, reproduction steps, and potential impact.

Never include passwords, API keys, JWT secrets, database credentials, uploaded resumes, or other private data in a report.

## Supported versions

The `master` branch is the actively maintained development line. Older commits are not guaranteed to receive security fixes.

## Security expectations

- Keep all credentials in runtime environment variables.
- Never commit `.env` files, tokens, or production data.
- Rotate any credential that may have been exposed immediately.
- Review authentication, file upload, and AI integration changes carefully.
