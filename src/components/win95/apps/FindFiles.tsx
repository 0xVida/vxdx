import React, { useMemo, useState } from "react";
import { useWM } from "../wm";
import { APPS } from "./registry";
import { NotepadIcon, BriefcaseIcon, PaintIcon, FolderIcon } from "../Icons";
import { useDesktopFiles } from "../desktopFiles";

interface FoundItem {
  name: string;
  location: string;
  type: "Text Document" | "WordPad Document" | "Bitmap Image" | "Folder";
  Icon: React.FC<{ size?: number }>;
  open: () => void;
}

export const FindFiles: React.FC = () => {
  const [name, setName] = useState("");
  const [searched, setSearched] = useState(false);
  const { open } = useWM();
  const { files } = useDesktopFiles();

  const all: FoundItem[] = useMemo(() => {
    const launchDoc = (appId: string, payload: any, title: string, Icon: React.FC<{ size?: number }>) => () => {
      const app = APPS[appId]; if (!app) return;
      open({
        id: `find-${title}-${Date.now()}`, appId, title,
        icon: <Icon size={16} />, x: 120, y: 80,
        width: app.defaultSize.w, height: app.defaultSize.h, payload,
      });
    };
    const builtIn: FoundItem[] = [
      { name: "About Me.txt", location: "C:\\My Documents", type: "Text Document", Icon: NotepadIcon,
        open: launchDoc("notepad", { readOnly: true, content: "See My Documents > About Me.txt" }, "About Me.txt - Notepad", NotepadIcon) },
      { name: "Resume.doc", location: "C:\\My Documents", type: "WordPad Document", Icon: BriefcaseIcon,
        open: launchDoc("notepad", { readOnly: true, content: "See My Documents > Resume.doc" }, "Resume.doc - WordPad", BriefcaseIcon) },
      { name: "README.txt", location: "C:\\My Documents", type: "Text Document", Icon: NotepadIcon,
        open: launchDoc("notepad", { readOnly: true, content: "See My Documents > README.txt" }, "README.txt - Notepad", NotepadIcon) },
      { name: "Projects", location: "C:\\My Documents", type: "Folder", Icon: FolderIcon,
        open: launchDoc("projects", {}, "Projects", FolderIcon) },
    ];
    const desktop: FoundItem[] = files.map((f) => ({
      name: f.name,
      location: "C:\\Windows\\Desktop",
      type: f.type === "image" ? "Bitmap Image" : "Text Document",
      Icon: f.type === "image" ? PaintIcon : NotepadIcon,
      open: f.type === "image"
        ? launchDoc("image-viewer", { dataUrl: f.dataUrl, name: f.name }, f.name, PaintIcon)
        : launchDoc("notepad", { content: f.content, readOnly: false }, `${f.name} - Notepad`, NotepadIcon),
    }));
    return [...builtIn, ...desktop];
  }, [files, open]);

  const results = searched
    ? all.filter((f) => !name.trim() || f.name.toLowerCase().includes(name.trim().toLowerCase()))
    : [];

  return (
    <div className="h-full flex flex-col bg-w95-silver text-[11px]">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray">
        {["File", "Edit", "View", "Options", "Help"].map((m) => (
          <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>
        ))}
      </div>
      <div className="p-3 flex flex-col gap-2 bevel-thin-out">
        <div className="flex items-center gap-2">
          <label className="w-24">Named:</label>
          <input
            className="w95-input flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearched(true)}
            placeholder="*.* or partial name"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-24">Look in:</label>
          <input className="w95-input flex-1" value="My Computer" readOnly />
        </div>
        <div className="flex justify-end gap-2">
          <button className="w95-button" onClick={() => setSearched(true)}>Find Now</button>
          <button className="w95-button" onClick={() => { setName(""); setSearched(false); }}>New Search</button>
        </div>
      </div>
      <div className="flex-1 bevel-in m-1 bg-white overflow-auto w95-scroll">
        {!searched ? (
          <div className="p-2 text-w95-text-disabled">Enter a name and click Find Now.</div>
        ) : results.length === 0 ? (
          <div className="p-2 text-w95-text-disabled">No files found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-w95-silver">
              <tr><th className="px-2 py-0.5 font-normal">Name</th><th className="px-2 py-0.5 font-normal">In Folder</th><th className="px-2 py-0.5 font-normal">Type</th></tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-w95-navy hover:text-w95-text-on-navy cursor-default" onDoubleClick={r.open}>
                  <td className="px-2 py-0.5 flex items-center gap-1"><r.Icon size={16} />{r.name}</td>
                  <td className="px-2 py-0.5">{r.location}</td>
                  <td className="px-2 py-0.5">{r.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="bevel-thin-in px-2 py-0.5">{searched ? `${results.length} file(s) found` : "Ready"}</div>
    </div>
  );
};
