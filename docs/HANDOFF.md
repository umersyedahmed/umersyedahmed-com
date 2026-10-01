# Handoff — umersyedahmed.com redesign demo

This is a **demo redo** of [https://www.umersyedahmed.com/](https://www.umersyedahmed.com/). It replaces the old single-page layout with a new static site in this repository. It is meant to be shared and reviewed. It is not a production cutover.

## Live preview

**https://umersyedahmed-com-demo-umer.netlify.app**

This is a demo Netlify site only — not the live domain, and there is no DNS cutover. The preview still shows the previous design until this revision is redeployed.

## Direction

Phillip-inspired CV and portfolio, recreated in original CSS. Warm ivory page, near-black type, copper italic accents, diamond section markers, a left nav, an about collage, an experience timeline, skill chips, a project card grid, and a dark contact panel. Hostinger’s sample actor copy and brand assets are not used.

Assets in `public/`:

- `headshot.jpeg` — real photo in the hero and the about portrait
- `about-cartoon.jpg` — illustration in the about collage, captioned as an illustration
- `logo.jpg` — the existing site mark, used small in the footer and mobile header
- `favicon.ico` — generated from that logo (the file supplied as favicon.ico was a Netlify 404 page, not an icon)

Still open:

- Confirmed experience entries (one timeline row is explicitly a placeholder, including any Empower Health role)
- Project screenshots. The projects section is blank on purpose
- A CV PDF. The download button is hidden until that file exists
- Optional contact delivery via `.env.example`

## Stack

- Vite static site
- Vanilla HTML, CSS, and JavaScript (no React, no backend)
- Build output: `dist/`
- Node is only needed to install and build. The deployed site is files on a CDN.
- Netlify config: [`netlify.toml`](../netlify.toml) (`npm run build`, publish `dist`, Node 22)

## Deploy notes

Use a **new** Netlify site so the current production site keeps serving www.umersyedahmed.com.

1. Netlify → Add new site → Import `umersyedahmed/umersyedahmed-com`.
2. Build command: `npm run build`. Publish directory: `dist`. `netlify.toml` sets these if the UI would otherwise guess.
3. Leave the production site and its domain attachment alone.
4. Share the new `*.netlify.app` URL.

Contact delivery is optional and build-time:

| Variable | Effect |
| --- | --- |
| Neither set | Form validates, then tells the visitor to use LinkedIn or GitHub. Nothing is sent. |
| `VITE_CONTACT_EMAIL` | Form opens the visitor’s email app with the note filled in. |
| `VITE_FORMSPREE_FORM_ID` | Form POSTs to `https://formspree.io/f/<id>`. This wins if both are set. |

Copy [`.env.example`](../.env.example) to `.env` locally, or set the same names in Netlify → Environment variables, then rebuild. Vite inlines `VITE_*` values into the public JavaScript bundle. A Formspree form id is public. Do not put secrets in these variables.

## Mock vs real

| Piece | Status |
| --- | --- |
| Page design | Original CSS in a Phillip-like CV rhythm. Not Hostinger template code, sample copy, or brand assets. |
| About | Carol Stream / Chicago. Builds stable, mobile-friendly websites and apps. Portrait is the real headshot. The second frame is an illustration. |
| Experience | The independent web-developer row matches the public site. The second row is marked Placeholder and is not a verified job. |
| Skills | HTML, CSS, JavaScript, responsive layout, Git, GitHub, Vite, Netlify, accessibility. |
| Projects | Blank until screenshots exist. No stand-in interface art. |
| Social links | The same public profiles as the live site: [LinkedIn](https://www.linkedin.com/in/umer-ahmed-9516611b7/), [GitHub](https://github.com/umersyedahmed), [Twitter](https://twitter.com/umersyedahmed). |
| Contact form | No fake backend and no `action="#"`. Delivery works only when an env var above is set. Otherwise the form says so and points at LinkedIn and GitHub. CV download is hidden until a PDF exists. |
| Production site | Unchanged. This demo does not edit DNS, Namecheap, or the Netlify site that currently serves the domain. |

## What this demo does not do

Production DNS, Namecheap, and the existing Netlify site are out of scope. Pointing www.umersyedahmed.com at this redesign is a **separate** step and needs Umer’s explicit ask.

## Ownership and cutover steps

Do these only when someone asks. Merging the redesign PR updates `main` in this GitHub repo. That alone does not change the live domain.

1. Review the pull request and merge it to `main` when the demo looks right.
2. For a shareable preview, create a new Netlify site from this repo (steps above). Confirm the site name is new and that www.umersyedahmed.com is still on the old site.
3. If the form should send mail, create a Formspree form or choose a real inbox, set the env var, and trigger a new deploy.
4. When Umer explicitly asks to replace the live site:
   - Add the custom domain to the **new** Netlify site.
   - Update Namecheap DNS to the records Netlify shows for that site (or switch nameservers if that is the path Netlify recommends at the time).
   - Wait for HTTPS, then check the homepage, project links, and contact form on a phone and a desktop.
   - Keep the old Netlify site until the new one is confirmed, then unpublish or leave it unused.
5. This GitHub repo is already under `umersyedahmed`. If it ever needs another owner: GitHub → Settings → General → Danger Zone → Transfer ownership. Add collaborators under Settings → Collaborators before a transfer if other people still need access.
