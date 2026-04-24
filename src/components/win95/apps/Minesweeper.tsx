import React, { useEffect, useMemo, useRef, useState } from "react";

type CellState = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adj: number;
};

const ROWS = 9;
const COLS = 9;
const MINES = 10;

function makeBoard(safeR: number, safeC: number): CellState[][] {
  const board: CellState[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 }))
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (board[r][c].mine) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    board[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) n++;
        }
      board[r][c].adj = n;
    }
  }
  return board;
}

const NUM_COLORS = ["", "#0000FF", "#008000", "#FF0000", "#000080", "#800000", "#008080", "#000000", "#808080"];

export const Minesweeper: React.FC = () => {
  const [board, setBoard] = useState<CellState[][] | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [time, setTime] = useState(0);
  const [pressed, setPressed] = useState(false);
  const timer = useRef<number | null>(null);

  const flags = useMemo(() => board?.flat().filter((c) => c.flagged).length ?? 0, [board]);

  useEffect(() => {
    if (status === "playing") {
      timer.current = window.setInterval(() => setTime((t) => t + 1), 1000);
    } else if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [status]);

  const reset = () => {
    setBoard(null);
    setStatus("idle");
    setTime(0);
    setPressed(false);
  };

  const reveal = (r: number, c: number) => {
    if (status === "won" || status === "lost") return;
    let b = board;
    if (!b) {
      b = makeBoard(r, c);
      setStatus("playing");
    }
    const next = b.map((row) => row.map((cell) => ({ ...cell })));
    if (next[r][c].flagged || next[r][c].revealed) return;
    if (next[r][c].mine) {
      next.forEach((row) => row.forEach((cell) => (cell.revealed = cell.revealed || cell.mine)));
      setBoard(next);
      setStatus("lost");
      return;
    }
    const stack = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop()!;
      if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue;
      const cell = next[cr][cc];
      if (cell.revealed || cell.flagged || cell.mine) continue;
      cell.revealed = true;
      if (cell.adj === 0) {
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) if (dr || dc) stack.push([cr + dr, cc + dc]);
      }
    }
    setBoard(next);
    const safeLeft = next.flat().filter((cell) => !cell.mine && !cell.revealed).length;
    if (safeLeft === 0) setStatus("won");
  };

  const toggleFlag = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!board || status === "won" || status === "lost") return;
    const next = board.map((row) => row.map((cell) => ({ ...cell })));
    if (!next[r][c].revealed) next[r][c].flagged = !next[r][c].flagged;
    setBoard(next);
  };

  const display = board ?? Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 }))
  );

  const minesLeft = MINES - flags;

  return (
    <div className="bg-[#c0c0c0] flex flex-col h-full overflow-hidden w-[154px]">
      <div className="w-full flex gap-3 px-2 py-0.5 border-b border-w95-gray text-[11px] mb-1">
        {["Game", "Help"].map(m => (
          <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>
        ))}
      </div>
      <div className="flex-1 p-1 bg-[#c0c0c0] flex flex-col items-center w-full">
        <div className="inline-block p-1 bg-[#c0c0c0] border-[3px] border-l-white border-t-white border-r-w95-gray border-b-w95-gray">
          <div className="flex justify-between items-center bg-[#c0c0c0] border-r-[3px] border-b-[3px] border-white border-l-w95-gray border-t-w95-gray px-1.5 py-1.5 mb-1.5 h-10 w-full">
            <LcdCounter value={Math.max(-99, Math.min(999, minesLeft))} />
            <button
              className="w-7 h-7 flex items-center justify-center bg-[#c0c0c0] bevel-out active:bevel-pressed focus:outline-none"
              onClick={reset}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              onMouseLeave={() => setPressed(false)}
            >
              <Smiley status={pressed ? "scared" : status} />
            </button>
            <LcdCounter value={Math.min(999, time)} />
          </div>

          <div
            className="border-r-[3px] border-b-[3px] border-white border-l-w95-gray border-t-w95-gray"
            onMouseDown={() => status === "playing" && setPressed(true)}
            onMouseUp={() => setPressed(false)}
          >
            {display.map((row, r) => (
              <div key={r} className="flex">
                {row.map((cell, c) => (
                  <Cell
                    key={c}
                    cell={cell}
                    onClick={() => reveal(r, c)}
                    onContextMenu={(e) => toggleFlag(r, c, e)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Smiley: React.FC<{ status: "idle" | "playing" | "won" | "lost" | "scared" }> = ({ status }) => {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" className="select-none pointer-events-none">
      <circle cx="8.5" cy="8.5" r="7.5" fill="yellow" stroke="black" strokeWidth="0.5" />
      {status === "lost" ? (
        <>
          <path d="M6 6 L8 8 M8 6 L6 8" stroke="black" strokeWidth="0.8" />
          <path d="M10 6 L12 8 M12 6 L10 8" stroke="black" strokeWidth="0.8" />
          <path d="M6 12 Q8.5 9 11 12" fill="none" stroke="black" strokeWidth="0.8" />
        </>
      ) : status === "won" ? (
        <>
          <rect x="4.5" y="6" width="3" height="1.5" fill="black" />
          <rect x="9.5" y="6" width="3" height="1.5" fill="black" />
          <path d="M5 11 Q8.5 14 12 11" fill="none" stroke="black" strokeWidth="1" />
        </>
      ) : status === "scared" ? (
        <>
          <circle cx="6" cy="7" r="1.5" fill="black" />
          <circle cx="11" cy="7" r="1.5" fill="black" />
          <circle cx="8.5" cy="12" r="1.5" fill="none" stroke="black" strokeWidth="1" />
        </>
      ) : (
        <>
          <rect x="5.5" y="6.5" width="1.5" height="1.5" fill="black" />
          <rect x="10.5" y="6.5" width="1.5" height="1.5" fill="black" />
          <path d="M5.5 11 Q8.5 14 11.5 11" fill="none" stroke="black" strokeWidth="1" />
        </>
      )}
    </svg>
  );
};

const LcdCounter: React.FC<{ value: number }> = ({ value }) => {
  const str = Math.abs(value).toString().padStart(3, "0").slice(-3);
  const isNeg = value < 0;

  return (
    <div className="bg-black flex p-[1px] gap-[1px]">
      {isNeg ? <Digit segment="-" /> : <Digit value={parseInt(str[0])} />}
      <Digit value={parseInt(str[1])} />
      <Digit value={parseInt(str[2])} />
    </div>
  );
};

const Digit: React.FC<{ value?: number; segment?: "-" }> = ({ value, segment }) => {
  // Simple SVG segments for a 7-segment display
  const segments = [
    [1, 1, 1, 1, 1, 1, 0], // 0
    [0, 1, 1, 0, 0, 0, 0], // 1
    [1, 1, 0, 1, 1, 0, 1], // 2
    [1, 1, 1, 1, 0, 0, 1], // 3
    [0, 1, 1, 0, 0, 1, 1], // 4
    [1, 0, 1, 1, 0, 1, 1], // 5
    [1, 0, 1, 1, 1, 1, 1], // 6
    [1, 1, 1, 0, 0, 0, 0], // 7
    [1, 1, 1, 1, 1, 1, 1], // 8
    [1, 1, 1, 1, 0, 1, 1], // 9
  ];
  const active = segment === "-" ? [0, 0, 0, 0, 0, 0, 1] : segments[value ?? 0];

  return (
    <svg width="13" height="23" viewBox="0 0 13 23">
      <defs>
        <path id="h" d="M2.5 1 L10.5 1 L11.5 2 L10.5 3 L2.5 3 L1.5 2 Z" />
        <path id="v" d="M1 2.5 L1 10.5 L2 11.5 L3 10.5 L3 2.5 L2 1.5 Z" />
      </defs>
      <use href="#h" fill={active[0] ? "red" : "#300"} /> {/* top */}
      <use href="#v" x="9" fill={active[1] ? "red" : "#300"} /> {/* tr */}
      <use href="#v" x="9" y="9" fill={active[2] ? "red" : "#300"} /> {/* br */}
      <use href="#h" y="18" fill={active[3] ? "red" : "#300"} /> {/* bot */}
      <use href="#v" y="9" fill={active[4] ? "red" : "#300"} /> {/* bl */}
      <use href="#v" fill={active[5] ? "red" : "#300"} /> {/* tl */}
      <use href="#h" y="9" fill={active[6] ? "red" : "#300"} /> {/* mid */}
    </svg>
  );
};

const Cell: React.FC<{
  cell: CellState;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}> = ({ cell, onClick, onContextMenu }) => {
  const base = "w-4 h-4 flex items-center justify-center select-none shrink-0";

  if (cell.revealed) {
    return (
      <div className={`${base} border border-w95-gray bg-[#c0c0c0]`} onContextMenu={onContextMenu}>
        {cell.mine ? (
          <MineIcon />
        ) : cell.adj > 0 ? (
          <span className="text-[12px] font-bold font-mono" style={{ color: NUM_COLORS[cell.adj] }}>
            {cell.adj}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <button
      className={`${base} bg-[#c0c0c0] bevel-out active:border active:border-w95-gray active:bg-[#c0c0c0] focus:outline-none`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {cell.flagged ? <FlagIcon /> : null}
    </button>
  );
};

const FlagIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10">
    <rect x="2" y="2" width="1" height="6" fill="black" />
    <path d="M3 2 L8 4.5 L3 7 Z" fill="red" />
    <rect x="1" y="8" width="4" height="1" fill="black" />
  </svg>
);

const MineIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12">
    <circle cx="6" cy="6" r="3.5" fill="black" />
    <path d="M6 1 L6 11 M1 6 L11 6 M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5" stroke="black" strokeWidth="1" />
    <rect x="4.5" y="4.5" width="1.5" height="1.5" fill="white" opacity="0.6" />
  </svg>
);
