// Zen Browser User Preferences
// Place or append into <zen_profile_directory>/user.js

// 1. Enable custom userChrome.css stylesheets
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// 2. Allow local custom unsigned extensions
user_pref("xpinstall.signatures.required", false);

// 3. Enable WebExtension experiment APIs (used by zen-translate-page for Firefox TranslationsParent)
user_pref("extensions.experiments.enabled", true);

// 4. Enable customizable context menus for macOS CSS layout & reordering
user_pref("widget.macos.native-context-menus", false);

// 5. Prevent Zen/Firefox from auto-disabling sideloaded local extensions
user_pref("extensions.autoDisableScopes", 0);

// 6. Audio & WebRTC Optimization: prevent Gecko DSP from clashing with Google Meet & Teams AI processing
user_pref("media.getusermedia.audio.processing.noise.enabled", false);
user_pref("media.getusermedia.audio.processing.agc.enabled", false);
user_pref("media.getusermedia.audio.processing.agc2.forced", false);
user_pref("media.getusermedia.audio.processing.transient.enabled", false);
