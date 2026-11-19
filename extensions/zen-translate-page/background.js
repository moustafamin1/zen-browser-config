"use strict";

const MENU_ID = "zen-translate-page-item";
let currentTitle = "Translate this page";

browser.menus.create({
  id: MENU_ID,
  title: currentTitle,
  contexts: ["page"],
  documentUrlPatterns: ["http://*/*", "https://*/*", "file://*/*"]
});

async function syncMenuTitle(tabId) {
  if (typeof tabId !== "number" || tabId < 0) {
    return false;
  }
  try {
    const translated = await browser.zenTranslatePage.isTranslated(tabId);
    const nextTitle = translated ? "Undo translation" : "Translate this page";
    if (nextTitle !== currentTitle) {
      currentTitle = nextTitle;
      await browser.menus.update(MENU_ID, { title: nextTitle });
      return true;
    }
  } catch (err) {
    console.error("[Zen Translate Page] syncMenuTitle failed:", err);
  }
  return false;
}

browser.menus.onShown.addListener(async (info, tab) => {
  if (!info.menuIds.includes(MENU_ID) || !tab) {
    return;
  }
  const changed = await syncMenuTitle(tab.id);
  if (changed) {
    browser.menus.refresh();
  }
});

browser.tabs.onActivated.addListener(({ tabId }) => {
  syncMenuTitle(tabId);
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    syncMenuTitle(tabId);
  }
});

browser.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID || !tab) {
    return;
  }
  try {
    const translated = await browser.zenTranslatePage.translateOrUndo(tab.id);
    currentTitle = translated ? "Undo translation" : "Translate this page";
    await browser.menus.update(MENU_ID, { title: currentTitle });
  } catch (err) {
    console.error("[Zen Translate Page] translateOrUndo failed:", err);
  }
});
