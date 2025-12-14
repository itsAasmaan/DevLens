import { Code2, ExternalLink } from "lucide-react";

const Popup = () => {
  const openDevTools = () => {
    alert('Please open Chrome DevTools (F12) and click on the "DevLens" tab');
  };

  return (
    <div className="w-80 bg-gray-800 text-gray-200 font-sans shadow-xl overflow-hidden">
      <div className="bg-gray-900 p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-600/50">
            DL
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">DevLens</h1>
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-6">
        <div>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2 border-b border-dashed border-gray-700 pb-1">
            <Code2 size={18} className="text-blue-400" />
            Quick Start
          </h2>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Open Chrome DevTools (F12 or Right-click → Inspect) and look for the "DevLens" tab for the main interface.
          </p>
          <button
            onClick={openDevTools}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-[0.99] focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <ExternalLink size={16} />
            Open DevTools
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center border-t border-gray-700 pt-4 mt-2">
          Made for web developers.
        </div>
      </div>
    </div>
  );
};

export default Popup;
