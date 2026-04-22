import React, { useState } from "react";
import { useDesktopFiles } from "../desktopFiles";
import { NotepadIcon, PaintIcon } from "../Icons";
import { useWM } from "../wm";
import { APPS } from "./registry";
import { useContextMenu } from "../ContextMenu";

export const RecycleBin: React.FC = () => {
  const { trash, restore, permanentlyDelete, emptyTrash } = useDesktopFiles();
  const [sel, setSel] = useState<string | null>(null);
  const { open: openMenu } = useContextMenu();
  const { open } = useWM();

  const openItem = (id: string) => {
    const item = trash.find((f) => f.id === id);
    if (!item) return;
    if (item.type === "image") {
      const app = APPS["image-viewer"];
      open({
        id: `image-viewer-trash-${item.id}`,
        appId: "image-viewer",
        title: `${item.name} (in Recycle Bin)`,
        icon: <PaintIcon size={16} />,
        x: 120, y: 80,
        width: app.defaultSize.w, height: app.defaultSize.h,
        payload: { dataUrl: item.dataUrl, name: item.name },
      });
    } else {
      const app = APPS["notepad"];
      open({
        id: `notepad-trash-${item.id}`,
        appId: "notepad",
        title: `${item.name} - Notepad`,
        icon: <NotepadIcon size={16} />,
        x: 120, y: 80,
        width: app.defaultSize.w, height: app.defaultSize.h,
        payload: { content: item.content, readOnly: true },
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-w95-silver text-[11px]">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray">
        {["File", "Edit", "View", "Help"].map((m) => (
          <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>
        ))}
      </div>
      <div className="flex gap-1 p-1 bevel-thin-out">
        <button className="w95-button px-2" onClick={emptyTrash} disabled={trash.length === 0}>
          Empty Recycle Bin
        </button>
        <button className="w95-button px-2" onClick={() => sel && restore(sel)} disabled={!sel}>
          Restore
        </button>
      </div>
      <div
        className="flex-1 bevel-in bg-white m-1 p-2 flex flex-wrap gap-1 content-start overflow-auto w95-scroll"
        onClick={() => setSel(null)}
      >
        {trash.length === 0 && (
          <div className="w-full text-w95-text-disabled text-center mt-8">
            The Recycle Bin is empty.
          </div>
        )}
        {trash.map((item) => {
          const isSel = sel === item.id;
          return (
            <button
              key={item.id}
              className="flex flex-col items-center p-1 focus:outline-none w-[75px]"
              onClick={(e) => {
                e.stopPropagation();
                if (sel === item.id) {
                  openItem(item.id);
                } else {
                  setSel(item.id);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault(); e.stopPropagation(); setSel(item.id);
                openMenu({ x: e.clientX, y: e.clientY }, [
                  { kind: "item", label: "Open", bold: true, onClick: () => openItem(item.id) },
                  { kind: "sep" },
                  { kind: "item", label: "Restore", onClick: () => restore(item.id) },
                  { kind: "item", label: "Delete", onClick: () => permanentlyDelete(item.id) },
                ]);
              }}
            >
              <div className={isSel ? "opacity-70" : ""}>
                {item.type === "image" ? (
                  <div className="w-8 h-8 bevel-thin-out bg-white flex items-center justify-center overflow-hidden">
                    <img src={item.dataUrl} alt={item.name} className="max-w-full max-h-full" style={{ imageRendering: "pixelated" }} />
                  </div>
                ) : (
                  <NotepadIcon size={32} />
                )}
              </div>
              <div className={`mt-1 px-0.5 text-center leading-tight ${isSel ? "bg-w95-navy text-w95-text-on-navy" : "text-w95-text"}`}>
                {item.name}
              </div>
            </button>
          );
        })}
      </div>
      <div className="bevel-thin-in px-2 py-0.5 flex justify-between">
        <span>{trash.length} object(s)</span>
        <span>{trash.length === 0 ? "" : "Right-click to restore"}</span>
      </div>
    </div>
  );
};
