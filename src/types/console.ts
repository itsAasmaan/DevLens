export type LogLevel = "log" | "warn" | "error" | "info" | "debug";

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  args: any[];
  timestamp: number;
  stackTrace?: string;
  count?: number;
  isPinned?: boolean;
}

export interface ConsoleFilter {
  levels: Set<LogLevel>;
  searchText: string;
  useRegex: boolean;
  showOnlyPinned: boolean;
}

export interface CommandHistoryEntry {
  command: string;
  timestamp: number;
  result?: any;
  error?: string;
}
