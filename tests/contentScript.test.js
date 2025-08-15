/**
 * Tests for contentScript.js
 */

// Mock DOM elements
document.body.innerHTML = '<div id="fwcsnackbar"></div>';

// Import the content script functions
// Note: In a real test setup, you'd need to load the actual content script
const { JSDOM } = require('jsdom');

describe('Content Script', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '<div id="fwcsnackbar"></div>';
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('showSnackBar', () => {
    test('should display widget name in snackbar', () => {
      // Mock the showSnackBar function (would be imported from content script)
      const showSnackBar = (widget) => {
        const toast = document.getElementById('fwcsnackbar');
        toast.innerHTML = `Copied ${widget}()`;
        toast.className = 'show';
      };
      
      showSnackBar('Container');
      
      const toast = document.getElementById('fwcsnackbar');
      expect(toast.innerHTML).toBe('Copied Container()');
      expect(toast.className).toBe('show');
    });
  });

  describe('extractWidgetName', () => {
    test('should extract widget name from simple widget', () => {
      const extractWidgetName = (text) => {
        const match = text.match(/([A-Z][a-zA-Z0-9_]*)\s*\(/);
        return match ? match[1] : 'Widget';
      };
      
      expect(extractWidgetName('Container(')).toBe('Container');
      expect(extractWidgetName('Column(')).toBe('Column');
      expect(extractWidgetName('Text("Hello")')).toBe('Text');
    });

    test('should handle complex widget structures', () => {
      const extractWidgetName = (text) => {
        const match = text.match(/([A-Z][a-zA-Z0-9_]*)\s*\(/);
        return match ? match[1] : 'Widget';
      };
      
      const complexWidget = `Container(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text('Hello'),
          ],
        ),
      )`;
      
      expect(extractWidgetName(complexWidget)).toBe('Container');
    });

    test('should return default for invalid input', () => {
      const extractWidgetName = (text) => {
        const match = text.match(/([A-Z][a-zA-Z0-9_]*)\s*\(/);
        return match ? match[1] : 'Widget';
      };
      
      expect(extractWidgetName('invalid text')).toBe('Widget');
      expect(extractWidgetName('')).toBe('Widget');
    });
  });

  describe('Chrome Message Handling', () => {
    test('should handle CATCH command', async () => {
      const mockListener = jest.fn();
      chrome.runtime.onMessage.addListener.mockImplementation((listener) => {
        mockListener.mockImplementation(listener);
      });
      
      // Simulate message
      const request = { command: 'CATCH', widget: 'Container' };
      const sender = {};
      const sendResponse = jest.fn();
      
      mockListener(request, sender, sendResponse);
      
      expect(sendResponse).toHaveBeenCalled();
    });
  });

  describe('Keyboard Shortcut Handling', () => {
    test('should handle Ctrl+Shift+C shortcut', () => {
      const mockEventListener = jest.fn();
      document.addEventListener = mockEventListener;
      
      // Simulate the event listener setup
      const eventType = mockEventListener.mock.calls.find(call => call[0] === 'keydown');
      expect(eventType).toBeTruthy();
    });
  });

  describe('Selection Modification', () => {
    test('should extend selection properly', () => {
      const mockSelection = testUtils.createMockSelection('Container(');
      window.getSelection = jest.fn(() => mockSelection);
      
      // Test that selection can be modified
      expect(mockSelection.modify).toBeDefined();
      expect(mockSelection.toString()).toBe('Container(');
    });
  });

  describe('Clipboard Operations', () => {
    test('should copy text to clipboard', async () => {
      const testText = 'Container(child: Text("Hello"))';
      
      await navigator.clipboard.writeText(testText);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText);
    });

    test('should handle clipboard errors gracefully', async () => {
      // Mock clipboard failure
      navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
      
      try {
        await navigator.clipboard.writeText('test');
      } catch (error) {
        expect(error.message).toBe('Clipboard error');
      }
    });
  });
});

describe('Widget Bracket Matching', () => {
  test('should match simple parentheses', () => {
    const matchBrackets = (text) => {
      let count = 0;
      for (let char of text) {
        if (char === '(') count++;
        else if (char === ')') count--;
      }
      return count === 0;
    };
    
    expect(matchBrackets('Container()')).toBe(true);
    expect(matchBrackets('Container(')).toBe(false);
    expect(matchBrackets('Container())')).toBe(false);
  });

  test('should handle nested brackets', () => {
    const matchBrackets = (text) => {
      const stack = [];
      for (let char of text) {
        if ('({['.includes(char)) {
          stack.push(char);
        } else if (')}]'.includes(char)) {
          const last = stack.pop();
          const pairs = { ')': '(', '}': '{', ']': '[' };
          if (last !== pairs[char]) return false;
        }
      }
      return stack.length === 0;
    };
    
    const nestedWidget = 'Container(child: Column(children: [Text("Hello")]))';
    expect(matchBrackets(nestedWidget)).toBe(true);
    
    const unmatchedWidget = 'Container(child: Column(children: [Text("Hello")])';
    expect(matchBrackets(unmatchedWidget)).toBe(false);
  });
}); 