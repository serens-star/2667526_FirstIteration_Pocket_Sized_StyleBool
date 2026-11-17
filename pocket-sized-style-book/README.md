# Pocket-Sized Style Book

A web app that turns a 12-question quiz into a named fashion aesthetic, an AI-written style profile, style icons and six affordable South African shopping picks (in rand). Players "try on" each option on an illustrated character before they commit to an answer. The outfit and hairstyle chosen in the first two questions stay on the character to the end of the quiz.

Built by Seren Mafunda (student 2667526) as an individual project with React 18 and Vite.

**Live site:** `<add your Vercel link here>`

## What it does

1. **Splash and landing.** A splash screen leads to an illustrated landing page with two buttons: *Sign In* and *Explore App*.
2. **Sign in or continue as guest.** A local sign-in (name and email, validated). Details are stored only on the device, with no password and no server.
3. **Illustrated quiz.** 12 questions, three options on each side of a character. Clicking an option previews it: the outfit (question 1) and hairstyle (question 2) change the character and stay on it, and every other option appears on a placard. *Next* records the answer; *Back* undoes it.
4. **Tiebreaker.** If the top scores are level, a short extra round asks only about the tied aesthetics. This works for ties of any size, from two to all six. A sudden-death question follows if needed, so a tie always ends.
5. **Results.** A named aesthetic (one of six), a style profile, three tips, style icons and shopping picks.
6. **Explainable AI.** A *Why this result* panel shows a calculated confidence level (High, Medium or Low) and the score for every aesthetic. *Yes / Not quite* feedback is saved on the device.
7. **Wishlist.** Heart any shopping pick; the list is saved on the device.

The six aesthetics are Quiet Luxury (QL), Streetwear (SW), Alternative (AL), Boho / Earthy (BE), Y2K (Y2K) and Whimsy (WH).

## How the AI is kept honest

- The model may only choose one of the six aesthetic names and must reply in JSON.
- The reply is validated. If it is invalid, or the call fails, a template built from the user's own answers is used and a banner says so.
- Confidence is calculated from the quiz scores, never by the model.
- The Gemini key stays on the server. The browser calls `/api/generate` (a Vercel function, or the Vite server in development), which holds the key, limits prompt size (6000 characters) and requests (20 per minute per IP), and never returns upstream error details.

## Run it locally

You need Node.js 20.19 or newer (required by Vite 8).

```bash
npm install
cp .env.example .env     # then edit .env (see below)
npm run dev              # http://localhost:5173
```

Without a key the app still works: results use the built-in fallback profile.

### Environment variables

Set these in `.env` locally, and in the Vercel project settings when deployed. **Never commit a real key.**

| Variable | Where | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | server only | Google Gemini key used by the proxy |
| `VITE_AI_PROXY` | browser | Set to `/api/generate` so the browser uses the proxy |
| `GEMINI_MODEL` | server, optional | Overrides the default model (`gemini-3.5-flash-lite`) |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | server, optional | Use Claude instead of Gemini |

The `VITE_GEMINI_API_KEY` and `VITE_ANTHROPIC_API_KEY` options in `.env.example` put the key in the browser. Use them for quick local experiments only and leave them empty when deploying.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server (includes the `/api/generate` proxy) |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the automated tests (91 tests, pure logic) |
| `npm run check:llm` | Make one real AI call and print the reply, to prove the live path works |

## Deploy (Vercel)

1. Import the GitHub repository. If the project sits in a sub-folder, set *Root Directory* to `pocket-sized-style-book`.
2. Add the environment variables `GEMINI_API_KEY` and `VITE_AI_PROXY=/api/generate`.
3. Deploy. Every push to `main` redeploys.

## Adding illustrations

Artwork lives in `public/illustrations/` and is picked up automatically; a missing file shows a neutral placeholder. See `public/illustrations/README.md` for file names and sizes. In short:

- `character.png`, the plain character.
- `character_outfit_<OUTFIT>_hair_NONE.png`, each Saturday outfit on the bald character (all six drawn). The outfit chosen in question 1 stays on the character for the rest of the quiz.
- `character_outfit_<OUTFIT>_hair_<HAIR>.png`, each hairstyle on each outfit (question 2). Streetwear and Alternative hair are drawn for every outfit; `character_hair_<CODE>.png` is the fallback.
- `<slot>/<CODE>.png`, a 3:2 picture per option for the placard questions.

Which question uses which layout is set in `src/data/stage.js`.

## Project structure

```
pocket-sized-style-book/
├── index.html, package.json, vite.config.js   Vite setup (vite.config.js also runs the dev proxy)
├── .env.example                                 Environment variable template (no real keys)
├── api/generate.js                              Vercel function that calls the AI
├── server/generate.js                           Proxy logic: validation, limits, hidden errors
├── scripts/check-llm.js                         Live AI check (npm run check:llm)
├── docs/sample-profile.json                     Example AI reply
├── public/
│   ├── images/                                  Landing, sign-in and splash artwork
│   └── illustrations/                           Quiz character and option artwork
├── src/
│   ├── App.jsx                                  Screen flow: splash, landing, quiz, loading, results, wishlist
│   ├── components/                              Screens and pieces (QuizScreen, Stage, OptionCard, ResultsScreen, SignInModal...)
│   ├── data/                                    categories, questions, stage layout, style icons, shop items
│   ├── utils/                                   scoring, tiebreak, quizLayout, llm, explain, feedback, wishlist
│   └── styles/                                  CSS for each screen
└── tests/                                       Vitest tests for scoring, ties, layout, AI layer, proxy, wishlist
```

## Data stored on the device

| Key | Holds |
| --- | --- |
| `psb_user` | Name and email from sign-in |
| `psb_feedback` | Yes / Not quite feedback on results |
| `psb_wishlist` | Saved shopping picks |

Nothing is sent to a server except the quiz answers used to write the style profile.

## Known limitations

- The sign-in is local to the device and is not real authentication.
- Tests cover logic only. There are no automated interface tests.
- Option artwork for several quiz questions is still being drawn, so some options show placeholders.
