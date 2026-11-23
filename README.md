# Interface Formulas

A self-contained editorial website exploring 45 sourced design-engineering recipes for CSS, typography, buttons, cards, icon buttons, and layout.

## Start

No npm install or build step required:

```bash
cd design-formulas-site
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Features

- 45 individual recipe articles, browsable by chapter and search
- Interactive live SVG geometry diagrams with three sliders each
- Toggleable annotated pixel-value guides, reset, and copy CSS
- Source attribution, documented-vs-derived labels, caveats, and prev/next navigation
- Responsive editorial layout, keyboard search (`/` or `Cmd/Ctrl K`), reduced-motion support
- Zero third-party JavaScript dependencies

## Project structure

- `index.html` — page shell
- `styles.css` — theme, tokens and responsive layout
- `app.js` — routing, interactions, article rendering and SVG diagram generation
- `data.js` — static recipe dataset, so the site also works when opened as a file
- `recipes.json` — original, machine-readable dataset

## Attribution

The editorial approach takes inspiration from [Jakub Krehel's writing](https://jakub.kr/writing/details-that-make-interfaces-feel-better), but is an independent original implementation. Colors, typography, layout, diagrams and text are not a copy of the reference site. Every recipe includes its own credited source URL and evidence classification.

## Notes

The SVG lab is a category-level teaching illustration whose inputs vary live. It is not a full browser CSS renderer, nor a bespoke visualization of each of the 45 formulas. The formula, example CSS and citations are specific to each recipe.
