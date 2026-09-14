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
   - [2. Daily Mood & Health Check-In Module](#2-daily-mood--health-check-in-module)
   - [3. Interactive Articulated Living Cat Engine](#3-interactive-articulated-living-cat-engine)
   - [4. Cognitive Training Games Hub (9 Clinical Games)](#4-cognitive-training-games-hub-9-clinical-games)
   - [5. Memory Vault & Reminiscence Therapy Module](#5-memory-vault--reminiscence-therapy-module)
   - [6. Authentication & User Security System](#6-authentication--user-security-system)
   - [7. Caregiver Management & Telemetry Portal](#7-caregiver-management--telemetry-portal)
   - [8. Doctor & Clinical Analytics Portal](#8-doctor--clinical-analytics-portal)
   - [9. Accessibility & Speech Synthesis Engine](#9-accessibility--speech-synthesis-engine)
   - [10. State Management & Context Providers](#10-state-management--context-providers)
   - [11. Desktop Native Integration (Electron Core)](#11-desktop-native-integration-electron-core)
   - [12. Backend, Database & Service Layer](#12-backend-database--service-layer)
6. [Folder Structure](#-folder-structure)
7. [Desktop Application Details](#-windows-desktop-application-smriti-care)
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
| **Web Speech API** | Browser Native API | **Text-to-Speech Engine**: Multi-language, rate-adjusted speech synthesis for elderly users with impaired vision or reading difficulties. |

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

Create a `.env` file in the root of your project with the following variables:

```env
# Supabase Authentication & Database
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key

# Optional: Google Gemini AI (for advanced generative reminiscence)
GEMINI_API_KEY=your_gemini_api_key_here
```

### How to Obtain and Configure Keys:

#### 1. Supabase Authentication (`VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`)
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Under **Project Settings** $\rightarrow$ **API**:
   - Copy the **Project URL** into `VITE_SUPABASE_URL`.
   - Copy the **anon / public key** into `VITE_SUPABASE_ANON_KEY`.
3. Under **Authentication** $\rightarrow$ **URL Configuration**:
   - Set Site URL to `http://localhost:3000` (or your deployed URL).
   - Add `http://localhost:3000/auth/callback` to the **Redirect URLs**.
4. *Demo Mode*: If no keys are provided, the app automatically runs in a local mock/demo mode with 1-click accounts for testing.

#### 2. Gemini API Key (`GEMINI_API_KEY`)
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key** and generate a new key.
3. Paste the key into `GEMINI_API_KEY` in `.env`.

---

## 🧩 Comprehensive Modules Catalog

SmritiCare is architected into 12 core functional module systems across presentation, game mechanics, clinical telemetry, accessibility, and native desktop integration:

---

### 1. Core Pages & Dashboards
*All top-level routed views in `/src/pages/`:*

| Module / Page Name | File Path | Functional Purpose & Key Features |
| :--- | :--- | :--- |
| **Patient Dashboard** | `/src/pages/PatientDashboard.tsx` | Main command center for patients with dementia or MCI. High-contrast tactile cards, daily routine schedule, 1-tap game launcher, emergency SOS alert, and daily mood/health status card. |
| **Caregiver Dashboard** | `/src/pages/CaregiverDashboard.tsx` | Telemetry portal for family and formal caregivers. Tracks patient routine adherence, sleep quality, game performance, medication logs, and monitors caregiver burden risk scores. |
| **Doctor / Clinician Portal** | `/src/pages/DoctorDashboard.tsx` | Specialized clinical dashboard displaying longitudinal cognitive trajectories, estimated MMSE/MoCA scores via Recharts, reaction time curves, and exportable medical summary evaluations. |
| **Cognitive Games Hub** | `/src/pages/GamesHub.tsx` | Game catalog organized across 5 clinical cognitive domains (Memory, Attention, Executive Function, Language, Visual-Spatial). Displays difficulty filters and personal best scores. |
| **Memory Vault** | `/src/pages/MemoriesPage.tsx` | Interactive photo album and reminiscence vault with voice note attachments, categorized timeline tags, loved ones association, and audio playback. |
| **AI Memory Companion** | `/src/pages/MemoryCompanionPage.tsx` | Conversational reminiscence companion that generates warm, comforting conversational prompts based on stored family photos and patient memories. |
| **Reminders & Routine Page** | `/src/pages/RemindersPage.tsx` | Daily schedule management interface for morning, afternoon, and evening medication, hydration goals, and doctor appointments with audio alarms. |
| **Cognitive Progress Page** | `/src/pages/ProgressPage.tsx` | Patient and family progress overview with weekly activity heatmaps, cognitive domain radar charts, and milestone achievement badges. |
| **Patient Profile Page** | `/src/pages/PatientProfilePage.tsx` | Medical history, emergency contacts, primary clinician contact, diagnosis stage, allergies, and caregiver circle management. |
| **Landing & Orientation Page** | `/src/pages/LandingPage.tsx` | Public introduction page highlighting the 4-tier care ecosystem, clinical game methodology, accessibility features, and quick demo login access. |
| **Authentication & Auth Pages** | `/src/pages/LoginPage.tsx`<br>`/src/pages/SignupPage.tsx`<br>`/src/pages/ForgotPasswordPage.tsx`<br>`/src/pages/ResetPasswordPage.tsx`<br>`/src/pages/EmailVerificationPage.tsx`<br>`/src/pages/AuthCallbackPage.tsx` | Complete authentication suite supporting email/password registration, password recovery, magic link verification, role redirection, and 1-Click Demo Accounts. |
| **Role Selection Portal** | `/src/pages/RoleSelectionPage.tsx` | Interactive switcher allowing instant role swapping between Patient, Caregiver, and Doctor for demonstration and multi-user environments. |
| **Accessibility & Settings** | `/src/pages/SettingsPage.tsx` | Global accessibility preferences: Dyslexia-friendly font toggle, High Contrast theme, text scaling (Normal/Large/XL), and TTS speech rate/voice controls. |

---

### 2. Daily Mood & Health Check-In Module
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

### 3. Interactive Articulated Living Cat Engine
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

### 4. Cognitive Training Games Hub (9 Clinical Games)
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

### 5. Memory Vault & Reminiscence Therapy Module
* **Location:** `/src/pages/MemoriesPage.tsx`, `/src/pages/MemoryCompanionPage.tsx`, `/src/components/MemoryUploadModal.tsx`
* **Features:**
  - **Digital Memory Albums:** Structured storage for family photographs, vintage milestones, vacation memories, and life achievements.
  - **Audio Reminiscence Storytelling:** Voice note recording and playback for each memory item.
  - **Person & Location Tagging:** Associative metadata linking photos to specific family members (children, grandchildren, spouses) and locations.
  - **AI Reminiscence Companion:** Conversational partner encouraging gentle reflection on memories with empathetic questions and guided prompts.
  - **Native Desktop Storage:** When running in Electron, photos are stored directly in the local file system (`%APPDATA%/Smriti Care/smriti-memories`).

---

### 6. Authentication & User Security System
* **Location:** `/src/pages/LoginPage.tsx`, `/src/context/AuthContext.tsx`, `/src/services/supabaseAuthService.ts`
* **Features:**
  - **Supabase Auth Client:** Secure JWT session handling, token refresh, and user metadata management.
  - **Email Verification Workflow:** Automatic confirmation flow with resend verification link triggers.
  - **1-Click Instant Demo Accounts:** Instant one-click authentication presets for Patient (`patient@smriticare.org`), Caregiver (`caregiver@smriticare.org`), and Doctor (`doctor@smriticare.org`).
  - **Password Privacy Integration:** Synchronized state events dispatching to the Interactive Cat.

---

### 7. Caregiver Management & Telemetry Portal
* **Location:** `/src/pages/CaregiverDashboard.tsx`, `/src/pages/PatientProfilePage.tsx`
* **Features:**
  - **Patient Adherence Telemetry:** Live tracking of daily medication intake, hydration status, and cognitive game completion rates.
  - **Zarit Caregiver Burden Monitoring:** Periodic assessment and proactive rest/respite alerts to prevent caregiver burnout.
  - **Remote Routine Scheduler:** Add, edit, or adjust patient daily routines, medication dosages, and hydration reminders remotely.
  - **Direct Clinician Messaging:** Share observational notes and health updates directly with the patient's neurologist or geriatrician.

---

### 8. Doctor & Clinical Analytics Portal
* **Location:** `/src/pages/DoctorDashboard.tsx`
* **Features:**
  - **Longitudinal Trend Curves:** Visualizes MMSE/MoCA trajectory estimates using Recharts over 30-day, 90-day, and 1-year time windows.
  - **Cognitive Domain Radar Breakdown:** Quantifies performance across Memory, Executive Function, Attention, Language, and Visual-Spatial domains.
  - **Telemetry Export:** Generates clinical summary evaluations suitable for medical chart integration.
  - **Medication & Treatment Notes:** Allows prescribing clinicians to log clinical observations and adjust cognitive therapy recommendations.

---

### 9. Accessibility & Speech Synthesis Engine
* **Location:** `/src/context/AccessibilityContext.tsx`, `/src/components/TTSButton.tsx`, `/src/pages/SettingsPage.tsx`
* **Features:**
  - **Web Speech Text-to-Speech (TTS):** 1-tap read-aloud button (`TTSButton.tsx`) for dashboard cards, game instructions, memories, and daily routines.
  - **Dyslexia Font Mode:** Toggles OpenDyslexic font across the entire interface for improved character distinction.
  - **Visual Contrast Profiles:** High-contrast light and dark industrial themes meeting WCAG 2.1 AAA accessibility standards.
  - **Text Scaling Engine:** Dynamically modifies root rem sizing between Normal (100%), Large (115%), and Extra Large (130%).
  - **Reduced Motion:** Disables decorative animations and transitions for users prone to vestibular discomfort.

---

### 10. State Management & Context Providers
*All centralized React contexts located in `/src/context/`:*

| Context Name | File Path | Responsibilities & Stored State |
| :--- | :--- | :--- |
| **`AuthContext`** | `/src/context/AuthContext.tsx` | Supabase auth user, session state, login/signup/logout actions, password reset dispatcher, and demo user fallback. |
| **`RoleContext`** | `/src/context/RoleContext.tsx` | Active role (`patient` \| `caregiver` \| `doctor`), active patient profile, medication reminders list, memory vault records, daily check-in history, game scores, and routine check-offs. |
| **`AccessibilityContext`** | `/src/context/AccessibilityContext.tsx` | High contrast mode, dyslexia font toggle, reduced motion preference, text scale multiplier, speech synthesis rate, voice selection, and translation keys. |

---

### 11. Desktop Native Integration (Electron Core)
*All native integration files located in `/electron/`:*

| Module Name | File Path | Desktop Capabilities & Security |
| :--- | :--- | :--- |
| **Electron Main Process** | `/electron/main.ts` | Initializes native Windows window (1440x900), configures CSP headers, manages window controls (minimize/maximize/close), handles local file URLs, and configures native application menus. |
| **Electron Preload Bridge** | `/electron/preload.ts` | Context-isolated bridge exposing `window.electronAPI` safely to the renderer (file dialogs, persistent photo storage in `%APPDATA%`, native shell links). |
| **Desktop Type Declarations** | `/src/types/electron.d.ts` | Full TypeScript definitions for `window.electronAPI` and Electron IPC events. |

---

### 12. Backend, Database & Service Layer
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

## 🖥️ Windows Desktop Application (Smriti Care)

Smriti Care is fully configured and packaged as a native Windows desktop application (supporting **Windows 10** and **Windows 11 x64**) using Electron and Electron Builder.

### 1. Prerequisites
- **Operating System:** Windows 10/11, macOS, or Linux (cross-compiles Windows NSIS installers)
- **Node.js:** `v18.0.0` or higher (Node 20+ recommended)
- **npm:** `v9.0.0` or higher

### 2. Run Desktop App in Development Mode
Starts Vite and launches the Electron desktop window with hot reload enabled:
```bash
npm run electron:dev
```
- Automatically waits for Vite on `http://localhost:3000`.
- Launches a native `1440x900` window titled **Smriti Care** with the app icon.
- Developer tools detach automatically for real-time debugging.

### 3. Build Windows Desktop App & Installer (NSIS)
Compiles React/Vite, bundles the Electron main & preload scripts, and produces the Windows executable and installer:
```bash
npm run electron:build
```

#### Output Artifacts:
```text
release/
├── Smriti-Care-Setup.exe          <-- Standard Windows x64 NSIS Installer
├── neuro-ner-1.0.0-x64.nsis.7z   <-- Compressed application archive
└── win-unpacked/                 <-- Standalone unpacked Windows executable (Smriti Care.exe)
```
- Users can double-click `release/Smriti-Care-Setup.exe` on Windows 10/11 to install Smriti Care with Start Menu and Desktop shortcuts.
- Or distribute/run the standalone folder `release/win-unpacked/Smriti Care.exe` directly without installation.

### 4. Desktop Architecture & Security
- **Context Isolation:** `contextIsolation: true` is strictly enforced.
- **Node Integration Disabled:** `nodeIntegration: false` in renderer process prevents web scripts from accessing operating system internals.
- **Secure Preload Bridge (`electron/preload.ts`):** Exposes only safe, specific APIs to `window.electronAPI`:
  - Native window controls (`minimize`, `maximize`, `close`, `isMaximized`).
  - Persistent Memory Vault storage: Saves and loads photos to the secure OS user data folder (`app.getPath('userData')/smriti-memories`).
  - Native Windows file selection dialog (`dialog.showOpenDialog`) for memory photos.
  - Safe external link handler: External links open in the user's default web browser via `shell.openExternal`, preventing in-app navigation escapes.

### 5. Offline Mode & Hackathon Demos
- **Zero-Config Demos:** The application does **not** require Supabase credentials or Gemini API keys to run.
- **Local Persistence:** Personal Memory Vault, reminders, check-in logs, and game scores persist locally via `localStorage` and Electron's `userData` store.
- **AI Memory Companion:** Includes offline-first conversational responses with simulated warm reminiscing and emotional support.
- **Cognitive Activity Graph:** Responsive Recharts visualization displays longitudinal engagement and activity performance without external servers.

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
