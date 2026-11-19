/* global ExtensionAPI, ChromeUtils */
"use strict";

this.zenTranslatePage = class extends ExtensionAPI {
  getAPI() {
    const { ExtensionParent } = ChromeUtils.importESModule(
      "resource://gre/modules/ExtensionParent.sys.mjs"
    );
    const { TranslationsParent } = ChromeUtils.importESModule(
      "resource://gre/actors/TranslationsParent.sys.mjs"
    );
    const { TranslationsUtils } = ChromeUtils.importESModule(
      "chrome://global/content/translations/TranslationsUtils.mjs"
    );

    const TARGET_LANGUAGE = "en";

    function getTabBrowser(tabId) {
      const tabTracker = ExtensionParent.apiManager.global.tabTracker;
      const nativeTab = tabTracker.getTab(tabId, null);
      return nativeTab?.linkedBrowser || null;
    }

    function getActor(browser) {
      if (!browser?.browsingContext?.currentWindowGlobal) {
        return null;
      }
      try {
        return TranslationsParent.getTranslationsActor(browser);
      } catch {
        return null;
      }
    }

    return {
      zenTranslatePage: {
        async isTranslated(tabId) {
          const browser = getTabBrowser(tabId);
          const actor = getActor(browser);
          return Boolean(actor?.languageState?.requestedLanguagePair);
        },

        async translateOrUndo(tabId) {
          const browser = getTabBrowser(tabId);
          const actor = getActor(browser);
          if (!actor) {
            return false;
          }

          if (actor.languageState?.requestedLanguagePair) {
            actor.restorePage();
            return false;
          }

          const langTags = await actor.getLangTags().catch(() => null);
          const docLangTag = langTags?.docLangTag;
          const isSupported = Boolean(langTags?.isDocLangTagSupported);

          if (
            isSupported &&
            docLangTag &&
            !TranslationsUtils.langTagsMatch(docLangTag, TARGET_LANGUAGE)
          ) {
            await actor.translate(
              { sourceLanguage: docLangTag, targetLanguage: TARGET_LANGUAGE },
              false
            );
            return true;
          }

          const win = browser.ownerGlobal;
          const panel = win?.FullPageTranslationsPanel;
          if (panel) {
            const button = panel.buttonElements?.button;
            const triggerEvent =
              button && !button.hidden
                ? {
                    type: "TranslationsParent:OfferTranslation",
                    target: browser,
                    stopPropagation() {},
                  }
                : {
                    type: "command",
                    target: win.document.getElementById("PanelUI-menu-button"),
                    stopPropagation() {},
                  };
            panel.open(triggerEvent);
          }
          return false;
        },
      },
    };
  }
};
