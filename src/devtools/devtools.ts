chrome.devtools.panels.create("DevLens", "icons/icon48.png", "panel.html", (panel) => {
  console.log("DevLens Panel created");

  panel.onShown.addListener((window) => {
    console.log("DevLens panel shown", window);
  });

  panel.onHidden.addListener(() => {
    console.log("DevLens panel hidden");
  });
});
