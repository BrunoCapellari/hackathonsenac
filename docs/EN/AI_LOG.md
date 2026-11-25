# AI usage log (AI_LOG)

**English** · [Português (Brasil)](AI_LOG.pt-BR.md)

Record how the team used artificial intelligence in the project. The use of AI is allowed and encouraged, as long as it is documented: this file is a required deliverable and a script for the “AI in practice” segment of the presentation.

Project documentation must be written in **English** (this file is the main version), with a **Portuguese version** alongside (`AI_LOG.pt-BR.md`). Keep both versions in sync.

Keep this file at the **root** of the repository. Include the tools used and, for every relevant use, the main prompt, what the AI generated, what the team kept and what was corrected or rejected — and why.

Never commit API keys, passwords or other secrets. Those values go in a `.env` file (outside the repository) and in GitHub Secrets.

Copy the template below whenever you need a new entry.

## Tools

- (e.g. ChatGPT, GitHub Copilot, Cursor, other)

## Entry template

```markdown
### [date] — [task or section]
- **Main prompt:**
- **What the AI generated:**
- **What the team kept:**
- **What the team corrected or rejected, and why:**
```

## Log

### 24/11/2026 — AI Integration Test with Java

- **Main Prompt:** Test the possibility of integrating artificial intelligence into a Java application, allowing users to send questions and receive responses through Java code.
- **What the AI Generated:** Java code examples using HTTP requests to connect the application to AI models, initially through Google Gemini and later through Ollama.
- **What the Team Used:** The knowledge gained about API integration, HTTP requests, the Java 21 HttpClient, and running local AI models using Ollama and Qwen 2.5 3B.
- **What the Team Corrected or Rejected, and Why:** The Google Gemini integration was abandoned due to availability issues and instability during testing. The Ollama alternative was used to complete the experiment and demonstrate that it is possible to connect a local AI model to a Java application.

### 24/11/2026 — JWT authentication (example)

- **Main prompt:** "Generate a JWT authentication middleware in Node.js/Express, with expired-token handling and a sample protected route."
- **What the AI generated:** a middleware and a sample route, with an outdated dependency and no validation of environment variables.
- **What the team kept:** the middleware structure and the token verification flow.
- **What the team corrected or rejected, and why:** we updated the library, moved the secret to an environment variable and added tests. The sample route was rewritten to fit our user model.

### 23/11/2026 — Branch/Repository fix

- **Main prompt:** "Github how do I take one branch's content and insert it into another."
- **What the AI generated:** Step-by-step guide and help on transferring branch content.

### 23/11/2026 — Help with developing the app

- **Main prompt:** "I'm planning an app that's similar to Ifood for business around an education institute. The BackEnd will be made with Java, how can I start developing this application for mobile? WITHOUT giving me the full code, only help me with reaching the end goal." 
- **What the AI generated:** Suggestions of tools to use for the MVP.
- **What the team kept:** We will use Java + Spring Boot for BackEnd, PostgreSQL for the database and React Native + Expo for the interface/app.

### 24/11/2026 — Front end concept with Figma's AI
- **Main prompt:** "Make the layout of an app that lists off local businesses near a specific school. The app uses AI as its main tool to list the businesses' products."
- **What the AI generated:** The main menu of our app, with examples of categories (Food & Drinks, School Supplies, Everyday Essentials, Gifts & More).
**What the team kept:** Everything, except for the format.
**What the team corrected or rejected, and why:**  As said previously, the format. The AI made it a desktop application instead of a webview mobile app which is what we were going for, although this is just a concept, it's on me (Felipe) for not have stated that beforehand.

### 24/11/2026 — Correcting front end's format
- **Main prompt:** "It has to be a webview mobile app."
- **What the AI generated:** Just adjusted the last app it created to make it a webview mobile app.
- **What the team kept:** The layout, pretty much everything.
- **What the team corrected or rejected, and why:** Nothing as we fixed the issue from before.

### [date] — [task or section]

- **Main prompt:**
- **What the AI generated:**
- **What the team kept:**
- **What the team corrected or rejected, and why:**
