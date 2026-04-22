import React from "react";
import { Rnd } from "react-rnd";

interface DialogProps {
  title: string;
  icon?: React.ReactNode;
  width?: number;
  onClose: () => void;
  children: React.ReactNode;
  buttons?: React.ReactNode;
}

let zCounter = 100000;

export const Dialog: React.FC<DialogProps> = ({ title, icon, width = 360, onClose, children, buttons }) => {
  const [z] = React.useState(() => ++zCounter);
  const [pos, setPos] = React.useState(() => ({
    x: Math.max(20, Math.floor(window.innerWidth / 2 - width / 2)),
    y: Math.max(40, Math.floor(window.innerHeight / 2 - 110)),
  }));

  return (
    <div className="fixed inset-0 z-[100000] pointer-events-none">
      <Rnd
        size={{ width, height: "auto" as any }}
        position={pos}
        onDragStop={(_, d) => setPos({ x: d.x, y: d.y })}
        enableResizing={false}
        dragHandleClassName="w95-dialog-handle"
        bounds="window"
        style={{ zIndex: z, position: "absolute", pointerEvents: "auto" }}
      >
        <div className="bevel-out bg-w95-silver">
          <div className="w95-dialog-handle w95-titlebar flex items-center justify-between m-0.5 px-1 py-0.5">
            <div className="flex items-center gap-1 text-w95-text-on-navy font-bold text-[11px]">
              {icon}
              <span>{title}</span>
            </div>
            <button
              aria-label="Close"
              className="bevel-out bg-w95-silver w-4 h-4 active:bevel-pressed flex items-center justify-center"
              onClick={onClose}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M1 1 L9 9 M9 1 L1 9" stroke="black" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
          <div className="px-3 py-3 text-[11px]">{children}</div>
          {buttons && <div className="flex justify-center gap-1 pb-3 pt-1">{buttons}</div>}
        </div>
      </Rnd>
    </div>
  );
};

export const DialogButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }
> = ({ primary, className = "", children, ...rest }) => (
  <button
    {...rest}
    className={`w95-button ${primary ? "ring-1 ring-w95-text" : ""} ${className}`}
    style={{ minWidth: 75 }}
  >
    {children}
  </button>
);
