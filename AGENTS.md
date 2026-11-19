# Agent Onboarding & Migration Guide: Zen Browser Configuration

This document provides actionable, deterministic instructions for AI agents (and automated setup systems) configuring Zen Browser on a new macOS machine.

---

## 🎯 Objective
Replicate the user's customized Zen Browser environment, including:
1. **Custom UI Styles (`userChrome.css`):** Reordered context menus, ultra-narrow sidebar (~120px), auto-hiding navigation controls, condensed vertical tab typography.
2. **Zen Mods / Themes:** SuperPins (compact grid essentials/pins), NoHighlightSplit (clean split view), and registered mod assets.
3. **Extensions:** Sideloaded and configured extensions (`Side View`, `Google Calendar Duplicate & Duration`, `Native Emoji & Symbols`, `Zen Google Web Apps Fix`, `Zen Translate Page`).
4. **Native macOS Messaging Host:** Python bridge for the native macOS Emoji & Symbols palette.
5. **Runtime Preferences (`user.js`):** Enabled stylesheet modifications, disabled macOS native context menus for flex ordering, WebRTC DSP bypass for Google Meet/Teams.

---

## 🧭 Repository Blueprint

```
zen-browser-config/
├── chrome/
│   ├── userChrome.css              # Context menu reordering, sidebar & tab styling
│   ├── zen-themes.css              # Compiled Zen Mod stylesheets
│   └── zen-themes/                 # Raw Zen Mod directories (SuperPins, NoHighlightSplit, etc.)
├── extensions/
│   ├── side-view@mozilla.org.xpi               # Mozilla Side View extension
│   ├── gcal-duplicate-duration@ext.com.xpi     # Google Calendar event duplicate & duration tool
│   ├── zen-google-fix@local.xpi                # Google Web Apps & Voice input patches
│   ├── zen-native-emoji@local.xpi              # Native Emoji picker context menu integration
│   ├── zen-translate-page@local.xpi            # Direct English translation via native engine
│   └── [source dirs...]                        # Unpacked sources for custom extensions
├── native-hosts/
│   ├── bin/zen-native-emoji        # Python executable triggering macOS emoji palette
│   └── zen_native_emoji.json       # Native messaging host registration manifest
├── zen-themes.json                 # Zen Mods state registry (enabled/disabled mods)
├── user.js                         # Firefox/Zen preferences applied at browser startup
├── install.sh                      # Fully automated installer script
├── AGENTS.md                       # This agent onboarding document
└── README.md                       # Human-readable documentation
```

---

## ⚡ Quickstart Deployment (Agent Instruction)

Execute the following commands in order:

```bash
# 1. Ensure Zen Browser has been installed and launched at least once
if [ ! -d "$HOME/Library/Application Support/zen/Profiles" ]; then
  open -a Zen
  sleep 3
  killall zen || true
fi

# 2. Run the automated installer
cd zen-browser-config
chmod +x install.sh
./install.sh

# 3. Launch Zen Browser to apply settings
open -a Zen
```

---

## 🔬 Component Breakdown & Manual Verification

If `./install.sh` cannot be executed or individual components must be verified:

### 1. Locate the Active Profile
Zen profiles reside in:
`$HOME/Library/Application Support/zen/Profiles/`
Find the directory ending with `.Default` or `.Default (release)`:
```bash
PROFILE_DIR=$(find "$HOME/Library/Application Support/zen/Profiles" -maxdepth 1 -mindepth 1 -type d | grep -i "default" | head -n 1)
```

### 2. Stylesheets & Mods
- **`userChrome.css`:** Copy `chrome/userChrome.css` to `$PROFILE_DIR/chrome/userChrome.css`.
- **`zen-themes.css`:** Copy `chrome/zen-themes.css` to `$PROFILE_DIR/chrome/zen-themes.css`.
- **`zen-themes/`:** Copy `chrome/zen-themes/` directory to `$PROFILE_DIR/chrome/zen-themes/`.
- **`zen-themes.json`:** Copy `zen-themes.json` to `$PROFILE_DIR/zen-themes.json`. This marks `SuperPins` and `NoHighlightSplit` as enabled.

### 3. Preferences (`user.js`)
Merge or copy `user.js` into `$PROFILE_DIR/user.js`. Key critical flags:
| Preference | Required Value | Purpose |
|---|---|---|
| `toolkit.legacyUserProfileCustomizations.stylesheets` | `true` | Enables `userChrome.css` parsing |
| `widget.macos.native-context-menus` | `false` | Allows CSS flexbox layout & item reordering in context menus |
| `xpinstall.signatures.required` | `false` | Allows sideloaded unsigned extensions |
| `extensions.autoDisableScopes` | `0` | Prevents Zen from auto-disabling sideloaded `.xpi` files |
| `extensions.experiments.enabled` | `true` | Allows extension experiment APIs (used by translation engine) |
| `sidebar.main.tools` | `"side-view@mozilla.org"` | Pins Side View into the Zen sidebar |

### 4. Extensions (.xpi Sideloading)
Copy all `.xpi` files from `extensions/` to `$PROFILE_DIR/extensions/`:
- `side-view@mozilla.org.xpi`
- `gcal-duplicate-duration@ext.com.xpi`
- `zen-google-fix@local.xpi`
- `zen-native-emoji@local.xpi`
- `zen-translate-page@local.xpi`

### 5. Native Messaging Host (Emoji Picker)
1. Copy `native-hosts/bin/zen-native-emoji` to `$HOME/.local/bin/zen-native-emoji`.
2. Ensure execution permissions: `chmod +x $HOME/.local/bin/zen-native-emoji`.
3. Replace `PLACEHOLDER_HOME` in `native-hosts/zen_native_emoji.json` with `$HOME`.
4. Place the resolved manifest at:
   - `$HOME/Library/Application Support/zen/NativeMessagingHosts/zen_native_emoji.json`
   - `$HOME/Library/Application Support/Mozilla/NativeMessagingHosts/zen_native_emoji.json`

---

## ✅ Post-Migration Verification Checklist

Verify the following in the newly configured Zen Browser instance:

1. [ ] **Tab Context Menu:** Right-click any tab (or essential tab).
   - **Item 1:** "New Tab Below"
   - **Item 2:** "Open in Side View"
   - Confirm no orphaned separator line at the bottom.
2. [ ] **Content Context Menu:** Right-click on any webpage content area.
   - Confirm **"Emoji & Symbols"** is at the very top.
   - Confirm **"Translate this page"** appears under reload.
3. [ ] **Vertical Tabs & Sidebar:**
   - Confirm sidebar width collapses to compact mode (~120px) without overflow.
   - Confirm essential tabs layout matches SuperPins 2-column grid.
4. [ ] **Extensions Active:** Check `about:addons` in the URL bar.
   - All 5 extensions should appear under "Extensions" and be toggled **Enabled**.
