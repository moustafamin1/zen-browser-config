const DEFAULT_OPTIONS = {
  enableShortcut: true,
  shortcutKey: 'Shift+Click',
  showDuration: true
};

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const existing = await chrome.storage.sync.get(DEFAULT_OPTIONS);
    const optionsToSet = {};
    
    for (const [key, defaultValue] of Object.entries(DEFAULT_OPTIONS)) {
      if (!(key in existing)) {
        optionsToSet[key] = defaultValue;
      }
    }
    
    if (Object.keys(optionsToSet).length > 0) {
      await chrome.storage.sync.set(optionsToSet);
      console.log('Default options initialized:', optionsToSet);
    }
  } catch (error) {
    console.error('Error initializing default options:', error);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_OPTIONS') {
    chrome.storage.sync.get(DEFAULT_OPTIONS).then(options => {
      sendResponse(options);
    });
    return true;
  }
  
  if (message.type === 'OPTIONS_UPDATED') {
    chrome.tabs.query({ url: 'https://calendar.google.com/*' }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'OPTIONS_UPDATED',
          options: message.options
        }).catch(() => {
        });
      });
    });
  }
}); 