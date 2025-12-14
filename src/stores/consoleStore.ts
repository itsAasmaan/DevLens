import { create } from "zustand";
import { LogEntry, LogLevel, ConsoleFilter, CommandHistoryEntry } from "@/types/console";

interface ConsoleState {
  logs: LogEntry[];
  filteredLogs: LogEntry[];
  filter: ConsoleFilter;
  commandHistory: CommandHistoryEntry[];
  historyIndex: number;

  addLog: (log: Omit<LogEntry, "id" | "timestamp">) => void;
  clearLogs: () => void;
  togglePinLog: (id: string) => void;
  setFilter: (filter: Partial<ConsoleFilter>) => void;
  applyFilters: () => void;
  addCommand: (command: CommandHistoryEntry) => void;
  setHistoryIndex: (index: number) => void;
  exportLogs: (format: "json" | "csv" | "txt") => string;
}

const useConsoleStore = create<ConsoleState>((set, get) => ({
  logs: [],
  filteredLogs: [],
  filter: {
    levels: new Set<LogLevel>(["log", "warn", "error", "info", "debug"]),
    searchText: "",
    useRegex: false,
    showOnlyPinned: false,
  },
  commandHistory: [],
  historyIndex: -1,

  addLog: (log) => {
    const newLog: LogEntry = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    set((state) => {
      const logs = [...state.logs, newLog];
      const trimmedLogs = logs.length > 1000 ? logs.slice(-1000) : logs;

      return { logs: trimmedLogs };
    });

    get().applyFilters();
  },

  clearLogs: () => {
    set({ logs: [], filteredLogs: [] });
  },

  togglePinLog: (id) => {
    set((state) => ({
      logs: state.logs.map((log) => (log.id === id ? { ...log, isPinned: !log.isPinned } : log)),
    }));
    get().applyFilters();
  },

  setFilter: (newFilter) => {
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { logs, filter } = get();

    let filtered = logs;
    if (filter.showOnlyPinned) {
      filtered = filtered.filter((log) => log.isPinned);
    }

    filtered = filtered.filter((log) => filter.levels.has(log.level));
    if (filter.searchText) {
      if (filter.useRegex) {
        try {
          const regex = new RegExp(filter.searchText, "i");
          filtered = filtered.filter((log) => regex.test(log.message));
        } catch (e) {
          const searchLower = filter.searchText.toLowerCase();
          filtered = filtered.filter((log) => log.message.toLowerCase().includes(searchLower));
        }
      } else {
        const searchLower = filter.searchText.toLowerCase();
        filtered = filtered.filter((log) => log.message.toLowerCase().includes(searchLower));
      }
    }

    set({ filteredLogs: filtered });
  },

  addCommand: (command) => {
    set((state) => ({
      commandHistory: [...state.commandHistory, command],
      historyIndex: -1,
    }));

    const { commandHistory } = get();
    chrome.storage.local.set({ commandHistory: commandHistory.slice(-50) }); // last 50
  },

  setHistoryIndex: (index) => {
    set({ historyIndex: index });
  },

  exportLogs: (format) => {
    const { filteredLogs } = get();

    if (format === "json") {
      return JSON.stringify(filteredLogs, null, 2);
    }

    if (format === "csv") {
      const headers = "Level,Message,Timestamp\n";
      const rows = filteredLogs
        .map((log) => {
          const timestamp = new Date(log.timestamp).toISOString();
          const message = log.message.replace(/"/g, '""');
          return `"${log.level}","${message}","${timestamp}"`;
        })
        .join("\n");
      return headers + rows;
    }

    if (format === "txt") {
      return filteredLogs
        .map((log) => {
          const timestamp = new Date(log.timestamp).toISOString();
          return `[${timestamp}] [${log.level.toUpperCase()}] ${log.message}`;
        })
        .join("\n");
    }

    return "";
  },
}));

chrome.storage.local.get(["commandHistory"], (result) => {
  if (result.commandHistory) {
    useConsoleStore.setState({ commandHistory: result.commandHistory as CommandHistoryEntry[] });
  }
});

export default useConsoleStore;
