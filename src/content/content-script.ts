console.log("DevLens content script loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message: ", message, sender);

  if (message.type === "GET_PAGE_INFO") {
    sendResponse({
      url: window.location.href,
      title: document.title,
      html: document.documentElement.outerHTML.length,
    });
  }

  return true;
});

chrome.runtime.sendMessage({
  type: "CONTENT_SCRIPT_READY",
});
