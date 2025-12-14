import { LogLevel } from "@/types/console";

interface CapturedLog {
  level: LogLevel;
  message: string;
  args: any[];
  stackTrace?: string;
}

class ConsoleCapture {
  private originalConsole: {
    log: typeof console.log;
    warn: typeof console.warn;
    error: typeof console.error;
    info: typeof console.info;
    debug: typeof console.debug;
  };

  constructor() {
    this.originalConsole = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
      debug: console.debug.bind(console),
    };
  }

  /**
   * Start intercepting console methods
   */
  start() {
    this.interceptConsoleMethod("log");
    this.interceptConsoleMethod("warn");
    this.interceptConsoleMethod("error");
    this.interceptConsoleMethod("info");
    this.interceptConsoleMethod("debug");
  }

  /**
   * Intercept a specific console method
   */
  private interceptConsoleMethod(level: LogLevel) {
    const original = this.originalConsole[level];

    console[level] = (...args: any[]) => {
      // Call original console method first
      original(...args);

      // Capture the log
      const capturedLog = this.captureLog(level, args);

      // Send to DevTools panel
      this.sendToDevTools(capturedLog);
    };
  }

  /**
   * Capture log details
   */
  private captureLog(level: LogLevel, args: any[]): CapturedLog {
    // Format message
    const message = this.formatMessage(args);

    // Get stack trace
    const stackTrace = this.getStackTrace();

    // Serialize arguments (handle circular references)
    const serializedArgs = this.serializeArgs(args);

    return {
      level,
      message,
      args: serializedArgs,
      stackTrace,
    };
  }

  /**
   * Format console arguments into a readable message
   */
  private formatMessage(args: any[]): string {
    return args
      .map((arg) => {
        if (typeof arg === "string") {
          return arg;
        }
        if (arg === null) {
          return "null";
        }
        if (arg === undefined) {
          return "undefined";
        }
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return "[Circular Reference]";
          }
        }
        return String(arg);
      })
      .join(" ");
  }

  /**
   * Get stack trace for the console call
   */
  private getStackTrace(): string {
    try {
      const stack = new Error().stack;
      if (!stack) return "";

      // Remove first 3 lines (Error, this function, interceptConsoleMethod)
      const lines = stack.split("\n").slice(3);
      return lines.join("\n");
    } catch (e) {
      return "";
    }
  }

  /**
   * Serialize arguments (handle circular references)
   */
  private serializeArgs(args: any[]): any[] {
    return args.map((arg) => {
      try {
        JSON.stringify(arg);
        return arg;
      } catch (e) {
        // Handle circular references or non-serializable objects
        if (typeof arg === "object" && arg !== null) {
          return "[Object with circular reference]";
        }
        if (typeof arg === "function") {
          return `[Function: ${arg.name || "anonymous"}]`;
        }
        return String(arg);
      }
    });
  }

  /**
   * Send captured log to DevTools panel via background script
   */
  private sendToDevTools(log: CapturedLog) {
    try {
      chrome.runtime.sendMessage({
        type: "CONSOLE_LOG_CAPTURED",
        payload: log,
      });
    } catch (e) {
      // Extension context invalidated or not available
      console.error("Failed to send log to DevTools:", e);
    }
  }

  /**
   * Stop intercepting and restore original console methods
   */
  stop() {
    console.log = this.originalConsole.log;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
    console.info = this.originalConsole.info;
    console.debug = this.originalConsole.debug;
  }
}

export default ConsoleCapture;
