# Business Savings Hub — Earl Shilton Building Society

A responsive, standalone website focused exclusively on business savings. Built using the same framework as the [ISA Hub](../README.md), scaled up for every type of business — sole traders, limited companies, partnerships, charities, clubs, trusts and pension schemes, credit unions and cooperatives, and client money accounts.

## What's here

Plain HTML, CSS and vanilla JS — no build step, no dependencies. Open `index.html` in a browser, or serve the folder with any static file server.

```
index.html                   Home
easy-access-business.html    Business Easy Access account
notice-business.html         Business 95-Day Notice account
fixed-rate-bond.html         Fixed Rate Bond (1/2 year terms)
business-types.html          Eligibility & documents for all 8 business types
application-guide.html       Step-by-step application guide + document checklist
help-guides.html             Help Guides — choosing an account, documents, tax, FSCS
calculator.html               Interactive business savings calculator
faqs.html                    Frequently asked questions
contact.html                 Contact form, phone/email, branches
404.html                     Not found page
assets/css/styles.css        Shared design system (same as ISA Hub)
assets/js/site.js            Nav toggle, dropdown, footer year
assets/js/calculator.js      Calculator logic
assets/images/               Favicon / brand mark
```

## Business types covered

Sole Traders & Freelancers · Limited Companies (Ltd) · Partnerships · Charities & Non-Profits · Clubs & Societies · Trusts & Pension Schemes · Credit Unions & Cooperatives · Client Money Accounts

Each has its own eligibility and document checklist in `business-types.html`, summarised in `application-guide.html`.

## Design

Same Ink/Navy/Blue/Coral/Paper design system as the ISA Hub, for a consistent Earl Shilton Building Society look across both hubs. Mobile-first, responsive breakpoints at 640px / 900px, system font stack (no external font requests).

## Key differences from the ISA Hub

- Accounts are **not tax-free** — interest is paid gross, and the site explains how each business type accounts for tax.
- FSCS protection is shown at **£120,000** per eligible depositor, with notes on the "large company" exclusion and the different treatment of client money accounts.
- Three account types (Easy Access, 95-Day Notice, Fixed Rate Bond) instead of ISA products.

## Note

This is a concept/demo build. Rates, branch addresses, contact details and FSCS/tax guidance throughout are illustrative and simplified for demonstration purposes — not financial, tax or regulatory advice.
