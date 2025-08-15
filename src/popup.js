document.addEventListener('DOMContentLoaded', function() {
  initializePopup();
});

/**
 * Initialize the popup interface
 */
function initializePopup() {
  loadExtensionInfo();
  loadUsageStats();
  setupEventListeners();
  updateShortcutDisplay();
}

/**
 * Load extension information
 */
function loadExtensionInfo() {
  chrome.runtime.sendMessage({action: 'GET_EXTENSION_INFO'}, function(response) {
    if (response) {
      document.getElementById('version').textContent = `v${response.version}`;
    }
  });
}

/**
 * Load and display usage statistics
 */
function loadUsageStats() {
  chrome.storage.local.get(['usageCount'], function(result) {
    const count = result.usageCount || 0;
    const countElement = document.getElementById('usage-count');
    animateCounter(countElement, count);
  });
}

/**
 * Animate counter with smooth counting effect
 * @param {HTMLElement} element - The counter element
 * @param {number} target - Target number to count to
 */
function animateCounter(element, target) {
  let current = 0;
  const increment = Math.ceil(target / 20);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current.toLocaleString();
  }, 50);
}

/**
 * Update shortcut display based on platform
 */
function updateShortcutDisplay() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutKeys = document.querySelector('.shortcut-keys');
  
  if (isMac) {
    shortcutKeys.innerHTML = '<span class="key">Cmd</span> + <span class="key">Shift</span> + <span class="key">C</span>';
  }
}

/**
 * Setup event listeners for buttons and interactions
 */
function setupEventListeners() {
  // Test button
  document.getElementById('test-btn').addEventListener('click', handleTestExtension);
  
  // Help button
  document.getElementById('help-btn').addEventListener('click', handleShowHelp);
  
  // Track button clicks
  trackEvent('popup_opened');
}

/**
 * Handle test extension functionality
 */
function handleTestExtension() {
  const button = document.getElementById('test-btn');
  const originalText = button.innerHTML;
  
  // Show loading state
  button.classList.add('loading');
  button.innerHTML = '<span class="btn-icon">⏳</span> Testing...';
  
  // Test clipboard functionality
  testClipboardAccess().then(() => {
    // Test context menu
    return testContextMenu();
  }).then(() => {
    // Success
    button.innerHTML = '<span class="btn-icon">✅</span> Test Passed!';
    button.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
    
    showNotification('Extension is working correctly!', 'success');
    trackEvent('test_success');
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
      button.classList.remove('loading');
    }, 2000);
  }).catch((error) => {
    // Error
    button.innerHTML = '<span class="btn-icon">❌</span> Test Failed';
    button.style.background = 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
    
    showNotification(`Test failed: ${error.message}`, 'error');
    trackEvent('test_failed', {error: error.message});
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
      button.classList.remove('loading');
    }, 3000);
  });
}

/**
 * Test clipboard access
 */
function testClipboardAccess() {
  return new Promise((resolve, reject) => {
    const testText = 'Flutter Widget Catcher Test';
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(testText).then(() => {
        resolve();
      }).catch((error) => {
        reject(new Error('Clipboard access denied'));
      });
    } else {
      reject(new Error('Clipboard API not supported'));
    }
  });
}

/**
 * Test context menu availability
 */
function testContextMenu() {
  return new Promise((resolve, reject) => {
    // Query active tab to test tab access
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (chrome.runtime.lastError) {
        reject(new Error('Cannot access tabs'));
      } else if (tabs.length === 0) {
        reject(new Error('No active tab found'));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Handle help and support
 */
function handleShowHelp() {
  const helpContent = `
    <div class="help-modal">
      <h3>How to Use Flutter Widget Catcher</h3>
      <ol>
        <li>Navigate to any webpage with Flutter widget code</li>
        <li>Select the widget name (e.g., "Container", "Column")</li>
        <li>Right-click and select "🎯 Catch Flutter Widget"</li>
        <li>The complete widget with proper brackets will be copied!</li>
      </ol>
      
      <h3>Keyboard Shortcut</h3>
      <p>Select widget text and press <strong>Ctrl+Shift+C</strong> (Cmd+Shift+C on Mac)</p>
      
      <h3>Troubleshooting</h3>
      <ul>
        <li>Make sure you have text selected before right-clicking</li>
        <li>Refresh the page if the extension doesn't respond</li>
        <li>Check that the extension has permission to access the current site</li>
      </ul>
    </div>
  `;
  
  showModal('Help & Support', helpContent);
  trackEvent('help_opened');
}

/**
 * Show a modal dialog
 * @param {string} title - Modal title
 * @param {string} content - Modal content HTML
 */
function showModal(title, content) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-content">
        ${content}
      </div>
    </div>
  `;
  
  // Add modal styles
  const style = document.createElement('style');
  style.textContent = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: white;
      border-radius: 12px;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #718096;
    }
    .modal-content {
      padding: 20px;
    }
    .help-modal h3 {
      color: #2d3748;
      margin-bottom: 12px;
      margin-top: 20px;
    }
    .help-modal h3:first-child {
      margin-top: 0;
    }
    .help-modal ol, .help-modal ul {
      padding-left: 20px;
      color: #4a5568;
    }
    .help-modal li {
      margin-bottom: 8px;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(overlay);
  
  // Close modal functionality
  overlay.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.head.removeChild(style);
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
      document.head.removeChild(style);
    }
  });
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add notification styles
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1001;
      animation: slideIn 0.3s ease;
    }
    .notification-success { background: #48bb78; }
    .notification-error { background: #f56565; }
    .notification-info { background: #4299e1; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
      document.head.removeChild(style);
    }
  }, 3000);
}

/**
 * Track events for analytics
 * @param {string} eventName - Event name
 * @param {Object} eventData - Additional event data
 */
function trackEvent(eventName, eventData = {}) {
  // Store analytics data locally
  chrome.storage.local.get(['analytics'], function(result) {
    const analytics = result.analytics || [];
    analytics.push({
      event: eventName,
      data: eventData,
      timestamp: Date.now()
    });
    
    // Keep only last 100 events
    if (analytics.length > 100) {
      analytics.splice(0, analytics.length - 100);
    }
    
    chrome.storage.local.set({analytics});
  });
}

/**
 * Update usage count when widget is caught
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'WIDGET_CAUGHT') {
    chrome.storage.local.get(['usageCount'], function(result) {
      const newCount = (result.usageCount || 0) + 1;
      chrome.storage.local.set({usageCount: newCount});
      
      // Update display if popup is open
      const countElement = document.getElementById('usage-count');
      if (countElement) {
        animateCounter(countElement, newCount);
      }
    });
  }
}); 