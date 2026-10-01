# Umer Ahmed — portfolio demo

A static redesign of [umersyedahmed.com](https://www.umersyedahmed.com/) for review and sharing. It is a mobile-first personal site: navigation, hero, three services, three selected projects, about, and contact.

This repository does not change the live site. Production DNS, the current Netlify site, and Namecheap stay as they are until Umer explicitly asks for a cutover. See [docs/HANDOFF.md](docs/HANDOFF.md).

## Run locally

```bash
npm install
npm run dev
```

Vite prints a local URL, usually http://localhost:5173.

Production build:

```bash
npm run build
npm run preview
```

`npm run build` writes the static site to `dist/`.

## Netlify

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |

[`netlify.toml`](netlify.toml) already sets both, plus Node 22. Create a **new** Netlify site from this repo if you want a shareable draft URL. Do not attach it to the existing production site as part of this demo.

Optional contact settings are in [`.env.example`](.env.example). Copy that file to `.env` for local use, or set the same variable names in Netlify. Leave them empty and the contact form tells visitors to use LinkedIn or GitHub instead of pretending to send.

## Stack

Vite, with vanilla HTML, CSS, and JavaScript. No server, no database, and no runtime dependencies beyond the static build.
