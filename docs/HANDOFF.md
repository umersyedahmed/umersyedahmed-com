# Handoff — umersyedahmed.com redesign demo

This is a **demo redo** of [https://www.umersyedahmed.com/](https://www.umersyedahmed.com/). It replaces the old single-page layout with a new static site in this repository. It is meant to be shared and reviewed. It is not a production cutover.

## Live preview

**https://umersyedahmed-com-demo-umer.netlify.app**

This is a demo Netlify site only — not the live domain, and there is no DNS cutover.

## Direction

Phillip-inspired CV, recreated in original CSS. Warm ivory page, near-black type, copper italic accents, diamond section markers, a left nav, an about collage, an experience timeline, skill chips, and a dark contact panel. Hostinger’s sample actor copy and brand assets are not used. There is no projects section.

Assets in `public/`:

- `headshot.jpeg` — real photo in the hero and the about portrait
- `about-cartoon.jpg` — illustration in the about collage, captioned as an illustration
- `logo.jpg` — the existing site mark, used small in the footer and mobile header
- `favicon.ico` — generated from that logo (the file supplied as favicon.ico was a Netlify 404 page, not an icon)

Still open:

- A CV PDF. The download button is hidden until that file exists
- Real project write-ups, when Umer wants them. Qissati is the only project named, and the page says it is still in progress

The resume has no education section, so the page does not add one. The phone number on the resume is not on the public page.

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

Contact delivery uses Netlify Forms. The form is static HTML in `dist/index.html` (`name="contact"`, `method="POST"`, `data-netlify="true"`), because this site is deployed with `netlify deploy --dir=dist` and is not Git-connected. Netlify detects the form from that built file. No environment variables are required.

The email recipient is set in Netlify form notifications: Project configuration → Forms → Form notifications. Add the address that should receive submissions there.

With JavaScript, the page posts `application/x-www-form-urlencoded` to `/` and shows a success or error line on the page. Without JavaScript, the form posts to `/thanks`.

## Mock vs real

| Piece | Status |
| --- | --- |
| Page design | Original CSS in a Phillip-like CV rhythm. Not Hostinger template code, sample copy, or brand assets. |
| About | Resume summary: 4+ years with TypeScript, Angular, and Node.js, and API work. Qissati is named as still in progress. Portrait is the real headshot. The second frame is an illustration. |
| Experience | Empower Health Services, Full Stack Developer, July 2022–present, Aurora, IL. |
| Skills | The resume technology list, plus spoken languages: English, Urdu, and Modern Standard Arabic. |
| Projects | No projects section. Qissati is the only project mentioned, in About, and it is marked in progress. |
| Social links | Email `umersyedahmed@gmail.com`, [LinkedIn](https://www.linkedin.com/in/umersyedahmed), [GitHub](https://github.com/umersyedahmed). No phone number. |
| Contact form | Netlify Forms. The built `dist/index.html` includes the form. The email recipient is set in Netlify form notifications. No env vars. CV download is hidden until a PDF exists. |
| Production site | Unchanged. This demo does not edit DNS, Namecheap, or the Netlify site that currently serves the domain. |

## What this demo does not do

Production DNS, Namecheap, and the existing Netlify site are out of scope. Pointing www.umersyedahmed.com at this redesign is a **separate** step and needs Umer’s explicit ask.

## Ownership and cutover steps

Do these only when someone asks. Merging the redesign PR updates `main` in this GitHub repo. That alone does not change the live domain.

1. Review the pull request and merge it to `main` when the demo looks right.
2. For a shareable preview, create a new Netlify site from this repo (steps above). Confirm the site name is new and that www.umersyedahmed.com is still on the old site.
3. If the form should send mail, set the email recipient in Netlify form notifications (Project configuration → Forms → Form notifications).
4. When Umer explicitly asks to replace the live site:
   - Add the custom domain to the **new** Netlify site.
   - Update Namecheap DNS to the records Netlify shows for that site (or switch nameservers if that is the path Netlify recommends at the time).
   - Wait for HTTPS, then check the homepage, section links, and contact form on a phone and a desktop.
   - Keep the old Netlify site until the new one is confirmed, then unpublish or leave it unused.
5. This GitHub repo is already under `umersyedahmed`. If it ever needs another owner: GitHub → Settings → General → Danger Zone → Transfer ownership. Add collaborators under Settings → Collaborators before a transfer if other people still need access.
