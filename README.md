# NEXUS — Premium 3D Personal Portfolio Platform

[![Nexus CI](https://github.com/placeholder-user/nexus-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/placeholder-user/nexus-portfolio/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r165-black.svg)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-729B1B.svg)](https://vitest.dev/)

**Nexus** is an interactive, futuristic 3D personal portfolio platform engineered for software developers, systems architects, and 3D graphics engineers. It transforms traditional static portfolios into an immersive digital universe with an orbital 3D Three.js environment, celestial navigation nodes, glassmorphic UI, a PostgreSQL database backend with Row Level Security (RLS), and a secure Administrator Dashboard.

---

## Visual Overview & Screenshots

> [!NOTE]
> Below are UI screenshots and architecture diagrams illustrating the 3D spatial interface and administrative terminal.

```text
+-----------------------------------------------------------------------------------------+
|                                    NEXUS UNIVERSE CORE                                  |
|                                                                                         |
|                    [Projects Portal]              [Credentials Vault]                   |
|                            (Cyan)                        (Emerald)                      |
|                                     \                  /                                |
|                                      *----------------*                                 |
|                                     /   CENTRAL 3D    \                                 |
|             [Technical Matrix]  -- *    NEXUS CORE     * --  [Academic Archive]         |
|                  (Violet)           \   (GLSL Glow)   /            (Gold)               |
|                                      *----------------*                                 |
|                                              |                                          |
|                                    [Profile Dossier]                                    |
|                                                                                         |
|  [Drag to Orbit Camera]  •  [Scroll to Zoom]  •  [Click Planetary Node to Enter]       |
+-----------------------------------------------------------------------------------------+
```

### Gallery Placeholders
- **3D Spatial Landing Page**: `public/images/screenshots/landing-3d.png` (Interactive orbital core, particle clouds, celestial portals)
- **Projects Matrix**: `public/images/screenshots/projects.png` (Search, categories, tech chips, live preview triggers)
- **Project Detail Page**: `public/images/screenshots/project-detail.png` (Full description, screenshot carousel, architecture notes)
- **Credentials Vault**: `public/images/screenshots/certificates.png` (Verification modal, credential ID copy, PDF preview)
- **Administrator Console**: `public/images/screenshots/admin-dashboard.png` (Real-time analytics, CRUD modals, upload pipeline)

---

## Key Features

### 🌌 1. Interactive 3D Spatial Universe
- **Central Holographic Nexus Object**: Rotating gyroscope rings, pulsating light emissions, and inner geometric icosahedron.
- **Orbital Planetary Portals**: 3D nodes representing Portfolio sections (Projects, Skills, Certificates, Education, Dossier) with interactive hover states and camera zoom.
- **2,500 Starfield Particles**: Ambient celestial cosmic dust with additive blending.
- **Atmospheric Celestial Synth**: Web Audio API ambient drone (toggleable, zero external bandwidth overhead).
- **Graceful 2D Fallback**: Automatic detection for non-WebGL environments and `prefers-reduced-motion` settings.

### 💼 2. Public Portfolio Showcase
- **Executive Dossier (`/about`)**: Background, engineering philosophy, research vectors, verifiable social endpoints, and downloadable CV.
- **Projects Matrix (`/projects` & `/projects/:slug`)**: Filterable software showcase with full architecture notes, live demo links, repository links, and image carousels.
- **Credentials Vault (`/certificates`)**: Verified certificate gallery supporting credential IDs, issue dates, expiration monitoring, verification links, and PDF documents.
- **Technical Matrix (`/skills`)**: 6 engineering vectors (Frontend, Backend, Databases/Cloud, AI/ML, DevOps, Cybersecurity) with animated proficiency gauges.
- **Academic Archive (`/education`)**: Degrees, institutions, GPA distinctions, and collegiate accolades.
- **Honors Ledger (`/achievements`)**: Hackathon victories, open-source impact, and research citations.
- **Transmission Terminal (`/contact`)**: Client-sanitized contact form with rate-limiting and direct database dispatch.

### 🛡️ 3. Secure Administrator Dashboard
- **Protected Routes (`/admin/*`)**: Authentication guards, session listeners, and zero unauthorized exposure.
- **Real-Time Operational Statistics**: Projects published vs. drafts, credential counts, and incoming inquiries.
- **Full CRUD Management**: Create, edit, delete, publish/unpublish, and feature projects, certificates, skills, education, and achievements.
- **Secure File Storage Integration**: Upload images and PDFs to Supabase Storage with client-side MIME and size validation (<10MB).
- **Inquiries Terminal**: Read, review, reply, and delete submitted contact messages.
- **JSON Snapshot Export**: One-click local backup export for offline portability.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript 5.4, Vite 5 |
| **3D Graphics & WebGL** | Three.js (r165), React Three Fiber (v8), Drei (v9) |
| **Styling & Design System** | Tailwind CSS 3.4, PostCSS, Custom Cyberpunk / Glassmorphism tokens |
| **Motion & Micro-interactions** | Framer Motion 11 |
| **Routing** | React Router DOM v6 |
| **Iconography** | Lucide React |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security (RLS) |
| **Testing Suite** | Vitest 1.6, React Testing Library, jsdom |
| **Quality & Linting** | Oxlint, TypeScript Compiler (`tsc --noEmit`) |
| **CI / CD** | GitHub Actions, Vercel SPA deployment configuration |

---

## Project Structure

```text
nexus/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow
├── public/
│   ├── favicon.svg              # Holographic vector favicon
│   ├── images/                  # Static media assets
│   ├── models/                  # 3D geometries & models
│   └── textures/                # Texture maps
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx  # Protected admin layout & sidebar
│   │   │   ├── Footer.tsx       # Public footer & network links
│   │   │   ├── Navbar.tsx       # Glassmorphic header & mobile drawer
│   │   │   └── PublicLayout.tsx # Main public wrapper
│   │   ├── navigation/
│   │   │   └── ProtectedRoute.tsx # Route authentication guard
│   │   └── ui/                  # Reusable UI controls
│   ├── context/
│   │   └── AuthContext.tsx      # Supabase Auth & Demo Session Provider
│   ├── lib/
│   │   ├── api.ts               # Unified Data Access Layer (Supabase + Local Fallback)
│   │   ├── mockData.ts          # Initial placeholder seed database
│   │   ├── supabase.ts          # Supabase client initializer
│   │   └── webgl.ts             # WebGL capability & reduced motion detector
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminAchievementsPage.tsx # Honors & awards management
│   │   │   ├── AdminCertificatesPage.tsx # Credential management & upload
│   │   │   ├── AdminDashboardPage.tsx    # Metrics, messages, quick actions
│   │   │   ├── AdminEducationPage.tsx   # Academic qualification management
│   │   │   ├── AdminLoginPage.tsx       # Administrator passkey gateway
│   │   │   ├── AdminProfilePage.tsx     # Architect dossier & bio editor
│   │   │   ├── AdminProjectsPage.tsx    # Project CRUD, media upload & tags
│   │   │   ├── AdminSettingsPage.tsx    # Social links & infrastructure health
│   │   │   └── AdminSkillsPage.tsx      # Technical skill matrix editor
│   │   ├── AboutPage.tsx        # Public Profile & Philosophy
│   │   ├── AchievementsPage.tsx # Public Honors & Publications
│   │   ├── CertificatesPage.tsx # Public Verified Credentials Gallery
│   │   ├── ContactPage.tsx      # Public Inquiries Terminal
│   │   ├── EducationPage.tsx    # Public Academic Background
│   │   ├── HomePage.tsx         # Public 3D Spatial Universe
│   │   ├── NotFoundPage.tsx     # 404 Deep Space Trajectory Lost
│   │   ├── ProjectDetailPage.tsx# Full Project Specs & Screenshots
│   │   ├── ProjectsPage.tsx     # Public Projects Showcase & Filters
│   │   └── SkillsPage.tsx       # Public Technical Capability Matrix
│   ├── scenes/
│   │   ├── NexusCanvas.tsx      # Main 3D Canvas, OrbitControls & Ambient Audio
│   │   ├── NexusCore.tsx        # Central glowing gyroscopic Nexus crystal
│   │   ├── NexusFallback2D.tsx  # Interactive 2D celestial canvas fallback
│   │   ├── Portals.tsx          # Orbital 3D planetary section nodes
│   │   └── StarfieldParticles.tsx # 2,500 3D particle dust cloud
│   ├── test/
│   │   ├── apiAndStorage.test.ts # CRUD & Storage restriction tests
│   │   ├── authAndProtectedRoutes.test.tsx # Security & redirect tests
│   │   ├── filtering.test.ts    # Search, category & visibility tests
│   │   ├── publicPages.test.tsx # Rendering & form validation tests
│   │   └── setup.ts             # Vitest jsdom setup & polyfills
│   ├── types/
│   │   └── index.ts             # Comprehensive TypeScript domain types
│   ├── App.tsx                  # Main router configuration
│   ├── index.css                # Tailwind directives & glassmorphic utilities
│   ├── main.tsx                 # Application entry point
│   └── vite-env.d.ts            # Vite client environment declarations
├── supabase/
│   ├── migrations/
│   │   └── 20260101000000_nexus_schema.sql # RLS-enforced PostgreSQL schema
│   └── seed.sql                 # Production-ready editable placeholder data
├── .env.example                 # Environment configuration template
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vercel.json                  # Vercel SPA rewrites & security headers
└── vite.config.ts               # Vite bundler, chunking & test config
```

---

## Installation & Local Development

### Prerequisites
- Node.js `v18.0.0` or higher (`v20+` recommended)
- `npm` or `pnpm`

### 1. Clone & Install
```bash
git clone https://github.com/placeholder-user/nexus-portfolio.git
cd nexus-portfolio
npm install
```

### 2. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```
Open `.env` and configure your Supabase details (optional for local mock testing):
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

> [!TIP]
> If you start Nexus without Supabase credentials, it automatically runs in **High-Fidelity Local Engine Mode**. You can immediately test the 3D Universe, view the public portfolio, log in to the admin dashboard, create projects, and edit credentials.

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## Supabase Backend Setup

To connect Nexus to a real cloud PostgreSQL database:

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/).
2. Create a new project (e.g., `nexus-portfolio-db`).
3. Note your project URL and `anon` public key under **Project Settings > API**.

### 2. Apply Database Migrations
1. In the Supabase Dashboard, navigate to the **SQL Editor**.
2. Copy and execute the contents of `supabase/migrations/20260101000000_nexus_schema.sql`.
   - This creates all 8 tables (`profiles`, `projects`, `certificates`, `skills`, `education`, `achievements`, `social_links`, `contact_messages`).
   - Automatically enables **Row Level Security (RLS)** on every table.
   - Enforces public read-only access for published items and restricts modifications to authenticated administrators.

### 3. Populate Initial Placeholder Data
1. In the SQL Editor, copy and execute `supabase/seed.sql`.
2. This safely populates high-quality, clearly marked editable placeholder records.

### 4. Create Storage Buckets
In the Supabase Dashboard under **Storage**:
1. Create a public bucket named `portfolio-media`.
2. Create a public bucket named `certificates-docs`.
3. Add the following storage security policies:
   - **Public Access**: Select (read-only) for `anon` role.
   - **Admin Access**: Insert, Update, Delete for `authenticated` role.

---

## Administrator Setup & Authentication

### Creating the First Administrator Account
1. Open the Supabase Dashboard > **Authentication > Users**.
2. Click **Add User > Create User**.
3. Enter your administrator email (e.g. `your-email@domain.com`) and choose a strong password.
4. Confirm email if your project requires confirmation.

### Accessing the Dashboard
1. Navigate to `/admin/login` on your portfolio site.
2. Enter your administrator credentials.
3. Upon clearance, you will be directed to `/admin/dashboard`.

### Local Preview Demo Login
When running in local/demo mode (without live Supabase credentials):
- **Email**: `admin@nexus.io`
- **Password**: `NexusAdmin2026!`

---

## Quality Assurance & Testing

Nexus includes automated unit and integration tests covering public page rendering, form validation, project/certificate filtering, authentication, protected route redirection, database operations, and file upload restrictions.

```bash
# Run unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run TypeScript typechecks
npx tsc --noEmit

# Run code linter
npm run lint

# Build production bundle
npm run build
```

---

## Production Deployment

### Deploying to Vercel
Nexus is optimized for 1-click deployment on Vercel:

1. Push your repository to GitHub.
2. In Vercel, click **Add New > Project** and import `nexus-portfolio`.
3. Set the Framework Preset to **Vite**.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.
6. The included `vercel.json` automatically handles single-page routing rewrites and security headers.

---

## Security & Best Practices

- **Zero Secret Exposure**: The Supabase `service_role` key is never exposed to the client. Only the public `anon` key is used.
- **Row Level Security**: Non-admin visitors cannot insert, update, or delete portfolio content. Public visitors only receive records where `is_published = true`.
- **File Restrictions**: Uploads enforce client and storage MIME validation (JPEG, PNG, WebP, GIF, SVG, PDF) and max file sizes (10MB).
- **Reduced Motion Support**: Users with vestibular sensitivities or reduced-motion preferences automatically receive an optimized 2D experience.

---

## License

MIT License. Designed and engineered for the modern software architect.
