import React, { useRef, useState, useEffect } from "react";
import { useDesktopFiles } from "../desktopFiles";
import { showMessage } from "../MessageBox";

const FONTS = ["Times New Roman", "Arial", "Courier New", "Tahoma", "MS Sans Serif", "Verdana"];
const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const TbBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = "", ...rest }) => (
  <button
    type="button"
    {...rest}
    className={`w-[22px] h-[22px] flex items-center justify-center bg-w95-silver hover:bevel-out active:bevel-pressed text-w95-text ${className}`}
  >
    {children}
  </button>
);

const Sep = () => <div className="w-px h-[18px] bg-w95-gray-dark mx-0.5 border-r border-white" />;

export const WordPad: React.FC<{ payload?: { content?: string; readOnly?: boolean; title?: string } }> = ({ payload }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [font, setFont] = useState("Times New Roman");
  const [size, setSize] = useState(20);
  const addText = useDesktopFiles((s) => s.addText);
  const [statusText, setStatusText] = useState("For Help, press F1");

  useEffect(() => {
    if (editorRef.current && payload?.content !== undefined) {
      // Render initial content as plain text broken by newlines
      editorRef.current.innerHTML = payload.content
        .split("\n")
        .map((l) => `<div>${l ? l.replace(/</g, "&lt;") : "<br/>"}</div>`)
        .join("");
    }
  }, []);

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const onFontChange = (f: string) => { setFont(f); exec("fontName", f); };
  const onSizeChange = (s: number) => {
    setSize(s);
    editorRef.current?.focus();
    document.execCommand("fontSize", false, "7");
    // Convert size 7 spans to actual px
    const spans = editorRef.current?.querySelectorAll('font[size="7"]');
    spans?.forEach((sp) => {
      (sp as HTMLElement).removeAttribute("size");
      (sp as HTMLElement).style.fontSize = `${s}px`;
    });
  };

  const save = () => {
    if (payload?.readOnly) return;
    const text = editorRef.current?.innerText ?? "";
    const file = addText(text, "Document");
    showMessage({ title: "WordPad", message: `Saved "${file.name}" to Desktop.`, icon: "info" });
  };

  const newDoc = () => {
    if (payload?.readOnly) return;
    if (editorRef.current) editorRef.current.innerHTML = "<div><br/></div>";
  };

  const menus = ["File", "Edit", "View", "Insert", "Format", "Help"];

  // Build ruler markers (inches)
  const ruler = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="h-full flex flex-col bg-w95-silver text-[11px] select-none">
      {/* Menu bar */}
      <div className="flex items-center gap-3 px-2 py-0.5">
        {menus.map((m) => (
          <span key={m} className="cursor-default px-1 hover:bg-w95-navy hover:text-white">
            <u>{m[0]}</u>{m.slice(1)}
          </span>
        ))}
      </div>

      {/* Toolbar 1 — file/edit icons */}
      <div className="flex items-center gap-0.5 px-1 py-0.5 border-t border-white">
        <TbBtn title="New" onClick={newDoc}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 1h7l3 3v9H2z" fill="white" stroke="black"/><path d="M9 1v3h3" fill="none" stroke="black"/></svg>
        </TbBtn>
        <TbBtn title="Open">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 4h5l1 1h6v7H1z" fill="#e8c474" stroke="black"/></svg>
        </TbBtn>
        <TbBtn title="Save" onClick={save}>
          <svg width="14" height="14" viewBox="0 0 14 14"><rect x="1" y="1" width="12" height="12" fill="#000080"/><rect x="3" y="2" width="8" height="4" fill="white"/><rect x="3" y="8" width="8" height="5" fill="#c0c0c0"/></svg>
        </TbBtn>
        <Sep />
        <TbBtn title="Print" onClick={() => window.print()}>
          <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="5" width="10" height="5" fill="#c0c0c0" stroke="black"/><rect x="3" y="2" width="8" height="3" fill="white" stroke="black"/><rect x="3" y="9" width="8" height="3" fill="white" stroke="black"/></svg>
        </TbBtn>
        <TbBtn title="Print Preview">
          <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="1" width="9" height="11" fill="white" stroke="black"/><path d="M4 4h5M4 6h5M4 8h3" stroke="black"/></svg>
        </TbBtn>
        <TbBtn title="Find">
          <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="6" cy="6" r="4" fill="none" stroke="black" strokeWidth="1.5"/><path d="M9 9l4 4" stroke="black" strokeWidth="1.5"/></svg>
        </TbBtn>
        <Sep />
        <TbBtn title="Cut" onClick={() => exec("cut")}>
          <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="4" cy="10" r="2" fill="none" stroke="black"/><circle cx="10" cy="10" r="2" fill="none" stroke="black"/><path d="M5 9L11 2M9 9L3 2" stroke="black"/></svg>
        </TbBtn>
        <TbBtn title="Copy" onClick={() => exec("copy")}>
          <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="7" height="9" fill="white" stroke="black"/><rect x="5" y="4" width="7" height="9" fill="white" stroke="black"/></svg>
        </TbBtn>
        <TbBtn title="Paste" onClick={() => exec("paste")}>
          <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="11" fill="#c0c0c0" stroke="black"/><rect x="4" y="1" width="6" height="3" fill="white" stroke="black"/><rect x="4" y="6" width="7" height="6" fill="white" stroke="black"/></svg>
        </TbBtn>
        <TbBtn title="Undo" onClick={() => exec("undo")}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 6 Q7 1 12 6 L12 9" fill="none" stroke="#0066cc" strokeWidth="1.5"/><path d="M1 5l3-2 0 4z" fill="#0066cc"/></svg>
        </TbBtn>
        <Sep />
        <TbBtn title="Date/Time">
          <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="white" stroke="black"/><path d="M7 7L7 3M7 7L10 8" stroke="black"/></svg>
        </TbBtn>
      </div>

      {/* Toolbar 2 — font/format */}
      <div className="flex items-center gap-1 px-1 py-0.5">
        <select
          value={font}
          onChange={(e) => onFontChange(e.target.value)}
          className="bevel-in bg-white text-[11px] h-[18px] w-[150px] px-0.5"
        >
          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="bevel-in bg-white text-[11px] h-[18px] w-[50px] px-0.5"
        >
          {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <Sep />
        <TbBtn title="Bold" onClick={() => exec("bold")}><span className="font-bold text-[12px]">B</span></TbBtn>
        <TbBtn title="Italic" onClick={() => exec("italic")}><span className="italic text-[12px] font-serif">I</span></TbBtn>
        <TbBtn title="Underline" onClick={() => exec("underline")}><span className="underline text-[12px]">U</span></TbBtn>
        <TbBtn title="Color" onClick={() => {
          const c = prompt("Color (e.g. red, #ff0000):", "#000000");
          if (c) exec("foreColor", c);
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="5" cy="5" r="3" fill="#ff0000"/><circle cx="9" cy="5" r="3" fill="#0000ff"/><circle cx="7" cy="9" r="3" fill="#00aa00"/></svg>
        </TbBtn>
        <Sep />
        <TbBtn title="Align Left" onClick={() => exec("justifyLeft")}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 3h10M2 6h7M2 9h10M2 12h6" stroke="black"/></svg>
        </TbBtn>
        <TbBtn title="Align Center" onClick={() => exec("justifyCenter")}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 3h10M4 6h6M2 9h10M4 12h6" stroke="black"/></svg>
        </TbBtn>
        <TbBtn title="Align Right" onClick={() => exec("justifyRight")}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 3h10M5 6h7M2 9h10M6 12h6" stroke="black"/></svg>
        </TbBtn>
        <Sep />
        <TbBtn title="Bullets" onClick={() => exec("insertUnorderedList")}>
          <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="3" cy="4" r="1" fill="black"/><circle cx="3" cy="8" r="1" fill="black"/><circle cx="3" cy="12" r="1" fill="black"/><path d="M5 4h7M5 8h7M5 12h7" stroke="black"/></svg>
        </TbBtn>
      </div>

      {/* Ruler */}
      <div className="bg-w95-silver border-t border-white border-b border-w95-gray-dark h-[18px] flex items-end relative px-2">
        <div className="flex-1 relative h-full">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex">
            {ruler.map((i) => (
              <div key={i} className="flex-1 flex items-center text-[9px] border-l border-w95-text-muted relative">
                <span className="ml-1">{i || ""}</span>
                <div className="absolute right-0 top-1/2 w-px h-1.5 bg-w95-text-muted -translate-y-1/2" />
              </div>
            ))}
          </div>
          {/* Indent markers */}
          <div className="absolute left-0 bottom-0 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-black" />
          <div className="absolute right-0 bottom-0 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-black" />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-w95-silver p-0.5 overflow-auto w95-scroll">
        <div
          ref={editorRef}
          contentEditable={!payload?.readOnly}
          suppressContentEditableWarning
          onFocus={() => setStatusText("")}
          onBlur={() => setStatusText("For Help, press F1")}
          className="bg-white min-h-full p-2 outline-none"
          style={{ fontFamily: font, fontSize: `${size}px`, lineHeight: 1.3 }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-stretch text-[11px] border-t border-white">
        <div className="flex-1 bevel-thin-in px-2 py-0.5">{statusText}</div>
        <div className="w-16 bevel-thin-in" />
        <div className="w-16 bevel-thin-in" />
      </div>
    </div>
  );
};
