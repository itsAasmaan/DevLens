import { useState } from "react";
import { Activity, Database, Network, Terminal, Settings } from "lucide-react";

const Panel = () => {
  const [activeTab, setActiveTab] = useState("console");

  const tabs = [
    { id: "console", label: "Console", icon: Terminal },
    { id: "network", label: "Network", icon: Network },
    { id: "storage", label: "Storage", icon: Database },
    { id: "performance", label: "Performance", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col bg-devtools-bg text-devtools-text">
      <div className="bg-devtools-panel border-b border-devtools-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-devtools-accent rounded flex items-center justify-center text-white font-bold">
            DL
          </div>
          <div>
            <h1 className="text-lg font-semibold">DevLens</h1>
            <p className="text-xs text-gray-400">Chrome DevTools Enhancement</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-devtools-panel border-b border-devtools-border">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-devtools-accent text-devtools-accent bg-devtools-bg"
                      : "border-transparent text-gray-400 hover:text-devtools-text hover:bg-devtools-bg"
                  }
                `}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab-content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === "console" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-devtools-accent">Console Enhancement</h2>
              <div className="bg-devtools-panel rounded-lg p-6 border border-devtools-border">
                <p className="text-gray-300 mb-4">
                  Welcome to DevLens! This panel will enhance your Chrome DevTools experience.
                </p>
              </div>
            </div>
          )}

          {activeTab === "network" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-devtools-accent">Network Monitor</h2>
              <div className="bg-devtools-panel rounded-lg p-6 border border-devtools-border">
                <p className="text-gray-400">Network monitoring features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === "storage" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-devtools-accent">Storage Manager</h2>
              <div className="bg-devtools-panel rounded-lg p-6 border border-devtools-border">
                <p className="text-gray-400">Storage management features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-devtools-accent">Performance Monitor</h2>
              <div className="bg-devtools-panel rounded-lg p-6 border border-devtools-border">
                <p className="text-gray-400">Performance monitoring features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-devtools-accent">Settings</h2>
              <div className="bg-devtools-panel rounded-lg p-6 border border-devtools-border">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About DevLens</h3>
                    <p className="text-sm text-gray-400">Version: 1.0.0</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Coming Soon</h3>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Theme customization</li>
                      <li>• Keyboard shortcuts</li>
                      <li>• Export/import settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel;
