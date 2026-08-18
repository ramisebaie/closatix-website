# CLOSATIX — Website

Marketing site for CLOSATIX, an AI lead automation system for real estate teams.

Static HTML. No build step, no dependencies, no framework. Every file here is
uploaded exactly as-is.

---

## Folder structure

```
.
├── index.html              Home page — the whole site is in this one file
├── privacy.html            Privacy Policy (linked from the footer)
├── terms.html              Terms of Use (linked from the footer)
├── favicon.ico             Browser tab icon — must stay at the root
├── apple-touch-icon.png    iOS home-screen icon — must stay at the root
└── assets/
    ├── closatix-logo.png   Wordmark used in the navigation and footer
    └── closatix-og.png     1200×630 card shown when the link is shared
```

`index.html` is self-contained: the CSS and JavaScript are inside it. That is
deliberate — one file means nothing can fall out of sync, and the page loads in
a single request.

---

## Before this goes live

Two things must be done or the site will look broken to visitors.

### 1. Replace the placeholder domain

Open `index.html` and find every instance of `https://closatix.com`, then
replace it with the real domain. It appears in five places:

| Tag | Why it matters |
|---|---|
| `<link rel="canonical">` | Tells Google which URL is the real one |
| `og:url` | Link previews |
| `og:image` | The image shown when the link is shared |
| `twitter:image` | Same, on X |
| JSON-LD `url` / `logo` | Structured data for search engines |

Any text editor's Find & Replace will do this in one action.

### 2. Create the Cal.com event

The booking buttons point at:

```
https://cal.com/rami-sebaie/closatix-discovery-call
```

That event must exist in your Cal.com account. The URL appears in two places
in `index.html` — as `href=""` on the buttons, and as a constant near the
bottom of the file. The duplication is intentional: the buttons still work if
JavaScript is blocked. Find & Replace across the whole file if it changes.

---

## The Lead Automation Audit form

The `#audit` section holds a seven-field form. **It does not send anything
yet, and it does not pretend to.** Submit a valid form today and the visitor
is told plainly that the form is not connected, and offered a pre-filled
email instead. Nothing is silently lost.

To turn on real delivery, set one constant near the bottom of `index.html`:

```js
const AUDIT_FORM_ENDPOINT = "";   // <- currently empty
const CONTACT_EMAIL = "hello@closatix.com";
```

### Option 1 — Netlify Forms (easiest, no backend, free tier)

1. Set `AUDIT_FORM_ENDPOINT = "netlify"`
2. Add these two attributes to the `<form>` tag in `index.html`:
   ```html
   <form class="audit-form" id="auditForm" novalidate
         name="audit" data-netlify="true" netlify-honeypot="bot-field">
   ```
3. Add this hidden field as the form's first child:
   ```html
   <input type="hidden" name="form-name" value="audit">
   ```
4. Deploy to Netlify. Submissions appear under **Forms** in the dashboard, and
   you can forward them to email under **Form notifications**.

### Option 2 — Formspree (works on any host)

1. Create a form at [formspree.io](https://formspree.io) and copy its endpoint
2. Set `AUDIT_FORM_ENDPOINT = "https://formspree.io/f/YOUR_ID"`

That's it — the existing code POSTs JSON and handles success and failure.

### Option 3 — your own endpoint

Any URL that accepts a JSON `POST` and returns a 2xx status will work. The
body is a flat object:

```json
{
  "name": "...", "company": "...", "email": "...", "website": "...",
  "monthly_leads": "200-500", "crm": "follow-up-boss", "challenge": "..."
}
```

### Before you switch it on

- Set `CONTACT_EMAIL` to a mailbox you actually read
- Submit the form yourself once and confirm the message arrives
- Decide who responds, and how fast. An audit request that sits for a week is
  worse than no form at all

---

## Deploying

### Option A — Netlify Drop (fastest, no git)

1. Go to <https://app.netlify.com/drop>
2. Drag this entire folder onto the page
3. The site is live in about ten seconds on a temporary URL
4. Connect a custom domain later from the site settings

Best for getting something online today.

### Option B — GitHub Pages (free, version controlled)

1. Push this repository to GitHub (see below)
2. In the repository: **Settings → Pages**
3. Under **Source**, choose **Deploy from a branch**
4. Branch: `main`, folder: `/ (root)` → **Save**
5. The site appears at `https://<username>.github.io/<repo>/` within a minute

To use a custom domain, add it under Settings → Pages → Custom domain, then
point the domain's DNS at GitHub.

---

## Pushing to GitHub

If this folder already has a `.git` directory, the history is set up and you
only need to connect it to a remote:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

Starting from scratch instead:

```bash
git init
git add .
git commit -m "CLOSATIX website"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Making a change later:

```bash
git add .
git commit -m "Describe what changed"
git push
```

---

## Editing the site

Everything lives in `index.html`. The file is commented and split into
numbered sections, so search for the heading you want:

| Looking for | Search for |
|---|---|
| Colours, fonts, spacing | `1. VARIABLES / RESET` |
| Navigation bar | `5. NAVIGATION` |
| Hero and the lead engine graphic | `6. HERO` |
| All page sections | `7. SECTIONS` |
| FAQ accordion | `8. FAQ` |
| Mobile and tablet rules | `10. RESPONSIVE` |
| Lead Automation Audit form | `LEAD AUTOMATION AUDIT` |
| Booking URLs and form endpoint | `Config` (near the bottom) |

To change wording, search for the sentence itself — the visible copy is plain
text in the HTML.

### Logo sizing

The CLOSATIX mark is a tall monogram beside a short wordmark: the letters take
up only about 28% of the image's height. Sizing it like a normal logo makes the
brand name read smaller than the menu links next to it. The widths in the CSS
are chosen so the wordmark's cap height lands near 16px against 11.5px
navigation links. If you swap the logo file, re-check that balance rather than
copying the old numbers.

---

## Browser support

Tested in Chromium at 1440px, 1000px and 390px. Uses `aspect-ratio`,
`backdrop-filter` and `IntersectionObserver` — all supported in current
Chrome, Safari, Firefox and Edge. Animations are disabled automatically for
visitors who have "reduce motion" turned on, and the page is fully readable
with JavaScript disabled.

---

## A note on claims

There is deliberately no timing or performance claim anywhere on this site —
no "in under a minute", no conversion percentages, no response-time promise.
The system has not been measured yet, so nothing is asserted about it.

The one number on the page, "Takes less than 1 minute", refers to how long the
audit form takes to fill in. That is a statement about the form, not about
CLOSATIX. Keep it that way until there is real data to point at.

---

## Still to do

The site is technically complete. What it does not yet have is **proof** —
no demo video, no screenshot of a live workflow, no named person behind it.

A 90-second screen recording of a real lead moving through the system would
do more for conversion than any further design work on this page.
