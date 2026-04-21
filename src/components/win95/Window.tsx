import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import { useWM, WindowState } from "./wm";

interface Props {
  win: WindowState;
  children: React.ReactNode;
  onMenuBar?: React.ReactNode;
  statusBar?: React.ReactNode;
  variant?: "default" | "menu" | "raw";
  resizable?: boolean;
}

const enableMap = {
  bottom: true,
  bottomLeft: true,
  bottomRight: true,
  left: true,
  right: true,
  top: true,
  topLeft: true,
  topRight: true,
};

const disableMap = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight: false,
};

export const Window: React.FC<Props> = ({ win, children, onMenuBar, statusBar, variant = "default", resizable = true }) => {
  const { focus, close, minimize, toggleMaximize, move, resize, activeId } = useWM();
  const isActive = activeId === win.id;
  const rndRef = useRef<Rnd>(null);

  if (win.minimized) return null;

  const viewport = { w: window.innerWidth, h: window.innerHeight };

  return (
    <Rnd
      ref={rndRef}
      size={{ width: win.width, height: win.height }}
      position={{ x: win.x, y: win.y }}
      minWidth={win.minWidth ?? 180}
      minHeight={win.minHeight ?? 120}
      dragHandleClassName="w95-drag-handle"
      cancel=".w95-no-drag"
      enableResizing={win.maximized || !resizable ? disableMap : enableMap}
      disableDragging={win.maximized}
      onDragStart={() => focus(win.id)}
      onDragStop={(_, d) => move(win.id, d.x, d.y)}
      onResizeStart={() => focus(win.id)}
      onResizeStop={(_, __, ref, ___, position) =>
        resize(win.id, position.x, position.y, ref.offsetWidth, ref.offsetHeight)
      }
      style={{ zIndex: win.zIndex, position: "absolute" }}
    >
      <div
        className="w-full h-full bevel-out bg-w95-silver flex flex-col"
        onMouseDown={() => focus(win.id)}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div
          className={`w95-drag-handle flex items-center justify-between px-0.5 py-0.5 m-0.5 ${
            isActive ? "w95-titlebar" : "w95-titlebar-inactive"
          }`}
          onDoubleClick={() => resizable && toggleMaximize(win.id, viewport)}
        >
          <div className="flex items-center gap-1 px-1 text-w95-text-on-navy font-bold text-[11px] truncate">
            {win.icon && <span className="shrink-0">{win.icon}</span>}
            <span className="truncate">{win.title}</span>
          </div>
          <div className="flex gap-0.5 w95-no-drag">
            <TitleButton onClick={() => minimize(win.id)} label="Minimize">
              <span className="block w-2 h-0.5 bg-w95-text mt-3 ml-0.5" />
            </TitleButton>
            {resizable && (
              <TitleButton onClick={() => toggleMaximize(win.id, viewport)} label="Maximize">
                {win.maximized ? (
                  <span className="block w-3 h-3 border-2 border-t-[3px] border-w95-text -mt-0.5 ml-0.5 relative">
                    <span className="absolute -top-1 -right-1 w-2 h-2 border-2 border-t-[3px] border-w95-text bg-w95-silver" />
                  </span>
                ) : (
                  <span className="block w-3 h-3 border border-w95-text border-t-2 ml-0.5" />
                )}
              </TitleButton>
            )}
            <TitleButton onClick={() => close(win.id)} label="Close" extraClass="ml-0.5">
              <svg width="10" height="10" viewBox="0 0 10 10" className="ml-0.5 mt-0.5">
                <path d="M1 1 L9 9 M9 1 L1 9" stroke="black" strokeWidth="1.5" />
              </svg>
            </TitleButton>
          </div>
        </div>

        {onMenuBar && (
          <div className="px-1 py-0.5 flex gap-2 text-[11px] border-b border-w95-gray bg-w95-silver">
            {onMenuBar}
          </div>
        )}

        <div className={`flex-1 m-0.5 mt-0 flex flex-col overflow-hidden ${
          variant === "default" ? "bevel-in bg-w95-white" : ""
        }`}>
          <div className="flex-1 overflow-auto w95-scroll">
            {children}
          </div>
        </div>

        {statusBar && (
          <div className="m-0.5 mt-0 bevel-thin-in px-1 py-0.5 text-[11px] flex gap-1 bg-w95-silver">
            {statusBar}
          </div>
        )}
      </div>
    </Rnd>
  );
};

const TitleButton: React.FC<{
  onClick: () => void;
  label: string;
  extraClass?: string;
  children: React.ReactNode;
}> = ({ onClick, label, extraClass = "", children }) => (
  <button
    aria-label={label}
    className={`bevel-out bg-w95-silver w-4 h-4 active:bevel-pressed flex items-center justify-center ${extraClass}`}
    onMouseDown={(e) => e.stopPropagation()}
    onClick={onClick}
  >
    {children}
  </button>
);

/** Simple menu bar item */
export const MenuBarItem: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) => (
  <button
    className="px-2 py-0.5 hover:bg-w95-navy hover:text-w95-text-on-navy"
    onClick={onClick}
  >
    <span className="underline">{label[0]}</span>
    {label.slice(1)}
  </button>
);
