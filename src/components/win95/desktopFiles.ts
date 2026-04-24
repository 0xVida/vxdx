import { create } from "zustand";

export type DesktopFileType = "image" | "text";

export interface DesktopFile {
  id: string;
  name: string;
  type: DesktopFileType;
  dataUrl?: string;   // for images
  content?: string;   // for text
  createdAt: number;
  deletedAt?: number;
}

interface DesktopFilesState {
  files: DesktopFile[];
  trash: DesktopFile[];
  addImage: (dataUrl: string, baseName?: string) => DesktopFile;
  addText: (content: string, baseName?: string) => DesktopFile;
  remove: (id: string) => void;       // soft-delete -> trash
  restore: (id: string) => void;
  emptyTrash: () => void;
  permanentlyDelete: (id: string) => void;
}

const STORAGE_KEY = "w95-desktop-files";
const TRASH_KEY = "w95-recycle-bin";

const load = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persist = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
};

const uniqueName = (existing: DesktopFile[], base: string, ext: string) => {
  let name = `${base}.${ext}`;
  let i = 1;
  while (existing.some((f) => f.name === name)) { name = `${base}${i}.${ext}`; i++; }
  return name;
};

export const useDesktopFiles = create<DesktopFilesState>((set, get) => ({
  files: load<DesktopFile>(STORAGE_KEY),
  trash: load<DesktopFile>(TRASH_KEY),

  addImage: (dataUrl, baseName = "untitled") => {
    const files = get().files;
    const file: DesktopFile = {
      id: `df-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: uniqueName(files, baseName, "png"),
      type: "image",
      dataUrl,
      createdAt: Date.now(),
    };
    const next = [...files, file];
    persist(STORAGE_KEY, next);
    set({ files: next });
    return file;
  },

  addText: (content, baseName = "Untitled") => {
    const files = get().files;
    const file: DesktopFile = {
      id: `df-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: uniqueName(files, baseName, "txt"),
      type: "text",
      content,
      createdAt: Date.now(),
    };
    const next = [...files, file];
    persist(STORAGE_KEY, next);
    set({ files: next });
    return file;
  },

  remove: (id) => {
    const target = get().files.find((f) => f.id === id);
    if (!target) return;
    const nextFiles = get().files.filter((f) => f.id !== id);
    const nextTrash = [...get().trash, { ...target, deletedAt: Date.now() }];
    persist(STORAGE_KEY, nextFiles);
    persist(TRASH_KEY, nextTrash);
    set({ files: nextFiles, trash: nextTrash });
  },

  restore: (id) => {
    const target = get().trash.find((f) => f.id === id);
    if (!target) return;
    const restored: DesktopFile = { ...target, deletedAt: undefined };
    const nextTrash = get().trash.filter((f) => f.id !== id);
    const nextFiles = [...get().files, restored];
    persist(TRASH_KEY, nextTrash);
    persist(STORAGE_KEY, nextFiles);
    set({ files: nextFiles, trash: nextTrash });
  },

  permanentlyDelete: (id) => {
    const next = get().trash.filter((f) => f.id !== id);
    persist(TRASH_KEY, next);
    set({ trash: next });
  },

  emptyTrash: () => {
    persist(TRASH_KEY, []);
    set({ trash: [] });
  },
}));
