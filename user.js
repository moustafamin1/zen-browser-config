// =============================================================================
// Zen Browser User Preferences: user.js
// Place into: ~/Library/Application Support/zen/Profiles/<profile>/user.js
// =============================================================================

// --- 1. UI Styling & userChrome.css Support ---
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// --- 2. Extensions & Sideloading ---
// Allow unsigned local extensions (.xpi)
user_pref("xpinstall.signatures.required", false);
// Prevent Zen/Firefox from auto-disabling sideloaded local extensions
user_pref("extensions.autoDisableScopes", 0);
// Enable WebExtension experiment APIs (used by translations & custom APIs)
user_pref("extensions.experiments.enabled", true);

// --- 3. macOS Native Integration ---
// Disable macOS native context menus so CSS flexbox reordering & styling works
user_pref("widget.macos.native-context-menus", false);

// --- 4. Audio & WebRTC Optimization ---
// Prevent Gecko DSP from clashing with Google Meet & Teams AI noise cancelling
user_pref("media.getusermedia.audio.processing.noise.enabled", false);
user_pref("media.getusermedia.audio.processing.agc.enabled", false);
user_pref("media.getusermedia.audio.processing.agc2.forced", false);
user_pref("media.getusermedia.audio.processing.transient.enabled", false);

// --- 5. Zen Sidebar & Workspace Layout ---
user_pref("zen.workspaces.show-workspace-indicator", false);
user_pref("zen.workspaces.indicator-name-center", false);
user_pref("zen.view.compact.enable-at-startup", false);
user_pref("zen.view.compact.drag-collapse-hint-seen", true);
user_pref("sidebar.main.tools", "side-view@mozilla.org");
user_pref("sidebar.installed.extensions", "side-view@mozilla.org");
user_pref("sidebar.position_start", false);
user_pref("sidebar.visibility", "hide-on-close");

// --- 6. Zen Mod: SuperPins (UUID: ad97bb70-0066-4e42-9b5f-173a5e42c6fc) ---
user_pref("mod.superpins.essentials.grid-count", "2");
user_pref("mod.superpins.pins.grid-count", "2");
user_pref("uc.essentials.auto-grow", false);
user_pref("uc.essentials.box-like-corners", false);
user_pref("uc.essentials.color-scheme", "transparent");
user_pref("uc.essentials.gap", "Normal");
user_pref("uc.essentials.grid-count", true);
user_pref("uc.essentials.position", "");
user_pref("uc.essentials.same-height", true);
user_pref("uc.essentials.transition-bg", false);
user_pref("uc.essentials.transition-speed", "100ms");
user_pref("uc.essentials.width", "Thin");
user_pref("uc.favicon.size", "small");
user_pref("uc.pinned.height", "");
user_pref("uc.pins.active-bg", false);
user_pref("uc.pins.auto-grow", false);
user_pref("uc.pins.bg", false);
user_pref("uc.pins.essentials-layout", false);
user_pref("uc.pins.grid-count", false);
user_pref("uc.pins.legacy-layout", false);
user_pref("uc.pins.separator-at-bottom", false);
user_pref("uc.pins.stay-at-top", false);
user_pref("uc.pins.transition-bg", false);
user_pref("uc.pins.transition-speed", "100ms");
user_pref("uc.remove-sidebar-scrollbar", true);
user_pref("uc.superpins.border", "");
user_pref("uc.tabs.show-separator", "");
user_pref("uc.tabs.strikethrough-on-pending", false);
user_pref("uc.theme.background_shape", "ModeratelyRounded");
user_pref("uc.theme.compact_side", "Right");
user_pref("uc.theme.expanded_side", "Right");
user_pref("uc.theme.font_size", "Medium");
user_pref("uc.workspace.current.icon.size", "");
user_pref("uc.workspace.icon.size", "");

// --- 7. Zen Mod: Sidebar Expand on Hover (UUID: bd92a9a0-1c00-4187-a66e-94c389fa5a59) ---
user_pref("mod.autoexpand.animation_delay", "0ms");
user_pref("mod.autoexpand.animation_duration", "10ms");
user_pref("mod.autoexpand.collapse_delay", "400ms");
user_pref("mod.autoexpand.collapsed_width", "50px");
user_pref("mod.autoexpand.essentials_vertical", true);
user_pref("mod.autoexpand.expanded_width", "150px");
user_pref("mod.autoexpand.fade_sleeping_tabs", false);
user_pref("mod.autoexpand.hide_workspace_indicator", true);
user_pref("mod.autoexpand.performance_mode", "potato");
user_pref("mod.autoexpand.remove_line_separator", true);
user_pref("zen.theme.content-element-separation", 0);
user_pref("zen.theme.border-radius", 0);

// --- 8. Tab Memory Optimization ---
// Auto-sleep / unload inactive background tabs after 3 minutes (180,000 ms)
user_pref("browser.tabs.unloadOnLowMemory", true);
user_pref("browser.tabs.min_inactive_duration_before_unload", 180000);

// --- 9. Window Vibrancy & Visual Appearance ---
// Restore macOS window vibrancy and pitch-black sidebar
user_pref("zen.widget.macos.window-vibrancy", true);
user_pref("zen.theme.acrylic-urlbar", true);

// --- 10. Hardware Acceleration & WebRender ---
user_pref("media.hardware-video-decoding.enabled", true);
user_pref("gfx.webrender.all", true);

// --- 11. Disable Telemetry & Background Ping Cycles ---
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("datareporting.policy.dataSubmissionEnabled", false);
user_pref("toolkit.telemetry.enabled", false);
user_pref("toolkit.telemetry.unified", false);
user_pref("toolkit.telemetry.archive.enabled", false);
user_pref("browser.ping-centre.telemetry", false);
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
user_pref("browser.newtabpage.activity-stream.telemetry", false);
user_pref("experiments.supported", false);
user_pref("experiments.enabled", false);

// --- 12. Network & Prefetch Optimization ---
// Prevent background speculative pre-fetching of unclicked links
user_pref("network.prefetch-next", false);
