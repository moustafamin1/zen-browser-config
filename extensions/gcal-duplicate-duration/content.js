
const INTERVAL_DELAY = 50;
const OPTIONS_BUTTON_SELECTOR = '.d29e1c';
const DUPLICATE_BUTTON_SELECTOR = '[jsname="lbYRR"]';
const SAVE_BUTTON_SELECTOR = '[jsname="x8hlje"]';

let extensionOptions = {
  enableShortcut: true,
  shortcutKey: 'Shift+Click',
  showDuration: true
};

async function loadOptions() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_OPTIONS' });
    extensionOptions = response;
  } catch (error) {
    console.error('[GCal Duplicate] Error loading options:', error);
    findEventCards().forEach(addDurationToCard);
  }
}

function onReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function formatDuration(ms) {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function findEventCards() {
  return Array.from(document.querySelectorAll('[data-eventid][data-eventchip]'));
}

function addDurationToCard(card) {
  if (!extensionOptions.showDuration) return;
  if (card.querySelector('.gcal-chip-duration')) return;

  let start, end;
  
  // Try to find time information in different card formats
  const timeDiv = card.querySelector('.lhydbb.gVNoLb');
  if (timeDiv) {
    // Large event cards with full time range
    const match = timeDiv.textContent.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
    if (match) {
      const [sh, sm, eh, em] = match.slice(1).map(Number);
      const today = new Date();
      start = new Date(today); start.setHours(sh, sm, 0, 0);
      end = new Date(today); end.setHours(eh, em, 0, 0);
      
      // Handle events that span across midnight
      if (end <= start) {
        end.setDate(end.getDate() + 1);
      }
    }
  } else {
    // Small event cards; look for time in the accessible description
    const accessibleDiv = card.querySelector('.XuJrye');
    if (accessibleDiv) {
      // Try to match the full date-time format first
      const fullMatch = accessibleDiv.textContent.match(/(\d{1,2})\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s+at\s+(\d{1,2}):(\d{2})\s+to\s+(\d{1,2})\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s+at\s+(\d{1,2}):(\d{2})/);
      if (fullMatch) {
        const [startDay, sh, sm, endDay, eh, em] = fullMatch.slice(1).map(Number);
        const today = new Date();
        start = new Date(today); start.setDate(startDay); start.setHours(sh, sm, 0, 0);
        end = new Date(today); end.setDate(endDay); end.setHours(eh, em, 0, 0);
      } else {
        // Fallback to simple time format
        const match = accessibleDiv.textContent.match(/(\d{1,2}):(\d{2})\s+to\s+(\d{1,2}):(\d{2})/);
        if (match) {
          const [sh, sm, eh, em] = match.slice(1).map(Number);
          const today = new Date();
          start = new Date(today); start.setHours(sh, sm, 0, 0);
          end = new Date(today); end.setHours(eh, em, 0, 0);
          
          // Handle events that span across midnight
          if (end <= start) {
            end.setDate(end.getDate() + 1);
          }
        }
      }
    }
  }

  if (start && end && end > start) {
    let duration = formatDuration(end - start);
    let durDiv = document.createElement('div');
    durDiv.textContent = duration;
    durDiv.style.color = 'black';
    durDiv.className = 'gcal-chip-duration';
    durDiv.style.position = 'absolute';
    durDiv.style.right = '4px';
    durDiv.style.bottom = '2px';
    durDiv.style.fontSize = '10px';
    durDiv.style.opacity = '0.7';
    durDiv.style.background = 'rgba(255,255,255,0.5)';
    durDiv.style.padding = '1px 4px';
    durDiv.style.borderRadius = '3px';
    durDiv.style.pointerEvents = 'none';
    durDiv.style.zIndex = '2';
    
    // Ensure the card has the correct positioning
    const computed = window.getComputedStyle(card);
    if (computed.position === 'static') {
      card.style.position = 'relative';
    }
    card.appendChild(durDiv);
  }
}

function styleDuplicateButton(btn, editButton) {

  btn.className = 'pYTkkf-Bz112c-LgbsSe pYTkkf-Bz112c-LgbsSe-OWXEXe-SfQLQb-suEOdc';
  btn.setAttribute('jscontroller', 'PIVayb');
  btn.setAttribute('jsaction', 'pointerenter:EX0mI;pointerleave:vpvbp;');
  btn.setAttribute('data-use-native-focus-logic', 'true');
  btn.setAttribute('jsname', 'DuplicateEvent');
  btn.setAttribute('aria-label', 'Duplicate event');
  btn.setAttribute('data-tooltip-enabled', 'true');
  btn.setAttribute('data-tooltip-id', 'tt-duplicate-event');
  btn.style.width = '40px';
  btn.style.height = '40px';
  btn.style.borderRadius = '50%';
  btn.style.border = 'none';
  btn.style.background = editButton.style.background;
  btn.style.color = editButton.style.color;
  btn.style.cursor = 'pointer';
  btn.style.display = 'inline-flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.marginLeft = '4px';
  btn.style.marginRight = '4px';
  btn.style.transition = 'background-color 0.2s';
  btn.style.zIndex = '1000';

  btn.onmouseenter = (e) => {
    e.stopPropagation();
    btn.style.background = editButton.style.background;
  };
  btn.onmouseleave = (e) => {
    e.stopPropagation();
    btn.style.background = editButton.style.background;
  };

}


function enhanceEventDetailsPopup(popup) {
  if (!popup) return;
  
  // Skip if duplicate button already exists
  if (popup.querySelector('[jsname="DuplicateEvent"]')) {
    return;
  }
  

  const editButton = popup.querySelector('button[aria-label="Edit event"]');
  if (!editButton) return;

  const actionContainer = editButton.closest('[jsaction*="JIbuQc"]');
  if (!actionContainer) return;

  const newContainer = document.createElement('div');
  
  const tooltipWrapper = document.createElement('span');
  tooltipWrapper.setAttribute('data-is-tooltip-wrapper', 'true');
  
  const btn = document.createElement('button');
  styleDuplicateButton(btn, editButton);
  const duplicateBtn = btn;
  duplicateBtn.onclick = (e) => {
    // Prevent overlap
    if (duplicateBtn.getAttribute('jsname') !== 'DuplicateEvent') {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    duplicateEvent();
  };
  
  const iconSpan = document.createElement('span');
  iconSpan.className = 'OiePBf-zPjgPe pYTkkf-Bz112c-UHGRz';
  iconSpan.innerHTML = '<svg focusable="false" width="20" height="20" viewBox="0 0 24 24" class="NMm5M"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>';
  btn.appendChild(iconSpan);
  
  const rippleSpan = document.createElement('span');
  rippleSpan.className = 'RBHQF-ksKsZd';
  rippleSpan.setAttribute('jscontroller', 'LBaJxb');
  rippleSpan.setAttribute('jsname', 'm9ZlFb');
  btn.appendChild(rippleSpan);
  
  const focusSpan = document.createElement('span');
  focusSpan.setAttribute('jsname', 'S5tZuc');
  focusSpan.setAttribute('aria-hidden', 'true');
  focusSpan.className = 'pYTkkf-Bz112c-kBDsod-Rtc0Jf';
  focusSpan.innerHTML = '<span class="notranslate VfPpkd-kBDsod" aria-hidden="true"><svg focusable="false" width="20" height="20" viewBox="0 0 24 24" class="NMm5M"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg></span>';
  btn.appendChild(focusSpan);
  
  const rippleDiv = document.createElement('div');
  rippleDiv.className = 'pYTkkf-Bz112c-RLmnJb';
  btn.appendChild(rippleDiv);
  
  const tooltipDiv = document.createElement('div');
  tooltipDiv.setAttribute('id', 'tt-duplicate-event');
  tooltipDiv.setAttribute('class', 'ne2Ple-oshW8e-V67aGc');
  tooltipDiv.setAttribute('role', 'tooltip');
  tooltipDiv.setAttribute('aria-hidden', 'true');
  tooltipDiv.textContent = 'Duplicate event';
  
  tooltipWrapper.appendChild(btn);
  tooltipWrapper.appendChild(tooltipDiv);
  newContainer.appendChild(tooltipWrapper);
  newContainer.style.position = 'relative';
  newContainer.style.zIndex = '999';
  actionContainer.parentNode.insertBefore(newContainer, actionContainer.nextSibling);
  
  // Debug: Check for overlapping elements
  const deleteButton = popup.querySelector('button[aria-label*="Delete"]');
  if (deleteButton) {
    const deleteRect = deleteButton.getBoundingClientRect();
    const duplicateRect = btn.getBoundingClientRect();
  }
  
}

function isOriginalUrl(url) {
  const path = new URL(url, location.origin).pathname;
  const parts = path.split("/").filter(Boolean);
  return parts.length === 5;
}

function duplicateEvent() {
  let intervalDuplicateEvent;
  let intervalSaveEvent;

  document.body.classList.add("gcqd-active");
  clearInterval(intervalDuplicateEvent);

  const currentUrl = window.location.href;
  const originalUrl = (new URL(currentUrl).pathname.slice(1)).replace('calendar/u/0/', '');

  intervalDuplicateEvent = setInterval(function () {
    const optionsButton = document.querySelector(OPTIONS_BUTTON_SELECTOR);
    const duplicateButton = document.querySelector(DUPLICATE_BUTTON_SELECTOR);

    // Open the options menu if it's closed, then click the duplicate button
    if (isOptionsMenuClosed(optionsButton, duplicateButton)) {
      simulateClick(optionsButton);
    } else if (duplicateButton != null) {
      simulateClick(duplicateButton);
      saveEvent();
    }
  }, INTERVAL_DELAY);

  function isOptionsMenuClosed(optionsButton, duplicateButton) {
    return optionsButton != null && duplicateButton == null;
  }

  function saveEvent() {
    clearInterval(intervalSaveEvent);

    intervalSaveEvent = setInterval(function () {
      const saveButton = document.querySelector(SAVE_BUTTON_SELECTOR);
      if (saveButton == null) return;

      clearInterval(intervalDuplicateEvent);
      clearInterval(intervalSaveEvent);
      simulateClick(saveButton);
      document.body.classList.remove("gcqd-active");

      if (isOriginalUrl(originalUrl)) {
        setTimeout(() => {
          history.pushState(null, '', originalUrl);
          window.dispatchEvent(new Event('popstate'));
        }, 600);
      }

    }, INTERVAL_DELAY);
  }
}

function simulateClick(element) {
  element.click();
  element.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );
  element.dispatchEvent(
    new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window })
  );
}

function handleEventCardClick(event) {
  if (!extensionOptions.enableShortcut) return;
  
  const isShortcutPressed = checkShortcutPressed(event);
  
  if (isShortcutPressed) {
    event.preventDefault();
    event.stopPropagation();
    const card = event.target.closest('[data-eventid][data-eventchip]');
    if (card) {
      simulateClick(card);
      setTimeout(() => duplicateEvent(), 100);
    }
  }
}

function checkShortcutPressed(event) {
  const shortcut = extensionOptions.shortcutKey.toLowerCase();
  
  if (shortcut.includes('+')) {
    const parts = shortcut.split('+');
    const requiredKeys = parts.map(part => part.trim().toLowerCase());
    
    const hasCtrl = requiredKeys.includes('ctrl') === event.ctrlKey;
    const hasShift = requiredKeys.includes('shift') === event.shiftKey;
    const hasAlt = requiredKeys.includes('alt') === event.altKey;
    const hasMeta = requiredKeys.includes('meta') === event.metaKey;
    
    const allRequiredPressed = hasCtrl && hasShift && hasAlt && hasMeta;
    const noExtraKeys = (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) === 
                       (event.ctrlKey && hasCtrl || event.shiftKey && hasShift || event.altKey && hasAlt || event.metaKey && hasMeta);
    
    return allRequiredPressed && noExtraKeys;
  }
  
  return false;
}

function observeEventCards() {
  const observer = new MutationObserver(() => {
    findEventCards().forEach(addDurationToCard);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function observeEventDetailsPopup() {
  const observer = new MutationObserver(() => {
    const popups = document.querySelectorAll('[role="dialog"], [data-mdc-dialog-surface], .m3Hc');
    
    for (let popup of popups) {
      if (popup.offsetParent !== null && 
          !popup.querySelector('[jsname="DuplicateEvent"]') &&
          popup.querySelector('button[aria-label="Edit event"]')) {
        enhanceEventDetailsPopup(popup);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}


function handleOptionsUpdate(options) {
  extensionOptions = options;
  
  // Update duration display based on new options
  if (extensionOptions.showDuration) {
    findEventCards().forEach(addDurationToCard);
  } else {
    // Remove duration displays if disabled
    document.querySelectorAll('.gcal-chip-duration').forEach(el => el.remove());
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPTIONS_UPDATED') {
    handleOptionsUpdate(message.options);
  }
});

onReady(async () => {
  await loadOptions();
  observeEventCards();
  observeEventDetailsPopup();
  document.addEventListener('click', handleEventCardClick, true);
}); 