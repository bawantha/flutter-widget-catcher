// Jest setup file

// Extend Jest matchers
expect.extend({
  toBeClipboardText(received, expected) {
    const pass = received === expected;
    return {
      message: () => `expected clipboard to ${pass ? 'not ' : ''}contain "${expected}"`,
      pass
    };
  }
});

// Global test utilities
global.testUtils = {
  // Create a mock selection with text
  createMockSelection: (text) => ({
    toString: () => text,
    rangeCount: 1,
    getRangeAt: () => ({
      cloneRange: () => ({})
    }),
    removeAllRanges: jest.fn(),
    addRange: jest.fn(),
    collapseToStart: jest.fn(),
    modify: jest.fn()
  }),
  
  // Wait for async operations
  wait: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock Chrome runtime message
  mockChromeMessage: (message, response = {}) => {
    const listeners = chrome.runtime.onMessage.addListener.mock.calls.map(call => call[0]);
    listeners.forEach(listener => {
      listener(message, {}, (resp) => {
        Object.assign(response, resp);
      });
    });
    return response;
  }
};

// Console error suppression for expected errors in tests
const originalConsoleError = console.error;
global.suppressConsoleError = () => {
  console.error = jest.fn();
};

global.restoreConsoleError = () => {
  console.error = originalConsoleError;
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  restoreConsoleError();
}); 