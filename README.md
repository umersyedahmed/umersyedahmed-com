# Umer Ahmed — portfolio demo

A CV and portfolio for [Umer Ahmed](https://www.umersyedahmed.com/), built as an original page in the editorial spirit of a warm ivory personal site: a centered hero, a left section nav, and CV sections below. It is not Hostinger’s Phillip template, sample copy, or brand assets.

The page is a full stack web developer CV: intro, about, experience, skills, and contact. Copy comes from Umer’s resume. Experience is Empower Health Services (July 2022–present). Qissati is mentioned in About as still in progress. There is no projects section. The resume has no education section, so the page does not either. The hero and about portrait use Umer’s headshot. The second about frame is an illustration. The tab icon and small mark use the existing site logo. A CV PDF is not in yet. The public page does not list a phone number.

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

The contact form posts to Netlify Forms and does not use environment variables. The email recipient is set in Netlify form notifications.

## Stack

Vite, with vanilla HTML, CSS, and JavaScript. No server, no database, and no runtime dependencies beyond the static build.
