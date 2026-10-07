# Portfolio — Phase 1b: English content

> Status: **v2 — aligned with `docs/01-fase-1-contenido.md` v2.1** · Updated: 2026-10-07 (Phase 4, Round 4) · v1: 2026-10-06
> This is an **adaptation, not a literal translation**: same structure, decisions and facts, written in natural international English (British spelling).
> Changes made during Phase 4 are marked **[F4 · UIxx]**; the reasoning is in `docs/04-fase-4-ui-alta-fidelidad.md`.

---

## 0. Voice and adaptation rules

| Rule | Application |
|---|---|
| Direct "you" | Same closeness as the Spanish "tú" |
| First person singular | "I design", "I'll walk you through it" |
| Plain words for clients, technical details in the "For developers" blocks | Same as Spanish |
| Portfolio tone, not sales [F4] | Show the work and the way of working; no "get a quote" calls to action |
| Only real facts | Same as Spanish |
| Spanish terms kept | Place names (Quijorna, Madrid), the "Finanzas Personales" product name (with a translation the first time) |
| Banned | "Innovative digital solutions", "Take your business to the next level", "Unique experiences", "Passionate about…", emojis in headings |

**Routes:** `/en`, `/en/work`, `/en/work/[slug]`, `/en/services`, `/en/about`, `/en/contact` (with `hreflang` linking each page to its Spanish counterpart). [F4 · UI13] No `/en/process`: process and AI live at `/en/services#process` and `/en/services#ai`.
**Section labels** [F4 · UI1, UI26]: `/work`, `/reviews`, `/services`, `/about`, `/contact`; in-page sections `#faq`, `#process`, `#ai`, `#for-companies`.

**WhatsApp link (EN)** [F4 · Round 4]: `https://wa.me/34614312673?text=Hi%20Terry%2C%20I%20found%20your%20website%20and%20I%27d%20like%20to%20talk%20about%20` → opens the chat with "Hi Terry, I found your website and I'd like to talk about ". (Replaces "…I'd like a quote for", in line with the portfolio tone.)

---

## 1. Value proposition

**Intro line (small, above, next to the avatar):** Hi, I'm Terry Quiñonez · Madrid
**Headline:** **<Web developer>** (angle brackets in grey, regular weight)
**Subheading:** I design and build websites, PWAs and systems that are a joy to use. I love the whole journey, from the first sketch to the last line of code, sweating every detail so they look good and work even better.

**Proof row:** `● Live projects` · `Next.js · TypeScript · Supabase` · `Madrid · Remote`

**CTAs:** **See my work** (primary) · **GitHub ↗** · LinkedIn ↗. No "Get a quote" buttons anywhere; WhatsApp as a floating button.

**Short description (SEO, social, share card):**
> Terry Quiñonez · Web design and development for freelancers and small businesses. Fast, clear websites built to bring in enquiries. Madrid and remote across Spain.

---

## 2. Navigation and shared elements

**Menu:** Work · Services · About · GitHub ↗ · **Contact** (button) · `ES / EN` switch — [F4 · UI13] no "Process"
**Logo:** "Terry Q." → always links to `/en`.
**Skip link** [F4 · Round 4]: Skip to content
**Language switch:** visible text `ES / EN` (current language in ink); accessible name "ES / EN: switch language to Spanish".
**Mobile menu** [F4 · UI37]: full-screen panel with Work · Services · About · GitHub ↗, Contact button, `ES / EN` and LinkedIn ↗; buttons "Open menu" / "Close menu".

**Footer**
> **Terry Quiñonez** · Web design and development
> Quijorna, Madrid · Working remotely across Spain
> contacto@terryq.com · WhatsApp · LinkedIn · GitHub
> Legal notice · Privacy · © 2026
> *Built with Next.js · Deployed on Vercel · Code on GitHub ↗*

---

## 3. Home

### 3.2 Featured work
**Title:** Recent work
**Intro:** Real projects, live or as working demos. You can open them and try them out.

| # | Project | Tags | Summary |
|---|---|---|---|
| 1 | **HB Construcciones** | Website · Brand identity proposal · ● Live | A website for a renovation and pool-building company, designed to bring in quote requests via WhatsApp. |
| 2 | **Zona F** | Web product · Demo | A sports betting platform prototype with a bet slip, accumulators and live odds. |
| 3 | **Finanzas Personales** | Web app · ● Live | A personal finance app to track income, spending, budgets and savings month by month. |

**Card link:** View case study → · **Section link:** See all work →

### 3.3 Services (summary)
**Title:** What I can do for your business
**Core service — Websites:** Your website, designed and built from scratch. Fast on mobile, easy to find on Google and ready for people to contact you.
- **Landing page:** To win enquiries fast, via WhatsApp or a form.
- **Company website:** Multiple pages and a structure built for Google.
- **Custom web app:** User accounts, a database and features built for your business.

**I can also take care of…** **Your brand identity:** a logo and versions for web, social media and print. **Maintenance and hosting:** your site always online, up to date, and someone who answers if something breaks.
**Link:** See services →

### 3.4 Process (summary)
> ~~Removed from the home page~~ [F4 · UI13].

### 3.5 Reviews (after Featured work)
**Title:** What my clients say
**Intro:** Real reviews you can check on Google.
**Link:** See all on Google ↗
> Same rule as Spanish: real reviews only; the section is hidden until at least one exists. The design shows "Sample" placeholders that are never published.

### 3.6 About (summary) — [F4 · UI12]
> I'm Terry. I started out teaching myself, hooked on clean, well-made interfaces and eager to understand how they were built under the hood. I now study Software Engineering at the Technical University of Madrid (UPM) and live in Quijorna, in the hills west of Madrid.
> **Link:** More about me →

### 3.7 Closing (subtle)
**Title:** Shall we talk?
**Text:** If you like what I do and have an idea in mind, drop me a line.
**Links:** contacto@terryq.com · WhatsApp ↗ · *I reply within 24 working hours*

---

## 4. Work page (`/en/work`)

**Title:** Work
**Intro:** Client websites, my own products and brand identity proposals. Each project explains the challenge, how I solved it and the technology behind it.
**Filters:** All · Web · Brand
**Table:** Year · Project · Type · Status · →
**Hint:** Hover over a row to see a preview.
**Closing block:** More code and experiments on GitHub — Including the code for this website, with its specification and tasks. · See GitHub ↗

| Year | Project | Type | Status |
|---|---|---|---|
| 2026 | HB Construcciones | Client website · Brand identity proposal | ● Live |
| 2026 | Zona F | Own product · Demo | ● Demo |
| 2026 | Finanzas Personales | Own web app | ● Live |

---

## 5. Case studies

> **My role** (shared by all three): *Project lead, specification, design, review and deployment. AI-assisted implementation (Claude Code).*
> **Shared UI labels:** Back to Work · Open the site ↗ · 01 The challenge · 02 The solution · 03 Brand identity proposal · 04 Outcome · 05 For developers · Next project · View case study →

### 5.1 HB Construcciones

| | |
|---|---|
| Client | HB Construcciones · Full home renovations and swimming pools |
| Location | Villanueva de la Cañada (Madrid, Spain) |
| Services | Web design and development · Brand identity proposal |
| Year | 2026 |
| Status | ● Live · [hb-construcciones.vercel.app](https://hb-construcciones.vercel.app/) |

**Title:** A website that makes asking for a quote as easy as sending a WhatsApp

**The challenge**
> HB Construcciones carries out full renovations, pools, kitchens, bathrooms and extensions in the west of Madrid. **They had no website:** every customer came through personal contacts and referrals. They needed to move beyond word of mouth with a site that builds trust with someone about to spend thousands on their home, and turns that trust into a conversation.

**The solution**
> - **WhatsApp as the main channel.** Renovation customers would rather message than fill in forms, so every button leads to WhatsApp, and the form opens the chat with the message already written.
> - **A sticky bar on mobile** with "Call" and "WhatsApp", always one tap away.
> - **Answers before they ask.** FAQs on building permits, timelines, quotes and guarantees: the doubts that stop a customer from getting in touch.
> - **Real proof.** A gallery of finished work, videos filmed on site and reviews from their customers.
> - **Built for local search.** Content aimed at renovation and pool searches in their area.

**Brand identity proposal**
> I designed a logo proposal with a full kit (colour, reversed, monochrome and icon, all in vector format). The client chose to keep their original logo, so the website uses their current identity.

**Outcome**
> HB has gone from relying only on word of mouth to having its own website, live since October 2026. It's recent, so this case study will be updated with real results (enquiries received via WhatsApp) as soon as there is data.

**For developers** (collapsible)
> - **Next.js (App Router) + React 19 + TypeScript.**
> - **Tailwind CSS 4**, **Framer Motion** for subtle animations, **Lucide** icons and **Geist** fonts via `next/font`.
> - **Custom media pipeline:** Node/TypeScript scripts that extract frames from site videos and convert the gallery and videos to **WebP** with `sharp`.
> - **Local SEO:** **LocalBusiness JSON-LD** structured data, metadata and `lang` set up.
> - **Conversion:** floating WhatsApp button, sticky mobile contact bar and a form that builds the WhatsApp message from the user's input.
> - **Analytics:** Vercel Analytics.
> - **Vercel** with automatic deploys from GitHub · ESLint.
> - **Spec-driven development** (`spec.md` + `tasks.md`).

---

### 5.2 Zona F

| | |
|---|---|
| Type | Own product · Working prototype |
| Services | Product design · Web development |
| Year | 2026 (designed and built in 2 weeks) |
| Status | ● Demo · [zona-f.vercel.app](https://zona-f.vercel.app/) |
| Note | Demo project. Not a real betting site; it does not accept money |

**Title:** What a betting site designed around the user could look like

**The challenge**
> Betting sites have cluttered interfaces: hundreds of markets, banners everywhere and a bet slip that's hard to follow. I set out to design and build a prototype that keeps every feature of a real sportsbook, but organised so that placing a bet is clear and fast.

**The solution**
> - **Always-visible bet slip** that instantly calculates potential winnings, with quick stakes (+10, +50, x2).
> - **Accumulators** with multiple selections on the same slip.
> - **Live matches** with the current minute, score and updated 1X2 odds.
> - **Favourite leagues** per user and a league sidebar with match counts.
> - **Promotions** (welcome bonus, cashback, free bet, accumulator boost, VIP) in a carousel.
> - **Cash Out:** settle a bet before the match ends.
> - **Responsible gambling** with configurable limits, reachable from the menu.
> - **Sign-in** with email and password or with Google.
> - **Mobile first:** on small screens the bet slip becomes a floating button.

**Outcome**
> A complete, navigable product that shows how to solve the user experience of a complex application, with many states and data that changes in real time.

**For developers** (collapsible)
> - **Next.js (App Router) + React 19**, server-rendered with Server Components and mutations via Server Actions.
> - **Strict TypeScript**, no `any`. **Tailwind CSS v4** with brand colours as tokens.
> - **Zustand** for client state (bet slip, favourites, filters and live odds); slip and favourites persisted to `localStorage`.
> - **Supabase (Postgres)**: business rules live in **SQL functions** (placing bets, accumulators, match settlement, promotions, responsible-gambling limits and Cash Out). Anything that moves money runs server-side, and data is protected with **RLS**.
> - **Supabase Auth** with `@supabase/ssr`: email and password plus Google OAuth; the session is refreshed on every request.
> - **Live match simulation** with custom scripts: moving odds, settling matches and seeding demo data.
> - **AI-generated images** (OpenAI) in a separate script; AI plays no part while the site is running.
> - **Vercel** with automatic deploys on every push to `main` · ESLint · `sharp`.
> - *Private repository: available to walk through in an interview.*

---

### 5.3 Finanzas Personales (Personal Finance)

| | |
|---|---|
| Type | Own web app |
| Services | Design and development · Database and security |
| Year | 2026 |
| Status | ● Live · [finanzas-personales-roan.vercel.app](https://finanzas-personales-roan.vercel.app/) · "Try the demo" button (once ready) |

**Title:** My finances, month by month, without spreadsheets

**The challenge**
> I wanted to know, effortlessly, how much comes in and goes out each month, how much I can spend at the weekend without breaking my savings goal, and when I'm overspending. Spreadsheets get abandoned; I needed something quick to use every day.

**The solution**
> - **Monthly tracking** of income and expenses by category, with essential categories flagged.
> - **Savings goal** and a calculation of **how much you can spend each weekend**.
> - **Budgets per category** with **alerts** as you approach the limit.
> - **Recurring transactions** (salary, rent, subscriptions) that log themselves.
> - **Multiple currencies:** each transaction stores the original amount, the exchange rate used and the amount in your base currency.
> - **Light and dark themes.**
> - **Demo mode:** anyone can try it in one click with sample data, no sign-up needed.

**Outcome**
> I use it every day for my own finances. It's the project where I've gone deepest into security and data modelling.

**For developers** (collapsible)
> Next.js (App Router) + TypeScript · Supabase (Postgres + Auth) · **Row Level Security** on every table: each user can only access their own rows (`user_id = auth.uid()`) · cascading deletion of user data · currency conversion with an exchange-rate history (`exchange_rate_snapshots`) and the applied rate stored on each transaction · **demo mode with Supabase anonymous users**: data seeded by a trigger, automatic clean-up with `pg_cron`, and email sign-up blocked server-side with a *Before User Created Hook* · deployed on Vercel.

---

## 6. Services page (`/en/services`)

**Title:** Services
**Intro:** I focus on what makes the biggest difference to a business: a website that works. If you also need a brand identity or someone to look after your site, I've got that covered too.
**"On this page"** [F4 · UI22]: Websites · Brand and maintenance · FAQs · How I work · How I use AI

### Websites (core service)
**Text:** Your website, designed and built from scratch: a landing page to win customers, a full company website, or a web app with its own features. Fast on mobile, easy to find on Google and ready for people to contact you.

| Type | Who it's for | What's included | Example [F4 · UI24] |
|---|---|---|---|
| **Landing page** | Freelancers and businesses who want enquiries fast | One complete page: services, work, reviews, FAQs and contact via WhatsApp or form | Example: HB Construcciones → |
| **Company website** | Businesses that need several sections | Multiple pages, optional blog and a structure built for Google | — |
| **Custom web app** | Businesses with their own process (bookings, dashboards, management) | User accounts, a database and bespoke features | Examples: Finanzas Personales · Zona F → |

**Always included:** custom design (no templates), mobile-friendly, fast loading, basic SEO, contact form or WhatsApp, standard legal pages and a session to show you how to use it.

### Brand
> A logo and a kit of versions (colour, reversed, monochrome, icon) in vector format, ready for web, social media and print. Banners and social media graphics too.
> **Link:** Brand identity proposal for HB Construcciones →

### Maintenance and hosting (label: "After delivery")
> Your site hosted, with domain, backups, small changes and someone who answers if something breaks.
> List: Hosting and domain · Backups · Small changes · Help if something breaks
> *Monthly or yearly plan, separate from the project.*

### FAQs (`#faq`) — [F4 · UI25] pricing is now the first question
- **How much does a website cost?** Every project is different, so I don't use fixed price lists. Tell me about your idea and I'll send you a tailored quote.
- **How long does it take?** A landing page is usually ready in 1–2 weeks once I have your text and photos. Larger sites depend on scope; I'll give you a timeline in the quote.
- **What do I need to give you?** The basics: what you do, who for, and photos of your work. If you don't have text, I'll help you write it.
- **Will the website be mine?** Yes. The domain and the content are yours.
- **Can I make changes later?** Yes: you can ask me, or go for a maintenance plan.
- **Do you only work in Madrid?** I work remotely with businesses all over Spain. If you're nearby, we can also meet in person.
- **Do you use AI?** Yes, as a tool to work faster. The design, the decisions and the review of every detail are mine (how I use AI ↓).

**Under the heading:** Got another question? Drop me a line.

### How I work (`#process`)
**Intro:** A clear process, so you always know where your website stands and what comes next.

| Step | What happens | What you get |
|---|---|---|
| **01 We talk** | You tell me about your business, your customers and your goals | Focused questions, not an endless form |
| **02 Fixed quote** | I define scope, price and timeline | A quote within 24 hours, no small print |
| **03 Design** | I prepare the visual proposal for the pages | You see how it will look before any code is written |
| **04 Build** | I build the site and share progress | A preview link to review it |
| **05 Launch** | We publish it on your domain and check everything works | Your site live, fast and ready for enquiries |
| **06 Support** | Adjustments after delivery, and maintenance if you need it | Someone who answers |

### How I use AI (`#ai`)
> I work with a method called **spec-driven development**: before writing a single line of code, I write down what the site must do, how, and to what quality standards. Then I use AI tools such as Claude Code to build faster, and I review, test and fix every part before it goes live.
>
> **For you, that means** faster delivery without cutting corners on quality.
> **If you're a company:** the code for this website is public. You can see the specification, the tasks and the technical decisions in the repository.
> **Button:** See the repository ↗

**"From paper to production" panel** [F4 · UI28] — legend: Me · AI
| Step | Piece | Text | Who |
|---|---|---|---|
| 01 Specification | `spec.md` | What the site must do, how, and to what quality standards. | Me |
| 02 Tasks | `tasks.md` | The work split into tasks, in order and reviewable. | Me |
| 03 Implementation | Claude Code | AI writes each task's code, following the specification. | AI |
| 04 Review | — | I review, test and fix every part before it goes live. | Me |

**Panel footer:** Decisions and the final review are always mine.

### Page closing [F4 · UI29]
See my work · Tell me your idea

---

## 7. Process page
> ~~Removed~~ [F4 · UI13]. Content moved to `/en/services#process` and `/en/services#ai` (§6).

---

## 8. About page (`/en/about`)

**Title:** Hi, I'm Terry

> I'm Terry Quiñonez, a web developer. I started out teaching myself with YouTube videos: I was hooked on well-made interfaces, clean and minimal, and I wanted to understand how they were built under the hood.
>
> **From Peru to Madrid.** I began my degree in Peru and, with a good part of it done, moved to Spain to finish it: I now study Software Engineering at the Technical University of Madrid (UPM), with part of my previous studies recognised. I live in Quijorna, in the hills west of Madrid.
>
> Many websites make things hard for people: confusing menus, endless forms, information you can't find. I aim for the opposite. I treat every project as my own and I don't call it finished until everything works properly.
>
> I'm persistent: when I set my mind on something, I get it done.

**Highlighted line** [F4 · UI30] (label "What I aim for"): `<Websites anyone understands at first glance>`

**Quick facts**
| | |
|---|---|
| Location | Quijorna, Madrid · Remote across Spain |
| Education | Software Engineering · UPM (in progress) |
| Languages | Spanish (native) · English (basic, actively improving) |
| Tech | Next.js · TypeScript · React · Supabase · Tailwind CSS · Vercel |

**For companies** (`#for-companies`) [F4 · UI31, final text, 2026-10-07]
> I have the qualities and the skills to contribute from day one and be a great addition to your team. I invite you to explore [my projects](/en/work).
> **Buttons:** Download CV · LinkedIn ↗ · GitHub ↗

---

## 9. Contact page (`/en/contact`)

**Title:** Let's talk about your project
**Intro** [F4 · UI33]: Tell me what you have in mind and I'll reply within 24 working hours. Or message me directly on WhatsApp if you prefer.

| Field | Type | Required |
|---|---|---|
| Name | text | Yes |
| Email or phone | text | Yes |
| What do you need? | New website · Redesign my website · Logo and identity · **Job opportunity** [F4 · UI33] · Something else | Yes |
| Current website, if any | URL | No (marked "Optional") |
| Tell me about your project | long text | Yes |
| I have read the privacy policy | checkbox | Yes (GDPR) |

**Form heading:** Write to me (mobile: Or write to me here) · **Note:** All fields are required except the optional one.
**Placeholders:** Your name · you@email.com or +34 600 000 000 · https:// · What you do, what you need and roughly when.
**Button:** Send message · while sending: Sending…

**Validation** [F4 · UI35]
- Summary: **Some details are missing.** Check the field marked below. / Check the N fields marked below.
- Name: Please enter your name.
- Email or phone: I need an email or a phone number to reply to you. · Wrong format: Check the format: an email (you@email.com) or a phone number.
- What do you need?: Please choose an option.
- Project: Tell me a little about your project.
- Privacy: Please accept the privacy policy to send your message.

**Success:** Message sent · **Got it!** I'll get back to you within 24 hours. If it's urgent, message me on WhatsApp. · Buttons: Message me on WhatsApp ↗ · Send another message · Link: In the meantime, have a look at my work →
**Error:** **Your message couldn't be sent.** Please try again or email me at contacto@terryq.com. (What you typed is kept.)
**Other channels:** WhatsApp (+34 614 312 673) · Email (contacto@terryq.com) · LinkedIn · I reply within 24 working hours · Quijorna, Madrid · Remote across Spain

---

## 10. 404 page

**Title:** This page doesn't exist
**Text:** The link may be broken, or the page may have moved.
**Buttons:** Back to home · See my work
**Extra** [F4 · UI36]: the requested path in mono (`/path → 404`) and "Or go straight to": Work · Services · About · Contact.

---

## 11. SEO per page

| Page | `<title>` | Meta description |
|---|---|---|
| Home | Terry Quiñonez · Web design and development in Madrid | Fast, clear websites for freelancers and small businesses, built to bring in enquiries. Fixed quote within 24 hours. |
| Work | Work · Terry Quiñonez | Client websites and own products: HB Construcciones, Zona F and Finanzas Personales. |
| Services | Web design services · Terry Quiñonez | Landing pages, company websites, custom web apps, logos and website maintenance. How I work and how I use AI. |
| About | About · Terry Quiñonez | Web developer and Software Engineering student at UPM. Quijorna, Madrid. |
| Contact | Contact · Terry Quiñonez | Tell me about your project or your offer and I'll reply within 24 working hours. |
| 404 | Page not found · Terry Quiñonez | — (`noindex`) |

---

## 12. Notes for implementation
- `hreflang="es"` / `hreflang="en"` on every page, `x-default` pointing to Spanish; `<html lang="en">` on every `/en` page.
- The language switch keeps the user on the equivalent page (e.g. `/servicios` ↔ `/en/services`, `/sobre-mi` ↔ `/en/about`).
- Legal pages (Aviso legal, Privacidad) are mandatory in Spanish; English versions are a courtesy translation, with the Spanish version prevailing.
- The contact form's confirmation email (if any) goes out in the language the form was sent in.
- English copy runs ~10–15% shorter than Spanish: layouts are the same; no component should depend on text length (checked on the EN Home artboard).
