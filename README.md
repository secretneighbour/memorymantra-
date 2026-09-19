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
5. [🧩 Comprehensive Modules Catalog](#-comprehensive-modules-catalog)
   - [1. Core Pages & Dashboards](#1-core-pages--dashboards)
   - [2. Simple UI Mode & Fluid Scalable Typography Engine](#2-simple-ui-mode--fluid-scalable-typography-engine)
   - [3. First-Time Walkthrough & Onboarding Module](#3-first-time-walkthrough--onboarding-module)
   - [4. Emergency Assistance & Safe SMS Simulation Module](#4-emergency-assistance--safe-sms-simulation-module)
   - [5. Privacy-First Regional Map & Important Places Module](#5-privacy-first-regional-map--important-places-module)
   - [6. Cognitive Training Games Hub (9 Clinical Games)](#6-cognitive-training-games-hub-9-clinical-games)
   - [7. Memory Vault & Reminiscence Therapy Module](#7-memory-vault--reminiscence-therapy-module)
   - [8. Daily Mood & Health Check-In Module](#8-daily-mood--health-check-in-module)
   - [9. Interactive Articulated Living Cat Engine](#9-interactive-articulated-living-cat-engine)
   - [10. Authentication & 3-Role User Security System](#10-authentication--3-role-user-security-system)
   - [11. Caregiver Management & Telemetry Portal](#11-caregiver-management--telemetry-portal)
   - [12. Doctor & Clinical Analytics Portal](#12-doctor--clinical-analytics-portal)
   - [13. Accessibility & Speech Synthesis Engine](#13-accessibility--speech-synthesis-engine)
   - [14. Unique Selling Proposition (USP) & 10-Slide Pitch Deck Module](#14-unique-selling-proposition-usp--10-slide-pitch-deck-module)
   - [15. Multilingual Regional Inclusion Engine (8 Languages)](#15-multilingual-regional-inclusion-engine-8-languages)
   - [16. State Management & Context Providers](#16-state-management--context-providers)
   - [17. Desktop Native Integration (Electron Core)](#17-desktop-native-integration-electron-core)
   - [18. Backend, Database & Service Layer](#18-backend-database--service-layer)
6. [Folder Structure](#-folder-structure)
7. [⚡ Complete Guide: How to Use & Build Electron](#-complete-guide-how-to-use--build-electron)
8. [Available Scripts](#-available-scripts)
9. [Tech Stack](#-tech-stack)

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

# 2. Supabase Authentication & PostgreSQL Database (Optional for Cloud Sync)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key

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

## 🧩 Comprehensive Modules Catalog

SmritiCare is architected into 12 core functional module systems across presentation, game mechanics, clinical telemetry, accessibility, and native desktop integration:

---

### 1. Core Pages & Dashboards
*All top-level routed views in `/src/pages/`:*

| Module / Page Name | File Path | Functional Purpose & Key Features |
| :--- | :--- | :--- |
| **Patient Dashboard** | `/src/pages/PatientDashboard.tsx` | Main command center for patients with dementia or MCI. Features **Simple UI Mode** toggle (5 distraction-free tactile cards: Today's Activity, Memory Companion, Daily Game, Reminders, and Help/SOS) alongside full telemetry, daily schedule, streak badges, and mood check-in. |
| **Important Places & Map** | `/src/pages/PlacesPage.tsx` | Privacy-first regional orientation map (Assam & Kamrup Metro landmarks: Home, GMCH Hospital, Doctor Clinic, Pharmacy, Family, Park). Offline-safe vector canvas with 1-tap direct Call and Route actions, zero background GPS tracking. |
| **Product Presentation Deck** | `/src/pages/PresentationPage.tsx` | In-app 10-slide interactive pitch deck detailing Smriti Care's executive vision, regional challenges, clinical architecture, cognitive game suite, AI companion, and clinical roadmap. Supports arrow navigation, thumbnail scrubber, speaker notes, and fullscreen. |
| **Caregiver Dashboard** | `/src/pages/CaregiverDashboard.tsx` | Telemetry portal for family and formal caregivers. Tracks patient routine adherence, sleep quality, game performance, medication logs, and monitors caregiver burden risk scores. |
| **Doctor / Clinician Portal** | `/src/pages/DoctorDashboard.tsx` | Specialized clinical dashboard displaying longitudinal cognitive trajectories, estimated MMSE/MoCA scores via Recharts, reaction time curves, and exportable medical summary evaluations. |
| **Cognitive Games Hub** | `/src/pages/GamesHub.tsx` | Game catalog organized across 5 clinical cognitive domains (Memory, Attention, Executive Function, Language, Visual-Spatial). Displays difficulty filters and personal best scores. |
| **Memory Vault** | `/src/pages/MemoriesPage.tsx` | Interactive photo album and reminiscence vault with voice note attachments, categorized timeline tags, loved ones association, and audio playback. |
| **AI Memory Companion** | `/src/pages/MemoryCompanionPage.tsx` | Conversational reminiscence companion that generates warm, comforting conversational prompts based on stored family photos and patient memories. |
| **Reminders & Routine Page** | `/src/pages/RemindersPage.tsx` | Daily schedule management interface for morning, afternoon, and evening medication, hydration goals, and doctor appointments with audio alarms. |
| **Cognitive Progress Page** | `/src/pages/ProgressPage.tsx` | Patient and family progress overview with weekly activity heatmaps, cognitive domain radar charts, and milestone achievement badges. |
| **Patient Profile Page** | `/src/pages/PatientProfilePage.tsx` | Medical history, emergency contacts, primary clinician contact, diagnosis stage, allergies, and caregiver circle management. |
| **Landing & Orientation Page** | `/src/pages/LandingPage.tsx` | Public introduction page highlighting the **Personalized Memory-Assisted Cognitive Care (USP Section)** with 8 core pillars, 4-tier care ecosystem, clinical game methodology, accessibility features, and quick demo login access. |
| **Authentication & Auth Pages** | `/src/pages/LoginPage.tsx`<br>`/src/pages/SignupPage.tsx`<br>`/src/pages/ForgotPasswordPage.tsx`<br>`/src/pages/ResetPasswordPage.tsx`<br>`/src/pages/EmailVerificationPage.tsx`<br>`/src/pages/AuthCallbackPage.tsx` | Complete authentication suite supporting email/password registration, password recovery, magic link verification, 3-tab role selector (Patient, Caregiver, Doctor), and 1-Click Demo Accounts. |
| **Role Selection Portal** | `/src/pages/RoleSelectionPage.tsx` | Interactive switcher allowing instant role swapping between Patient, Caregiver, and Doctor for demonstration and multi-user environments. |
| **Accessibility & Settings** | `/src/pages/SettingsPage.tsx` | Global accessibility preferences: Simple UI Mode toggle, 4-step fluid typography scaling (Small, Normal, Large, Extra Large) with live preview, Dyslexia font, High Contrast, and Replay Walkthrough. |

---

### 2. Simple UI Mode & Fluid Scalable Typography Engine
* **Location:** `/src/context/AccessibilityContext.tsx`, `/src/pages/PatientDashboard.tsx`, `/src/index.css`
* **Purpose:** Provides a zero-clutter, high-focus interface for elderly individuals experiencing cognitive fatigue or visual impairment.
* **Key Capabilities:**
  - **1-Tap Simple UI Mode:** Strips away secondary telemetry badges, graphs, and diagnostic charts. Transforms the Patient Dashboard into **5 large tactile cards**:
    1. *Today's Activity*: Daily recommended cognitive task with large $\ge 56\text{px}$ primary action button.
    2. *Smriti Memory Companion*: Warm, peaceful conversation launcher for reminiscence therapy.
    3. *Recommended Cognitive Game*: Daily neuro-stimulation exercise.
    4. *Today's Reminders*: Streamlined schedule with high-contrast `[ ✓ Done ]` and `[ ⏰ Later ]` buttons.
    5. *Family & Help*: 1-tap direct caregiver phone dialer and emergency assistance trigger.
  - **4-Step Scalable Typography:** Fluid sizing across **Small**, **Normal (Default)**, **Large (115%)**, and **Extra Large (130%)** with live preview in Settings. Scales headings, buttons, and inputs harmoniously without horizontal scroll or layout breaking.
  - **Strategic Red Accent System:** Follows Dieter Rams / Nothing OS guidelines where red (`#D71921`) is reserved exclusively for critical alerts, emergency SOS, and urgent reminder states, paired with icons so color is never the sole information carrier.
  - **Offline Persistence:** Settings persist instantly to `localStorage` (`neuro_simpleUIMode`, `neuro_text_size`).

---

### 3. First-Time Walkthrough & Onboarding Module
* **Location:** `/src/components/WalkthroughModal.tsx`
* **Purpose:** An accessible, calm 7-step onboarding guide introducing seniors and family members to the platform.
* **7 Guided Steps:**
  1. *Welcome to Smriti Care*: Cognitive care companion introduction.
  2. *Your Memories*: Memory Vault and oral history audio narratives.
  3. *Keep Your Mind Active*: 9 clinical cognitive training games.
  4. *Your Daily Journey*: Routine check-ins and daily milestone goals.
  5. *Never Miss an Important Reminder*: Medication, hydration, and doctor visits.
  6. *Stay Connected*: Family care circle and caregiver telemetry.
  7. *Need Help?*: Emergency assistance and instant SMS dispatch.
* **Key Features:**
  - Full keyboard accessibility (Arrow keys, Escape to close).
  - Clear **[Skip]**, **[Back]**, **[Next]**, and **[Get Started]** navigation.
  - Automatic first-visit trigger persisted in `localStorage` (`smriti_walkthrough_completed`).
  - Replayable anytime via the *"Replay Onboarding Guide"* button in Settings.
  - 100% translated across all 8 regional languages.

---

### 4. Emergency Assistance & Safe SMS Simulation Module
* **Location:** `/src/components/EmergencyHelpModal.tsx` & `/src/context/RoleContext.tsx`
* **Purpose:** A safe, transparent lifeline for immediate family assistance without deceptive claims.
* **Key Capabilities:**
  - **Urgency Selection:** Patient chooses between *"I need gentle help"* (routine check-in) and *"Emergency Situation"* (urgent medical alert).
  - **Trusted Contacts Directory:** Displays configured emergency contacts with Primary caregiver badges and one-tap direct phone dialer (`tel:...`).
  - **Pre-Composed Message Preview:** Pre-formats comforting, clear messages:
    - *Routine:* `"Smriti Care Alert: [Patient Name] requested gentle assistance/check-in. Please contact them when free."`
    - *Emergency:* `"[URGENT] Smriti Care SOS Alert: [Patient Name] requires immediate assistance. Please call back immediately."`
  - **Explicit Confirmation Step:** Prevents accidental triggers by requiring an intentional `[Confirm & Send SMS]` tap.
  - **Native Mobile `sms:` Protocol Fallback:** Automatically generates native `sms:${phone}?body=...` action buttons allowing real SMS dispatch via the device's native messaging application on mobile devices.
  - **Honest Simulation Layer:** Clearly identifies simulated mock dispatches with realistic status timelines (Sending $\rightarrow$ Delivered) and logs them into `localStorage` (`neuro_sms_logs`) and caregiver alert telemetry.

---

### 5. Dual-Engine Regional Map & Important Places Module (Google Maps Online + OpenStreetMap Offline)
* **Location:** `/src/components/ImportantPlacesMap.tsx`, `/src/components/GoogleMapOnline.tsx`, `/src/components/NorthEastOfflineMap.tsx`, `/src/data/northEastMapData.ts`, `/src/pages/PlacesPage.tsx`
* **Purpose:** Geographic orientation and spatial memory anchors for familiar regional places with seamless online/offline continuity and zero privacy invasion.
* **Architecture & Compliance:**
  - **Online Mode (Google Maps Platform):** Interactive Google Maps with zoom/pan, category pins, and integrated Google Places search (hospital, pharmacy, clinic, address). Strictly abides by Google Platform Terms: zero scraping, no local tile caching, Place IDs stored only where permitted, and full Google attribution/logo preserved.
  - **Offline Mode (OpenStreetMap / Natural Earth Vector Engine):** A completely separate, legally redistributable open vector map dataset covering the **8 North-Eastern States of India** (Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura, Sikkim). Renders state boundary polygons, the Brahmaputra and Barak river networks, national highways (NH 27, NH 37, GS Road), regional capital hubs, and all saved places with zero Google tile requests.
  - **Graceful Online/Offline Switching:** Automatically transitions between Google Maps and the Offline Map based on network connectivity without jumping or losing saved places. Manual override available via Map Settings (Auto / Online / Offline).
* **Key Capabilities:**
  - **8 Essential Place Categories:** Home, Doctor Clinic, Hospital, Pharmacy, Family Residence, Caregiver, Familiar Park, and Other.
  - **Role-Based Access Control:**
    - *Patient:* View all important places and add personal anchors.
    - *Caregiver:* Full management (add, edit, delete, mark primary, assign landmark memory cues).
    - *Doctor:* Filtered clinical view restricted to medical and emergency anchors only.
  - **Current Location Tracker:** Explicit user-permission geolocation without continuous background tracking.
  - **Emergency Care Integration:** "I Need Help" quick drawer immediately displays nearest hospital/clinic, primary caregiver contact, and 1-tap SOS SMS dispatch.
  - **Simple UI Mode:** Adapts into 4 large tactile buttons (Map, Important Places, Where Am I?, and SOS) with high contrast and oversized touch targets ($\ge 56\text{px}$).
  - **Actual Dataset Size & Licensing:** Dynamically computes and displays the bundled offline map data size (~250 KB) with required OpenStreetMap ODbL attribution.

---

### 6. Cognitive Training Games Hub (9 Clinical Games)
* **Location:** `/src/games/*` & `/src/pages/GamesHub.tsx`
* **Clinically Designed Neuro-Stimulation Modules:**

| # | Game Module Name | File Location | Targeted Cognitive Domain & Therapeutic Mechanism |
| :- | :--- | :--- | :--- |
| 1 | **Memory Match** | `/src/games/MemoryMatchGame.tsx` | **Visual & Spatial Working Memory**: Card-pair matching with everyday items, fruits, and shapes with progressive grid sizes (2x2 up to 4x4). |
| 2 | **Sequence Recall** | `/src/games/SequenceRecallGame.tsx` | **Short-Term Audio-Visual Memory**: Simon-style sequenced tone and light pattern repetition with tactile feedback. |
| 3 | **Pattern Finder** | `/src/games/PatternFinderGame.tsx` | **Inductive Reasoning & Fluid Intelligence**: Identifies geometric patterns and predicts the missing element in a sequence. |
| 4 | **Picture Recognition** | `/src/games/PictureRecognitionGame.tsx` | **Object Naming & Visual Agnosia Mitigation**: Identifies and names common household objects and tools to prevent language decline. |
| 5 | **Routine Recall** | `/src/games/RoutineRecallGame.tsx` | **Executive Function & Instrumental Activities of Daily Living (IADL)**: Reorders daily sequential tasks (e.g., waking up, brushing teeth, taking medication, eating breakfast). |
| 6 | **Emotion Recognition** | `/src/games/EmotionRecognitionGame.tsx` | **Socio-Emotional Acuity & Empathy**: Identifies facial emotional expressions (happy, calm, sad, surprised, concerned) to maintain social connection. |
| 7 | **Word Connect** | `/src/games/WordConnectGame.tsx` | **Semantic Memory & Verbal Fluency**: Groups related vocabulary words by semantic category (e.g., fruits, kitchen utensils, weather, garden tools). |
| 8 | **Market Memory** | `/src/games/MarketMemoryGame.tsx` | **Functional Everyday Memory Simulator**: Memorizes a shopping grocery list and collects the items in a virtual pantry under cognitive load. |
| 9 | **Name & Face Recall** | `/src/games/NameFaceRecallGame.tsx` | **Prosopagnosia Mitigation & Facial Recognition**: Associates family members, caregivers, and friends with their correct names and relationship roles. |

---

### 7. Memory Vault & Reminiscence Therapy Module
* **Location:** `/src/pages/MemoriesPage.tsx`, `/src/pages/MemoryCompanionPage.tsx`, `/src/components/MemoryUploadModal.tsx`
* **Features:**
  - **Digital Memory Albums:** Structured storage for family photographs, vintage milestones, vacation memories, and life achievements.
  - **Audio Reminiscence Storytelling:** Voice note recording and playback for each memory item.
  - **Person & Location Tagging:** Associative metadata linking photos to specific family members (children, grandchildren, spouses) and locations.
  - **AI Reminiscence Companion:** Conversational partner encouraging gentle reflection on memories with empathetic questions and guided prompts.
  - **Native Desktop Storage:** When running in Electron, photos are stored directly in the local file system (`%APPDATA%/Smriti Care/smriti-memories`).

---

### 8. Daily Mood & Health Check-In Module
* **Location:** `/src/components/DailyMoodHealthCheckin.tsx` & `/src/utils/wellbeingUtils.ts`
* **Purpose:** A structured, elderly-friendly daily check-in that captures psychological state, physical comfort, and routine telemetry in under 30 seconds.
* **Key Features:**
  - **Tactile Mood Selector:** 6 expressive visual states (*Great/Energized, Good/Peaceful, Okay/Steady, Tired/Sleepy, Worried/Tense, Unwell/Discomfort*).
  - **Energy Level Gauge:** 5-step battery level selector (1 to 5).
  - **Physical Pain & Comfort Rating:** One-tap selection for *No Pain (Comfortable)*, *Mild Ache*, or *Moderate Pain*.
  - **Sleep Quality Evaluation:** Fast evaluation of last night's rest (*Restful, Okay, Restless*).
  - **Daily Habits Check-Off:** Quick toggles for hydration (water), meals taken, morning medication, and gentle stretches/walks.
  - **Symptom Tags & Notes:** One-tap symptom tags (*Headache, Joint Pain, Dizziness, Fatigue, Peaceful Mind, Refreshed*) and free-form note field.
  - **Persistence & Telemetry Sync:** Saves locally to `localStorage` and optionally synchronizes to Supabase `daily_health_checkins` table and `RoleContext`.
  - **Historical Review Modal:** Allows patients and caregivers to browse historical check-in trends and notes over time.

---

### 9. Interactive Articulated Living Cat Engine
* **Location:** `/src/components/InteractiveCat.tsx`
* **Purpose:** A living quadruped creature living on the login ledge to reduce user anxiety and provide joyful, non-intrusive tactile interaction.
* **Sub-systems & Capabilities:**
  - **Autonomous Behavior Engine:** Spontaneously cycles through states (`sleeping`, `waking`, `stretching`, `sitting`, `looking_around`, `scratching`, `yawning`, `idle`, `walking`) with randomized dwell intervals.
  - **Dynamic Quadruped Gait Physics:** 4-limb kinematic stride generator with individual limb phase offsets (`frontLeft`, `frontRight`, `hindLeft`, `hindRight`), body pitch tilt, and vertical breathing/walking bob.
  - **Interactive User Gestures:**
    - *Pointer Dragging:* Pick up and drag the cat across the ledge with a natural gravity-based drop and settle bounce.
    - *Stroke & Petting:* Continuous cursor strokes trigger purring vibration and squinting eyes.
    - *Startle & Escape:* High-speed cursor movement triggers a flinch, 180° turn, escape trot, and look-back sequence.
  - **Authentication Security Integration:**
    - Paw Coverage (`hiding_eyes`): Covers eyes with paws whenever the user focuses on or types into the password input field.
    - Sneak Peek (`peeking`): Peeks between paws when the "Show Password" eye toggle is activated.
    - Confetti Celebration: Leaps up with celebratory particle bursts when login is successful.
  - **5-Tier State Priority Hierarchy:** `AUTH_FEEDBACK` (Level 5) > `DIRECT_USER` (Level 4) > `REACTIVE` (Level 3) > `ATTENTION` (Level 2) > `AUTONOMOUS` (Level 1).

---

### 10. Authentication & 3-Role User Security System
* **Location:** `/src/pages/LoginPage.tsx`, `/src/pages/SignupPage.tsx`, `/src/context/AuthContext.tsx`, `/src/services/supabaseAuthService.ts`
* **Features:**
  - **3-Role Sign-in Switcher:** Visual tab selector on the login page enabling users to declare their intended operational mode:
    1. 🟢 **Patient**: Direct access to Simple UI Mode, daily activities, memories, and voice companion.
    2. 🔵 **Caregiver**: Direct access to adherence dashboards, routine scheduler, and Zarit burden monitor.
    3. 🟣 **Doctor / Clinician**: Direct access to clinical telemetry, cognitive domain radar, and diagnostic notes.
  - **Supabase Auth Client:** Secure JWT session handling, token refresh, and user metadata management.
  - **Email Verification Workflow:** Automatic confirmation flow with resend verification link triggers.
  - **1-Click Instant Demo Accounts:** Instant one-click authentication presets for Patient (`patient@smriticare.org`), Caregiver (`caregiver@smriticare.org`), and Doctor (`doctor@smriticare.org`).
  - **Password Privacy Integration:** Synchronized state events dispatching to the Interactive Cat.

---

### 11. Caregiver Management & Telemetry Portal
* **Location:** `/src/pages/CaregiverDashboard.tsx`, `/src/pages/PatientProfilePage.tsx`
* **Features:**
  - **Patient Adherence Telemetry:** Live tracking of daily medication intake, hydration status, and cognitive game completion rates.
  - **Zarit Caregiver Burden Monitoring:** Periodic assessment and proactive rest/respite alerts to prevent caregiver burnout.
  - **Remote Routine Scheduler:** Add, edit, or adjust patient daily routines, medication dosages, and hydration reminders remotely.
  - **Direct Clinician Messaging:** Share observational notes and health updates directly with the patient's neurologist or geriatrician.

---

### 12. Doctor & Clinical Analytics Portal
* **Location:** `/src/pages/DoctorDashboard.tsx`
* **Features:**
  - **Longitudinal Trend Curves:** Visualizes MMSE/MoCA trajectory estimates using Recharts over 30-day, 90-day, and 1-year time windows.
  - **Cognitive Domain Radar Breakdown:** Quantifies performance across Memory, Executive Function, Attention, Language, and Visual-Spatial domains.
  - **Telemetry Export:** Generates clinical summary evaluations suitable for medical chart integration.
  - **Medication & Treatment Notes:** Allows prescribing clinicians to log clinical observations and adjust cognitive therapy recommendations.

---

### 13. Accessibility & Speech Synthesis Engine (Well Voice & Speech Engine)
* **Location:** `/src/context/AccessibilityContext.tsx`, `/src/utils/speechEngine.ts`, `/src/components/WellVoiceAssistant.tsx`, `/src/components/VoiceDictationButton.tsx`, `/src/hooks/useSpeechRecognition.ts`, `/src/components/TTSButton.tsx`, `/src/pages/SettingsPage.tsx`
* **Features:**
  - **Well Voice Guided Assistant (`WellVoiceAssistant.tsx`):** A conversational voice assistant that walks elderly patients through their check-in flow (Mood → Energy Level → Physical Comfort → Spoken Note). It speaks prompts naturally in the patient's chosen language, listens to their spoken reply via Speech Recognition, and automatically parses sentiment and metrics.
  - **Voice Dictation Button (`VoiceDictationButton.tsx`):** A reusable microphone dictation control with live ripple animations and feedback, integrated into notes, health check-in, and AI companion inputs.
  - **Cross-Language Speech Recognition (`useSpeechRecognition.ts`):** Client-side speech-to-text supporting multi-language BCP-47 mapping across English (`en-US`), Hindi (`hi-IN`), Bengali (`bn-IN`), Assamese (`as-IN`), and regional dialects.
  - **Harmonic Audio Chimes (`speechEngine.ts`):** Web Audio API dual-harmonic sine synthesis (528 Hz Love Frequency + 396 Hz Solfeggio tone) providing relaxing acoustic confirmation before and after voice interactions.
  - **Web Speech Text-to-Speech (TTS):** 1-tap read-aloud button (`TTSButton.tsx`) for dashboard cards, game instructions, memories, and daily routines with neural/natural voice scoring.
  - **Dyslexia Font Mode:** Toggles OpenDyslexic font across the entire interface for improved character distinction.
  - **Visual Contrast Profiles:** High-contrast light and dark industrial themes meeting WCAG 2.1 AAA accessibility standards.
  - **Text Scaling Engine:** Dynamically modifies root rem sizing between Normal (100%), Large (115%), and Extra Large (130%).
  - **Reduced Motion:** Disables decorative animations and transitions for users prone to vestibular discomfort.

---

### 14. Unique Selling Proposition (USP) & 10-Slide Pitch Deck Module
* **Location:** `/src/components/USPSection.tsx` & `/src/pages/PresentationPage.tsx`
* **Purpose:** Clearly communicates Smriti Care's clinical, regional, and human differentiators to families, healthcare investors, and medical evaluators.
* **Key Capabilities:**
  - **Personalized Memory-Assisted Cognitive Care (USP Section):**
    - 8 foundational pillars: Multi-Modal Stimulation, Cultural Familiarity, Tri-Partite Care Ecosystem, Privacy By Design, Zero-Clutter Architecture, Dignity-First Voice Companion, Clinical Telemetry, and Offline Resiliency.
    - 4-Tier Care Ecosystem breakdown (Patient $\leftrightarrow$ Caregiver $\leftrightarrow$ Doctor $\leftrightarrow$ Community).
    - Clinical Game Methodology mapping cognitive domains to dementia intervention benchmarks.
  - **10-Slide Presentation Pitch Deck (`PresentationPage.tsx`):**
    - Slide 1: Executive Title & Vision (*"Cognitive Care, Made Human"*)
    - Slide 2: The Silent Crisis in India & North-East India (Diagnostic delay, stigma, lack of regional tools)
    - Slide 3: The Solution: Smriti Care Ecosystem
    - Slide 4: Clinical Methodology & Cognitive Domains
    - Slide 5: The 9-Game Neuro-Stimulation Suite
    - Slide 6: Dignity-First AI Memory Companion
    - Slide 7: Tri-Partite Telemetry & Caregiver Burden Defense
    - Slide 8: Accessibility & Regional Inclusion (8 North-East & Indian languages)
    - Slide 9: Technology Stack & Offline Resiliency
    - Slide 10: Clinical Roadmap & Impact Vision
    - Full presentation controls: Next/Previous keyboard shortcuts, thumbnail scrubber, slide timer, speaker notes toggle, and fullscreen mode.

---

### 15. Multilingual Regional Inclusion Engine (8 Languages)
* **Location:** `/src/i18n/translations/*`, `/src/context/AccessibilityContext.tsx`
* **Purpose:** Unlocks digital cognitive care for seniors across diverse linguistic communities in North-East and pan-India who have historically been excluded by English-only software.
* **Supported Languages (Native Scripts & Full Dictionaries):**
  1. 🇬🇧 **English (`en`)**: International default with complete accessibility phrasing.
  2. 🇮🇳 **অসমীয়া / Assamese (`as`)**: Native script for Assam and Brahmaputra valley.
  3. 🇮🇳 **বাংলা / Bengali (`bn`)**: Native script for West Bengal, Tripura, and Barak valley.
  4. 🇮🇳 **हिन्दी / Hindi (`hi`)**: Devanagari script for pan-Indian accessibility.
  5. 🇮🇳 **মৈতৈলোন্ / Meitei / Manipuri (`mni`)**: Bengali-Manipuri script for Manipur communities.
  6. 🇮🇳 **Ka Ktien Khasi (`kha`)**: Standard Latin orthography for Meghalaya Khasi communities.
  7. 🇮🇳 **Mizo ṭawng (`lus`)**: Standard Lushai Latin orthography for Mizoram.
  8. 🇮🇳 **Nagamese Creole (`nag`)**: Latin orthography for Nagaland inter-tribal lingua franca.
* **Completeness:** Over 120 standardized translation keys per language covering navigation, Simple UI cards, games, memory vault, reminders, emergency SOS, health check-in, and onboarding guide.

---

### 16. State Management & Context Providers
*All centralized React contexts located in `/src/context/`:*

| Context Name | File Path | Responsibilities & Stored State |
| :--- | :--- | :--- |
| **`AuthContext`** | `/src/context/AuthContext.tsx` | Supabase auth user, session state, login/signup/logout actions, password reset dispatcher, and demo user fallback. |
| **`RoleContext`** | `/src/context/RoleContext.tsx` | Active role (`patient` \| `caregiver` \| `doctor`), active patient profile, medication reminders list, memory vault records, daily check-in history, game scores, and routine check-offs. |
| **`AccessibilityContext`** | `/src/context/AccessibilityContext.tsx` | High contrast mode, dyslexia font toggle, reduced motion preference, Simple UI Mode toggle, text size scaling (`normal`, `large`, `xlarge`), speech synthesis rate, language code selection, and localized translation keys. |

---

### 17. Desktop Native Integration (Electron Core)
*All native integration files located in `/electron/`:*

| Module Name | File Path | Desktop Capabilities & Security |
| :--- | :--- | :--- |
| **Electron Main Process** | `/electron/main.ts` | Initializes native Windows window (1440x900), configures CSP headers, manages window controls (minimize/maximize/close), handles local file URLs, and configures native application menus. |
| **Electron Preload Bridge** | `/electron/preload.ts` | Context-isolated bridge exposing `window.electronAPI` safely to the renderer (file dialogs, persistent photo storage in `%APPDATA%`, native shell links). |
| **Desktop Type Declarations** | `/src/types/electron.d.ts` | Full TypeScript definitions for `window.electronAPI` and Electron IPC events. |

---

### 18. Backend, Database & Service Layer
*Located in `/src/services/`, `/src/lib/`, `/src/utils/`, and `/supabase/`:*

| Module / Layer | File Path | Responsibilities |
| :--- | :--- | :--- |
| **Supabase Client Initializer** | `/src/lib/supabaseClient.ts` | Configures Supabase client with graceful offline detection and local demo fallback. |
| **Auth Service** | `/src/services/supabaseAuthService.ts` | Abstracted authentication service for user sign-in, sign-up, password recovery, and email verification. |
| **Wellbeing & Telemetry Utils** | `/src/utils/wellbeingUtils.ts` | Scoring algorithms for well-being assessments, mood calculations, and adherence statistics. |
| **Activity Definitions** | `/src/data/activities.ts` | Structured cognitive activities, therapy task metadata, and daily journey steps. |
| **Database Migrations** | `/supabase/migrations/*.sql` | PostgreSQL schema definitions for tables (`daily_health_checkins`, `game_scores`, `patient_profiles`, `reminders`, `memories`) and Row-Level Security (RLS) policies. |

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
