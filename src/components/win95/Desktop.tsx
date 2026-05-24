import React, { useState, useEffect, useRef } from "react";
import { APPS, DESKTOP_LAYOUT } from "./apps/registry";
import { useWM } from "./wm";
import { useContextMenu } from "./ContextMenu";
import { useDesktopFiles, type DesktopFile } from "./desktopFiles";
import { PaintIcon, NotepadIcon, RecycleBinFullIcon } from "./Icons";
import { useDesktopIcons, getSnappedPosition } from "./desktopIcons";

export const Desktop: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { open } = useWM();
  const { open: openMenu } = useContextMenu();
  const { files, remove, trash } = useDesktopFiles();
  const { positions, setPosition, initializePositions, arrangeIcons } = useDesktopIcons();
  const [selected, setSelected] = useState<string | null>(null);
  const [marquee, setMarquee] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const startMousePos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  const activeDesktopApps = DESKTOP_LAYOUT.filter((id) => {
    const app = APPS[id];
    return app && !app.hideFromDesktop;
  });

  const allIds = [
    ...activeDesktopApps,
    ...files.map((f) => f.id),
  ];

  useEffect(() => {
    initializePositions(allIds);
  }, [allIds.length]);

  useEffect(() => {
    if (!draggingId) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startMousePos.current.x;
      const dy = e.clientY - startMousePos.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasDragged.current = true;
      }

      const nextX = e.clientX - dragOffset.current.x;
      const nextY = e.clientY - dragOffset.current.y;
      setPosition(draggingId, nextX, nextY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const finalX = e.clientX - dragOffset.current.x;
      const finalY = e.clientY - dragOffset.current.y;
      const snapped = getSnappedPosition(finalX, finalY, window.innerWidth, window.innerHeight);
      setPosition(draggingId, snapped.x, snapped.y);
      setDraggingId(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId, setPosition]);

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
        {
          kind: "item" as const,
          label: "by Name",
          onClick: () => {
            const sortedIds = [
              ...activeDesktopApps,
              ...[...files].sort((a, b) => a.name.localeCompare(b.name)).map((f) => f.id),
            ];
            arrangeIcons(sortedIds);
          },
        },
        {
          kind: "item" as const,
          label: "by Type",
          onClick: () => {
            const sortedIds = [
              ...activeDesktopApps,
              ...[...files].sort((a, b) => a.type.localeCompare(b.type)).map((f) => f.id),
            ];
            arrangeIcons(sortedIds);
          },
        },
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
      {/* Desktop Icons */}
      <div>
        {activeDesktopApps.map((id) => {
          const app = APPS[id];
          if (!app || app.hideFromDesktop) return null;
          const isSel = selected === id;
          const pos = positions[id] || { x: 10, y: 10 };
          return (
            <button
              key={id}
              className="w-24 flex flex-col items-center px-1 py-1 focus:outline-none"
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
              }}
              onMouseDown={(e) => {
                if (e.button !== 0) return;
                e.stopPropagation();
                setSelected(id);
                dragOffset.current = {
                  x: e.clientX - pos.x,
                  y: e.clientY - pos.y,
                };
                startMousePos.current = { x: e.clientX, y: e.clientY };
                setDraggingId(id);
                hasDragged.current = false;
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (hasDragged.current) return;
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
          const pos = positions[file.id] || { x: 10, y: 10 };
          return (
            <button
              key={file.id}
              className="w-24 flex flex-col items-center px-1 py-1 focus:outline-none"
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
              }}
              onMouseDown={(e) => {
                if (e.button !== 0) return;
                e.stopPropagation();
                setSelected(file.id);
                dragOffset.current = {
                  x: e.clientX - pos.x,
                  y: e.clientY - pos.y,
                };
                startMousePos.current = { x: e.clientX, y: e.clientY };
                setDraggingId(file.id);
                hasDragged.current = false;
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (hasDragged.current) return;
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
