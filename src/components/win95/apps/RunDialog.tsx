import React, { useState } from "react";
import { useWM } from "../wm";
import { APPS } from "./registry";
import { RunIcon } from "../Icons";

const ALIASES: Record<string, string> = {
  "calc": "calculator",
  "calc.exe": "calculator",
  "notepad": "notepad",
  "notepad.exe": "notepad",
  "mspaint": "paint",
  "pbrush": "paint",
  "iexplore": "ie",
  "explorer": "my-computer",
  "control": "control-panel",
  "winmine": "minesweeper",
  "command": "msdos",
  "command.com": "msdos",
  "cmd": "msdos",
};

export const RunDialog: React.FC<{ payload?: { onClose?: () => void } }> = ({ payload }) => {
  const [value, setValue] = useState("");
  const { open, close, windows } = useWM();

  const launch = (appId: string) => {
    const app = APPS[appId];
    if (!app) return false;
    open({
      id: `${appId}-${Date.now()}`,
      appId,
      title: app.title,
      icon: <app.Icon size={16} />,
      x: 120, y: 80,
      width: app.defaultSize.w, height: app.defaultSize.h,
    });
    return true;
  };

  const closeSelf = () => {
    const me = windows.find((w) => w.appId === "run");
    if (me) close(me.id);
  };

  const onOk = () => {
    const key = value.trim().toLowerCase();
    if (!key) return;
    if (key.startsWith("http://") || key.startsWith("https://") || key.includes(".com") || key.includes(".org")) {
      const app = APPS["ie"];
      open({
        id: `ie-${Date.now()}`, appId: "ie", title: app.title,
        icon: <app.Icon size={16} />, x: 120, y: 80,
        width: app.defaultSize.w, height: app.defaultSize.h,
        payload: { url: value.trim() },
      });
      closeSelf(); return;
    }
    const target = ALIASES[key];
    if (target && launch(target)) { closeSelf(); return; }
    alert(`Cannot find the file '${value}'. Make sure the path and filename are correct.`);
  };

  return (
    <div className="h-full p-3 bg-w95-silver flex flex-col gap-3 text-[11px]">
      <div className="flex gap-2 items-start">
        <RunIcon size={32} />
        <div className="flex-1">
          Type the name of a program, folder, or document, and Windows will open it for you.
        </div>
      </div>
      <label className="flex flex-col gap-1">
        Open:
        <input
          autoFocus
          className="w95-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onOk()}
          placeholder="e.g. calc, notepad, mspaint, winmine, https://google.com"
        />
      </label>
      <div className="flex justify-end gap-2 mt-auto">
        <button className="w95-button" onClick={onOk}>OK</button>
        <button className="w95-button" onClick={closeSelf}>Cancel</button>
        <button className="w95-button" disabled>Browse...</button>
      </div>
    </div>
  );
};
