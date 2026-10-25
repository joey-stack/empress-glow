# Empress Glow Emporium

A modern, high-performance botanical skincare e-commerce platform handcrafted in Abuja, Nigeria. Formulated specifically for melanin skin wellness using cold-pressed West African fruit enzymes and restorative botanical lipids.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**, integrated with **InsForge** for real-time inventory and persistence, and **Paystack** for seamless payment processing.

---

## Key Features

- **Two-Phase Architecture**: Seamless transition between pre-launch waitlist reservations and full live e-commerce, with granular brand-level exemption controls.
- **Editorial Design System**: Bespoke, high-contrast luxury botanical aesthetics inspired by architectural skincare storefronts (zero border radius, sharp typography, fluid transitions).
- **Interactive Product Catalog**: Dynamic category filtering, search, and variant management (Small 150g, Medium 250g, Large 350g, XL 500g).
- **Drag-and-Drop Media Uploads**: Admin dashboard with drag-and-drop image uploads directly from desktop with instant preview and server persistence.
- **Direct WhatsApp Consultation**: Integrated customer care and personalized routine advisory endpoints.
- **Enterprise Admin Suite**: Operations command center for product catalog management, order fulfillment, live inventory adjustment, and refund processing.
- **Regulatory Compliance**: Built-in adherence to NAFDAC statutory disclaimers, FCCPC return policies, and NDPA privacy guidelines.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend / BaaS**: [InsForge](https://insforge.dev/) (Postgres, Storage, Auth, Realtime)
- **Payments**: [Paystack](https://paystack.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## Project Structure

```
empress-glow/
├── app/                  # Next.js App Router (pages & API routes)
│   ├── (storefront)/     # Customer-facing storefront routes
│   ├── admin/            # Admin operations dashboard
│   ├── api/              # REST endpoints (products, orders, uploads, refunds)
│   └── globals.css       # Design tokens and typographic definitions
├── components/           # Modular React components
│   ├── admin/            # Admin management panels & dropzone uploader
│   ├── layout/           # Header, footer, navigation drawers
│   ├── product/          # Product gallery, accordions, prelaunch actions
│   └── ui/               # Core design system primitives (cards, drawers)
├── data/                 # Persistent store catalog & seeds
├── lib/                  # Shared utilities, InsForge queries, cart context
└── public/               # Static assets, botanical photography, fonts
```

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or 20+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/joey-stack/empress-glow.git
   cd empress-glow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your InsForge and Paystack credentials in `.env.local`.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

To validate TypeScript types and build the production bundle:

```bash
npm run build
npm run start
```

---

## License

Private and proprietary. All rights reserved by Empress Glow Emporium.
