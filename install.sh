#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "🚀 Zen Browser Configuration Installer"
echo "=========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Detect Zen Profile directory on macOS
ZEN_PROFILES_DIR="$HOME/Library/Application Support/zen/Profiles"

if [ ! -d "$ZEN_PROFILES_DIR" ]; then
  echo "❌ Error: Zen profiles directory not found at:"
  echo "   $ZEN_PROFILES_DIR"
  echo "   Please install and launch Zen Browser at least once first."
  exit 1
fi

# Find default target profile (or accept as argument $1)
if [ "${1:-}" != "" ] && [ -d "$1" ]; then
  TARGET_PROFILE="$1"
else
  PROFILES=($(find "$ZEN_PROFILES_DIR" -maxdepth 1 -mindepth 1 -type d))

  if [ ${#PROFILES[@]} -eq 0 ]; then
    echo "❌ Error: No profile found inside $ZEN_PROFILES_DIR"
    exit 1
  elif [ ${#PROFILES[@]} -eq 1 ]; then
    TARGET_PROFILE="${PROFILES[0]}"
  else
    TARGET_PROFILE=""
    for p in "${PROFILES[@]}"; do
      if [[ "$p" =~ [Dd]efault ]]; then
        TARGET_PROFILE="$p"
        break
      fi
    done
    if [ -z "$TARGET_PROFILE" ]; then
      TARGET_PROFILE="${PROFILES[0]}"
    fi
  fi
fi

echo "📁 Target Zen Profile:"
echo "   $TARGET_PROFILE"
echo ""

# 1. Install userChrome.css & Zen Theme Stylesheets
echo "🎨 [1/5] Installing userChrome.css & Zen Themes..."
mkdir -p "$TARGET_PROFILE/chrome"
if [ -f "$TARGET_PROFILE/chrome/userChrome.css" ]; then
  cp "$TARGET_PROFILE/chrome/userChrome.css" "$TARGET_PROFILE/chrome/userChrome.css.backup.$(date +%s)"
fi
cp "$SCRIPT_DIR/chrome/userChrome.css" "$TARGET_PROFILE/chrome/userChrome.css"
echo "   ✅ userChrome.css installed."

if [ -f "$SCRIPT_DIR/chrome/zen-themes.css" ]; then
  cp "$SCRIPT_DIR/chrome/zen-themes.css" "$TARGET_PROFILE/chrome/zen-themes.css"
  echo "   ✅ zen-themes.css installed."
fi

if [ -d "$SCRIPT_DIR/chrome/zen-themes" ]; then
  mkdir -p "$TARGET_PROFILE/chrome/zen-themes"
  cp -R "$SCRIPT_DIR/chrome/zen-themes/"* "$TARGET_PROFILE/chrome/zen-themes/"
  echo "   ✅ zen-themes mod assets installed."
fi

# 2. Install Zen Mods registry (zen-themes.json)
echo "🧩 [2/5] Installing Zen Mods registry..."
if [ -f "$SCRIPT_DIR/zen-themes.json" ]; then
  cp "$SCRIPT_DIR/zen-themes.json" "$TARGET_PROFILE/zen-themes.json"
  echo "   ✅ zen-themes.json installed (SuperPins & NoHighlightSplit enabled)."
fi

# 3. Configure user.js preferences
echo "⚙️  [3/5] Configuring user.js preferences..."
USER_JS="$TARGET_PROFILE/user.js"
touch "$USER_JS"

# Append or replace preferences from repo user.js
while IFS= read -r line || [ -n "$line" ]; do
  # Skip comments and empty lines
  if [[ "$line" =~ ^[[:space:]]*// ]] || [[ -z "${line// }" ]]; then
    continue
  fi
  # Extract pref key
  if [[ "$line" =~ user_pref\(\"([^\"]+)\" ]]; then
    pref_key="${BASH_REMATCH[1]}"
    if grep -q "user_pref(\"$pref_key\"," "$USER_JS"; then
      # Replace existing pref
      awk -v key="$pref_key" -v repl="$line" '
        $0 ~ "user_pref\\(\"" key "\"," { print repl; next }
        { print }
      ' "$USER_JS" > "$USER_JS.tmp" && mv "$USER_JS.tmp" "$USER_JS"
    else
      echo "$line" >> "$USER_JS"
    fi
  fi
done < "$SCRIPT_DIR/user.js"
echo "   ✅ user.js updated with all base and mod preferences."

# 4. Install Extensions (.xpi)
echo "📦 [4/5] Installing extensions..."
mkdir -p "$TARGET_PROFILE/extensions"
shopt -s nullglob
for xpi in "$SCRIPT_DIR/extensions/"*.xpi; do
  cp "$xpi" "$TARGET_PROFILE/extensions/"
  echo "   ✅ Copied $(basename "$xpi")"
done
shopt -u nullglob

# 5. Configure macOS Native Messaging Host (for Emoji palette)
echo "🍎 [5/5] Configuring macOS native messaging host..."
mkdir -p "$HOME/.local/bin"
cp "$SCRIPT_DIR/native-hosts/bin/zen-native-emoji" "$HOME/.local/bin/zen-native-emoji"
chmod +x "$HOME/.local/bin/zen-native-emoji"

mkdir -p "$HOME/Library/Application Support/zen/NativeMessagingHosts"
mkdir -p "$HOME/Library/Application Support/Mozilla/NativeMessagingHosts"

sed "s|PLACEHOLDER_HOME|$HOME|g" "$SCRIPT_DIR/native-hosts/zen_native_emoji.json" > "$HOME/Library/Application Support/zen/NativeMessagingHosts/zen_native_emoji.json"
cp "$HOME/Library/Application Support/zen/NativeMessagingHosts/zen_native_emoji.json" "$HOME/Library/Application Support/Mozilla/NativeMessagingHosts/zen_native_emoji.json"
echo "   ✅ Native messaging host configured."

echo ""
echo "=========================================="
echo "🎉 Setup complete!"
echo "   Restart Zen Browser (Cmd+Q and reopen) to apply all changes."
echo "=========================================="
