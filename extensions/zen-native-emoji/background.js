browser.contextMenus.create({
  id: "zen-native-emoji-item",
  title: "Emoji & Symbols",
  contexts: ["editable"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "zen-native-emoji-item") {
    browser.runtime.sendNativeMessage("zen_native_emoji", { action: "open" })
      .catch((err) => {
        console.error("[Zen Native Emoji] Native message failed:", err);
      });
  }
});
