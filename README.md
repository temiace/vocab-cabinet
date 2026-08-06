# Word Cabinet

A daily vocabulary app: one word a day, a use-it-or-not tracker, field notes,
and six auto-progressing difficulty levels. Runs entirely on your machine —
your data is saved in your browser's local storage.

## 1\. Install Node.js (skip if you already have it)

Node.js is the runtime that lets you run `npm` (the tool that installs and
runs this project). Check if you already have it:

```
node -v
npm -v
```

Open a terminal (macOS: Terminal app, Windows: Command Prompt or
PowerShell) and run those two commands.

* **If you see version numbers** (e.g. `v20.11.0`) — you're set, skip to step 2.
* **If you get "command not found"** — download the LTS installer from
[nodejs.org](https://nodejs.org) and run it. It installs both `node` and
`npm` together. Restart your terminal afterward and re-run the commands
above to confirm.

## 2\. Install the project's dependencies

From inside this folder:

```
npm install
```

This reads `package.json` and downloads React, Vite, and the icon library
into a `node\\\_modules` folder. You only need to do this once (and again any
time `package.json` changes).

## 3\. Run it

```
npm run dev
```

Vite will start a local server and print a URL, usually
`http://localhost:5173`. Open that in your browser — that's the app.

Leave this terminal running while you use the app; it's your live dev
server. `Ctrl+C` stops it.

## 4\. Open it in IntelliJ IDEA

1. **File → Open**, select the `vocab-cabinet-app` folder.
2. IntelliJ will detect `package.json` and may prompt to run `npm install`
for you — let it, or use the terminal method above.
3. Open `src/App.jsx` — you should get full syntax highlighting and
autocomplete. (This works out of the box on IntelliJ IDEA 2026.1+; on
older versions you'd need the JavaScript and TypeScript plugin from
**Settings → Plugins**.)
4. IntelliJ has a built-in terminal (**View → Tool Windows → Terminal**) —
you can run `npm run dev` from there instead of a separate terminal app.

## Project layout

```
vocab-cabinet-app/
├── index.html          # page shell Vite serves
├── package.json         # dependencies + scripts
├── vite.config.js       # build tool config
└── src/
    ├── main.jsx          # entry point — wires up storage, renders App
    ├── App.jsx           # the whole app: word bank, UI, logic
    ├── storage.js         # local-storage adapter (swap this out for a
    │                       real database later, e.g. Supabase)
    └── index.css          # minimal global styles
```

## Known limitation (by design, for now)

Data is saved via your browser's `localStorage`, scoped to `src/storage.js`.
That means:

* It's per-browser, per-device — no syncing between your laptop and phone.
* Clearing your browser's site data will wipe your word history.

When you're ready, swapping `storage.js` for a Supabase-backed version is a
contained change — nothing in `App.jsx` needs to know the difference.



