# SAQR Voice — HVAC AI Receptionist Website

A static, bilingual marketing website for a managed AI voice answering, qualification and booking service aimed at HVAC / air-conditioning companies in Saudi Arabia.

## Working brand

The website currently uses **SAQR Voice** as a working brand. It can be renamed globally before launch without changing the site structure.

## Design direction

- Olive, ivory, white and black visual system
- Arabic-first, with a complete English version
- Responsive layout for phone, tablet and desktop
- No stock photography or copied creative assets
- Custom SVG brand mark and icon system
- Motion with reduced-motion support
- Accessible navigation, tabs, FAQ and focus states

## Pages

```text
index.html          Arabic homepage
en.html             English homepage
demo.html           Standalone interactive demo simulation
privacy.html        Arabic website privacy notice
privacy-en.html     English website privacy notice
terms.html          Arabic website terms
terms-en.html       English website terms
404.html            GitHub Pages fallback
robots.txt
.nojekyll
assets/
  icons.svg
  saqr-mark.svg
  site.css
  site.js
```

## Implemented sections

- Outcome-led hero for Saudi HVAC companies
- Interactive call-to-booking simulation
- After-hours and peak-call problem framing
- Full capability grid
- Managed implementation process
- Interactive use-case tabs
- Integration categories with compatibility disclaimer
- Editable SAR revenue-recovery calculator
- Founding Partner programme
- FAQ
- Arabic and English legal notices

## Critical launch items

### 1. Booking URL

All booking buttons are set in `assets/site.js`:

```js
const BOOKING_URL = 'https://cal.com/rami-sebaie/closatix-discovery-call';
```

This is the existing CLOSATIX booking event. Before sending the new site to prospects, either:

1. create a dedicated SAQR Voice / HVAC AI demo event and replace the URL; or
2. rename and rewrite the existing event so the page title, questions and confirmations match this offer.

### 2. Live demo phone number

The public site currently provides an honest interactive UI simulation. It does **not** show a fake callable number. Once the master voice demo is deployed, add the real number and a `tel:` button to the hero and demo sections.

### 3. Brand and domain

Before connecting a custom domain:

- confirm the final brand name;
- check domain and trademark availability;
- update canonical and social metadata with absolute URLs;
- add a production social-sharing image in PNG format;
- add the GitHub Pages `CNAME` file.

### 4. Official contact details

No unowned email address, fake office address or unregistered company details are displayed. Add official legal/contact details only when they are real and approved.

### 5. Integrations

The integration strip is explicitly framed as compatible categories to be assessed. Do not turn any item into a firm supported-integration claim until the technical team verifies the client’s version, plan, API and permissions.

## Deployment

This project has no framework or build step.

1. Serve the repository root through GitHub Pages or any static host.
2. Keep `.nojekyll` in the root.
3. Test `index.html`, `en.html`, `demo.html`, both legal languages and `404.html`.
4. Verify every booking button in an incognito window.
5. Test the interactive demo, tabs, ROI calculator, FAQ and mobile menu.

## Editing shortcuts

- Brand name: search for `SAQR Voice` and `SAQR VOICE`
- Booking URL: `BOOKING_URL` in `assets/site.js`
- Calculator defaults: inputs with `data-roi-input` in both homepages
- Demo transcript: `callScripts` in `assets/site.js`
- Main palette: CSS variables at the top of `assets/site.css`

## Truthfulness rules retained in the website

- no fake clients;
- no invented testimonials;
- no unsupported revenue guarantee;
- no claim that every integration works automatically;
- demo customer data is clearly fictional;
- the current brand is not presented as a registered legal entity;
- call recording and transcript features are described as subject to legal and client requirements.
