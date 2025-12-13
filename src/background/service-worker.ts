console.log("DevLens background service worker ready");

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("DevLens installed successfully!");

    chrome.storage.local.set({
      theme: "dark",
      version: "1.0.0",
      firstInstall: Date.now(),
    });
  } else if (details.reason === "update") {
    console.log("DevLens updated to version", chrome.runtime.getManifest().version);
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

  return true;
});
