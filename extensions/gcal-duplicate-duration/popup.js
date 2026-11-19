const DEFAULT_OPTIONS = {
  enableShortcut: true,
  shortcutKey: 'Shift+Click',
  showDuration: true
};

const enableShortcutCheckbox = document.getElementById('enableShortcut');
const shortcutKeyInput = document.getElementById('shortcutKey');
const showDurationCheckbox = document.getElementById('showDuration');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const options = await chrome.storage.sync.get(DEFAULT_OPTIONS);
    
    enableShortcutCheckbox.checked = options.enableShortcut;
    shortcutKeyInput.value = options.shortcutKey;
    showDurationCheckbox.checked = options.showDuration;
    
    updateShortcutInputState();
  } catch (error) {
    console.error('Error loading options:', error);
    showStatus('Error loading options', 'error');
  }
});

enableShortcutCheckbox.addEventListener('change', updateShortcutInputState);

function updateShortcutInputState() {
  shortcutKeyInput.disabled = !enableShortcutCheckbox.checked;
  if (!enableShortcutCheckbox.checked) {
    shortcutKeyInput.style.opacity = '0.5';
  } else {
    shortcutKeyInput.style.opacity = '1';
  }
}

shortcutKeyInput.addEventListener('click', () => {
  if (enableShortcutCheckbox.checked) {
    shortcutKeyInput.readOnly = false;
    shortcutKeyInput.focus();
    shortcutKeyInput.select();
    shortcutKeyInput.placeholder = 'Press a key...';
  }
});

shortcutKeyInput.addEventListener('keydown', (e) => {
  e.preventDefault();
  
  let keyName = '';
  
  if (e.ctrlKey) keyName += 'Ctrl+';
  if (e.altKey) keyName += 'Alt+';
  if (e.shiftKey) keyName += 'Shift+';
  if (e.metaKey) keyName += 'Meta+';
  
  if (keyName) {
    shortcutKeyInput.value = keyName + 'Click';
    shortcutKeyInput.readOnly = true;
    shortcutKeyInput.placeholder = '';
  }
});

saveButton.addEventListener('click', async () => {
  saveButton.disabled = true;
  saveButton.textContent = 'Saving...';
  
  try {
    const options = {
      enableShortcut: enableShortcutCheckbox.checked,
      shortcutKey: shortcutKeyInput.value,
      showDuration: showDurationCheckbox.checked
    };
    
    await chrome.storage.sync.set(options);
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.url.includes('calendar.google.com')) {
      await chrome.tabs.sendMessage(tab.id, { 
        type: 'OPTIONS_UPDATED', 
        options: options 
      });
    }
    
    showStatus('Options saved successfully!', 'success');
    
    setTimeout(() => {
      saveButton.disabled = false;
      saveButton.textContent = 'Save Options';
    }, 2000);
    
  } catch (error) {
    console.error('Error saving options:', error);
    showStatus('Error saving options', 'error');
    saveButton.disabled = false;
    saveButton.textContent = 'Save Options';
  }
});

function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  
  setTimeout(() => {
    statusDiv.textContent = '';
    statusDiv.className = 'status';
  }, 3000);
}

shortcutKeyInput.addEventListener('blur', () => {
  shortcutKeyInput.readOnly = true;
  shortcutKeyInput.placeholder = '';
}); 