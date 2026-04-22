import { create } from "zustand";

export type WindowId = string;

export interface WindowState {
  id: WindowId;
  appId: string;
  title: string;
  icon?: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; width: number; height: number };
  payload?: any;
}

interface WMState {
  windows: WindowState[];
  zCounter: number;
  activeId: WindowId | null;
  open: (w: Omit<WindowState, "zIndex" | "minimized" | "maximized">) => void;
  close: (id: WindowId) => void;
  focus: (id: WindowId) => void;
  minimize: (id: WindowId) => void;
  toggleMaximize: (id: WindowId, viewport: { w: number; h: number }) => void;
  restore: (id: WindowId) => void;
  move: (id: WindowId, x: number, y: number) => void;
  resize: (id: WindowId, x: number, y: number, width: number, height: number) => void;
}

export const useWM = create<WMState>((set, get) => ({
  windows: [],
  zCounter: 10,
  activeId: null,
  open: (w) => {
    // Only dedupe when caller reuses the same window id (e.g. singleton apps).
    // Otherwise allow multiple instances — Win95 lets you open many Notepads.
    const existing = get().windows.find((x) => x.id === w.id);
    if (existing) {
      get().focus(existing.id);
      if (existing.minimized) {
        set((s) => ({
          windows: s.windows.map((x) => (x.id === existing.id ? { ...x, minimized: false } : x)),
        }));
      }
      return;
    }
    const z = get().zCounter + 1;
    set((s) => ({
      zCounter: z,
      activeId: w.id,
      windows: [...s.windows, { ...w, zIndex: z, minimized: false, maximized: false }],
    }));
  },
  close: (id) =>
    set((s) => ({
      windows: s.windows.filter((w) => w.id !== id),
      activeId: s.activeId === id ? null : s.activeId,
    })),
  focus: (id) => {
    const z = get().zCounter + 1;
    set((s) => ({
      zCounter: z,
      activeId: id,
      windows: s.windows.map((w) => (w.id === id ? { ...w, zIndex: z, minimized: false } : w)),
    }));
  },
  minimize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
      activeId: s.activeId === id ? null : s.activeId,
    })),
  toggleMaximize: (id, viewport) =>
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized && w.prev) {
          return { ...w, ...w.prev, maximized: false, prev: undefined };
        }
        return {
          ...w,
          prev: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: viewport.w,
          height: viewport.h - 28, // taskbar
          maximized: true,
        };
      }),
    })),
  restore: (id) => get().focus(id),
  move: (id, x, y) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),
  resize: (id, x, y, width, height) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y, width, height } : w)),
    })),
}));
