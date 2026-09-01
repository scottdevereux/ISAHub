# Business Savings Hub — Earl Shilton Building Society

A responsive, standalone website focused exclusively on business savings. Built using the same framework as the [ISA Hub](../README.md), scaled up for every type of business — sole traders, limited companies, partnerships, charities, clubs, trusts and pension schemes, credit unions and cooperatives, and client money accounts.

## What's here

Plain HTML, CSS and vanilla JS — no build step, no dependencies. Open `index.html` in a browser, or serve the folder with any static file server.

```
index.html                   Home
bonus-saver.html              Business Bonus Saver account
notice-90-day.html            90 Day Notice account
notice-35-day.html            35 Day Notice account
notice-7-day.html             7 Day Notice account (formerly Treasurers Account)
no-notice.html                No Notice account (formerly Endeavour Account)
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

## Business accounts

| Account | Gross Rate p.a. | AER | Access | Min / Max deposit |
|---|---|---|---|---|
| Business Bonus Saver | 4.16% | 4.16% | No notice (bonus lost in a withdrawal year) | £1 / £500,000 |
| 90 Day Notice | 4.10% | 4.10% | 90 days' notice | £1,000 / £500,000 |
| 35 Day Notice | 3.85% | 3.85% | 35 days' notice | £1,000 / £500,000 |
| 7 Day Notice (formerly Treasurers Account) | 2.25% | 2.25% | 7 days' notice | £10,000 / £500,000 |
| No Notice (formerly Endeavour Account) | 2.00% | 2.00% | No notice | £10,000 / £500,000 |

## Business types covered

Sole Traders & Freelancers · Limited Companies (Ltd) · Partnerships · Charities & Non-Profits · Clubs & Societies · Trusts & Pension Schemes · Credit Unions & Cooperatives · Client Money Accounts

Each has its own eligibility and document checklist in `business-types.html`, summarised in `application-guide.html`.

## Branches

Earl Shilton (Head Office), 22 The Hollow, Earl Shilton, Leicester, LE9 7NB · Barwell, 7 Malt Mill Bank, Barwell, Leicester, LE9 8GS

## Design

Same Ink/Navy/Blue/Coral/Paper design system as the ISA Hub, for a consistent Earl Shilton Building Society look across both hubs. Mobile-first; the horizontal nav switches to the mobile menu below 1180px (raised from the ISA Hub's 900px, since this site's nav carries more items) and links use `white-space: nowrap` so the row never wraps onto a second line.

## Key differences from the ISA Hub

- Accounts are **not tax-free** — interest is paid gross, and the site explains how each business type accounts for tax.
- FSCS protection is shown at **£120,000** per eligible depositor, with notes on the "large company" exclusion and the different treatment of client money accounts.
- Five real account types (Business Bonus Saver, 90/35/7 Day Notice, No Notice) instead of ISA products, all capped at a £500,000 balance.

## Note

This is a concept/demo build. Rates, contact details and FSCS/tax guidance throughout are illustrative and simplified for demonstration purposes — not financial, tax or regulatory advice. Branch addresses reflect Earl Shilton Building Society's two real branches.
