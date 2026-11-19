# Zen Browser Custom Configuration, Mods & Extensions

Production configuration, UI stylesheets, Zen mods, extensions, and macOS native integrations for Zen Browser.

---

## ✨ Features Included

1. **Ultra-Narrow Sidebar (~120px):**
   - Compact ~120px sidebar width (30% narrower than the default 169px minimum).
   - Centered page-action buttons in the collapsed URL bar.
   - Preserved click-to-edit, `Cmd+L`, and New Tab (`+`) URL entry.

2. **Auto-Hiding Navigation Buttons:**
   - Back, Forward, and Overflow (`•••`) buttons auto-hide in the top bar to save space.
   - Reveal smoothly on hover with compact spacing.

3. **Compact Vertical Tab Labels:**
   - 13px font size with tight icon-to-label spacing (4px margins & padding).
   - Maximizes visible URL/title length in the narrow sidebar.

4. **Chrome-Style Context Menus:**
   - Native macOS **"Emoji & Symbols"** pinned to the top of editable menus.
   - **"Translate this page"** / **"Undo translation"** positioned right below "Reload", translating directly into English via Firefox's native offline engine.
   - **"Open in Side View"** repositioned as the second item in the tab context menu, right below **"New Tab Below"**.

5. **Integrated Zen Mods:**
   - **SuperPins (`ad97bb70...`):** 2-column essentials and pins layout, clean transparent styling, removed sidebar scrollbar.
   - **NoHighlightSplit (`f50841b2...`):** Removes border highlight around the active tab in Split View.
   - **Sidebar Expand on Hover (`bd92a9a0...`):** Mod assets and tuned preferences preserved.

6. **Packaged Extensions:**
   - `side-view@mozilla.org.xpi`: Mobile/desktop side view panel.
   - `gcal-duplicate-duration@ext.com.xpi`: Google Calendar event duplication and duration calculation helper.
   - `zen-translate-page@local.xpi`: Instant English translation via native `TranslationsParent`.
   - `zen-native-emoji@local.xpi`: macOS native emoji picker integration.
   - `zen-google-fix@local.xpi`: Voice recording, layout, and compatibility patches for Google Web Apps.

---

## 🤖 Agent Onboarding & Migration

For AI coding agents or automated provisioning systems setting up a new laptop, see **[AGENTS.md](file:///Users/moustafa/.gemini/antigravity/scratch/zen-browser-config/AGENTS.md)** for detailed protocols, manual fallback steps, and verification checklists.

---

## 🚀 1-Step Installation (New Laptop)

On a new Mac with Zen Browser installed:

```bash
git clone https://github.com/moustafamin1/zen-browser-config.git
cd zen-browser-config
./install.sh
```

Restart Zen Browser (`Cmd+Q` and reopen).

---

## 🛠️ Repository Structure

```
zen-browser-config/
├── chrome/
│   ├── userChrome.css              # Custom UI styling and overrides
│   ├── zen-themes.css              # Compiled Zen Mod stylesheets
│   └── zen-themes/                 # Raw Zen Mod assets (SuperPins, NoHighlightSplit, etc.)
├── extensions/
│   ├── side-view@mozilla.org.xpi               # Mozilla Side View extension
│   ├── gcal-duplicate-duration@ext.com.xpi     # Google Calendar event duplicate & duration tool
│   ├── zen-google-fix@local.xpi                # Google Web Apps & Voice input patches
│   ├── zen-native-emoji@local.xpi              # Native Emoji picker context menu integration
│   ├── zen-translate-page@local.xpi            # Direct English translation via native engine
│   └── [source dirs...]                        # Unpacked sources for custom extensions
├── native-hosts/
│   ├── bin/zen-native-emoji        # Python bridge for macOS emoji picker
│   └── zen_native_emoji.json       # Native messaging host manifest template
├── zen-themes.json                 # Zen Mods registry and enabled status
├── user.js                         # Firefox/Zen runtime preferences
├── install.sh                      # Automated installer script
├── AGENTS.md                       # Agent migration protocol and verification
└── README.md
```

---

## ⚙️ Manual Configuration

If installing manually into `<profile-folder>`:
1. Copy `chrome/userChrome.css`, `chrome/zen-themes.css`, and `chrome/zen-themes/` into `<profile-folder>/chrome/`.
2. Copy `zen-themes.json` into `<profile-folder>/zen-themes.json`.
3. Add settings from `user.js` to `<profile-folder>/user.js`.
4. Copy `.xpi` files from `extensions/` into `<profile-folder>/extensions/`.
5. Copy `native-hosts/bin/zen-native-emoji` to `~/.local/bin/zen-native-emoji` (`chmod +x`).
6. Place `zen_native_emoji.json` into `~/Library/Application Support/zen/NativeMessagingHosts/`.
