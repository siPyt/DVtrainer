# DV Trainer

A dark-mode study-card web app for learning **Emerson DeltaV** function blocks and system implementation. Pick a difficulty level and a set of source material, then drill flashcards or run a self-test.

> All study-card content is **derived study material** written from a set of DeltaV manuals. The original manuals themselves are copyrighted Emerson training materials and are **not** included in this repository.

## Features

- **Three levels** — Beginner, Intermediate, Expert.
- **Material scopes** — Function Block manuals, the Implementation course, or All manuals.
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
│   └── cards.js       # card dataset (DV_MANUALS + DV_CARDS)
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
