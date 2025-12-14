import ConsoleCapture from "./consoleCapture";

console.log("DevLens content script loaded");

// Initialize console capture
const consoleCapture = new ConsoleCapture();
consoleCapture.start();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message, sender);

  if (message.type === "GET_PAGE_INFO") {
    sendResponse({
      url: window.location.href,
      title: document.title,
      html: document.documentElement.outerHTML.length,
    });
  }

  if (message.type === "STOP_CONSOLE_CAPTURE") {
    consoleCapture.stop();
    sendResponse({ success: true });
  }

  if (message.type === "START_CONSOLE_CAPTURE") {
    consoleCapture.start();
    sendResponse({ success: true });
  }

  return true;
});

chrome.runtime.sendMessage({
  type: "CONTENT_SCRIPT_READY",
  payload: {
    url: window.location.href,
    title: document.title,
  },
});
