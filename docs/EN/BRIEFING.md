# Theme briefing: Neighborhood showcase

**English** · [Português (Brasil)](BRIEFING.pt-BR.md)

**Hack with AI: Coding with Intelligence**  
Senac na Prática · Technical Program in Systems Development  
Area: campus life and community  
Immersion from 23 to 29 November · presentations on 30 November and 1 December

This briefing is the starting point for **your** theme. Read it carefully, cut an MVP that fits in one week, and record your decisions. You will turn this problem into a real product, with a front end and a back end, an organized repository, and documented use of AI. This is a collaborative immersion: the panel evaluates what the team built, decided, and learned.

## Theme and context

**Neighborhood showcase** — A digital showcase for nearby small businesses, with AI generating product descriptions.

Around Senac Canoas — near Rua Mathias Velho and the routes that students and staff walk every day — there are snack bars, stationery shops, print shops, and other small businesses that support campus life. Many have little digital presence: the menu is on a sheet of paper, the day's special is only mentioned at the counter, and writing a clear product description takes time the owner barely has. On the other side, people who study or work at Senac often do not know what exists a few blocks away.

You will build a digital showcase for this nearby commerce, in which AI helps write descriptions, always with a review by someone who knows the product.

## Audience and personas

- **A student or staff member looking for something near campus:** lunch, supplies, printing, a quick service.
- **An owner or person responsible for a small nearby business:** wants to publish the essentials (hours, what they offer) without writing everything from scratch.
- **Someone who will represent the shopkeeper in the demo:** needs a simple flow to add a product and accept or edit the generated text.

## Goal

Ship an MVP showcase in which a visitor can find nearby businesses and products, and the person who manages a shop can add items with a photo and short notes so that AI can propose a description — which goes live only after review.

## Minimum requirements (MVP)

The scope below is realistic for one week. Lock it on the first day and record in `DECISIONS.md` what is in, what is out, and why. A complete, demonstrable flow is better than a long list left half-done.

1. List nearby businesses with a name, category, address or landmark, and opening hours.
2. Open a business page, with its products or services.
3. Add a product with a photo and a few notes (ingredients, approximate price, what stands out) and generate the description with AI.
4. Review and edit the generated text before publishing.
5. Search and filter businesses and products by category or keyword.
6. A simple profile for the person who manages the business (in the MVP, a shopkeeper user is enough).

## Where AI comes in

The use of AI is allowed and encouraged — in the product and in the process — and it must appear in `AI_LOG.md`. Some concrete starting points for this theme:

- Generate the product description from the photo and notes, in a tone that fits a neighborhood business.
- Suggest a category and a short title, for review.
- Help write a brief “about the business” text if the person only has a few bullet points.
- Keep the description honest: do not invent ingredients, promotions, or features that nobody provided.

Do not publish, without your review, an AI-generated text or automatic decision as if it were already the final version.

## Optional extras

Only after the MVP is standing. These are ideas, not obligations:

- An “open now” hint, based on the registered hours.
- A map or visual landmark of the area around campus.
- A student's favorites list.
- A highlight for a business's suggestion of the day.

## Out of scope

To protect the deadline and the focus of the product:

- Payments, a cart, delivery, and fulfillment logistics.
- A full online-store flow, with official stock and checkout.
- Unmoderated public reviews that could unfairly expose a business during this week.
- Automatically listing any company in the city — the scope is the area around campus.

## Questions to guide the team

Use these questions on the first day, when you define the MVP, and again before the demo:

- Where does the first list of businesses in the demo come from — a sample set from the neighborhood is enough and transparent?
- Who can edit a business page?
- How do you keep AI from inventing a detail the shopkeeper has not confirmed?
- What happens if the photo is poor or the notes are too vague?
- How does the showcase make it clear that it is a window display, not an ordering and payment app?

## Deliverables and how the panel evaluates

This is a one-week **collaborative immersion**, with teams of 3 or 4 TDS students. The panel evaluates **your** work, on your own project — formative feedback, not a comparison with other teams.

**What must be in the repository** (at the root), in **English** (the main version) and in **Portuguese** (`.pt-BR`), with a language link at the top of each file:

- `README.md` and `README.pt-BR.md`
- `DECISIONS.md` and `DECISIONS.pt-BR.md`
- `AI_LOG.md` and `AI_LOG.pt-BR.md`

The application must have a **front end and a back end**. The back end may be **Java**, **Python**, or **Node.js** (alone or combined, as long as they are integrated). A front end is required (web, desktop, or mobile). Justify the stack in `DECISIONS.md`. Also required: a Conventional Commits history, work through reviewed Pull Requests, a protected `main` branch, and a green **GitHub Actions** pipeline (build, lint, and tests) on PRs and on `main`. Do not commit secrets. On the first day, add the instructor as a collaborator: **adrianoanschau@gmail.com**.

**Code freeze** is on Sunday, **29 November, at 23:59**. Presentations are **15 minutes + 5 minutes of questions**, on 30 November and 1 December, at Senac Canoas, Room 103. Rehearse the demo and the required outline (problem and solution, live demo, workflow, decisions, AI in practice, and CI/CD).

Evaluation is split equally between **two panels**:

- **Technical panel (50%):** code quality and architecture; Git, Conventional Commits, and PRs; CI/CD; command of the code in the Q&A.
- **Innovation and Impact panel (50%):** originality; impact (the real problem and for whom); user experience; clarity of the pitch; creative use of AI.

Anyone on the team may be asked about any part of the project. Use AI thoughtfully, record what it generated and what you corrected, and own the code you present.

Good work — and may the week be intense, collaborative, and well documented.

