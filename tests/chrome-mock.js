// Mock Chrome APIs for testing

global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    onInstalled: {
      addListener: jest.fn()
    },
    onStartup: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn(),
    getManifest: jest.fn(() => ({
      name: 'Flutter Widget Catcher',
      version: '1.0.0',
      manifest_version: 3
    })),
    lastError: null
  },
  
  contextMenus: {
    create: jest.fn(),
    onClicked: {
      addListener: jest.fn()
    }
  },
  
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
    onUpdated: {
      addListener: jest.fn()
    }
  },
  
  action: {
    onClicked: {
      addListener: jest.fn()
    }
  },
  
  commands: {
    onCommand: {
      addListener: jest.fn()
    }
  },
  
  notifications: {
    create: jest.fn()
  },
  
  storage: {
    local: {
      get: jest.fn((keys, callback) => {
        if (typeof keys === 'function') {
          keys({});
        } else if (callback) {
          callback({});
        }
        return Promise.resolve({});
      }),
      set: jest.fn((data, callback) => {
        if (callback) callback();
        return Promise.resolve();
      })
    }
  }
};

// Mock DOM APIs
Object.defineProperty(window, 'getSelection', {
  writable: true,
  value: jest.fn(() => ({
    toString: jest.fn(() => 'Container('),
    rangeCount: 1,
    getRangeAt: jest.fn(() => ({
      cloneRange: jest.fn(() => ({}))
    })),
    removeAllRanges: jest.fn(),
    addRange: jest.fn(),
    collapseToStart: jest.fn(),
    modify: jest.fn()
  }))
});

Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: jest.fn(() => Promise.resolve())
  }
});

// Mock document.execCommand
document.execCommand = jest.fn(() => true); 