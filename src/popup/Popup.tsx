import { Code2, ExternalLink } from "lucide-react";

const Popup = () => {
  const openDevTools = () => {
    alert('Please open Chrome DevTools (F12) and click on the "DevLens" tab');
  };

  return (
    <div className="w-80 bg-devtools-bg text-devtools-text">
      <div className="bg-devtools-panel p-4 border-b border-devtools-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-devtools-accent rounded flex items-center justify-center text-white font-bold">
            DL
          </div>
          <div>
            <h1 className="text-lg font-semibold">DevLens</h1>
            <p className="text-xs text-gray-400">v0.1.0</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Code2 size={16} className="text-devtools-accent" />
            Quick Start
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            Open Chrome DevTools (F12 or Right-click → Inspect) and look for the "DevLens" tab.
          </p>
          <button
            onClick={openDevTools}
            className="w-full bg-devtools-accent hover:bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={16} />
            Open DevTools
          </button>
        </div>
        <div className="text-xs text-gray-500 text-center pt-2">Made for developers</div>
      </div>
    </div>
  );
};

export default Popup;
