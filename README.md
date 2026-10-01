# Umer Ahmed — portfolio demo

A CV and portfolio for [Umer Ahmed](https://www.umersyedahmed.com/), built as an original page in the editorial spirit of a warm ivory personal site: a centered hero, a left section nav, and CV sections below. It is not Hostinger’s Phillip template, sample copy, or brand assets.

The page is for a web developer in Carol Stream, Illinois: about, experience, skills, projects, and contact. Headshot, about stills, one experience row, the Empower Health card, and the CV download are placeholders until real assets arrive.

This repository does not change the live site. Production DNS, the current Netlify site, and Namecheap stay as they are until Umer explicitly asks for a cutover. See [docs/HANDOFF.md](docs/HANDOFF.md).

## Live preview

**https://umersyedahmed-com-demo-umer.netlify.app**

This is a demo Netlify site only — not the live domain, and there is no DNS cutover.

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
