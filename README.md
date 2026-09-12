# DV Trainer

A dark-mode study-card web app for learning **Emerson DeltaV** function blocks and system implementation. Pick a difficulty level and a set of source material, then drill flashcards or run a self-test. Ships with **~1,300 study cards** spanning ~60 function blocks (every parameter), modes/cascade/status behavior, PID, and DeltaV implementation.

> All study-card content is **derived study material** written from a set of DeltaV manuals. The original manuals themselves are copyrighted Emerson training materials and are **not** included in this repository.

## Features

- **Three levels** — Beginner, Intermediate, Expert.
- **Material scopes** — Function Block manuals, the Implementation course, or All manuals.
- **Deep parameter coverage** — a card for every parameter of every documented function block, plus “coding with parameters” (fields, references, named sets, option bitstrings, expressions).
- **Two study modes** — Flashcards (flip to reveal) and Self-Test (rate recall: Again / Hard / Good / Easy).
- **Progress tracking** — mastered cards are remembered per level/scope in `localStorage`.
- **Filter & search** — narrow the deck by keyword or topic.
- **Keyboard shortcuts** — `Space`/`Enter` to flip, `←`/`→` to navigate.
- **Extensible** — add manuals and cards and the home screen counts update automatically.

## Run it

No build step. Open `index.html` in any modern browser, or serve the folder:

```bash
# Python
python -m http.server 8080
# then visit http://localhost:8080
```

## Project structure

```
DV-Trainer/
├── index.html        # markup + view containers
├── styles.css        # dark theme
├── app.js            # study/session logic, progress, filters
├── data/
│   ├── cards.js            # curated card dataset (DV_MANUALS + DV_CARDS)
│   └── cards_generated.js  # auto-generated per-block parameter cards
└── make_icons.py      # optional: generate app icons (needs Pillow)
```

## Adding content

Edit `data/cards.js`:

```js
// Register a manual (its scope decides the home-screen grouping)
DV_MANUALS.mykey = {
  name: "My Manual",
  short: "Mine",
  scope: "function-block",
};

// Add cards
DV_CARDS.push({
  manual: "mykey",
  topic: "My Topic",
  level: "beginner", // beginner | intermediate | expert
  front: "Question?",
  back: "Answer.",
});
```

Scopes: `function-block` and `implementation`. The **All Manuals** option always includes everything.
