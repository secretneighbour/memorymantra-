# SmritiCare (NEURO NER) — Cognitive Wellness & Dementia Care Platform

A modern, accessibility-first cognitive support platform designed for elderly individuals with memory impairments, family caregivers, and healthcare clinicians. 

Built with a high-contrast industrial aesthetic inspired by Nothing OS and Dieter Rams design principles, SmritiCare combines cognitive therapy games, memory vaults, clinical telemetry, and interactive physical UI elements.

---

## 📋 Table of Contents

1. [Quick Start & Setup](#-quick-start--setup)
2. [Environment Variables & API Keys](#-environment-variables--api-keys)
3. [Project Architecture & Modules](#-project-architecture--modules)
   - [1. Authentication & Security Engine](#1-authentication--security-engine)
   - [2. Interactive Animated Cat System](#2-interactive-animated-cat-system)
   - [3. Patient Dashboard & Care Circle](#3-patient-dashboard--care-circle)
   - [4. Cognitive Training Games Hub (9 Clinical Games)](#4-cognitive-training-games-hub)
   - [5. Memory Vault & Reminiscence Therapy](#5-memory-vault--reminiscence-therapy)
   - [6. Caregiver Management Portal](#6-caregiver-management-portal)
   - [7. Doctor & Clinical Analytics Portal](#7-doctor--clinical-analytics-portal)
   - [8. Accessibility & TTS Engine](#8-accessibility--tts-engine)
4. [Folder Structure](#-folder-structure)
5. [Available Scripts](#-available-scripts)
6. [Tech Stack](#-tech-stack)

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

## 🧩 Project Architecture & Modules

### 1. Authentication & Security Engine
* **Location:** `/src/pages/LoginPage.tsx`, `/src/pages/SignupPage.tsx`, `/src/pages/ForgotPasswordPage.tsx`, `/src/pages/EmailVerificationPage.tsx`, `/src/context/AuthContext.tsx`, `/src/services/supabaseAuthService.ts`
* **Features:**
  - Real email/password registration with email verification workflow.
  - Quick 1-Click Demo Accounts for Patient, Caregiver, and Doctor testing.
  - Password recovery with tokenized reset links.
  - Role-based redirect routing and session state synchronization.

---

### 2. Interactive Animated Cat System
* **Location:** `/src/components/InteractiveCat.tsx`
* **Description:** A physical, living quadruped creature living on the login and authentication screen. It is not an AI chatbot or UI assistant—it acts like a real cat with autonomous behaviors and tactile reactions.
* **Key Sub-systems:**
  - **Autonomous Behavior Engine:** Cycles unpredictably through states (`sleeping`, `waking`, `stretching`, `sitting`, `looking_around`, `scratching`, `yawning`, `idle`, `walking`) with randomized dwell intervals.
  - **Dynamic Gait Physics:** Quadruped stride generator with individual limb phase offsets (`frontLeft`, `frontRight`, `hindLeft`, `hindRight`), body pitch tilt, and vertical breathing/walking bob.
  - **Tactile User Gestures:**
    - *Dragging:* Interactive pointer dragging across the ledge with a physical settle-bounce on release.
    - *Petting:* Continuous stroke tracking triggering purr vibration and squinting eyes.
    - *Clicks & Startle:* Fast cursor velocity or repeated clicks trigger a startle flinch, turn, escape trot, and look-back sequence.
  - **Password Privacy Integration:**
    - Automatically lifts paws directly over its eyes (`hiding_eyes`) when the password field is focused or typed.
    - Peeks out with wide eyes (`peeking`) when password visibility is toggled on.
    - Celebrates with confetti on successful authentication.
  - **5-Tier State Priority Hierarchy:** `AUTH_FEEDBACK` (5) > `DIRECT_USER` (4) > `REACTIVE` (3) > `ATTENTION` (2) > `AUTONOMOUS` (1).

---

### 3. Patient Dashboard & Care Circle
* **Location:** `/src/pages/PatientDashboard.tsx`
* **Features:**
  - Large-button, low-cognitive-load interface designed specifically for elderly users.
  - Today's routine timeline with audio-assisted medication and hydration reminders.
  - Emergency SOS contact trigger.
  - Daily mood tracker and quick cognitive game launchpad.

---

### 4. Cognitive Training Games Hub (9 Clinical Games)
* **Location:** `/src/pages/GamesHub.tsx`, `/src/games/*`
* **Clinically Designed Neuro-Stimulation Modules:**
  1. **Memory Match (`MemoryMatchGame.tsx`)**: Card-pair recall exercising visual and spatial working memory.
  2. **Sequence Recall (`SequenceRecallGame.tsx`)**: Simon-style audio-visual order recall.
  3. **Pattern Finder (`PatternFinderGame.tsx`)**: Abstract pattern completion testing inductive reasoning.
  4. **Picture Recognition (`PictureRecognitionGame.tsx`)**: Everyday object identification and naming.
  5. **Routine Recall (`RoutineRecallGame.tsx`)**: Daily task sequence arrangement (brushing teeth, taking pills, breakfast).
  6. **Emotion Recognition (`EmotionRecognitionGame.tsx`)**: Facial emotion identification to maintain social-emotional acuity.
  7. **Word Connect (`WordConnectGame.tsx`)**: Semantic category grouping and vocabulary recall.
  8. **Market Memory (`MarketMemoryGame.tsx`)**: Functional shopping list recall simulator.
  9. **Name & Face Recall (`NameFaceRecallGame.tsx`)**: Family and caregiver facial association to delay prosopagnosia.

---

### 5. Memory Vault & Reminiscence Therapy
* **Location:** `/src/pages/MemoriesPage.tsx`, `/src/pages/MemoryCompanionPage.tsx`
* **Features:**
  - Digital interactive memory photo albums with tagged loved ones, dates, and locations.
  - Audio voice notes and reminiscence story playback.
  - Interactive reminiscence companion encouraging gentle storytelling based on saved family photos.

---

### 6. Caregiver Management Portal
* **Location:** `/src/pages/CaregiverDashboard.tsx`, `/src/pages/PatientProfilePage.tsx`
* **Features:**
  - Daily adherence telemetry (medication intake, game completion rates, sleep logs).
  - Caregiver burden score monitoring and respite support alerts.
  - Remote medication scheduler and Memory Vault editor.

---

### 7. Doctor & Clinical Analytics Portal
* **Location:** `/src/pages/DoctorDashboard.tsx`
* **Features:**
  - Longitudinal cognitive trend charts (MMSE/MoCA estimated trajectories via Recharts).
  - Reaction time tracking, memory retention curves, and game telemetry analytics.
  - Exportable clinical summary reports for patient evaluations.

---

### 8. Accessibility & TTS Engine
* **Location:** `/src/context/AccessibilityContext.tsx`, `/src/components/TTSButton.tsx`, `/src/pages/SettingsPage.tsx`
* **Features:**
  - Integrated Text-to-Speech (TTS) using the Web Speech API with multilingual and speed controls.
  - Dyslexia-friendly font switcher (OpenDyslexic typography support).
  - High Contrast Dark/Light mode and Reduced Motion toggle (WCAG 2.1 AAA compliance).
  - Adjustable text scaling (Normal, Large, Extra Large).

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
