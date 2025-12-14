class DevToolsConnection {
  private port: chrome.runtime.Port | null = null;
  private tabId: number;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.tabId = chrome.devtools.inspectedWindow.tabId;
    this.connect();
  }

  /**
   * Establish connection with background script
   */
  private connect() {
    this.port = chrome.runtime.connect({
      name: `devtools-${this.tabId}`,
    });

    // Listen for messages from background
    this.port.onMessage.addListener((message) => {
      this.handleMessage(message);
    });

    // Handle disconnection
    this.port.onDisconnect.addListener(() => {
      console.log("DevTools port disconnected");
      this.port = null;

      // Try to reconnect after a delay
      setTimeout(() => this.connect(), 1000);
    });

    // Notify background that DevTools is connected
    chrome.runtime.sendMessage({
      type: "DEVTOOLS_CONNECTED",
      tabId: this.tabId,
    });

    console.log(`DevTools connection established for tab ${this.tabId}`);
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: any) {
    const { type, payload } = message;

    // Notify all listeners for this message type
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach((callback) => callback(payload));
    }
  }

  /**
   * Register a listener for a specific message type
   */
  on(type: string, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Send a message to the background script
   */
  send(message: any) {
    if (this.port) {
      this.port.postMessage(message);
    } else {
      console.error("DevTools port not connected");
    }
  }

  /**
   * Execute code in the inspected page context
   */
  executeInPage(code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval(code, (result, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Get current tab ID
   */
  getTabId(): number {
    return this.tabId;
  }
}

export const devToolsConnection = new DevToolsConnection();
export default devToolsConnection;
