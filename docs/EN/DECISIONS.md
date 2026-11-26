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

## 24/11/2026 — Choice of Language for the Back-End

- **Decision:** Use Java to program the back-end
- **Alternatives considered:** Python and Node.js
- **Rationale:** Java ends up being more sustainable for large projects

## 24/11/2026 — Choice of DBMS and Front-End

- **Decision:** Use PostgreSQL for the database and React + Expo for the front-end since it will be a webview
- **Rationale:** PostgreSQL ends up being the most viable option for this type of project, and React to make the application a webview

## 24/11/2026 — Use of Artificial Intelligence for Product Descriptions

- **Decision:** Use Ollama with the Qwen 2.5 3B model to generate product descriptions based on information provided by the business owner.
- **Alternatives considered:** External AI APIs and manual description writing.
- **Rationale:** Local execution reduces dependence on external services and allows AI integration into the system. Generated descriptions will also be reviewed and can be edited by the business owner before publication, preventing inaccurate information.

## 24/11/2026 — Database Design

- **Decision:** Use PostgreSQL with three main tables: users, establishments, and products.
- **Alternatives considered:** Other relational database management systems.
- **Rationale:** This structure allows users to manage multiple establishments and each establishment to manage its own products, meeting the MVP requirements.

## 25/11/2026 — Password Security and Database Credentials

- **Decision:** Use BCrypt to hash user passwords before storing them in PostgreSQL. Store database connection credentials in environment variables instead of hardcoding them in the source code.
- **Alternatives considered:** Storing passwords as plain text and hardcoding database credentials.
- **Rationale:** Password hashing improves user data security, while environment variables prevent sensitive credentials from being exposed in the source code or GitHub repository.

### 26/11/2026 — AI-generated product descriptions

- **Decision:** The backend will use Ollama with the qwen2.5vl:3b model to generate product descriptions through the Spring Boot API.
- **Implementation:** The backend sends the product name, price, and merchant-provided notes to Ollama through its /api/chat endpoint.
- **Rules:** The AI must use only the information provided by the merchant and must not invent ingredients, characteristics, benefits, promotions, or other product information.
- **Review:** AI-generated descriptions must be reviewed and approved by the merchant before the product is published.
- **Rationale:** This approach provides local AI processing without requiring an external AI API and keeps the AI generation centralized in the backend.

### Prerequisites

- **Java JDK 21:** application execution.
- **Apache Maven 3.9+:** project compilation.
- **Ollama:** local AI execution.
- **Qwen 2.5 3B:** AI model used by the system.
- **Windows 10 or later.**
- **8 GB RAM and 5 GB of free disk space recommended.**


## [date] — [decision title]

- **Decision:**
- **Alternatives considered:**
- **Rationale:**
