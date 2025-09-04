# Global Tools Website – Copilot Instructions

This document defines the **structure, design system, and functionality** for the Tools Website built with **Next.js 14 + MUI + JSX + Context API**.  
Copilot should follow these instructions to keep the project consistent, scalable, and global-ready.  

---

## 1. Tech Stack
- Framework: **Next.js 14 (App Router)**
- UI: **Material UI (MUI)**
- Icons: **MUI Icons**
- State Management: **Context API** (theme, language, global state)
- Internationalization: `next-intl` or `next-intl` (multi-language)
- Dark/Light Mode: **MUI ThemeProvider + Context**
- Fonts: **Roboto** (default) or **Poppins/Inter** (Google Fonts)
- SEO: Next.js Metadata API + sitemap + robots.txt
- Monetization: Google AdSense (script integration)

---

## 2. Folder Structure
/app
/[locale] # Locale-based routes (en, es, fr, hi)
layout.jsx # Root layout (Navbar, Footer, Providers)
page.jsx # Homepage per locale
/tools
/finance
loan-calculator/page.jsx
sip-calculator/page.jsx
/students
gpa-calculator/page.jsx
study-planner/page.jsx
/utilities
pdf-merge/page.jsx
qr-generator/page.jsx
/fun
meme-generator/page.jsx
emoji-translator/page.jsx
/blog
[slug]/page.jsx # SEO blog posts
about/page.jsx
contact/page.jsx
privacy/page.jsx
terms/page.jsx
/components
Navbar.jsx
Footer.jsx
ToolCard.jsx
ThemeToggle.jsx
LanguageSwitcher.jsx
SEO.jsx
/context
ThemeContext.jsx
LanguageContext.jsx
/lib
seo-config.js
utils.js
/public
/images
/icons
/styles
globals.css
next.config.js
sitemap.js
robots.txt


---

## 3. Global Features
### ✅ Theme (Dark/Light Mode)
- Use **MUI ThemeProvider** with `ThemeContext`.
- Default theme: system preference.
- User toggle via `ThemeToggle` button in Navbar.

### ✅ Internationalization
- Route-based: `/en`, `/es`, `/fr`, `/hi`.
- Language stored in `LanguageContext`.
- Switcher in Navbar + Footer.

### ✅ Navbar
- Left: Logo
- Center: Links (Tools dropdown → Finance, Students, Utilities, Fun | Blog | About | Contact)
- Right: Language Switcher, Theme Toggle
- Mobile: Collapse into hamburger menu.

### ✅ Footer
- Left: Logo + tagline
- Middle: Quick links
- Right: Social icons + Language Switcher
- Background: Dark variant of primary color.

---

## 4. Components
### Navbar.jsx
- MUI AppBar + Toolbar
- Logo (left), NavLinks (center), Actions (right)

### Footer.jsx
- 3-column layout using MUI Grid
- Links, social, language selector

### ToolCard.jsx
- MUI Card
- Icon + Title + Description
- Hover: subtle shadow + scale

### ThemeToggle.jsx
- Switch between dark/light using MUI Icons (`LightMode`, `DarkMode`)

### LanguageSwitcher.jsx
- Dropdown for locale selection
- Routes update to `/[locale]/...`

### SEO.jsx
- Wrapper component for setting `title`, `description`, `og:image`

---

## 5. Pages and Functionality
### Homepage (`/[locale]/page.jsx`)
- Hero Section → "Free Online Tools for Everyone, Everywhere 🌍"
- Category Grid → Finance | Students | Utilities | Fun
- Featured Tools → Grid of ToolCards
- Blog Section → Latest 3 posts
- Footer

### Tools Pages (`/[locale]/tools/.../page.jsx`)
- Header: Tool Title + short description
- Inputs Section (MUI Grid)
  - Example Loan Calculator:
    - Loan Amount (Slider + Input)
    - Interest Rate (Slider + Input)
    - Tenure (Slider + Dropdown)
- Results Section
  - EMI, Total Interest, Total Payment (MUI Paper)
- Visualization
  - Chart (Pie/Line/Bar) using Recharts
- Related Tools section
- FAQ (MUI Accordion)
- Ads integrated (header, inline, sidebar)

### Blog Page (`/[locale]/blog/[slug]/page.jsx`)
- SEO-friendly blog
- Hero: Title + meta
- Content (MDX rendering)
- Inline ads after 2–3 paragraphs
- Related articles in sidebar (desktop only)
- Embedded ToolCard if relevant

### About Page
- Mission statement, vision
- Global audience focus

### Contact Page
- Simple form (Name, Email, Message)
- Links to support email

### Privacy Policy + Terms
- Static text pages

---

## 6. Design System
### Colors
- Primary: `#1976d2` (Blue)
- Secondary: `#009688` (Teal)
- Accent: `#ff9800` (Orange)
- Light Mode: White backgrounds, Gray text
- Dark Mode: `#121212` backgrounds, `#e0e0e0` text

### Typography
- H1: 36px Bold
- H2: 28px Semi-bold
- H3: 22px
- Body: 16px
- Small: 14px

### Layout
- Mobile-first
- MUI Grid for responsiveness
- Inputs and results stacked on mobile, side-by-side on desktop

---

## 7. Development Roadmap
1. Initialize project → Next.js 14 + MUI
2. Add **ThemeContext** + **LanguageContext**
3. Build **Navbar + Footer**
4. Build **ToolCard + SEO + ThemeToggle + LanguageSwitcher**
5. Create core tools (Finance first: EMI, SIP, Retirement)
6. Add **Blog system (MDX)** + blog layout
7. Integrate **AdSense**
8. Add legal pages (Privacy, Terms)
9. Translate into multiple languages
10. Scale → add tools weekly

---

# ✅ Copilot Instructions
When generating code:
- Always use **MUI components** (Buttons, Grid, Card, AppBar, Paper, Accordion).
- Always use **JSX (not TSX)**.
- Respect **ThemeContext** and **LanguageContext**.
- Every tool page follows the same structure: **Header → Inputs → Results → Chart → Related Tools → FAQ**.
- Blogs use **MDX rendering**.
- Ads should be responsive (`ins` tag with `data-ad-format="auto"`).

You are my coding partner.  
We are building a **global tools website** using **Next.js 14 (App Router) + MUI + JSX + Context API**.  

## Project Rules
- Use **JSX, not TSX**.
- Use **MUI components** (AppBar, Card, Grid, Paper, Accordion, Icons).
- Manage **dark/light mode** with `ThemeContext` (MUI ThemeProvider).
- Manage **languages** with `LanguageContext` (`/en`, `/es`, `/fr`, `/hi` routing).
- SEO handled via Next.js Metadata API + `SEO.jsx` component.
- Every **tool page** should follow the same layout:  
  `Header → Inputs (MUI) → Results (Cards) → Chart (Recharts) → Related Tools → FAQ (Accordion)`.  
- Blogs use **MDX** for content.  
- Ads: Integrate Google AdSense (`ins` tag, responsive).  

## What I Expect From You
1. Generate **boilerplate code** for contexts (Theme + Language).  
2. Create **Navbar.jsx + Footer.jsx** with MUI (responsive, includes LanguageSwitcher + ThemeToggle).  
3. Build **a sample tool page** (Loan Calculator) with MUI sliders, text fields, results, and chart.  
4. Build **blog page template** with MDX rendering, inline ads, and sidebar (desktop).  
5. Follow the folder structure from `copilot-instructions.md`.  

## Task Flow
- First: set up `ThemeContext.jsx` and `LanguageContext.jsx`.  
- Second: scaffold global layout (`layout.jsx`) with Navbar + Footer.  
- Third: create a **Finance Tool** page (Loan Calculator).  
- Fourth: add blog system with MDX support.  
- Fifth: add supporting components (SEO, ToolCard, ThemeToggle, LanguageSwitcher).  

Always explain your reasoning before giving the code.  
Always respect the project conventions.  
