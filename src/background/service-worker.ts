console.log("DevLens background service worker ready");

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("DevLens installed successfully!");

    chrome.storage.local.set({
      theme: "dark",
      version: "1.0.0",
      firstInstall: Date.now(),
      consoleEnabled: true,
    });
  } else if (details.reason === "update") {
    console.log("DevLens updated to version", chrome.runtime.getManifest().version);
  }
});

const devToolsConnections = new Map<number, chrome.runtime.Port>();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name.startsWith("devtools-")) {
    const tabId = parseInt(port.name.split("-")[1]);
    devToolsConnections.set(tabId, port);

    console.log(`DevTools connected for tab ${tabId}`);

    port.onDisconnect.addListener(() => {
      devToolsConnections.delete(tabId);
      console.log(`DevTools disconnected for tab ${tabId}`);
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);

  if (message.type === "GET_TAB_INFO") {
    if (sender.tab?.id) {
      sendResponse({
        tabId: sender.tab.id,
        url: sender.tab.url,
        title: sender.tab.title,
      });
    }
  }

  if (message.type === "CONSOLE_LOG_CAPTURED") {
    const tabId = sender.tab?.id;
    if (tabId && devToolsConnections.has(tabId)) {
      const port = devToolsConnections.get(tabId);
      port?.postMessage({
        type: "CONSOLE_LOG",
        payload: message.payload,
      });
    }
  }

  if (message.type === "DEVTOOLS_CONNECTED") {
    const tabId = message.tabId;
    console.log(`DevTools panel connected for tab ${tabId}`);
    sendResponse({ success: true });
  }
  return true;
});
