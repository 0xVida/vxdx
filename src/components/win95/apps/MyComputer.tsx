import React, { useState } from "react";
import { useContextMenu } from "../ContextMenu";
import { FolderIcon, RecycleBinIcon, PrintersIcon, SettingsIcon } from "../Icons";
import { useWM } from "../wm";
import { APPS } from "./registry";
import { showMessage } from "../MessageBox";

const HddIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
    <rect x="3" y="9" width="26" height="18" fill="#C3C3C3" />
    <rect x="3" y="9" width="26" height="1" fill="#FFFFFF" />
    <rect x="3" y="9" width="1" height="18" fill="#FFFFFF" />
    <rect x="28" y="9" width="1" height="18" fill="#000000" />
    <rect x="3" y="26" width="26" height="1" fill="#000000" />
    <rect x="6" y="13" width="20" height="5" fill="#5F9EA0" />
    <rect x="22" y="20" width="4" height="2" fill="#00FF00" />
    <rect x="7" y="20" width="14" height="2" fill="#808080" />
  </svg>
);

const FloppyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
    <rect x="4" y="6" width="24" height="20" fill="#000000" />
    <rect x="5" y="7" width="22" height="18" fill="#C3C3C3" />
    <rect x="9" y="9" width="14" height="7" fill="#000000" />
    <rect x="10" y="10" width="12" height="5" fill="#A0A0A0" />
    <rect x="9" y="18" width="14" height="7" fill="#FFFFFF" />
    <rect x="11" y="20" width="10" height="1" fill="#000000" />
    <rect x="11" y="22" width="10" height="1" fill="#000000" />
  </svg>
);

const CdRomIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
    <circle cx="16" cy="16" r="13" fill="#E0E0E0" stroke="#000" />
    <circle cx="16" cy="16" r="13" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
    <circle cx="16" cy="16" r="9" fill="#A0C8E0" />
    <circle cx="16" cy="16" r="3" fill="#FFFFFF" stroke="#000" />
    <rect x="13" y="4" width="6" height="3" fill="#FFFF00" opacity="0.3" />
  </svg>
);

interface DriveItem {
  id: string;
  label: string;
  appId: string;
  payload?: any;
  Icon: React.FC;
}

const items: DriveItem[] = [
  { id: "drive-a", label: "3½ Floppy (A:)", appId: "floppy-empty", Icon: FloppyIcon },
  { id: "drive-c", label: "(C:)",            appId: "drive-browser", payload: { drive: "C:\\" }, Icon: HddIcon },
  { id: "drive-d", label: "Audio CD (D:)",   appId: "cd-player",     Icon: CdRomIcon },
  { id: "control", label: "Control Panel",   appId: "control-panel", Icon: SettingsIcon },
  { id: "printers", label: "Printers",       appId: "printers",      Icon: PrintersIcon },
  { id: "dialup", label: "Dial-Up Networking", appId: "dialup",      Icon: FolderIcon },
  { id: "documents", label: "My Documents",  appId: "documents",     Icon: FolderIcon },
  { id: "recycle", label: "Recycle Bin",     appId: "recycle-bin",   Icon: RecycleBinIcon },
];

export const MyComputer: React.FC = () => {
  const { open } = useWM();
  const { open: openMenu } = useContextMenu();
  const [selected, setSelected] = useState<string | null>(null);

  const launch = (item: DriveItem) => {
    if (item.appId === "floppy-empty") {
      showMessage({
        title: "A:\\ is not accessible",
        message: "The device is not ready.\n\nPlease insert a disk into drive A: and try again.",
        icon: "error",
      });
      return;
    }
    if (item.appId === "printers") {
      showMessage({
        title: "Printers",
        message: "There are no printers installed.\n\nTo install a printer, double-click Add Printer.",
        icon: "info",
      });
      return;
    }
    if (item.appId === "dialup") {
      showMessage({
        title: "Dial-Up Networking",
        message: "No connections have been configured.\n\nDouble-click Make New Connection to set one up.",
        icon: "info",
      });
      return;
    }
    const app = APPS[item.appId];
    if (!app) return;
    open({
      id: item.id,
      appId: item.appId,
      title: item.label,
      icon: <app.Icon size={16} />,
      x: 80 + Math.random() * 80,
      y: 60 + Math.random() * 40,
      width: app.defaultSize.w,
      height: app.defaultSize.h,
      payload: item.payload,
    });
  };

  return (
    <div className="h-full flex flex-col bg-w95-silver">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray text-[11px]">
        {["File", "Edit", "View", "Help"].map((m) => <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>)}
      </div>
      <div className="flex-1 p-2 flex flex-wrap gap-1 content-start overflow-auto w95-scroll" onClick={() => setSelected(null)}>
        {items.map((item) => {
          const isSel = selected === item.id;
          return (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                if (selected === item.id) {
                  launch(item);
                } else {
                  setSelected(item.id);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelected(item.id);
                openMenu({ x: e.clientX, y: e.clientY }, [
                  { kind: "item", label: "Open", bold: true, onClick: () => launch(item) },
                  { kind: "sep" },
                  { kind: "item", label: "Properties", disabled: true }
                ]);
              }}
              className="flex flex-col items-center p-1 focus:outline-none w-[80px]"
            >
              <div className={isSel ? "opacity-70" : ""}><item.Icon /></div>
              <div className={`mt-1 px-0.5 text-[11px] text-center leading-tight ${isSel ? "bg-w95-navy text-w95-text-on-navy" : "text-w95-text"}`}>
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
      <div className="bevel-thin-in px-2 py-0.5 text-[11px] flex gap-3 bg-w95-silver">
        <span>{items.length} object(s)</span>
      </div>
    </div>
  );
};
