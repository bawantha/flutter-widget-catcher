"use strict";

// Constants
const EXTENSION_NAME = 'Flutter Widget Catcher';
const CONTEXT_MENU_ID = 'flutter-widget-catch';

/**
 * Initialize the extension when installed
 */
chrome.runtime.onInstalled.addListener(function(details) {
  console.log(`${EXTENSION_NAME} installed/updated. Reason: ${details.reason}`);
  
  // Create context menu item
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "🎯 Catch Flutter Widget",
    type: "normal",
    contexts: ["selection"],
  }, function() {
    if (chrome.runtime.lastError) {
      console.error('Error creating context menu:', chrome.runtime.lastError);
    } else {
      console.log('Context menu created successfully');
    }
  });
  
  // Show installation/update notification
  if (details.reason === 'install') {
    showWelcomeNotification();
  } else if (details.reason === 'update') {
    console.log(`Extension updated from version ${details.previousVersion}`);
  }
});

/**
 * Handle context menu clicks
 */
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    handleWidgetCatch(info, tab);
  }
});

/**
 * Handle the widget catching process
 * @param {Object} info - Context menu click info
 * @param {Object} tab - Current tab info
 */
function handleWidgetCatch(info, tab) {
  try {
    // Validate selection
    if (!info.selectionText || info.selectionText.trim().length === 0) {
      console.warn('No text selected');
      showErrorNotification('Please select some text first');
      return;
    }
    
    // Check if tab is valid and accessible
    if (!tab || !tab.id) {
      console.error('Invalid tab information');
      showErrorNotification('Cannot access current tab');
      return;
    }
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
      command: "CATCH",
      widget: info.selectionText.trim()
    }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error sending message to content script:', chrome.runtime.lastError);
        showErrorNotification('Failed to communicate with page. Please refresh and try again.');
      } else if (response && response.success) {
        console.log('Widget caught successfully:', response.message);
      } else {
        console.warn('Widget catch failed:', response ? response.message : 'Unknown error');
        showErrorNotification('Failed to catch widget. Please try again.');
      }
    });
    
  } catch (error) {
    console.error('Error in handleWidgetCatch:', error);
    showErrorNotification('An unexpected error occurred');
  }
}

/**
 * Show welcome notification for new users
 */
function showWelcomeNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon_48.png',
    title: 'Flutter Widget Catcher Installed!',
    message: 'Right-click on any Flutter widget text to copy it with proper brackets. You can also use Ctrl+Shift+C (Cmd+Shift+C on Mac).'
  }, function(notificationId) {
    if (chrome.runtime.lastError) {
      console.log('Notification permission not granted or error occurred');
    } else {
      console.log('Welcome notification shown:', notificationId);
    }
  });
}

/**
 * Show error notification to user
 * @param {string} message - Error message to display
 */
function showErrorNotification(message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon_48.png',
    title: 'Flutter Widget Catcher Error',
    message: message
  }, function(notificationId) {
    if (chrome.runtime.lastError) {
      console.log('Could not show error notification:', chrome.runtime.lastError);
    }
  });
}

/**
 * Handle extension icon click (if user clicks the extension icon)
 */
chrome.action.onClicked.addListener(function(tab) {
  // Open options page or show help
  chrome.tabs.create({
    url: 'https://github.com/your-username/flutter-widget-catcher'
  });
});

/**
 * Handle keyboard shortcuts (if defined in manifest)
 */
chrome.commands.onCommand.addListener(function(command) {
  if (command === "catch-widget") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "CATCH_SHORTCUT"});
      }
    });
  }
});

/**
 * Monitor tab updates to ensure content script is ready
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    // Content script should be automatically injected
    console.log('Tab updated and ready:', tab.url);
  }
});

/**
 * Handle extension startup
 */
chrome.runtime.onStartup.addListener(function() {
  console.log(`${EXTENSION_NAME} started`);
});

/**
 * Handle messages from content script or popup
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  try {
    switch (request.action) {
      case 'GET_EXTENSION_INFO':
        sendResponse({
          name: EXTENSION_NAME,
          version: chrome.runtime.getManifest().version
        });
        break;
      
      case 'LOG_ERROR':
        console.error('Content script error:', request.error);
        break;
        
      case 'LOG_INFO':
        console.log('Content script info:', request.message);
        break;
        
      default:
        console.log('Unknown message action:', request.action);
    }
  } catch (error) {
    console.error('Error handling runtime message:', error);
  }
  
  return true; // Keep message channel open for async response
});
