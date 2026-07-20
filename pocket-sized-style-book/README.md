# Pocket-Sized Style Book — Alpha / MVP

A personal style curator: a 12-question aesthetic quiz feeds into an
LLM-generated style profile, matched style icons, and a curated
shopping list. Built as the Alpha for the Creative Practice Module 2
Project Check-In.

## Must-Have features implemented

- **Aesthetic Quiz** — 12 questions, image/emoji option cards, scored
  across 6 predefined aesthetic categories, with a tiebreaker flow if
  two categories tie for the top score.
- **LLM-Powered Style Profile** — calls Claude with a structured,
  JSON-only system prompt constrained to the 6 categories; falls back
  to a template-based profile if the call fails or returns something
  malformed/out-of-scope.
- **Style Icon Recommendations** — 2 reference icons per category.
- **Curated Shopping Suggestions** — 6 hand-picked items per category
  with ZAR price ranges.

## Folder structure

```
pocket-sized-style-book/
├── index.html              Vite entry HTML
├── package.json
├── vite.config.js
├── .env.example             Copy to .env to enable the live LLM call
└── src/
    ├── main.jsx              React entry point
    ├── App.jsx                Screen state machine (intro/quiz/loading/results)
    ├── components/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── IntroScreen.jsx
    │   ├── QuizScreen.jsx
    │   ├── ProgressBar.jsx
    │   ├── OptionCard.jsx
    │   ├── LoadingScreen.jsx
    │   ├── ResultsScreen.jsx
    │   ├── IconCard.jsx
    │   └── ShopCard.jsx
    ├── data/
    │   ├── categories.js      The 6 predefined aesthetic categories
    │   ├── questions.js       Quiz questions + tiebreaker questions
    │   ├── styleIcons.js      Curated style icon references
    │   └── shopItems.js       Curated shopping suggestions
    ├── utils/
    │   ├── scoring.js         Quiz scoring + tie detection
    │   └── llm.js             Claude API call + fallback logic
    └── styles/
        ├── index.css          Global reset + design tokens
        ├── App.css            App shell styles
        ├── IntroScreen.css
        ├── QuizScreen.css
        └── ResultsScreen.css
```

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Enabling the live LLM call (optional)

By default there's no API key configured, so every run uses the
built-in fallback profile generator — which is itself one of the
PRD's required edge cases, so the app is fully functional either way.

To try the real Claude call:

```bash
cp .env.example .env
# then edit .env and paste in an Anthropic API key
npm run dev
```

**Security note:** this calls the Anthropic API directly from the
browser, which ships the key into client-side JS. That's fine for
local testing but is flagged as a known gap in the Progress Report —
before Beta, this call should move behind a small backend or
serverless proxy so the key is never exposed to the client.

## Build for production

```bash
npm run build
npm run preview
```

## Known gaps (see Progress Report for full detail)

- No backend/database yet — quiz sessions and profiles aren't persisted.
- No real user testing has taken place yet.
- Shopping and style-icon data is hardcoded rather than database-backed.
- Direct browser-to-Anthropic-API calls are not production-safe (see
  security note above).
