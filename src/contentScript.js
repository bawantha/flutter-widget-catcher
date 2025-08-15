"use strict";

// Create toast notification element
var toast = document.createElement('div');
toast.id = 'fwcsnackbar';
document.body.appendChild(toast);

/**
 * Shows a snackbar notification with the widget name
 * @param {string} widget - The name of the widget that was copied
 */
function showSnackBar(widget) {
  var toast = document.getElementById("fwcsnackbar");
  toast.innerHTML = "Copied " + widget + "()";
  toast.className = "show";
  
  // Remove the show class after 1.5 seconds
  setTimeout(function() { 
    toast.className = toast.className.replace("show", ""); 
  }, 1500);
}

/**
 * Enhanced function to snap selection to complete Flutter widget with proper bracket matching
 * Handles nested parentheses, curly braces, and square brackets
 */
function snapSelectionToWidget() {
  try {
    let selection = window.getSelection();
    
    // If no selection, return early
    if (selection.rangeCount === 0) {
      console.warn('No selection found');
      return false;
    }
    
    // Get the selected text
    let selectedText = selection.toString().trim();
    
    // If selection is empty, return early
    if (!selectedText) {
      console.warn('Empty selection');
      return false;
    }
    
    // Stack to track opening brackets
    var bracketStack = [];
    
    // Extend selection forward one character to check for opening bracket
    selection.modify("extend", "forward", "character");
    let currentChar = selection.toString().charAt(selection.toString().length - 1);
    
    // If we hit an opening bracket, start tracking
    if (currentChar === "(") {
      bracketStack.push("(");
    } else {
      // If no opening bracket found immediately, try to find the widget start
      // Move backward to find the widget name start
      let originalRange = selection.getRangeAt(0).cloneRange();
      selection.collapseToStart();
      
      // Try to extend backward to capture the full widget name
      let attempts = 0;
      while (attempts < 50) { // Prevent infinite loop
        selection.modify("extend", "backward", "character");
        let char = selection.toString().charAt(0);
        if (/[A-Z]/.test(char) && selection.toString().length > 1) {
          break;
        }
        attempts++;
      }
      
      // Now extend forward to find the opening parenthesis
      attempts = 0;
      while (attempts < 100) { // Prevent infinite loop
        selection.modify("extend", "forward", "character");
        let lastChar = selection.toString().charAt(selection.toString().length - 1);
        if (lastChar === "(") {
          bracketStack.push("(");
          break;
        }
        attempts++;
      }
      
      // If we couldn't find an opening bracket, restore original selection
      if (bracketStack.length === 0) {
        selection.removeAllRanges();
        selection.addRange(originalRange);
        selectedText = selection.toString();
        navigator.clipboard.writeText(selectedText);
        return true;
      }
    }
    
    // Now find the matching closing brackets
    let attempts = 0;
    while (bracketStack.length > 0 && attempts < 10000) { // Prevent infinite loop
      selection.modify("extend", "forward", "character");
      let currentChar = selection.toString().charAt(selection.toString().length - 1);
      
      switch (currentChar) {
        case "(":
          bracketStack.push("(");
          break;
        case ")":
          if (bracketStack[bracketStack.length - 1] === "(") {
            bracketStack.pop();
          } else {
            bracketStack.push(")"); // Unmatched closing bracket
          }
          break;
        case "{":
          bracketStack.push("{");
          break;
        case "}":
          if (bracketStack[bracketStack.length - 1] === "{") {
            bracketStack.pop();
          } else {
            bracketStack.push("}"); // Unmatched closing bracket
          }
          break;
        case "[":
          bracketStack.push("[");
          break;
        case "]":
          if (bracketStack[bracketStack.length - 1] === "[") {
            bracketStack.pop();
          } else {
            bracketStack.push("]"); // Unmatched closing bracket
          }
          break;
        case "":
          // End of document reached
          console.warn('Reached end of document while looking for closing brackets');
          bracketStack.length = 0; // Exit the loop
          break;
        default:
          // Continue for other characters
          break;
      }
      attempts++;
    }
    
    // Get the final selected text
    let finalText = selection.toString().trim();
    
    // Validate that we have a proper Flutter widget structure
    if (!finalText.includes('(') || !finalText.includes(')')) {
      console.warn('Selected text does not appear to be a valid Flutter widget');
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(finalText).then(() => {
      console.log('Widget copied to clipboard successfully');
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      try {
        let textArea = document.createElement('textarea');
        textArea.value = finalText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Widget copied using fallback method');
      } catch (fallbackErr) {
        console.error('Fallback copy method also failed:', fallbackErr);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error in snapSelectionToWidget:', error);
    return false;
  }
}

/**
 * Extract widget name from selected text for display purposes
 * @param {string} text - The selected widget text
 * @returns {string} - The widget name
 */
function extractWidgetName(text) {
  try {
    // Match widget name pattern (starts with capital letter, followed by letters/numbers)
    let match = text.match(/([A-Z][a-zA-Z0-9_]*)\s*\(/);
    return match ? match[1] : 'Widget';
  } catch (error) {
    console.error('Error extracting widget name:', error);
    return 'Widget';
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  try {
    if (request.command === "CATCH") {
      let success = snapSelectionToWidget();
      if (success) {
        let widgetName = extractWidgetName(request.widget || '');
        showSnackBar(widgetName);
        sendResponse({success: true, message: 'Widget copied successfully'});
      } else {
        sendResponse({success: false, message: 'Failed to copy widget'});
      }
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({success: false, message: 'Error occurred while copying widget'});
  }
  return true; // Indicates that response will be sent asynchronously
});

// Add keyboard shortcut support (Ctrl+Shift+C or Cmd+Shift+C)
document.addEventListener('keydown', function(event) {
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
    event.preventDefault();
    let selection = window.getSelection();
    if (selection.toString().trim()) {
      let success = snapSelectionToWidget();
      if (success) {
        let widgetName = extractWidgetName(selection.toString());
        showSnackBar(widgetName);
      }
    }
  }
});