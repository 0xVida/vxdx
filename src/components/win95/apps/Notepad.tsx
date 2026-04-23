import React, { useState } from "react";
import { useDesktopFiles } from "../desktopFiles";
import { toast } from "sonner";

export const Notepad: React.FC<{ payload?: { content?: string; readOnly?: boolean; fileId?: string } }> = ({ payload }) => {
  const [text, setText] = useState(payload?.content ?? "");
  const addText = useDesktopFiles((s) => s.addText);

  const save = () => {
    const file = addText(text, "Untitled");
    toast(`Saved "${file.name}" to Desktop`);
  };

  const newDoc = () => { if (!payload?.readOnly) setText(""); };

  return (
    <div className="h-full flex flex-col bg-w95-silver text-[11px]">
      <div className="flex items-center gap-3 px-2 py-0.5 border-b border-w95-gray">
        {["File", "Edit", "Search", "Help"].map((m) => (
          <span key={m} className="cursor-default"><u>{m[0]}</u>{m.slice(1)}</span>
        ))}
      </div>
      <div className="flex gap-1 p-1 bevel-thin-out">
        <button className="w95-button px-2" onClick={newDoc} disabled={payload?.readOnly}>New</button>
        <button className="w95-button px-2" onClick={save} disabled={payload?.readOnly}>Save</button>
      </div>
      <textarea
        className="flex-1 bevel-in bg-white p-1 font-mono text-[12px] resize-none focus:outline-none w95-scroll"
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={payload?.readOnly}
        spellCheck={false}
      />
      <div className="bevel-thin-in px-2 py-0.5 flex justify-between">
        <span>{payload?.readOnly ? "Read-only" : "Ready"}</span>
        <span>Ln 1, Col {text.length + 1}</span>
      </div>
    </div>
  );
};
