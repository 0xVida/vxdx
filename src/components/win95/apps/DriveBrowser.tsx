import React, { useState } from "react";
import { useContextMenu } from "../ContextMenu";
import { FolderIcon, NotepadIcon, MyComputerIcon } from "../Icons";
import { useWM } from "../wm";
import { APPS } from "./registry";

interface FsEntry {
  name: string;
  type: "folder" | "file";
  Icon: React.FC<{ size?: number }>;
  appId?: string;
  payload?: any;
  title?: string;
}

const TREE: Record<string, FsEntry[]> = {
  "C:\\": [
    { name: "Windows", type: "folder", Icon: FolderIcon },
    { name: "Program Files", type: "folder", Icon: FolderIcon },
    { name: "My Documents", type: "folder", Icon: FolderIcon, appId: "documents", title: "My Documents" },
    { name: "Autoexec.bat", type: "file", Icon: NotepadIcon, appId: "notepad", title: "Autoexec.bat - Notepad",
      payload: { readOnly: true, content: `@ECHO OFF\nPROMPT $p$g\nPATH C:\\WINDOWS;C:\\WINDOWS\\COMMAND\nSET TEMP=C:\\WINDOWS\\TEMP\n` } },
    { name: "Config.sys", type: "file", Icon: NotepadIcon, appId: "notepad", title: "Config.sys - Notepad",
      payload: { readOnly: true, content: `DEVICE=C:\\WINDOWS\\HIMEM.SYS\nDEVICE=C:\\WINDOWS\\EMM386.EXE NOEMS\nDOS=HIGH,UMB\nFILES=40\nBUFFERS=20\n` } },
  ],
  "C:\\Windows": [
    { name: "System", type: "folder", Icon: FolderIcon },
    { name: "Desktop", type: "folder", Icon: FolderIcon },
    { name: "Win.ini", type: "file", Icon: NotepadIcon, appId: "notepad", title: "Win.ini - Notepad",
      payload: { readOnly: true, content: "[windows]\nload=\nrun=\n" } },
    { name: "Notepad.exe", type: "file", Icon: NotepadIcon, appId: "notepad", title: "Untitled - Notepad" },
  ],
  "C:\\Program Files": [
    { name: "Accessories", type: "folder", Icon: FolderIcon },
    { name: "Internet Explorer", type: "folder", Icon: FolderIcon, appId: "ie", title: "Internet Explorer" },
  ],
};

export const DriveBrowser: React.FC<{ payload?: { drive?: string } }> = ({ payload }) => {
  const [path, setPath] = useState(payload?.drive || "C:\\");
  const [sel, setSel] = useState<string | null>(null);
  const { open } = useWM();
  const { open: openMenu } = useContextMenu();
  const entries = TREE[path] || [];

  const launch = (e: FsEntry) => {
    if (e.appId) {
      const app = APPS[e.appId]; if (!app) return;
      open({
        id: `${e.appId}-${Date.now()}`,
        appId: e.appId,
        title: e.title || app.title,
        icon: <app.Icon size={16} />,
        x: 120, y: 80,
        width: app.defaultSize.w, height: app.defaultSize.h,
        payload: e.payload,
      });
      return;
    }
    if (e.type === "folder") {
      const next = path.endsWith("\\") ? path + e.name : path + "\\" + e.name;
      if (TREE[next]) { setPath(next); setSel(null); }
    }
  };

  const up = () => {
    if (path === "C:\\") return;
    const parts = path.split("\\").filter(Boolean);
    parts.pop();
    setPath(parts.length === 1 ? parts[0] + "\\" : parts.join("\\"));
    setSel(null);
  };

  return (
    <div className="h-full flex flex-col bg-w95-silver text-[11px]">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray">
        {["File", "Edit", "View", "Help"].map((m) => (
          <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>
        ))}
      </div>
      <div className="flex gap-1 p-1 bevel-thin-out items-center">
        <button className="w95-button px-2" onClick={up} disabled={path === "C:\\"}>↑ Up</button>
        <span className="ml-2">Address:</span>
        <input className="w95-input flex-1" value={path} readOnly />
      </div>
      <div className="flex-1 bevel-in bg-white m-1 p-2 flex flex-wrap gap-1 content-start overflow-auto w95-scroll"
        onClick={() => setSel(null)}>
        {entries.map((e) => {
          const isSel = sel === e.name;
          return (
            <button
              key={e.name}
              className="flex flex-col items-center p-1 focus:outline-none w-[75px]"
              onClick={(ev) => {
                ev.stopPropagation();
                if (sel === e.name) {
                  launch(e);
                } else {
                  setSel(e.name);
                }
              }}
              onContextMenu={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                setSel(e.name);
                openMenu({ x: ev.clientX, y: ev.clientY }, [
                  { kind: "item", label: "Open", bold: true, onClick: () => launch(e) },
                  { kind: "sep" },
                  { kind: "item", label: "Properties", disabled: true }
                ]);
              }}
            >
              <div className={isSel ? "opacity-70" : ""}><e.Icon size={32} /></div>
              <div className={`mt-1 px-0.5 text-center leading-tight ${isSel ? "bg-w95-navy text-w95-text-on-navy" : "text-w95-text"}`}>
                {e.name}
              </div>
            </button>
          );
        })}
      </div>
      <div className="bevel-thin-in px-2 py-0.5 flex gap-3">
        <MyComputerIcon size={14} />
        <span>{entries.length} object(s)</span>
      </div>
    </div>
  );
};
