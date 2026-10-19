
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

 (see
  security note above).
