import { create } from "zustand";

export interface IconPosition {
  x: number;
  y: number;
}

interface DesktopIconsState {
  positions: Record<string, IconPosition>;
  setPosition: (id: string, x: number, y: number) => void;
  arrangeIcons: (allIds: string[]) => void;
  initializePositions: (allIds: string[]) => void;
}

const STORAGE_KEY = "w95-desktop-icon-positions";

const loadPositions = (): Record<string, IconPosition> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const persistPositions = (positions: Record<string, IconPosition>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    //quota exceeded or storage disabled
  }
};

export const GRID_WIDTH = 96;
export const GRID_HEIGHT = 80;
export const PADDING_X = 10;
export const PADDING_Y = 10;

export const getSnappedPosition = (x: number, y: number, screenWidth: number, screenHeight: number) => {
  const col = Math.round((x - PADDING_X) / GRID_WIDTH);
  const row = Math.round((y - PADDING_Y) / GRID_HEIGHT);

  const maxCols = Math.max(1, Math.floor((screenWidth - PADDING_X) / GRID_WIDTH));
  const maxRows = Math.max(1, Math.floor((screenHeight - 28 - PADDING_Y) / GRID_HEIGHT)); // 28px taskbar

  const clampedCol = Math.max(0, Math.min(col, maxCols - 1));
  const clampedRow = Math.max(0, Math.min(row, maxRows - 1));

  return {
    x: PADDING_X + clampedCol * GRID_WIDTH,
    y: PADDING_Y + clampedRow * GRID_HEIGHT,
  };
};

export const calculateDefaultPositions = (allIds: string[], screenWidth: number, screenHeight: number): Record<string, IconPosition> => {
  const nextPositions: Record<string, IconPosition> = {};
  const maxRows = Math.max(1, Math.floor((screenHeight - 28 - PADDING_Y) / GRID_HEIGHT));

  allIds.forEach((id, idx) => {
    const col = Math.floor(idx / maxRows);
    const row = idx % maxRows;
    nextPositions[id] = {
      x: PADDING_X + col * GRID_WIDTH,
      y: PADDING_Y + row * GRID_HEIGHT,
    };
  });

  return nextPositions;
};

export const useDesktopIcons = create<DesktopIconsState>((set, get) => ({
  positions: loadPositions(),

  setPosition: (id, x, y) => {
    const current = get().positions;
    const next = { ...current, [id]: { x, y } };
    persistPositions(next);
    set({ positions: next });
  },

  arrangeIcons: (allIds) => {
    const sw = window.innerWidth;
    const sh = window.innerHeight;
    const next = calculateDefaultPositions(allIds, sw, sh);
    persistPositions(next);
    set({ positions: next });
  },

  initializePositions: (allIds) => {
    const current = get().positions;
    let updated = false;
    const next = { ...current };

    const sw = window.innerWidth;
    const sh = window.innerHeight;

    allIds.forEach((id, idx) => {
      if (!next[id]) {
        const maxRows = Math.max(1, Math.floor((sh - 28 - PADDING_Y) / GRID_HEIGHT));
        let gridIdx = idx;
        let placed = false;

        while (!placed) {
          const col = Math.floor(gridIdx / maxRows);
          const row = gridIdx % maxRows;
          const candidateX = PADDING_X + col * GRID_WIDTH;
          const candidateY = PADDING_Y + row * GRID_HEIGHT;

          const isOccupied = Object.values(next).some(
            (pos) => pos.x === candidateX && pos.y === candidateY
          );

          if (!isOccupied) {
            next[id] = { x: candidateX, y: candidateY };
            placed = true;
          } else {
            gridIdx++;
          }
        }
        updated = true;
      }
    });

    if (updated) {
      persistPositions(next);
      set({ positions: next });
    }
  },
}));
