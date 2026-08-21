# CLOSATIX Website — GitHub Pages Edition

Static marketing site for CLOSATIX, a managed AI lead automation service for property management companies and real estate teams.

There is no framework, build command, package manager or server-side code. Upload the files to a GitHub repository and serve them directly with GitHub Pages.

## What this version communicates

- CLOSATIX is a **managed implementation and ongoing service**, not self-serve software.
- The primary audience is property management companies and real estate teams with consistent inbound inquiries.
- The client journey is clear: audit, build, validate, launch and manage.
- The product demo uses a fictional Canadian inquiry.
- The integrations shown match the current implementation stack.
- No unconnected form is exposed to prospects.
- No testimonials, conversion claims or client results are invented.

## Folder structure

```text
.
├── index.html                 Main marketing site
├── demo.html                  Embedded product demonstration
├── privacy.html               Current website privacy notice
├── terms.html                 Website terms
├── 404.html                   GitHub Pages fallback page
├── robots.txt                 Search crawler instructions
├── BACKLOG.md                 Deferred launch and production items
├── README.md                  This file
├── favicon.ico
├── apple-touch-icon.png
├── .nojekyll
└── assets/
    ├── closatix-logo.png
    ├── closatix-og.png
    ├── demo.css
    └── demo.js
```

## One external item to verify before outreach

Every booking button currently points to:

```text
https://cal.com/rami-sebaie/closatix-discovery-call
```

Open that URL in an incognito/private browser window and confirm that:

1. the event exists;
2. a visitor can choose a time;
3. the event title and description are client-facing;
4. the booking questions are correct; and
5. confirmations reach the intended calendar and email.

The URL appears in `index.html`, `demo.html`, `privacy.html` and `terms.html`. Use Find and Replace across the project if the event slug changes.

## Deploying with GitHub Pages

1. Create a new GitHub repository.
2. Upload the **contents of this folder** to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`.
6. Save and wait for the GitHub Pages URL.
7. Test the homepage, demo, mobile menu, FAQ, legal pages and every booking button.

The `.nojekyll` file should remain at the repository root.

## Custom domain later

The site works without a custom domain. Until one is connected, canonical and social-card paths are relative so the site does not claim an unowned domain.

After the real domain is connected:

1. Replace `<link rel="canonical" href="./">` in `index.html` with the final absolute URL.
2. Add an absolute `og:url` meta tag.
3. Replace the relative `og:image` and `twitter:image` values with the final absolute image URL.
4. Replace the relative canonical in `demo.html`.
5. Add the domain in GitHub Pages settings and create the generated `CNAME` file.
6. Re-test the link preview with the final live URL.

## Lead Flow Audit section

The previous seven-field audit form was intentionally removed from the live interface because it did not have a production backend. The current section sends visitors to a discovery call and does not collect data on the website.

The planned production flow remains:

```text
Audit Form → Make webhook → HubSpot contact record → internal notification/email
           → optional Discovery Call routing
```

See `BACKLOG.md` before restoring a form.

## Legal pages

`privacy.html` and `terms.html` describe the current public website behaviour and contain no legal-entity, address or jurisdiction placeholders. They are not a replacement for professional legal review.

When the company structure, official notices email, business address and governing law are finalised, have a qualified Canadian professional review and update the legal pages and service agreement.

## Editing

The homepage CSS and JavaScript are inside `index.html`. The product demo has separate files:

- `demo.html`
- `assets/demo.css`
- `assets/demo.js`

Useful searches inside `index.html`:

| Change | Search for |
|---|---|
| Booking URL | `BOOKING_URL` |
| Hero copy | `HERO` |
| Implementation journey | `HOW IT WORKS` |
| Integrations | `CURRENT IMPLEMENTATION STACK` |
| Founding-client message | `FOUNDING CLIENT CTA` |
| Lead audit | `LEAD FLOW AUDIT` |
| FAQ | `FAQ` |

## Pre-outreach check

Before sending the site to prospects:

- confirm the Cal.com event works;
- open the live site on a phone and desktop;
- watch the full demo once;
- verify the legal pages and footer links;
- do not publish a client result until it is real, measured and approved; and
- do not describe an integration as supported until compatibility has been confirmed.
