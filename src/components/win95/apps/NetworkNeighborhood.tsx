import React, { useState } from "react";
import { useContextMenu } from "../ContextMenu";
import { NetworkNeighborhoodIcon } from "../Icons";
import { showMessage } from "../MessageBox";

interface NetItem {
  name: string;
  comment: string;
}

const items: NetItem[] = [
  { name: "Entire Network", comment: "" },
  { name: "Workgroup",      comment: "" },
  { name: "Workstation",    comment: "Local computer" },
  { name: "Fileserver",     comment: "Shared documents" },
  { name: "Printserver",    comment: "Network printer" },
];

const PcIcon = () => <NetworkNeighborhoodIcon size={32} />;
const GlobeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
    <circle cx="16" cy="16" r="12" fill="#5F9EA0" stroke="#000" />
    <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="#000" />
    <ellipse cx="16" cy="16" rx="5" ry="12" fill="none" stroke="#000" />
    <line x1="4" y1="16" x2="28" y2="16" stroke="#000" />
  </svg>
);

export const NetworkNeighborhood: React.FC = () => {
  const { open: openMenu } = useContextMenu();
  const [sel, setSel] = useState<string | null>(null);

  const onOpen = (it: NetItem) => {
    if (it.name === "Entire Network") {
      showMessage({
        title: "Network",
        message: "Unable to browse the network.\n\nThe network is not present or not started.",
        icon: "error",
      });
    } else {
      showMessage({
        title: `\\\\${it.name}`,
        message: `\\\\${it.name} is not accessible.\n\nThe network path was not found.`,
        icon: "error",
      });
    }
  };

  return (
    <div className="h-full bg-w95-silver flex flex-col text-w95-text">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray text-[11px]">
        {["File", "Edit", "View", "Help"].map((m) => <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>)}
      </div>
      <div className="flex-1 p-2 flex flex-wrap gap-1 content-start overflow-auto w95-scroll" onClick={() => setSel(null)}>
        {items.map((it) => {
          const isSel = sel === it.name;
          const Icon = it.name === "Entire Network" ? GlobeIcon : PcIcon;
          return (
            <button
              type="button"
              key={it.name}
              onClick={(e) => {
                e.stopPropagation();
                if (sel === it.name) {
                  onOpen(it);
                } else {
                  setSel(it.name);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSel(it.name);
                openMenu({ x: e.clientX, y: e.clientY }, [
                  { kind: "item", label: "Open", bold: true, onClick: () => onOpen(it) }
                ]);
              }}
              className="flex flex-col items-center p-1 focus:outline-none w-[80px]"
            >
              <div className={isSel ? "opacity-70" : ""}><Icon /></div>
              <div className={`mt-1 px-0.5 text-[11px] text-center leading-tight ${isSel ? "bg-w95-navy text-w95-text-on-navy" : "text-w95-text"}`}>
                {it.name}
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
