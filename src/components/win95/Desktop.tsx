import React, { useState } from "react";
import { APPS, DESKTOP_LAYOUT } from "./apps/registry";
import { useWM } from "./wm";
import { useContextMenu } from "./ContextMenu";
import { useDesktopFiles, type DesktopFile } from "./desktopFiles";
import { PaintIcon, NotepadIcon, RecycleBinFullIcon } from "./Icons";

export const Desktop: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { open } = useWM();
  const { open: openMenu } = useContextMenu();
  const { files, remove, trash } = useDesktopFiles();
  const [selected, setSelected] = useState<string | null>(null);
  const [marquee, setMarquee] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const openFile = (file: DesktopFile) => {
    if (file.type === "image") {
      open({
        id: `image-viewer-${file.id}`,
        appId: "image-viewer",
        title: file.name,
        icon: <PaintIcon size={16} />,
        x: 120, y: 60, width: 560, height: 440,
        minWidth: 240, minHeight: 160,
        payload: { dataUrl: file.dataUrl, name: file.name },
      });
    } else {
      open({
        id: `notepad-${file.id}`,
        appId: "notepad",
        title: `${file.name} - Notepad`,
        icon: <NotepadIcon size={16} />,
        x: 120, y: 60, width: 520, height: 380,
        minWidth: 240, minHeight: 160,
        payload: { content: file.content ?? "", readOnly: false, fileId: file.id },
      });
    }
  };

  const launch = (appId: string) => {
    const app = APPS[appId];
    if (!app) return;
    const w = app.defaultSize.w;
    const h = app.defaultSize.h;
    open({
      id: appId,
      appId,
      title: app.title,
      icon: <app.Icon size={16} />,
      x: Math.max(20, Math.floor((window.innerWidth - w) / 2 + (Math.random() * 60 - 30))),
      y: Math.max(20, Math.floor((window.innerHeight - h) / 2 - 40)),
      width: w,
      height: h,
      minWidth: app.resizable === false ? w : 200,
      minHeight: app.resizable === false ? h : 160,
    });
  };

  const desktopMenu = [
    {
      kind: "item" as const,
      label: "Arrange Icons",
      submenu: [
        { kind: "item" as const, label: "by Name", disabled: true },
        { kind: "item" as const, label: "by Type", disabled: true },
        { kind: "item" as const, label: "by Size", disabled: true },
        { kind: "item" as const, label: "by Date", disabled: true },
        { kind: "sep" as const },
        { kind: "item" as const, label: "Auto Arrange", disabled: true },
      ],
    },
    { kind: "item" as const, label: "Line up Icons", disabled: true },
    { kind: "sep" as const },
    { kind: "item" as const, label: "Paste", disabled: true },
    { kind: "item" as const, label: "Paste Shortcut", disabled: true },
    { kind: "sep" as const },
    {
      kind: "item" as const,
      label: "New",
      submenu: [
        { kind: "item" as const, label: "Folder", disabled: true },
        { kind: "item" as const, label: "Shortcut", disabled: true },
      ],
    },
    { kind: "sep" as const },
    { kind: "item" as const, label: "Properties", onClick: () => launch("about") },
  ];

  return (
    <div
      className="absolute inset-0 bg-w95-teal overflow-hidden select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        setSelected(null);
        openMenu({ x: e.clientX, y: e.clientY }, desktopMenu);
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setSelected(null);
          setDragStart({ x: e.clientX, y: e.clientY });
        }
      }}
      onMouseMove={(e) => {
        if (!dragStart) return;
        const x = Math.min(dragStart.x, e.clientX);
        const y = Math.min(dragStart.y, e.clientY);
        const w = Math.abs(e.clientX - dragStart.x);
        const h = Math.abs(e.clientY - dragStart.y);
        setMarquee({ x, y, w, h });
      }}
      onMouseUp={() => {
        setDragStart(null);
        setMarquee(null);
      }}
    >
      {/* Icon grid */}
      <div className="absolute top-2 left-2 grid grid-cols-1 gap-1 content-start">
        {DESKTOP_LAYOUT.map((id) => {
          const app = APPS[id];
          if (!app || app.hideFromDesktop) return null;
          const isSel = selected === id;
          return (
            <button
              key={id}
              className="w-24 flex flex-col items-center px-1 py-1 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                if (selected === id) {
                  launch(id);
                } else {
                  setSelected(id);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelected(id);
                openMenu({ x: e.clientX, y: e.clientY }, [
                  { kind: "item", label: "Open", bold: true, onClick: () => launch(id) },
                  { kind: "sep" },
                  { kind: "item", label: "Cut", disabled: true },
                  { kind: "item", label: "Copy", disabled: true },
                  { kind: "sep" },
                  { kind: "item", label: "Create Shortcut", disabled: true },
                  { kind: "item", label: "Delete", disabled: true },
                  { kind: "item", label: "Rename", disabled: true },
                  { kind: "sep" },
                  { kind: "item", label: "Properties", onClick: () => launch(id) },
                ]);
              }}
            >
              <div className={isSel ? "opacity-70" : ""}>
                {id === "recycle-bin" && trash.length > 0 ? <RecycleBinFullIcon size={32} /> : <app.Icon size={32} />}
              </div>
              <div
                className={`mt-1 px-0.5 text-[11px] text-w95-text-on-navy text-center leading-tight max-w-full break-words desktop-icon-label ${isSel ? "desktop-icon-label-selected" : ""
                  }`}
              >
                {app.title.split(" - ")[0]}
              </div>
            </button>
          );
        })}
        {files.map((file) => {
          const isSel = selected === file.id;
          return (
            <button
              key={file.id}
              className="w-24 flex flex-col items-center px-1 py-1 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                if (selected === file.id) {
                  openFile(file);
                } else {
                  setSelected(file.id);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault(); e.stopPropagation(); setSelected(file.id);
                openMenu({ x: e.clientX, y: e.clientY }, [
                  { kind: "item", label: "Open", bold: true, onClick: () => openFile(file) },
                  { kind: "sep" },
                  { kind: "item", label: "Delete", onClick: () => remove(file.id) },
                ]);
              }}
            >
              <div className={isSel ? "opacity-70" : ""}>
                {file.type === "image" ? (
                  <div className="w-8 h-8 bevel-thin-out bg-w95-white flex items-center justify-center overflow-hidden">
                    <img src={file.dataUrl} alt={file.name} className="max-w-full max-h-full" style={{ imageRendering: "pixelated" }} />
                  </div>
                ) : (
                  <NotepadIcon size={32} />
                )}
              </div>
              <div className={`mt-1 px-0.5 text-[11px] text-w95-text-on-navy text-center leading-tight max-w-full break-words desktop-icon-label ${isSel ? "desktop-icon-label-selected" : ""}`}>
                {file.name}
              </div>
            </button>
          );
        })}
      </div>

      {marquee && (
        <div
          className="fixed border border-dotted border-w95-white pointer-events-none"
          style={{ left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h, mixBlendMode: "difference" }}
        />
      )}

      {children}
    </div>
  );
};
