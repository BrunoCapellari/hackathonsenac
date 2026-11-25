# Project decisions

**English** · [Português (Brasil)](DECISIONS.pt-BR.md)

Record the team's important decisions here. Each entry should be short and state what was decided, the alternatives considered and the reason for the choice.

Project documentation must be written in **English** (this file is the main version), with a **Portuguese version** alongside (`DECISIONS.pt-BR.md`). Keep both versions in sync.

Keep this file at the **root** of the repository. Add a new entry for every relevant decision (stack, architecture, MVP scope, what was left out, paths you tried and abandoned, etc.). This file is a script for the decisions segment of the presentation.

Copy the template below whenever you need a new entry.

## Template

```markdown
## [date] — [decision title]
- **Decision:**
- **Alternatives considered:**
- **Rationale:**
```

## 23/11/2026 — Back-end stack choice (example)

- **Decision:** use Node.js with Express on the back-end.
- **Alternatives considered:** Java with Spring Boot; Python with FastAPI.
- **Rationale:** the team is already more familiar with JavaScript, and a one-week deadline favors a stack everyone can contribute to from day one.

## 24/11/2026 — Choice of AI Technology

- **Decision:** Use Ollama with the Qwen 2.5 3B model to integrate artificial intelligence into the Java application.
- **Alternatives considered:** External AI APIs, such as Gemini and other cloud-based solutions.
- **Reason:** Ollama allows AI models to run locally, without depending on external services or API keys, making the solution more accessible and suitable for the presentation environment.

## 24/11/2026 — Database Design

- **Decision:** Use PostgreSQL with three main tables: users, establishments, and products.
- **Alternatives considered:** Other relational database management systems.
- **Reason:** This structure allows users to manage multiple establishments and each establishment to manage its own products, meeting the MVP requirements.

## [date] — [decision title]

- **Decision:**
- **Alternatives considered:**
- **Rationale:**
