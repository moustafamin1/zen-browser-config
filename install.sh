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

# Find default profile
PROFILES=($(find "$ZEN_PROFILES_DIR" -maxdepth 1 -mindepth 1 -type d))

if [ ${#PROFILES[@]} -eq 0 ]; then
  echo "❌ Error: No profile found inside $ZEN_PROFILES_DIR"
  exit 1
elif [ ${#PROFILES[@]} -eq 1 ]; then
  TARGET_PROFILE="${PROFILES[0]}"
else
  # Prefer the default release profile if present
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

echo "📁 Target Zen Profile:"
echo "   $TARGET_PROFILE"
echo ""

# 1. Install userChrome.css
echo "🎨 [1/4] Installing userChrome.css..."
mkdir -p "$TARGET_PROFILE/chrome"
if [ -f "$TARGET_PROFILE/chrome/userChrome.css" ]; then
  cp "$TARGET_PROFILE/chrome/userChrome.css" "$TARGET_PROFILE/chrome/userChrome.css.backup.$(date +%s)"
  echo "   (Existing userChrome.css backed up)"
fi
cp "$SCRIPT_DIR/chrome/userChrome.css" "$TARGET_PROFILE/chrome/userChrome.css"
echo "   ✅ userChrome.css installed."

# 2. Configure user.js
echo "⚙️  [2/4] Configuring user.js preferences..."
USER_JS="$TARGET_PROFILE/user.js"
touch "$USER_JS"

ensure_pref() {
  local pref="$1"
  local val="$2"
  if grep -q "$pref" "$USER_JS"; then
    sed -i '' "s/user_pref(\"$pref\", .*/user_pref(\"$pref\", $val);/" "$USER_JS"
  else
    echo "user_pref(\"$pref\", $val);" >> "$USER_JS"
  fi
}

ensure_pref "toolkit.legacyUserProfileCustomizations.stylesheets" "true"
ensure_pref "xpinstall.signatures.required" "false"
ensure_pref "extensions.experiments.enabled" "true"
ensure_pref "widget.macos.native-context-menus" "false"
ensure_pref "extensions.autoDisableScopes" "0"
echo "   ✅ user.js updated."

# 3. Install custom extensions (.xpi)
echo "🧩 [3/4] Installing extensions..."
mkdir -p "$TARGET_PROFILE/extensions"
for xpi in "$SCRIPT_DIR/extensions/"*.xpi; do
  if [ -f "$xpi" ]; then
    cp "$xpi" "$TARGET_PROFILE/extensions/"
    echo "   ✅ Copied $(basename "$xpi")"
  fi
done

# 4. Configure macOS Native Messaging Host (for Emoji palette)
echo "🍎 [4/4] Configuring macOS native messaging host..."
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
