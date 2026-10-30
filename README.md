# Taper: 21-Day Digital Detox & Habit Architect

An end-to-end browser extension built on Manifest V3 designed to permanently break social media and digital addictions through neuroplastic tapering, reel-level tracking, session cooldowns, and cognitive friction defense.

Strictly zero emojis. Minimalist, load-free design with a **Technical Carbon Monolith & Electric Citron** aesthetic, razor-sharp tactile borders, and an Architectural Chalk light mode.

---

## Core Systems & Key Features

### 1. 21-Day Habit Tapering (Titration Protocol)
- **The Problem with Cold-Turkey**: Sudden deprivation shocks the dopamine system, leading to high relapse rates and binge behavior within 48 to 72 hours.
- **The Tapering Solution**: Systematically lowers your daily allowance across 21 days (e.g., Day 1 starts at 50 reels; Day 2 tightens to 48; Day 3 to 45; progressively tapering down to a sovereign maintenance target of 5 reels by Day 21).
- **Interactive 21-Day Matrix**: A visual day-by-day progress tracker that displays completed days, active challenges, and future milestones across three neurobiological phases:
  - **Phase 1 (Days 1 - 7)**: Acute Withdrawal & Thumb Reflex Interruption.
  - **Phase 2 (Days 8 - 14)**: Synaptic Re-Calibration & Dopamine Down-Regulation.
  - **Phase 3 (Days 15 - 21)**: Autonomous Habit Mastery & Consolidation.

### 2. Multi-Level Limit & Session Lockout
- **Reel & Short Detection**: Real-time content observer detects swipe transitions on Instagram Reels (`/reels/`, `/reel/`), YouTube Shorts (`/shorts/`), and TikTok.
- **Session Thresholds**: Set a hard limit on reels (e.g., 5 reels max) or time (e.g., 5 minutes max).
- **Automatic Lockout**: Upon hitting your limit, the tab automatically closes or redirects to a distraction-free Cooldown Screen.
- **Lockout Cooldown Duration**: Prevents reopening the target website for 1, 2, or 3 hours (customizable). Attempting to visit the site during cooldown redirects to the live countdown screen.

### 3. Pre-Removal Extension Guard & Cognitive Friction
- **Pre-Removal Interception**: Whenever a user navigates to `chrome://extensions` or `edge://extensions` to remove the extension, the background engine intercepts the navigation and immediately displays the **Cognitive Reflection Course**.
- **The Friction Barrier**: When trying to surrender, pause, or disable rules:
  - Users are presented with Stoic and neuroscience principles on dopamine loop mechanics.
  - A mandatory 15-second deliberative reflection timer blocks immediate action, allowing the prefrontal cortex to regain control.
  - A written pledge checkbox must be acknowledged before any deactivation is confirmed.
  - Strictly enforces unbypassable 1-hour minimum lockouts: once triggered, cooldowns cannot be lifted or overridden by any button until the full timer finishes.
- **Standalone Web Reflection Page**: A dedicated page (`docs/index.html`) is prepared for GitHub Pages hosting to ensure any uninstallation event is met with motivational quotes, neuroscience breakdowns, and 1-click reinstallation instructions.

### 4. Friction & Relapse Audit (New Section)
- **Interactive Craving & Urge Logger**: Record urge events with target site, intensity (1–5), trigger category, and remedy applied.
- **Craving Pattern Analytics**: Tracks the distribution between Boredom, Phantom Thumb Reflex, Stress Avoidance, and Extension Tampering.
- **Four Classic Detox Failure Modes**: In-depth behavioral diagnoses and remedies for the Day 4-5 Dopamine Valley, the "Just 2 Minutes" rationalization, browser removal impulses, and addiction substitution.

### 5. Mindful Interstitial Checkpoint
- Pauses page load for 3 seconds when entering monitored platforms with a conscious breath prompt to interrupt mindless muscle-memory browsing.

---

## Installation Instructions (Chromium Browsers)

Works in **Google Chrome**, **Microsoft Edge**, **Brave**, **Opera**, and any Chromium-based browser.

1. Open your browser and navigate to:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click the **Load unpacked** button in the top-left corner.
4. Select this directory:
   ```
   c:\Users\Acer\Desktop\ext\adiction Remover
   ```
5. Click on the extension icon in your toolbar to view your streak or click **Open Habit Architect** to configure your custom website rules and tapering targets.

---

## File Structure

```
adiction Remover/
├── manifest.json              # Manifest V3 specification
├── background.js              # Service worker (session enforcer, alarms, lockouts)
├── icons/                     # Generated vector PNG icons (16, 32, 48, 128px)
├── docs/
│   └── index.html             # Standalone web detox reflection page (GitHub Pages ready)
├── shared/
│   ├── icons.js               # Clean SVG vector icon library (Zero emojis)
│   ├── quotes.js              # Behavioral psychology & Stoic quotes repository
│   └── storage.js             # 21-Day Tapering calculation & Chrome storage engine
├── content/
│   ├── content.js             # Active DOM reel & video detector + conscious checkpoint
│   └── content.css            # Sleek floating HUD styling & technical overlay
├── popup/
│   ├── popup.html             # Quick glance popup
│   ├── popup.css
│   └── popup.js
├── dashboard/
│   ├── dashboard.html         # Full 21-Day Habit Architect, Site Manager, & Friction Audit
│   ├── dashboard.css
│   └── dashboard.js
├── blocked/
│   ├── blocked.html           # Live Lockout Cooldown & Box Breathing page
│   ├── blocked.css
│   └── blocked.js
└── reflection/
    ├── reflection.html        # Cognitive Friction Gate & Anti-Removal screen
    ├── reflection.css
    └── reflection.js
```
