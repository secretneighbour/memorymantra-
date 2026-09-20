# SmritiCare (NEURO NER) — Cognitive Wellness & Dementia Care Platform

A modern, accessibility-first cognitive support platform designed for elderly individuals with memory impairments, family caregivers, and healthcare clinicians. 

Built with a high-contrast industrial aesthetic inspired by Nothing OS and Dieter Rams design principles, SmritiCare combines cognitive therapy games, memory vaults, clinical telemetry, and interactive physical UI elements.

---

## 📋 Table of Contents

1. [💻 Programming Languages & Technologies Used](#-programming-languages--technologies-used)
2. [🪟 Complete Guide: How to Run on a Windows Laptop](#-complete-guide-how-to-run-on-a-windows-laptop)
   - [Method 1: Run the Pre-Built Windows App (Fastest / No Coding Required)](#method-1-run-the-pre-built-windows-app-fastest--no-coding-required)
   - [Method 2: Run via Web Browser on Windows](#method-2-run-via-web-browser-on-windows)
   - [Method 3: Run as Native Windows Desktop App from Source (Electron Dev Mode)](#method-3-run-as-native-windows-desktop-app-from-source-electron-dev-mode)
   - [Method 4: Build Your Own Windows `.exe` Installer](#method-4-build-your-own-windows-exe-installer)
   - [Windows Troubleshooting & Tips](#-windows-troubleshooting--tips)
3. [Quick Start & Setup](#-quick-start--setup)
4. [Environment Variables & API Keys](#-environment-variables--api-keys)
5. [🚀 Major Architectural Changes & Refactorings Log](#-major-architectural-changes--refactorings-log)
   - [1. Dynamic User State Binding & Removal of Hardcoded Dummy Names](#1-dynamic-user-state-binding--removal-of-hardcoded-dummy-names)
   - [2. Backend Secure API Gateway & Proxy Architecture (`server.ts`)](#2-backend-secure-api-gateway--proxy-architecture-serverts)
   - [3. Fixed-Pinned Responsive Header & Navigation System](#3-fixed-pinned-responsive-header--navigation-system)
   - [4. Modal Layering & Stacking Context Fix (`z-index: 99999`)](#4-modal-layering--stacking-context-fix-z-index-99999)
   - [5. Multilingual Audio Auditioning & Speech Engine Stabilization](#5-multilingual-audio-auditioning--speech-engine-stabilization)
   - [6. Production-Ready Supabase Auth (v2) Pipeline & Centralized Client](#6-production-ready-supabase-auth-v2-pipeline--centralized-client)
   - [7. Unauthenticated-Only Landing Experience & Route Protection](#7-unauthenticated-only-landing-experience--route-protection)
   - [8. Independent Accessibility Architecture (No Sign-In Required)](#8-independent-accessibility-architecture-no-sign-in-required)
   - [9. Complete Premium Dark Mode & Button Styling System](#9-complete-premium-dark-mode--button-styling-system)
6. [🧩 Comprehensive Modules Catalog](#-comprehensive-modules-catalog)
   - [1. Core Pages & Dashboards](#1-core-pages--dashboards)
   - [2. Dynamic User State & Central Identity Engine (`useCurrentUser`)](#2-dynamic-user-state--central-identity-engine-usecurrentuser)
   - [3. Backend API Gateway & Proxy Server (`server.ts`)](#3-backend-api-gateway--proxy-server-serverts)
   - [4. Fixed-Pinned Responsive Navigation Bar (`Navbar.tsx`)](#4-fixed-pinned-responsive-navigation-bar-navbartsx)
   - [5. Interactive Scroll Storytelling & Feature Showcase](#5-interactive-scroll-storytelling--feature-showcase)
   - [6. Simple UI Mode & Fluid Scalable Typography Engine](#6-simple-ui-mode--fluid-scalable-typography-engine)
   - [7. First-Time Walkthrough & Onboarding Module](#7-first-time-walkthrough--onboarding-module)
   - [8. Emergency Assistance & Safe SMS Simulation Module](#8-emergency-assistance--safe-sms-simulation-module)
   - [9. Privacy-First Dual-Engine Regional Map (Online + Offline)](#9-privacy-first-dual-engine-regional-map-online--offline)
   - [10. Cognitive Training Games Hub (9 Clinical Neuro-Stimulation Engines)](#10-cognitive-training-games-hub-9-clinical-neuro-stimulation-engines)
   - [11. Memory Vault & Reminiscence Therapy System](#11-memory-vault--reminiscence-therapy-system)
   - [12. AI Reminiscence Companion & Cognitive Recommendation Engine](#12-ai-reminiscence-companion--cognitive-recommendation-engine)
   - [13. Daily Mood & Health Check-In Module](#13-daily-mood--health-check-in-module)
   - [14. Interactive Articulated Living Cat Engine](#14-interactive-articulated-living-cat-engine)
   - [15. Multi-Role Authentication & User Security System](#15-multi-role-authentication--user-security-system)
   - [16. Caregiver Management & Telemetry Portal](#16-caregiver-management--telemetry-portal)
   - [17. Doctor & Clinical Analytics Portal](#17-doctor--clinical-analytics-portal)
   - [18. Well Voice Assistant & Speech Synthesis Engine](#18-well-voice-assistant--speech-synthesis-engine)
   - [19. Unique Selling Proposition (USP) & 10-Slide Pitch Deck Engine](#19-unique-selling-proposition-usp--10-slide-pitch-deck-engine)
   - [20. Multilingual Regional Inclusion Engine (8 Regional Languages)](#20-multilingual-regional-inclusion-engine-8-regional-languages)
   - [21. State Management & Context Providers](#21-state-management--context-providers)
   - [22. Desktop Native Integration (Electron 33 Core)](#22-desktop-native-integration-electron-33-core)
   - [23. Backend, Database & Service Layer](#23-backend-database--service-layer)
7. [Folder Structure](#-folder-structure)
8. [⚡ Complete Guide: How to Use & Build Electron](#-complete-guide-how-to-use--build-electron)
9. [Available Scripts](#-available-scripts)
10. [Tech Stack](#-tech-stack)
11. [License](#-license)

---

## 💻 Programming Languages & Technologies Used

SmritiCare is built using a modern full-stack architecture optimized for speed, accessibility, cross-platform compatibility, and strict type safety:

| Language / Technology | Files / Extensions | Role in Project |
| :--- | :--- | :--- |
| **TypeScript** | `.ts`, `.tsx` | **Primary Language (~85%)**: All frontend UI components, React pages, 9 cognitive game engines, React Context state managers, Electron main & preload scripts, types, and utility algorithms. |
| **JavaScript (ESM / Node.js)** | `.js`, `.cjs` | **Tooling & Build Scripts**: PostCSS config, Tailwind config, esbuild bundling scripts, and compiled Electron runtime scripts. |
| **HTML5** | `.html` | **Application Entry Point & Semantics**: Document structure, viewport configuration for accessibility, high-DPI scaling, and canvas rendering targets. |
| **CSS3 & Tailwind CSS** | `.css`, Tailwind utilities | **Design System & Visual Styling**: Industrial high-contrast design tokens (Nothing OS style), fluid typography, custom keyframe animations, dyslexia font support, and WCAG AAA compliance. |
| **SQL (PostgreSQL)** | `.sql` | **Database & Security**: Relational tables for daily check-ins, game telemetry, user profiles, medication reminders, memory vault metadata, and Row-Level Security (RLS) policies in Supabase. |
| **JSON** | `.json` | **Configuration & Packaging**: `package.json` dependencies, `tsconfig.json` compiler options, `electron-builder.json` Windows packaging definitions, and `metadata.json`. |
| **NSIS Scripting** | Embedded NSIS | **Windows Installer Automation**: Embedded NSIS routines for building the Windows setup installer (`Smriti-Care-Setup.exe`), Start Menu shortcuts, and uninstaller logic. |
| **Web Speech API** | Browser Native API | **Speech Synthesis (TTS) & Recognition (STT)**: Multi-language narration across all 8 supported North-East & Indian languages, plus voice recognition for interactive voice-guided check-ins. |
| **Web Audio API** | Browser Native API | **Calming Harmonic Audio Engine**: Generates real-time 528Hz and 396Hz harmonic chimes for peaceful audio feedback during voice interactions. |

---

---

## 🪟 Complete Guide: How to Run on a Windows Laptop

Whether you want to install and run the pre-built desktop application or run the source code using PowerShell, Command Prompt, or VS Code, follow the step-by-step instructions below.

---

### Method 1: Run the Pre-Built Windows App (Fastest / No Coding Required)

If you already have the `release/` folder or downloaded the build artifacts:

#### Option A: Run the Standalone Unpacked App
1. Open the project folder on your Windows laptop.
2. Navigate into the `release\win-unpacked\` directory:
   ```text
   release\win-unpacked\
   ```
3. Locate **`Smriti Care.exe`**.
4. **Double-click `Smriti Care.exe`** to launch the native desktop application immediately.
   *(Optional: Right-click `Smriti Care.exe` $\rightarrow$ **Show more options** $\rightarrow$ **Send to** $\rightarrow$ **Desktop (create shortcut)** for quick future access).*

#### Option B: Install with the Setup Installer
1. Navigate into the `release\` directory.
2. Double-click **`Smriti-Care-Setup.exe`**.
3. Follow the on-screen installer prompts.
4. Once installed, search for **"Smriti Care"** in the Windows Start Menu or double-click the shortcut on your desktop.

> 💡 **Note on Windows SmartScreen**: If Windows Defender shows *"Windows protected your PC"*, click **"More info"** $\rightarrow$ **"Run anyway"** (this occurs because the local build is self-packaged and not signed with a commercial Microsoft code signing certificate).

---

### Method 2: Run via Web Browser on Windows

To run the application inside Google Chrome, Microsoft Edge, or Firefox:

#### Step 1: Install Node.js on your Windows Laptop
1. Download Node.js (Version **18.x** or **20+ LTS**) from [nodejs.org](https://nodejs.org/).
2. Run the `.msi` installer and click **Next** through all prompts (make sure the "Add to PATH" option is checked).
3. To verify installation, open **PowerShell** or **Command Prompt** (Press `Win + R`, type `powershell`, and hit Enter) and run:
   ```powershell
   node -v
   npm -v
   ```

#### Step 2: Open the Project in PowerShell or Command Prompt
1. Open PowerShell, Windows Terminal, or Command Prompt.
2. Navigate to your project folder:
   ```powershell
   cd C:\path\to\neuro-ner
   ```

#### Step 3: Install Dependencies
Run the following command in PowerShell:
```powershell
npm install
```

#### Step 4: Start the Local Development Server
```powershell
npm run dev
```

#### Step 5: Open in Your Browser
Once the terminal displays `Ready in ... ms`, open your web browser and navigate to:
```text
http://localhost:3000
```
- Click any **1-Click Demo Account** on the login page (Patient, Caregiver, or Doctor) to explore without needing any backend configuration!

---

### Method 3: Run as Native Windows Desktop App from Source (Electron Dev Mode)

To run the application inside a dedicated, borderless Windows native window with live hot-reloading:

1. Open **PowerShell** or **Command Prompt** in the project directory:
   ```powershell
   cd C:\path\to\neuro-ner
   ```
2. Run:
   ```powershell
   npm run electron:dev
   ```
3. What happens automatically:
   - Compiles Electron's `main.ts` and `preload.ts` into `dist-electron/`.
   - Starts Vite development server in the background on port `3000`.
   - Launches a dedicated `1440x900` native Windows desktop window titled **Smriti Care**.
   - Changes you make to code in `src/` will hot-reload instantly inside the desktop window!

---

### Method 4: Build Your Own Windows `.exe` Installer

To compile and package the entire app into a redistributable Windows setup installer (`.exe`) and standalone zip:

1. Open PowerShell or Command Prompt in the project directory.
2. Run:
   ```powershell
   npm run electron:build
   ```
3. When the build finishes, your freshly built Windows binaries will be located in the `release/` folder:
   - **`release\Smriti-Care-Setup.exe`**: Ready-to-install Windows installer.
   - **`release\Smriti-Care-Setup.zip`**: Portable zip archive you can extract on any Windows PC.
   - **`release\win-unpacked\Smriti Care.exe`**: Direct portable executable folder.

---

### 🔧 Windows Troubleshooting & Tips

- **PowerShell Execution Policy Error (`ps1 cannot be loaded`)**:
  If PowerShell blocks running `npm` scripts with a security message:
  1. Open PowerShell as Administrator.
  2. Run:
     ```powershell
     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
     ```
  3. Re-run your `npm` command.
- **Port 3000 Already in Use**:
  If port 3000 is occupied by another application, kill the process on Windows via PowerShell:
  ```powershell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
  ```
- **Where are local memories and user data saved on Windows?**:
  In desktop mode, photos and user data are stored locally in the standard Windows user data directory:
  ```text
  %APPDATA%\Smriti Care\smriti-memories\
  ```
  (Usually located at `C:\Users\<YourUsername>\AppData\Roaming\Smriti Care`).

---

---

## 🚀 Quick Start & Setup

### Prerequisites

- **Node.js**: Version `18.0.0` or higher
- **npm** (v9+) or **yarn** / **pnpm**

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd neuro-ner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 🔑 Environment Variables & API Keys

SmritiCare uses environment variables to connect to external services such as **Google Gemini AI** and **Supabase**. All credentials are stored in a local `.env` file in the project root.

> 🛡️ **Security Note**: Never commit your `.env` file or actual secrets to public version control or GitHub. The `.env` file is already listed in `.gitignore` to protect your privacy.

---

### ⚙️ Quick Step-by-Step Guide: How to Put API Keys into the Project

#### Step 1: Create your local `.env` file
A template file called `.env.example` is provided in the root directory. You can create your `.env` file using your terminal or text editor:

* **Using Windows PowerShell:**
  ```powershell
  Copy-Item .env.example .env
  ```
* **Using Windows Command Prompt (CMD):**
  ```cmd
  copy .env.example .env
  ```
* **Using macOS / Linux / Git Bash:**
  ```bash
  cp .env.example .env
  ```
* **Using VS Code / File Explorer:**
  1. Open the project folder in VS Code or your code editor.
  2. Right-click the root folder (empty area in the file explorer sidebar) and select **New File**.
  3. Name the file exactly **`.env`** (make sure there is a leading dot and no `.txt` extension).
  4. Copy the contents from `.env.example` into your new `.env` file.

---

#### Step 2: Open `.env` and Insert Your Keys
Open the `.env` file in VS Code or any text editor (Notepad, nano, etc.). It should look like this:

```env
# ==========================================
# SMRITICARE ENVIRONMENT CONFIGURATION
# ==========================================

# 1. Google Gemini AI (Optional for Advanced Reminiscence & Clinical AI)
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# 2. Supabase Authentication & PostgreSQL Database (Dual Vite & Next.js Support)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
# Also seamlessly supported across environments:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key

# 3. Google Maps Platform (Optional for Live Online Google Maps & Google Places Search)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyYourGoogleMapsApiKeyHere
```

Replace the placeholder values on the right-hand side of the `=` with your actual credentials.

---

#### Step 3: Restart Your Development Server
Because Vite and Node.js load environment variables when starting up, **you must restart the dev server after editing `.env`**:

1. In the terminal where `npm run dev` is running, press **`Ctrl + C`** to stop the server.
2. Start it again:
   ```bash
   npm run dev
   ```
3. Your application will now load with the active API keys!

---

### 🌐 How to Put API Keys in Google AI Studio / Cloud Deployments

If you are running or sharing the application within **Google AI Studio** or deploying to **Cloud Run / Vercel / Netlify**:

1. **In Google AI Studio**:
   - Do **not** create a UI form to type in API keys.
   - Click the **Settings** gear icon in the top header or side panel.
   - Navigate to **Secrets / Environment Variables**.
   - Add your secret keys (e.g. `GEMINI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) with their corresponding values.
   - The platform will securely inject them into the application environment.

2. **In Vercel / Netlify / Cloud Run**:
   - Go to your project's **Settings** $\rightarrow$ **Environment Variables**.
   - Add key-value pairs matching `.env.example`.
   - Re-deploy the application to apply the new variables.

---

### 📖 Detailed Instructions: How to Obtain Each API Key

#### 1. Google Gemini API Key (`GEMINI_API_KEY`)
* **What it powers**: Used by the AI Reminiscence Companion, conversational memory reflection, and clinical narrative summarization.
* **How to get a key**:
  1. Visit the [Google AI Studio API Keys Page](https://aistudio.google.com/app/apikey).
  2. Sign in with your Google account.
  3. Click **"Create API key"** (or **"Get API key"**).
  4. Select or create a Google Cloud project to associate with the key.
  5. Copy your newly generated key (starts with `AIzaSy...`).
  6. In your `.env` file, paste it directly:
     ```env
     GEMINI_API_KEY=AIzaSyD-ExampleKeyXYZ123456789
     ```

#### 2. Supabase Keys (`VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`)
* **What it powers**: User registration, login, doctor telemetry, clinical notes sync, and persistent caregiver tracking.
* **How to get your keys**:
  1. Go to [supabase.com](https://supabase.com) and click **"Start your project"** or sign in.
  2. Create a new organization and project (e.g., named `smriti-care`).
  3. Once your project is ready, click the **Project Settings** (gear icon at the bottom of the left sidebar).
  4. Click **"API"** under the Configuration section.
  5. Look for the **Project URL**:
     - Copy the URL (e.g. `https://xyzcompany.supabase.co`).
     - Paste it into `VITE_SUPABASE_URL` in `.env`.
  6. Look for **Project API keys** and locate the **`anon` / `public`** key:
     - Copy the long JWT token string.
     - Paste it into `VITE_SUPABASE_ANON_KEY` in `.env`.
  7. *(Required for email links)*: Go to **Authentication** $\rightarrow$ **URL Configuration**:
     - Set **Site URL** to `http://localhost:3000` (or your deployed domain).
     - Add `http://localhost:3000/auth/callback` to the **Redirect URLs** list.

---

### 💡 Syntax Rules & Common Mistakes to Avoid

| Rule | Correct Example | Incorrect Example | Why? |
| :--- | :--- | :--- | :--- |
| **No spaces around `=`** | `GEMINI_API_KEY=AIza...` | `GEMINI_API_KEY = AIza...` | Spaces around `=` cause parsing failures in Node.js & dotenv. |
| **No quotation marks** | `VITE_SUPABASE_URL=https://abc.supabase.co` | `VITE_SUPABASE_URL="https://abc.supabase.co"` | Quotes are generally unnecessary and may get parsed as part of the string. |
| **Vite prefix rule** | `VITE_SUPABASE_URL=...` | `SUPABASE_URL=...` | Frontend Vite code can only read client-side variables prefixed with `VITE_`. |
| **Server-only secrets** | `GEMINI_API_KEY=...` | `VITE_GEMINI_API_KEY=...` | Never prefix private AI/server keys with `VITE_`, to prevent them from leaking into client-side JS bundles. |

---

### 📴 Zero-Config / Demo Mode (No Keys Needed for Testing!)

Don't have API keys yet or just want to test the app? **No problem!**

SmritiCare includes an automatic **Zero-Config Demo Mode**:
- If `.env` is empty or missing, the application automatically falls back to client-side demo accounts.
- On the login screen, simply click any **1-Click Demo Account**:
  - 🟢 **Patient Demo** (`patient@smriticare.org`)
  - 🔵 **Caregiver Demo** (`caregiver@smriticare.org`)
  - 🟣 **Doctor Demo** (`doctor@smriticare.org`)
- All 9 clinical cognitive training games, the interactive cat, memory vault, and local voice narrator will work smoothly without any cloud configuration.

---

## 🚀 Major Architectural Changes & Refactorings Log

This section provides an executive summary and technical breakdown of recent major system refactorings, security audits, UI responsive fixes, and state management upgrades implemented across SmritiCare.

---

### 1. Dynamic User State Binding & Removal of Hardcoded Dummy Names
* **Files Modified:** `src/context/AuthContext.tsx`, `src/context/RoleContext.tsx`, `src/data/patients.ts`, `src/data/activities.ts`, `src/data/memories.ts`, `src/utils/wellbeingUtils.ts`, `src/services/ai/memoryCompanion.ts`, `server.ts`, `src/components/RoleSwitcherModal.tsx`, `src/components/scroll/HeroScrollSection.tsx`, `src/components/scroll/StickyFeatureSection.tsx`, `src/components/scroll/MemoryWallSection.tsx`, `src/components/scroll/AICompanionScrollSection.tsx`, `src/pages/PatientDashboard.tsx`, `src/pages/MemoriesPage.tsx`, `src/pages/MemoryCompanionPage.tsx`, `src/pages/RoleSelectionPage.tsx`, `src/pages/SignupPage.tsx`, `src/pages/LoginPage.tsx`, `src/games/*.tsx`, and all 8 translation catalogs (`src/i18n/translations/*.ts`).
* **The Problem:**
  Previously, dummy names (*"Shri Biren Baruah"*, *"Ananya Baruah"*, *"Dr. Hemanta Phukan"*, *"Mukul Rawat"*, *"Lakshya Raj"*) were hardcoded across various UI elements, including hero session cards, role switcher modals, game victory dialogues, greeting banners, and regional localization files. This created an unprofessional presentation and broke personalization for newly registered users.
* **Architecture & Solution:**
  1. **Centralized User Hook (`useCurrentUser`)**: Created and exported the `CurrentUser` interface and `useCurrentUser()` hook from `src/context/AuthContext.tsx`.
  2. **Reactive Fallback Mechanics**:
     ```typescript
     export interface CurrentUser {
       name: string;
       role: string;
       email?: string;
       avatarUrl?: string;
       isAuthenticated: boolean;
     }

     export const useCurrentUser = () => {
       const { user, isAuthenticated } = useAuth();
       const currentUser: CurrentUser = useMemo(() => ({
         name: isAuthenticated && user?.name ? user.name : 'Visitor',
         role: isAuthenticated && user?.role ? user.role : 'Guest',
         email: user?.email,
         avatarUrl: user?.avatarUrl,
         isAuthenticated,
       }), [user, isAuthenticated]);

       return { currentUser, displayName: currentUser.name, isAuthenticated };
     };
     ```
  3. **Conditional Dynamic UI Binding**: When an unauthenticated visitor arrives, all greeting banners, cards, and audition dialogues display `"Visitor"`. Once the user registers or logs in, `AuthContext` updates, causing React to immediately re-render all instances of `{displayName}` with the user's actual registered name.
  4. **Zero-UI-Change Future Integration**: Any future authentication provider (OAuth, Supabase, Firebase, or enterprise SAML) needs only to populate `user.name` in `AuthContext`; all UI components automatically consume and display it without changing a single line of component code.
  5. **Multilingual Catalog Overhaul**: Updated `patientName: 'Visitor'`, `rolePatientPersona: 'Visitor (Patient)'`, `roleCaregiverPersona: 'Visitor (Caregiver)'`, and `doctorRolePersona: 'Visitor (Doctor)'` across all 8 supported Indian and regional languages (`en`, `as`, `bn`, `hi`, `mni`, `kha`, `lus`, `nag`).

---

### 2. Backend Secure API Gateway & Proxy Architecture (`server.ts`)
* **Files Modified/Created:** `server.ts`, `src/services/ai/memoryCompanion.ts`, `.env.example`, `package.json`
* **The Problem:**
  Direct browser-to-cloud API invocations risked exposing private third-party credentials (`GEMINI_API_KEY`, speech engine keys) in client-side bundles, making them vulnerable to extraction and abuse.
* **Architecture & Solution:**
  1. **Node.js Express Server Gateway**: Built an Express backend gateway (`server.ts`) listening on port `3001` (bundled into `dist/server.cjs` via esbuild).
  2. **Secure Proxy Endpoints**:
     - `POST /api/companion`: Ingests conversation history, user identity, and patient reminders, and calls the Google Gemini AI model using server-side environment variables.
     - `GET /api/places/nearby`: Proxies geographic landmark queries.
     - `POST /api/speech-to-text`: Handles voice audio streams server-side.
  3. **SessionStorage & In-Memory Caching**: Caches conversational responses and queries to prevent redundant external API hits, lower latency, and preserve offline operability.
  4. **Strict Fallback Resiliency**: If external AI services time out or lose connectivity, the proxy seamlessly serves culturally grounded offline reassurance templates.

---

### 3. Fixed-Pinned Responsive Header & Navigation System
* **Files Modified:** `src/components/Navbar.tsx`, `src/index.css`
* **The Problem:**
  On standard laptop displays ($1366 \times 768$ and $1440 \times 900$), all primary navigation links were previously collapsed behind a mobile hamburger drawer, leaving an empty void in the header. Subsequent horizontal scrolling attempts caused the `"SMRITICARE (R)"` logo to scroll out of view.
* **Architecture & Solution:**
  1. **Tripartite Structural Layout**:
     - **Left Side (`.logo-wrapper`)**: Permanently pinned to the left with `flex-shrink: 0`, ensuring the brand identifier never scrolls or moves.
     - **Center-Left (`.nav-links-container`)**: Independent horizontally-scrollable navigation links container with custom invisible scrollbars, allowing all 11+ navigation destinations to remain accessible on laptops without crowding.
     - **Right Side (`.nav-actions`)**: Pinned action buttons (Role Switcher, Simple UI toggle, Quick SOS, User Profile).
  2. **Responsive Breakpoint Adjustment**: Replaced premature desktop collapsing with a mobile-only breakpoint (`max-width: 1024px`), guaranteeing full navigation visibility on standard laptops.

---

### 4. Modal Layering & Stacking Context Fix (`z-index: 99999`)
* **Files Modified:** `src/index.css`, `src/components/RoleSwitcherModal.tsx`, `src/pages/SettingsPage.tsx`
* **The Problem:**
  The sticky/floating navigation bar had a stacking index of `z-index: 9999`. Modals rendered underneath the navbar, causing modal headers and close triggers to be obscured.
* **Architecture & Solution:**
  1. **Elevated Stacking Order**: Updated `.modal-overlay` to `z-index: 99999` with `position: fixed; inset: 0;`.
  2. **Top-Aligned Vertical Positioning**: Changed overlay flex alignment from `items-center` to `items-start` with top padding (`pt-20 pb-12`) and `overflow-y: auto`, preventing header clipping and ensuring full scrolling visibility on smaller viewports.

---

### 5. Multilingual Audio Auditioning & Speech Engine Stabilization
* **Files Modified:** `src/components/scroll/AICompanionScrollSection.tsx`, `src/utils/speechEngine.ts`
* **The Problem:**
  Invoking voice audition triggers in the interactive AI companion scroll section caused runtime `handleAuditionVoice is not defined` errors and lacked native phrase greetings for regional dialects.
* **Architecture & Solution:**
  1. **Engine Pre-Warming (`primeSpeechEngine()`)**: Wakes up the Web Speech API on the initial user click to circumvent aggressive browser autoplay and audio context restrictions.
  2. **Multilingual Voice Auditioning**: Added synchronized audio preview greetings in 7 regional languages (English, Assamese, Bengali, Hindi, Meitei/Manipuri, Khasi, and Bodo) dynamically bound to the active user's `displayName`.

---

### 6. Production-Ready Supabase Auth (v2) Pipeline & Centralized Client
* **Files Modified/Created:** `src/lib/supabaseClient.ts`, `src/lib/supabase.ts`, `src/context/AuthContext.tsx`, `src/pages/LoginPage.tsx`, `src/pages/SignupPage.tsx`, `vite.config.ts`
* **The Problem:**
  Previous authentication logic utilized custom intermediate wrappers that masked specific Supabase errors, had inconsistent environment variable detection between Vite and Next.js, and lacked robust email confirmation flow handling.
* **Architecture & Solution:**
  1. **Centralized Client (`src/lib/supabaseClient.ts`)**:
     - Initialized once with `createClient` using environment variables.
     - Dual environment compatibility: seamlessly resolves `NEXT_PUBLIC_SUPABASE_*` and `VITE_SUPABASE_*` across `import.meta.env` and `process.env`.
     - Standardized PKCE auth flow, persistent `localStorage` session handling, and auto token refresh.
  2. **Global Auth Context & Real-Time Listener (`src/context/AuthContext.tsx`)**:
     - Global subscription using `supabase.auth.onAuthStateChange` to keep session state synchronized across tabs, refreshes, and auth events.
     - Exposes `user`, `session`, `loading`, `signIn`, `signUp`, and `signOut` via `useAuth()`.
  3. **Direct Sign In (`LoginPage.tsx`)**:
     - Direct standard call to `supabase.auth.signInWithPassword({ email, password })`.
     - Loading states with disabled button and spinner feedback.
     - Direct Supabase `error.message` display, with automatic detection for unconfirmed email accounts.
  4. **Direct Sign Up (`SignupPage.tsx`)**:
     - Direct standard call to `supabase.auth.signUp(...)` with user metadata (`name`, `role`, `location`).
     - Gracefully handles email verification flow (`data.session === null`), guiding users to check their inbox.
  5. **Clean Session Destruction**:
     - Standardized `signOut()` method destroying the Supabase session, clearing local auth context, and redirecting the user to `/login`.

---

### 7. Unauthenticated-Only Landing Experience & Route Protection
* **Files Modified:** `src/components/auth/AuthGuard.tsx`, `src/App.tsx`, `src/pages/LandingPage.tsx`
* **The Problem:**
  Authenticated users were repeatedly shown the public introductory landing page, and unauthenticated visitors could attempt to access protected clinical and patient dashboards.
* **Architecture & Solution:**
  1. **Unauthenticated Landing Invariant**: The Introduction/Landing page (`/` and `/intro`) is strictly reserved for logged-out visitors.
  2. **Immediate Dashboard Routing**: Once authenticated, users are immediately routed into their corresponding role dashboard (`/patient`, `/caregiver`, or `/doctor`) without flashing or showing the landing page.
  3. **Route Protection Guards (`src/components/auth/AuthGuard.tsx`)**:
     - `ProtectedRoute`: Verifies active session before rendering protected routes; redirects unauthenticated users to `/login` with a return URL.
     - `PublicAuthRoute`: Prevents logged-in users from visiting `/login` and `/signup`, redirecting them to their dashboard.
     - `PublicIntroRoute`: Blocks authenticated users from `/` and `/intro`, forwarding them straight into their care dashboard.

---

### 8. Independent Accessibility Architecture (No Sign-In Required)
* **Files Modified:** `src/context/AccessibilityContext.tsx`, `src/components/AccessibilityModal.tsx`, `src/pages/LandingPage.tsx`, `src/components/Navbar.tsx`
* **The Problem:**
  Cognitive accessibility settings (text scaling, simple UI, contrast, voice assistance) should never require an account, as elderly users need accessible controls before they can even read or complete sign-in.
* **Architecture & Solution:**
  1. **Decoupled Accessibility**: The complete accessibility control suite is available directly from the unauthenticated landing page, navigation header, and modal dialogs.
  2. **Full In-Browser Persistence**: Preferences are saved locally to `localStorage` (`smriti_accessibility_prefs`, `smriti_theme`, `smriti_font_size`) and persist across browser reloads, through sign-in, and after logout.
  3. **Data Privacy**: No private patient or clinical telemetry is ever stored in accessibility preference stores.

---

### 9. Complete Premium Dark Mode & Button Styling System
* **Files Modified:** `src/index.css`, `index.html`, `electron/main.ts`, `src/context/AccessibilityContext.tsx`, `src/components/Navbar.tsx`, `src/pages/LoginPage.tsx`, `src/pages/SignupPage.tsx`, `src/components/AccessibilityModal.tsx`
* **The Problem:**
  In dark mode, several option buttons, language cards, and form inputs retained light grey backgrounds with low-contrast dark text, disrupting the dark mode aesthetic.
* **Architecture & Solution:**
  1. **Foundational Color Palette**:
     - Canvas Background: Near-black (`#0A0A0C`).
     - Secondary Surfaces: Deep charcoal (`#141418`).
     - Cards & Containers: Charcoal (`#17171C` / `rgba(23, 23, 28, 0.92)`).
     - Typography: Pure white headings & body (`#FFFFFF`), soft light gray secondary (`#A1A1AA`), and strategic Smriti Care terracotta red (`#DE4A30`).
  2. **Option & Standard Button Styling Pass**:
     - Standard/option buttons in dark mode render with dark grey background (`#2A2A2A` / `dark:bg-gray-800`), crisp white text (`#FFFFFF`), and subtle dark borders (`#3F3F4A` / `dark:border-gray-700`).
     - Selected/active states highlight with Smriti Care terracotta orange/red (`#DE4A30`) with white typography.
     - Primary action buttons ("SIGN IN", "LISTEN ALOUD") preserve their bold terracotta styling.
  3. **Anti-White-Flash Engineering**:
     - Pre-render inline theme detection script in `index.html` applies `.dark` before React mounts.
     - Desktop Electron window configured with `backgroundColor: '#0C0C0E'` to eliminate white flashes on desktop startup.

---

## 🧩 Comprehensive Modules Catalog

SmritiCare is structured into **23 comprehensive functional modules** covering client presentation, state management, cognitive game engines, AI therapy, clinical telemetry, regional inclusion, and native desktop integration:

---

### 1. Core Pages & Dashboards
*All top-level routed views in `/src/pages/`:*

| Module / Page Name | File Path | Functional Purpose & Key Features |
| :--- | :--- | :--- |
| **Patient Dashboard** | `/src/pages/PatientDashboard.tsx` | Main command center for patients with dementia or MCI. Features **Simple UI Mode** toggle (5 distraction-free tactile cards: Today's Activity, Memory Companion, Daily Game, Reminders, and Help/SOS) alongside full telemetry, daily schedule, streak badges, dynamic `{displayName}` greeting, and mood check-in. |
| **Important Places & Map** | `/src/pages/PlacesPage.tsx` | Privacy-first regional orientation map (Assam & Kamrup Metro landmarks: Home, GMCH Hospital, Doctor Clinic, Pharmacy, Family, Park). Dual online/offline vector canvas with 1-tap direct Call and Route actions, zero background GPS tracking. |
| **Product Presentation Deck** | `/src/pages/PresentationPage.tsx` | In-app 10-slide interactive pitch deck detailing Smriti Care's executive vision, regional challenges, clinical architecture, cognitive game suite, AI companion, and clinical roadmap. Supports arrow navigation, thumbnail scrubber, speaker notes, and fullscreen. |
| **Caregiver Dashboard** | `/src/pages/CaregiverDashboard.tsx` | Telemetry portal for family and formal caregivers. Tracks patient routine adherence, sleep quality, game performance, medication logs, and monitors caregiver burden risk scores. |
| **Doctor / Clinician Portal** | `/src/pages/DoctorDashboard.tsx` | Specialized clinical dashboard displaying longitudinal cognitive trajectories, estimated MMSE/MoCA scores via Recharts, reaction time curves, and exportable medical summary evaluations. |
| **Cognitive Games Hub** | `/src/pages/GamesHub.tsx` | Game catalog organized across 5 clinical cognitive domains (Memory, Attention, Executive Function, Language, Visual-Spatial). Displays difficulty filters and personal best scores. |
| **Memory Vault** | `/src/pages/MemoriesPage.tsx` | Interactive photo album and reminiscence vault with voice note attachments, categorized timeline tags, loved ones association, audio playback, and dynamic `{displayName}` notification simulation. |
| **AI Memory Companion** | `/src/pages/MemoryCompanionPage.tsx` | Conversational reminiscence companion that generates warm, comforting conversational prompts based on stored family photos, patient memories, and active caregiver profile. |
| **Reminders & Routine Page** | `/src/pages/RemindersPage.tsx` | Daily schedule management interface for morning, afternoon, and evening medication, hydration goals, and doctor appointments with audio alarms. |
| **Cognitive Progress Page** | `/src/pages/ProgressPage.tsx` | Patient and family progress overview with weekly activity heatmaps, cognitive domain radar charts, and milestone achievement badges. |
| **Patient Profile Page** | `/src/pages/PatientProfilePage.tsx` | Medical history, emergency contacts, primary clinician contact, diagnosis stage, allergies, and caregiver circle management. |
| **Landing & Orientation Page** | `/src/pages/LandingPage.tsx` | Unauthenticated-only introduction page highlighting the **Personalized Memory-Assisted Cognitive Care (USP Section)** with 8 core pillars, 4-tier care ecosystem, clinical game methodology, independent accessibility controls (no sign-in required), and quick demo login access. Guarded by `PublicIntroRoute`. |
| **Authentication & Auth Pages** | `/src/pages/LoginPage.tsx`<br>`/src/pages/SignupPage.tsx`<br>`/src/pages/ForgotPasswordPage.tsx`<br>`/src/pages/ResetPasswordPage.tsx`<br>`/src/pages/EmailVerificationPage.tsx`<br>`/src/pages/AuthCallbackPage.tsx` | Production-ready authentication suite utilizing standard Supabase Auth v2 methods (`signInWithPassword`, `signUp`, `signOut`), direct error message reporting, loading spinners, graceful email confirmation flows, strict dark mode compliance, and `PublicAuthRoute` route protection. |
| **Role Selection Portal** | `/src/pages/RoleSelectionPage.tsx` | Interactive switcher allowing instant role swapping between Patient, Caregiver, and Doctor for demonstration and multi-user environments. |
| **Accessibility & Settings** | `/src/pages/SettingsPage.tsx` | Global accessibility preferences available without sign-in: Simple UI Mode toggle, 4-step fluid typography scaling (Small, Normal, Large, Extra Large) with live preview, Dyslexia font, High Contrast, Display Theme (Light/Dark), and Replay Walkthrough. |

---

### 2. Dynamic User State & Central Identity Engine (`useCurrentUser`)
* **Location:** `/src/context/AuthContext.tsx`
* **Purpose:** Provides a centralized, reactive identity engine ensuring zero hardcoded dummy names across the application.
* **Key Capabilities:**
  - `useCurrentUser()` Hook: Dynamically computes `displayName` based on `isAuthenticated` and `user.name`.
  - Deterministic Fallback: Automatically resolves to `"Visitor"` when unauthenticated.
  - Zero-UI Coupling: Any new authentication backend connects to `AuthContext` with immediate, app-wide UI updates.

---

### 3. Backend API Gateway & Proxy Server (`server.ts`)
* **Location:** `/server.ts` & `/dist/server.cjs`
* **Purpose:** Protects sensitive third-party API keys (Google Gemini, Places, Speech-to-Text) from client-side bundle exposure.
* **Key Capabilities:**
  - Express API gateway running on port `3001` (or alongside desktop bundling).
  - Secure `/api/companion` proxy endpoint executing Gemini queries server-side.
  - In-memory response caching and offline fallback templates for zero-latency reassurance.

---

### 4. Fixed-Pinned Responsive Navigation Bar (`Navbar.tsx`)
* **Location:** `/src/components/Navbar.tsx` & `/src/index.css`
* **Purpose:** Traditional, feature-rich desktop navigation bar grouping brand and links on the left, and actions on the right.
* **Key Capabilities:**
  - Pinned `.logo-wrapper` permanently fixed on the far left.
  - Horizontally-scrollable `.nav-links-container` with hidden scrollbars for dense laptops ($1366 \times 768$).
  - Full desktop navigation visibility on all screens $\ge 1024\text{px}$.
  - Seamless mobile drawer fallback for phones and tablets.

---

### 5. Interactive Scroll Storytelling & Feature Showcase
* **Location:** `/src/components/scroll/*`
* **Key Sub-modules:**
  - `HeroScrollSection.tsx`: Cinematic hero section with active session card bound to `{displayName}`.
  - `StickyFeatureSection.tsx`: Scroll-locked interactive feature canvas showcasing memory vault, clinical games, and AI companion.
  - `MemoryWallSection.tsx`: Parallax floating memory cards with rich cultural storytelling.
  - `AICompanionScrollSection.tsx`: Interactive voice auditioning in 7 languages and live simulated dialogue.
  - `CaregiverScrollDashboard.tsx`: Live telemetry preview for family members.
  - `InteractiveReminderSection.tsx`: Tactile routine timeline with audio chime previews.
  - `RegionalAccessibilitySection.tsx`: Visual matrix of the 8 supported North-Eastern and Indian languages.
  - `FinalCTASection.tsx`: Concluding call-to-action onboarding portal.

---

### 6. Simple UI Mode & Fluid Scalable Typography Engine
* **Location:** `/src/context/AccessibilityContext.tsx`, `/src/pages/PatientDashboard.tsx`, `/src/index.css`
* **Purpose:** Zero-clutter, high-focus interface for elderly individuals experiencing cognitive fatigue or visual impairment.
* **Key Capabilities:**
  - 1-Tap Simple UI Mode: Collapses complex dashboards into 5 large tactile cards ($\ge 56\text{px}$ touch targets).
  - 4-Step Scalable Typography: Fluid rem scaling across Small, Normal, Large (115%), and Extra Large (130%).
  - Strategic Dieter Rams Red Accent: Red (`#D71921`) reserved exclusively for critical SOS alerts.

---

### 7. First-Time Walkthrough & Onboarding Module
* **Location:** `/src/components/WalkthroughModal.tsx`
* **Purpose:** Accessible 7-step guided onboarding tour for seniors and family caregivers.
* **Key Capabilities:**
  - Full keyboard accessibility and high-contrast visuals.
  - Persisted completion state in `localStorage` (`smriti_walkthrough_completed`).
  - Replayable on demand via Settings.

---

### 8. Emergency Assistance & Safe SMS Simulation Module
* **Location:** `/src/components/EmergencyHelpModal.tsx` & `/src/context/RoleContext.tsx`
* **Purpose:** Transparent, safe emergency lifeline for family contact without deceptive claims.
* **Key Capabilities:**
  - Dual Urgency Selection: Routine check-in vs. urgent medical alert.
  - Direct 1-tap phone dialer (`tel:...`) and native mobile SMS protocol fallback (`sms:...`).
  - Transparent simulated dispatch logging to `localStorage` (`neuro_sms_logs`).

---

### 9. Privacy-First Dual-Engine Regional Map (Online + Offline)
* **Location:** `/src/components/ImportantPlacesMap.tsx`, `/src/components/GoogleMapOnline.tsx`, `/src/components/NorthEastOfflineMap.tsx`, `/src/data/northEastMapData.ts`
* **Purpose:** Geographic orientation and spatial memory anchors with seamless online/offline continuity.
* **Key Capabilities:**
  - Online Google Maps Platform with Google Places search and full attribution compliance.
  - Offline OpenStreetMap/Natural Earth vector dataset covering 8 North-Eastern states (~250 KB bundled).
  - 8 Essential Place Categories (Home, Clinic, Hospital, Pharmacy, Family, Park, etc.).

---

### 10. Cognitive Training Games Hub (9 Clinical Neuro-Stimulation Engines)
* **Location:** `/src/games/*` & `/src/pages/GamesHub.tsx`
* **Key Clinical Game Engines:**

| # | Game Module Name | File Location | Targeted Cognitive Domain & Therapeutic Mechanism |
| :- | :--- | :--- | :--- |
| 1 | **Memory Match** | `/src/games/MemoryMatchGame.tsx` | **Visual & Spatial Working Memory**: Progressive card-pair matching with dynamic `{displayName}` victory evaluation. |
| 2 | **Sequence Recall** | `/src/games/SequenceRecallGame.tsx` | **Short-Term Audio-Visual Memory**: Sequenced tone and light pattern repetition with tactile feedback. |
| 3 | **Pattern Finder** | `/src/games/PatternFinderGame.tsx` | **Inductive Reasoning & Fluid Intelligence**: Geometric sequence reasoning with dynamic completion feedback. |
| 4 | **Picture Recognition** | `/src/games/PictureRecognitionGame.tsx` | **Object Naming & Visual Agnosia Mitigation**: Household object naming to prevent language decline. |
| 5 | **Routine Recall** | `/src/games/RoutineRecallGame.tsx` | **Executive Function & IADL Skills**: Reorders daily sequential tasks with personalized user recognition. |
| 6 | **Emotion Recognition** | `/src/games/EmotionRecognitionGame.tsx` | **Socio-Emotional Acuity**: Facial expression identification maintaining emotional connection. |
| 7 | **Word Connect** | `/src/games/WordConnectGame.tsx` | **Semantic Memory & Verbal Fluency**: Semantic category vocabulary grouping. |
| 8 | **Market Memory** | `/src/games/MarketMemoryGame.tsx` | **Functional Everyday Memory Simulator**: Culturally grounded grocery market shopping under cognitive load. |
| 9 | **Name & Face Recall** | `/src/games/NameFaceRecallGame.tsx` | **Prosopagnosia Mitigation**: Associates family circle members with personalized names and roles. |

---

### 11. Memory Vault & Reminiscence Therapy System
* **Location:** `/src/pages/MemoriesPage.tsx`, `/src/components/MemoryUploadModal.tsx`, `/src/data/memories.ts`
* **Key Capabilities:**
  - Digital photo albums with voice note attachments and relationship tagging.
  - Electron native filesystem persistence (`%APPDATA%/Smriti Care/smriti-memories/`).
  - Interactive reminiscence therapy mode with memory reflection questions.

---

### 12. AI Reminiscence Companion & Cognitive Recommendation Engine
* **Location:** `/src/services/ai/*` & `/src/pages/MemoryCompanionPage.tsx`
* **Key Capabilities:**
  - `memoryCompanion.ts`: Generates personalized, compassionate conversational prompts via secure server proxy.
  - `recommendationEngine.ts`: Suggests the optimal next cognitive activity based on user game scores and fatigue.
  - `adaptiveEngine.ts`: Dynamically scales game difficulty parameters based on real-time accuracy and reaction time.
  - `caregiverSummary.ts`: Summarizes daily patient activity into actionable caregiver insights.

---

### 13. Daily Mood & Health Check-In Module
* **Location:** `/src/components/DailyMoodHealthCheckin.tsx`, `/src/components/WellbeingCheckIn.tsx`, `/src/utils/wellbeingUtils.ts`
* **Key Capabilities:**
  - Tactile 6-mood selector, 5-level energy gauge, pain rating, and sleep quality assessment.
  - Consecutive low mood tracking with automatic caregiver alerts (`evaluateConsecutiveNegativeResponses`).
  - Historical review modal with longitudinal wellbeing trends.

---

### 14. Interactive Articulated Living Cat Engine
* **Location:** `/src/components/InteractiveCat.tsx`
* **Key Capabilities:**
  - 4-limb kinematic stride generator with individual limb phase offsets and breathing bob.
  - Autonomous state cycling (sleeping, stretching, sitting, walking, yawning).
  - Password privacy integration: covers eyes when typing password; peeks when revealed.

---

### 15. Multi-Role Authentication & User Security System
* **Location:** `/src/pages/LoginPage.tsx`, `/src/pages/SignupPage.tsx`, `/src/context/AuthContext.tsx`, `/src/lib/supabaseClient.ts`, `/src/components/auth/AuthGuard.tsx`
* **Key Capabilities:**
  - 3-Role operational modes: Patient, Caregiver, and Doctor with automatic route-directed entry.
  - Production-ready Supabase Auth (v2) integration with PKCE flow, persistent session handling, and real-time `onAuthStateChange` synchronization.
  - Direct `signInWithPassword` and `signUp` calls with instant inline error display and graceful email confirmation flows.
  - Route Protection Architecture: `ProtectedRoute` guarding clinical and patient dashboards, and `PublicAuthRoute` redirecting authenticated users away from login/signup.
  - Instant 1-Click Demo Accounts for testing without cloud credentials.

---

### 16. Caregiver Management & Telemetry Portal
* **Location:** `/src/pages/CaregiverDashboard.tsx`, `/src/pages/PatientProfilePage.tsx`
* **Key Capabilities:**
  - Real-time patient routine adherence, hydration tracking, and cognitive game completion metrics.
  - Zarit Caregiver Burden index evaluation and proactive respite alerts.
  - Remote schedule management for medication and appointment alerts.

---

### 17. Doctor & Clinical Analytics Portal
* **Location:** `/src/pages/DoctorDashboard.tsx`
* **Key Capabilities:**
  - Longitudinal MMSE/MoCA trajectory visualizations via Recharts.
  - 5-domain cognitive radar analytics (Memory, Executive, Attention, Language, Visual-Spatial).
  - Clinical note logging and exportable telemetry summaries.

---

### 18. Well Voice Assistant & Speech Synthesis Engine
* **Location:** `/src/components/WellVoiceAssistant.tsx`, `/src/components/VoiceDictationButton.tsx`, `/src/utils/speechEngine.ts`, `/src/hooks/useSpeechRecognition.ts`, `/src/components/TTSButton.tsx`
* **Key Capabilities:**
  - Conversational voice-guided daily check-in with automatic sentiment extraction.
  - Dual-harmonic Web Audio API sine synthesis (528 Hz + 396 Hz) for calming interaction cues.
  - Multi-language Text-to-Speech (`TTSButton`) and speech dictation across regional dialects.

---

### 19. Unique Selling Proposition (USP) & 10-Slide Pitch Deck Engine
* **Location:** `/src/components/scroll/USPSection.tsx`, `/src/pages/PresentationPage.tsx`
* **Key Capabilities:**
  - 8 foundational pillars of memory-assisted cognitive care.
  - In-app 10-slide presentation deck with keyboard controls, timer, speaker notes, and fullscreen.

---

### 20. Multilingual Regional Inclusion Engine (8 Regional Languages)
* **Location:** `/src/i18n/translations/*`, `/src/context/AccessibilityContext.tsx`
* **Key Capabilities:**
  - Native scripts & full dictionaries for: English (`en`), Assamese (`as`), Bengali (`bn`), Hindi (`hi`), Manipuri (`mni`), Khasi (`kha`), Mizo (`lus`), and Nagamese (`nag`).
  - 120+ standardized translation keys per language covering all UI components, games, and emergency dialogs.
  - Standardized `"Visitor"` persona bindings across all 8 translation catalogs.

---

### 21. State Management & Context Providers
* **Location:** `/src/context/*`
* **Key Providers:**
  - `AuthContext.tsx`: User identity, session tokens, login/signup/logout, and `useCurrentUser()`.
  - `RoleContext.tsx`: Active role, patient profile, medication reminders, memory records, and game scores.
  - `AccessibilityContext.tsx`: Fluid typography, high contrast, dyslexia font, Simple UI Mode, and i18n translations.

---

### 22. Desktop Native Integration (Electron 33 Core)
* **Location:** `/electron/main.ts`, `/electron/preload.ts`, `/src/types/electron.d.ts`
* **Key Capabilities:**
  - Dedicated native Windows desktop application with window control IPC channels.
  - Secure context isolation bridge (`window.electronAPI`).
  - Local filesystem photo persistence in `%APPDATA%/Smriti Care/smriti-memories/`.

---

### 23. Backend, Database & Service Layer
* **Location:** `/server.ts`, `/src/services/*`, `/src/lib/*`, `/supabase/migrations/*`
* **Key Capabilities:**
  - Express API gateway (`server.ts`) proxying external AI and speech services.
  - Supabase client initializer with offline detection.
  - PostgreSQL schema definitions for check-ins, telemetry, reminders, and Row-Level Security (RLS) policies.

---

---

## 📁 Folder Structure

```
neuro-ner/
├── src/
│   ├── components/            # UI components (Navbar, Footer, Cat, TTS, Modals)
│   │   ├── InteractiveCat.tsx # Full articulated living animated cat
│   │   ├── Navbar.tsx         # Responsive navigation bar
│   │   ├── Footer.tsx         # Application footer
│   │   ├── TTSButton.tsx      # Web Speech Text-to-Speech button
│   │   └── ...
│   ├── context/               # React Context providers (Auth, Role, Accessibility)
│   │   ├── AuthContext.tsx
│   │   ├── RoleContext.tsx
│   │   └── AccessibilityContext.tsx
│   ├── games/                 # 9 Cognitive exercise game components
│   │   ├── MemoryMatchGame.tsx
│   │   ├── SequenceRecallGame.tsx
│   │   ├── NameFaceRecallGame.tsx
│   │   └── ...
│   ├── lib/                   # Client libraries (Supabase, utilities)
│   │   ├── supabaseClient.ts
│   │   └── utils.ts
│   ├── pages/                 # Full application views and dashboards
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── PatientDashboard.tsx
│   │   ├── CaregiverDashboard.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── MemoriesPage.tsx
│   │   └── ...
│   ├── services/              # Authentication and business logic services
│   │   └── supabaseAuthService.ts
│   ├── types.ts               # Global TypeScript definitions
│   ├── App.tsx                # Main routing & application wrapper
│   ├── main.tsx               # DOM entry point
│   └── index.css              # Global Tailwind CSS and styling variables
├── public/                    # Static assets & icons
├── .env.example               # Example environment variable template
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build & bundler configuration
└── README.md                  # Complete documentation
```

---

## ⚡ Complete Guide: How to Use & Build Electron

Smriti Care is architected as an **offline-first, native desktop application** using **Electron 33** and **Electron Builder**, paired with React 18 and Vite. This guide explains the desktop architecture, step-by-step development commands, packaging workflows, IPC security model, and troubleshooting techniques.

---

### 1. Why Electron for Cognitive & Dementia Care?

Elderly patients and clinical memory care facilities frequently experience spotty internet, strict medical privacy requirements, and high cognitive fatigue:
* **True Offline Resiliency:** The entire application—all 9 clinical cognitive training games, the Simple UI Mode, the regional Kamrup Metro map, the living interactive cat, and the Well Voice assistant—functions 100% offline without requiring internet or active cloud servers.
* **Privacy & Local Data Sovereignty:** Patient reminiscence photographs, voice notes, daily medication logs, and health check-ins are stored directly on the local operating system filesystem (`%APPDATA%`), ensuring sensitive medical records never leak to third-party servers unless family explicitly chooses cloud sync.
* **Distraction-Free Desktop Environment:** Launches in a dedicated native window (`1440x900` or fullscreen) without distracting browser tabs, URL bars, or push notifications that cause confusion for seniors.
* **Native OS Capabilities:** Smooth integration with native Windows file picker dialogs, system audio output for 528Hz calming harmonic chimes, and automatic hardware acceleration.

---

### 2. Prerequisites & System Requirements

Before running or building Electron, ensure your system meets the following specifications:

| Requirement | Minimum | Recommended |
| :--- | :--- | :--- |
| **Node.js** | `v18.0.0` | `v20.18.0` LTS or higher |
| **npm** | `v9.0.0` | `v10.0.0` or higher |
| **Operating System** | Windows 10/11 x64, macOS 11+, or Linux (Ubuntu 20.04+, Debian 11+, Fedora 38+) | Windows 11 (64-bit) or Linux X11/Wayland |
| **Display Resolution** | `1024 x 768` | `1920 x 1080` or higher |
| **Memory (RAM)** | 4 GB RAM | 8 GB RAM |

To verify your Node.js and npm versions:
```bash
node -v
npm -v
```

---

### 3. Electron Architecture & Directory Layout

Smriti Care strictly isolates the native Node.js runtime from the browser rendering context to prevent remote code execution vulnerabilities:

```text
smriticare-/
├── electron/
│   ├── main.ts               # Electron Main Process (Window lifecycle, IPC handlers, CSP)
│   └── preload.ts            # Context-Isolated Preload Bridge (window.electronAPI)
├── dist-electron/            # esbuild compilation target
│   ├── main.cjs              # Compiled Main process bundle (CommonJS)
│   └── preload.cjs           # Compiled Preload bundle (CommonJS)
├── src/types/
│   └── electron.d.ts         # TypeScript definitions for window.electronAPI
├── electron-builder.json     # Windows NSIS, portable executable & asset packaging rules
└── package.json              # Electron build scripts and dependency configurations
```

#### Core Components:
1. **Main Process (`electron/main.ts`):** 
   - Spawns the `BrowserWindow` with `1440x900` dimensions and custom icon.
   - Enforces strict security: `contextIsolation: true`, `nodeIntegration: false`, and `webSecurity: true`.
   - Injects Content Security Policy (CSP) headers protecting against unauthorized script injection.
   - Handles IPC requests: native file selection dialogs, saving/loading photos in `%APPDATA%`, and window minimization/maximization.
   - Safely routes external URLs to the user's default browser via `shell.openExternal()`.
2. **Preload Bridge (`electron/preload.ts`):**
   - Uses Electron's `contextBridge.exposeInMainWorld('electronAPI', ...)` to expose an immutable, type-safe API surface to the React renderer.
3. **Renderer Process (`src/`):**
   - Standard React 18 + Vite web application that seamlessly detects if running inside Electron via `Boolean(window.electronAPI)`.

---

### 4. Running Electron in Development Mode

To run Smriti Care inside a live desktop window with **Hot Module Replacement (HMR)**:

```bash
npm run electron:dev
```

#### What happens automatically:
1. **Compiles Electron Scripts:** Runs `npm run build:electron` via `esbuild`, compiling `electron/main.ts` $\rightarrow$ `dist-electron/main.cjs` and `electron/preload.ts` $\rightarrow$ `dist-electron/preload.cjs` in under 100ms.
2. **Starts Backend Server:** Launches the Node.js server via `cross-env NODE_ENV=development tsx server.ts` (or starts Vite on port 3000).
3. **Waits for Server Readiness:** Uses the `wait-on` utility to wait for `http://localhost:3000` to return HTTP 200.
4. **Launches Native Window:** Spawns `electron . --dev`, loading `http://localhost:3000` into a dedicated desktop window titled **Smriti Care**.
5. **Live Hot Reloading:** Any edits to files in `src/` (components, pages, styles) update instantly inside the desktop window without restarting Electron!

> 💡 **Developer Tools:** Press `Ctrl + Shift + I` (Windows/Linux) or `Cmd + Option + I` (macOS) at any time inside the desktop window to toggle the Chromium Developer Tools console and element inspector.

---

### 5. Compiling Electron Scripts Separately

If you only want to transpile the TypeScript main and preload scripts without starting the web server:

```bash
npm run build:electron
```

This compiles:
- `electron/main.ts` $\rightarrow$ `dist-electron/main.cjs`
- `electron/preload.ts` $\rightarrow$ `dist-electron/preload.cjs`

---

### 6. Packaging & Building the Windows Executable (`.exe` Installer)

To package Smriti Care into a complete, standalone redistributable Windows setup installer (`.exe`) and portable standalone application:

```bash
npm run electron:build
```

#### The Automated Build Pipeline:
1. **Compiles Frontend (`npm run build`):** Executes Vite production bundle, compiling TypeScript, Tailwind CSS, assets, and React components into the production `/dist` directory.
2. **Compiles Electron Core (`npm run build:electron`):** Transpiles `electron/main.ts` and `electron/preload.ts` into `/dist-electron`.
3. **Packages Windows Binaries (`electron-builder`):** Bundles the Chromium runtime, Node.js binaries, `/dist`, and `/dist-electron` into the `/release` directory based on rules in `electron-builder.json`.

#### Output Artifacts in `/release`:
```text
release/
├── Smriti-Care-Setup.exe          # Standard Windows x64 NSIS Installer (Install wizard with Start Menu shortcut)
├── Smriti-Care-Setup.zip          # Portable compressed ZIP archive for offline USB distribution
└── win-unpacked/                 # Unpacked standalone portable folder
    ├── Smriti Care.exe           # Direct executable (Runs immediately without installation)
    ├── resources/                # Embedded application bundle
    └── ...
```

---

### 7. How to Distribute & Run the Built Desktop App

#### Option 1: Standalone Portable Execution (Fastest / No Install)
1. Navigate to the `release/win-unpacked/` folder.
2. Double-click **`Smriti Care.exe`**.
3. The app launches immediately with full local storage and native features.
4. *Tip:* You can copy the entire `win-unpacked` folder onto a USB drive to run Smriti Care on any Windows 10 or 11 laptop without internet access or administrative privileges.

#### Option 2: Windows Setup Installer
1. Send **`release/Smriti-Care-Setup.exe`** to the user.
2. Double-click `Smriti-Care-Setup.exe` and follow the guided setup wizard.
3. The installer creates a desktop shortcut and registers Smriti Care in the Windows Start Menu and Add/Remove Programs.

> 🛡️ **Windows Defender / SmartScreen Notice:** Because local hackathon and open-source builds are self-packaged without an expensive Microsoft EV Code Signing Certificate, Windows Defender SmartScreen may display *"Windows protected your PC"*. Simply click **"More info"** $\rightarrow$ **"Run anyway"**.

---

### 8. Running on Linux & macOS

Smriti Care is cross-platform and can be developed or packaged on Linux and macOS:

#### On Linux Desktop (Ubuntu, Debian, Fedora, Arch):
```bash
# Ensure you have a running X11 or Wayland display session
npm run electron:dev
```
* **Packaging for Linux (`.AppImage` / `.deb`):**
  ```bash
  npx electron-builder --linux --config electron-builder.json
  ```
* **Running in Headless / CI Linux (without a physical monitor):**
  If running tests or builds in headless Docker or CI containers, use `xvfb` (virtual framebuffer):
  ```bash
  xvfb-run -a npm run electron:dev
  ```

#### On macOS (Intel & Apple Silicon):
```bash
npm run electron:dev
```
* **Packaging for macOS (`.dmg`):**
  ```bash
  npx electron-builder --mac --config electron-builder.json
  ```

---

### 9. IPC Channels & Security Bridge Reference

The preload script exposes `window.electronAPI` to React components. The table below lists all supported IPC channels:

| Method / Property | IPC Channel | Parameters | Description |
| :--- | :--- | :--- | :--- |
| `window.electronAPI.minimize()` | `window:minimize` | None | Minimizes the desktop window to the Windows taskbar. |
| `window.electronAPI.maximize()` | `window:maximize` | None | Toggles between maximized and restored window state. |
| `window.electronAPI.close()` | `window:close` | None | Gracefully terminates and closes the desktop application. |
| `window.electronAPI.isMaximized()` | `window:isMaximized` | None | Returns a boolean promise indicating if window is currently maximized. |
| `window.electronAPI.openFileDialog()` | `dialog:openFile` | Filter options | Opens the native Windows file selection dialog to import family photos. |
| `window.electronAPI.saveMemoryPhoto()` | `photos:save` | `{ name, buffer }` | Saves photo into `%APPDATA%/Smriti Care/smriti-memories/`. |
| `window.electronAPI.getMemoryPhotos()` | `photos:getAll` | None | Returns list of local image paths stored in `%APPDATA%`. |
| `window.electronAPI.openExternal(url)` | `shell:openExternal` | `url: string` | Safely opens external hyperlinks in user's default browser (Chrome, Edge). |

---

### 10. Electron Troubleshooting & Frequently Asked Questions

#### Q1: Port 3000 is already in use (`EADDRINUSE: address already in use :::3000`)
**Cause:** A previous dev server process is still running in the background.  
**Fix for Windows (PowerShell):**
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```
**Fix for macOS / Linux (Terminal):**
```bash
kill -9 $(lsof -t -i:3000)
```
Then restart: `npm run electron:dev`.

#### Q2: PowerShell says `npm run electron:dev : File cannot be loaded because running scripts is disabled`
**Cause:** Windows PowerShell default execution policy blocks unsigned scripts.  
**Fix:** Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Then re-run your npm command in your terminal.

#### Q3: Where are patient photos and local memories stored on Windows?
In Electron mode, all memory album photos are saved locally in:
```text
%APPDATA%\Smriti Care\smriti-memories\
```
*(Full path: `C:\Users\<YourUsername>\AppData\Roaming\Smriti Care\smriti-memories\`)*.  
To view them, press `Win + R`, paste the path above, and press Enter.

#### Q4: White Screen or `wait-on` Timeout when starting Electron
**Cause:** Vite took longer than 30 seconds to start, or port 3000 did not respond.  
**Fix:**
1. Test if the web server boots independently: `npm run dev`.
2. Ensure you have run `npm install` and your dependencies are up to date.
3. Check that no firewall or antivirus is blocking local connections on `127.0.0.1:3000`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite local development server on `http://localhost:3000` |
| `npm run electron:dev` | Compiles electron scripts, boots Vite, and launches the desktop app |
| `npm run build` | Compiles TypeScript types and bundles the production app into `/dist` |
| `npm run build:electron` | Bundles `electron/main.ts` and `electron/preload.ts` via esbuild |
| `npm run electron:build` | Compiles frontend and generates Windows desktop app & NSIS installer |
| `npm run preview` | Spins up a local web server to preview the production `/dist` build |

---

## 🛠 Tech Stack

- **Framework:** React 18 with TypeScript
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS with custom Nothing-style industrial color tokens
- **Animations:** Motion (`framer-motion`) & Canvas Confetti
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **Backend / Authentication:** Supabase (`@supabase/supabase-js`)
- **Speech Synthesis:** Web Speech API

---

## 📄 License

This project is developed for cognitive healthcare and dementia care support under the MIT License.
