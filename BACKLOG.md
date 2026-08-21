# CLOSATIX Website Backlog

These items are intentionally deferred. They are not production-complete merely because the website mentions the broader CLOSATIX service.

## 1. Production Lead Automation Audit form

Current state: the public website does **not** collect audit submissions.

Planned flow:

```text
Audit Form
→ Make webhook
→ validate and normalise fields
→ HubSpot contact create/update
→ internal notification/email
→ optional Discovery Call routing
→ submission logging and failure alert
```

Before enabling:

- define required and optional fields;
- add spam protection and rate limiting;
- obtain explicit consent wording where required;
- test success, duplicate, invalid and failed-delivery cases;
- ensure the visitor sees a real confirmation only after a successful response;
- update the privacy notice; and
- assign an owner and response-time standard.

## 2. Custom domain and professional email

- purchase and connect the final CLOSATIX domain;
- create role-based addresses only after they can receive mail;
- update canonical, Open Graph and Twitter image URLs;
- update legal contact details; and
- configure DNS security records for email.

## 3. Legal and company details

- contracting legal entity and owner name;
- registration number, if applicable;
- registered business address;
- official legal/notices email;
- governing law and dispute forum;
- support channel;
- payment, tax and invoice details; and
- final review of privacy, website terms and service agreement.

## 4. Integrations

The website currently lists the tested implementation stack:

- HubSpot
- Make
- Cal.com
- Gmail
- Google Sheets
- website forms
- webhooks / APIs

Do not add other CRM or platform logos until a real compatibility test has been completed or the proposal clearly identifies the integration as custom scope.

## 5. Proof and case studies

Add only after a client has approved publication:

- baseline lead-response process;
- verified operational improvement;
- client quote;
- anonymised workflow screenshots where required; and
- measurement period and limitations.

Never publish invented metrics, logos or testimonials.

## 6. Product improvements to consider after client feedback

- lead score from 0–100 with a short reason;
- staff-facing AI lead summary;
- multi-step no-response follow-up sequences;
- old-lead recovery workflow;
- client reporting dashboard;
- workflow health alerts; and
- additional CRM integrations based on actual demand.
