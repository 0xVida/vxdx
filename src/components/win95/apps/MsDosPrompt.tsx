import React, { useEffect, useRef, useState } from "react";

const HELP = `Microsoft(R) Windows 95
   (C)Copyright Microsoft Corp 1981-1996.

Available commands:
  DIR          List files in current directory
  CD [path]    Change directory
  ECHO [text]  Print text
  CLS          Clear screen
  VER          Show Windows version
  DATE         Show current date
  TIME         Show current time
  WHOAMI       Display owner
  HELP         Show this help
  EXIT         Close this window`;

const FS: Record<string, string[]> = {
  "C:\\": ["WINDOWS", "PROGRA~1", "MYDOCU~1", "AUTOEXEC.BAT", "CONFIG.SYS", "COMMAND.COM"],
  "C:\\WINDOWS": ["SYSTEM", "DESKTOP", "WIN.INI", "SYSTEM.INI", "REGEDIT.EXE", "NOTEPAD.EXE"],
  "C:\\MYDOCU~1": ["ABOUT~1.TXT", "RESUME~1.DOC", "README~1.TXT"],
  "C:\\PROGRA~1": ["ACCESS~1", "INTERN~1"],
};

export const MsDosPrompt: React.FC<{ payload?: { initialCommand?: string } }> = ({ payload }) => {
  const [cwd, setCwd] = useState("C:\\");
  const [lines, setLines] = useState<string[]>([
    "Microsoft(R) Windows 95",
    "   (C)Copyright Microsoft Corp 1981-1996.",
    "",
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [lines]);

  const print = (s: string | string[]) => {
    setLines((prev) => [...prev, ...(Array.isArray(s) ? s : [s])]);
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    print(`${cwd}>${cmd}`);
    if (!cmd) return;
    const [c, ...args] = cmd.split(/\s+/);
    const C = c.toUpperCase();
    switch (C) {
      case "HELP": case "?": print(["", HELP, ""]); break;
      case "CLS": setLines([]); break;
      case "VER": print(["", "Windows 95. [Version 4.00.950]", ""]); break;
      case "DATE": print([`Current date: ${new Date().toDateString()}`, ""]); break;
      case "TIME": print([`Current time: ${new Date().toLocaleTimeString()}`, ""]); break;
      case "ECHO": print([args.join(" ") || "ECHO is on.", ""]); break;
      case "WHOAMI": print(["MS-DOS\\USER", ""]); break;
      case "DIR": {
        const items = FS[cwd] || [];
        print([
          ` Volume in drive ${cwd[0]} is WIN95`,
          ` Directory of ${cwd}`,
          "",
          ...items.map((n) => ` ${n.padEnd(14)} ${n.includes(".") ? "       1,024" : "<DIR>       "}  04-19-26  10:00`),
          `        ${items.length} file(s)`,
          "",
        ]);
        break;
      }
      case "CD": {
        const target = args.join(" ").toUpperCase();
        if (!target || target === ".") { print([cwd, ""]); break; }
        if (target === "..") {
          const parts = cwd.replace(/\\$/, "").split("\\");
          if (parts.length > 1) parts.pop();
          const next = parts.length === 1 ? parts[0] + "\\" : parts.join("\\");
          setCwd(next); break;
        }
        const candidate = target.startsWith("C:\\") ? target : (cwd.endsWith("\\") ? cwd + target : cwd + "\\" + target);
        if (FS[candidate]) setCwd(candidate);
        else print(["Invalid directory", ""]);
        break;
      }
      case "EXIT": print(["", "Goodbye."]); break;
      default: print([`Bad command or file name: ${c}`, ""]);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setHistory((h) => [...h, input]);
      setHIdx(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const ni = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(ni); setInput(history[ni]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx < 0) return;
      const ni = hIdx + 1;
      if (ni >= history.length) { setHIdx(-1); setInput(""); }
      else { setHIdx(ni); setInput(history[ni]); }
    }
  };

  useEffect(() => { if (payload?.initialCommand) run(payload.initialCommand); /* eslint-disable-next-line */ }, []);

  return (
    <div
      className="h-full bg-black text-white font-mono text-[12px] p-1 overflow-auto w95-scroll"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
      style={{ fontFamily: "'Perfect DOS VGA 437', 'Courier New', monospace" }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ whiteSpace: "pre" }}>{l}</div>
      ))}
      <div className="flex">
        <span style={{ whiteSpace: "pre" }}>{cwd}{">"}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          className="flex-1 bg-transparent outline-none border-0 text-white font-mono"
          style={{ caretColor: "white" }}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
