import React, { useEffect, useRef, useState, createContext, useContext } from "react";

type MenuItem =
  | { kind: "item"; label: string; icon?: React.ReactNode; onClick?: () => void; disabled?: boolean; bold?: boolean; shortcut?: string; submenu?: MenuItem[] }
  | { kind: "sep" };

interface CtxState {
  open: (e: { x: number; y: number }, items: MenuItem[]) => void;
  close: () => void;
}
const ContextMenuCtx = createContext<CtxState | null>(null);
export const useContextMenu = () => {
  const c = useContext(ContextMenuCtx);
  if (!c) throw new Error("ContextMenuProvider missing");
  return c;
};

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{ x: number; y: number; items: MenuItem[] } | null>(null);
  const close = () => setState(null);
  return (
    <ContextMenuCtx.Provider value={{ open: (p, items) => setState({ ...p, items }), close }}>
      {children}
      {state && <Menu x={state.x} y={state.y} items={state.items} onClose={close} />}
    </ContextMenuCtx.Provider>
  );
};

export const Menu: React.FC<{
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
  width?: number;
}> = ({ x, y, items, onClose, width = 180 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });
  const [submenu, setSubmenu] = useState<{ idx: number; rect: DOMRect } | null>(null);

  useEffect(() => {
    // Clamp to viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = ref.current?.offsetWidth ?? width;
    const h = ref.current?.offsetHeight ?? 200;
    setPos({
      x: Math.min(x, vw - w - 4),
      y: Math.min(y, vh - h - 32),
    });
  }, [x, y, width]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    setTimeout(() => {
      window.addEventListener("mousedown", onDown);
      window.addEventListener("keydown", onKey);
    }, 0);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="bevel-out bg-w95-silver fixed py-0.5 z-[10000] text-[11px]"
      style={{ left: pos.x, top: pos.y, minWidth: width }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((it, i) =>
        it.kind === "sep" ? (
          <div key={i} className="my-0.5 mx-1 border-t border-w95-gray border-b border-b-w95-white" />
        ) : (
          <div
            key={i}
            className={`flex items-center px-1 py-0.5 select-none ${
              it.disabled
                ? "text-w95-text-disabled"
                : "hover:bg-w95-navy hover:text-w95-text-on-navy cursor-default"
            } ${it.bold ? "font-bold" : ""}`}
            onMouseEnter={(e) => {
              if (it.submenu && !it.disabled) {
                setSubmenu({ idx: i, rect: (e.currentTarget as HTMLElement).getBoundingClientRect() });
              } else {
                setSubmenu(null);
              }
            }}
            onClick={() => {
              if (it.disabled) return;
              if (!it.submenu) {
                it.onClick?.();
                onClose();
              }
            }}
          >
            <div className="w-4 mr-1 flex items-center justify-center">{it.icon}</div>
            <div className="flex-1 whitespace-nowrap pr-4">{it.label}</div>
            {it.shortcut && <div className="ml-2 text-w95-text-disabled">{it.shortcut}</div>}
            {it.submenu && <div className="ml-2">▶</div>}
          </div>
        )
      )}
      {submenu && items[submenu.idx].kind === "item" && (items[submenu.idx] as any).submenu && (
        <Menu
          x={submenu.rect.right - 2}
          y={submenu.rect.top - 2}
          items={(items[submenu.idx] as any).submenu}
          onClose={onClose}
        />
      )}
    </div>
  );
};
