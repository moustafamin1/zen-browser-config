// Zen Browser User Preferences
// Place or append into <zen_profile_directory>/user.js

// 1. Enable custom userChrome.css stylesheets
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// 2. Allow local custom unsigned extensions
user_pref("xpinstall.signatures.required", false);

// 3. Enable WebExtension experiment APIs (used by zen-translate-page for Firefox TranslationsParent)
user_pref("extensions.experiments.enabled", true);
