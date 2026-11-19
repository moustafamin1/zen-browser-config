# Zen Browser Custom Configuration & Extensions

Custom UI optimizations, styles, extensions, and native macOS integrations for Zen Browser.

## ✨ Features Included

1. **Ultra-Narrow Sidebar (~120px):**
   - Compact ~120px sidebar width (30% narrower than default 169px floor).
   - Centered page-action buttons in the collapsed URL bar.
   - Preserved click-to-edit, `Cmd+L`, and New Tab (`+`) URL entry.

2. **Auto-Hiding Navigation Buttons:**
   - Back, Forward, and Overflow (`•••`) buttons auto-hide in the top bar to save space.
   - Reveal smoothly on hover with compact spacing.

3. **Compact Vertical Tab Labels:**
   - 13px font size with tight icon-to-label spacing (4px margins & padding).
   - Maximizes visible URL/title length in the narrow sidebar.

4. **Chrome-Style Context Menu:**
   - Native macOS **"Emoji & Symbols"** pinned to the top of editable menus.
   - **"Translate this page"** / **"Undo translation"** positioned right below "Reload", translating directly into English via Firefox's native offline engine.

5. **Integrated Extensions:**
   - `zen-translate-page@local.xpi`: Direct English translation via native `TranslationsParent`.
   - `zen-native-emoji@local.xpi`: macOS native emoji picker integration.
   - `zen-google-fix@local.xpi`: Compatibility, voice recording, and layout patches for Google Web Apps.

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
├── chrome/
│   └── userChrome.css              # Custom UI styling and overrides
├── extensions/
│   ├── zen-translate-page/         # Source code for page translation extension
│   ├── zen-translate-page@local.xpi# Pre-packaged translation extension
│   ├── zen-native-emoji/           # Source code for emoji extension
│   ├── zen-native-emoji@local.xpi  # Pre-packaged emoji extension
│   └── zen-google-fix@local.xpi    # Google Web Apps compatibility fix
├── native-hosts/
│   ├── bin/zen-native-emoji        # Python bridge for macOS emoji picker
│   └── zen_native_emoji.json       # Native messaging host manifest template
├── user.js                         # Firefox/Zen runtime preferences
├── install.sh                      # Automated installer script
└── README.md
```

---

## ⚙️ Manual Configuration

If installing manually into `<profile-folder>`:
1. Copy `chrome/userChrome.css` to `<profile-folder>/chrome/userChrome.css`.
2. Add settings from `user.js` to `<profile-folder>/user.js`.
3. Copy `.xpi` files from `extensions/` into `<profile-folder>/extensions/`.
4. Copy `native-hosts/bin/zen-native-emoji` to `~/.local/bin/zen-native-emoji` (`chmod +x`).
5. Place `zen_native_emoji.json` into `~/Library/Application Support/zen/NativeMessagingHosts/`.
