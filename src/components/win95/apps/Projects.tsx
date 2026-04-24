import React, { useState } from "react";
import { FolderIcon, NotepadIcon, IEIcon } from "../Icons";

interface Project {
  name: string;
  type: string;
  size: string;
  modified: string;
  description: string;
  stack: string[];
  url?: string;
  Icon: React.FC<{ size?: number }>;
}

const PROJECTS: Project[] = [
  {
    name: "PixelDash.exe",
    type: "Application",
    size: "2.4 MB",
    modified: "10/11/2024 14:32",
    description:
      "Real-time analytics dashboard with WebSocket streams, custom charting, and a retro pixel theme.",
    stack: ["React", "TypeScript", "WebSockets", "D3"],
    url: "https://example.com",
    Icon: NotepadIcon,
  },
  {
    name: "RetroChat",
    type: "File Folder",
    size: "—",
    modified: "08/02/2024 09:11",
    description:
      "End-to-end encrypted chat app styled like AIM. Group rooms, presence, typing indicators.",
    stack: ["Next.js", "Supabase", "WebRTC"],
    url: "https://example.com",
    Icon: FolderIcon,
  },
  {
    name: "Browser95",
    type: "Application",
    size: "5.1 MB",
    modified: "06/19/2024 22:08",
    description:
      "An in-browser Windows 95 simulator (yes, the one you're using). Window manager, taskbar, the whole thing.",
    stack: ["React", "Zustand", "react-rnd"],
    url: "/",
    Icon: IEIcon,
  },
  {
    name: "BeatGrid",
    type: "Application",
    size: "1.8 MB",
    modified: "03/04/2024 16:45",
    description:
      "Web-based step sequencer with sample loading, swing, and MIDI export.",
    stack: ["React", "Web Audio", "Canvas"],
    Icon: NotepadIcon,
  },
];

export const Projects: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(0);
  const sel = selected !== null ? PROJECTS[selected] : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex">
        {/* List */}
        <div className="flex-1 bg-w95-white">
          <table className="w-full text-[11px]">
            <thead className="bg-w95-silver text-left">
              <tr>
                {["Name", "Type", "Size", "Modified"].map((h) => (
                  <th key={h} className="bevel-out px-1 py-0.5 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p, i) => {
                const isSel = selected === i;
                return (
                  <tr
                    key={p.name}
                    onClick={() => setSelected(i)}
                    onDoubleClick={() => p.url && window.open(p.url, "_blank")}
                    className={`cursor-default ${isSel ? "bg-w95-navy text-w95-text-on-navy" : ""}`}
                  >
                    <td className="px-1 py-0.5 flex items-center gap-1">
                      <p.Icon size={16} />
                      {p.name}
                    </td>
                    <td className="px-1 py-0.5">{p.type}</td>
                    <td className="px-1 py-0.5">{p.size}</td>
                    <td className="px-1 py-0.5">{p.modified}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Details */}
        {sel && (
          <div className="w-56 shrink-0 border-l border-w95-gray bg-w95-silver p-2 text-[11px] flex flex-col">
            <div className="flex flex-col items-center mb-2">
              <sel.Icon size={32} />
              <div className="mt-1 font-bold">{sel.name}</div>
            </div>
            <div className="bevel-in bg-w95-white p-2 mb-2 flex-1">
              <p className="mb-2">{sel.description}</p>
              <div className="text-w95-text-disabled">Stack:</div>
              <div>{sel.stack.join(", ")}</div>
            </div>
            {sel.url && (
              <button
                className="w95-button"
                onClick={() => window.open(sel.url, "_blank")}
              >
                Open
              </button>
            )}
          </div>
        )}
      </div>
      <div className="bevel-thin-in px-2 py-0.5 text-[11px] bg-w95-silver">
        {PROJECTS.length} object(s) — double-click to launch
      </div>
    </div>
  );
};
