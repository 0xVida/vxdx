import React, { useEffect, useRef, useState } from "react";
import { useDesktopFiles } from "../desktopFiles";
import { toast } from "sonner";

type Tool = "pencil" | "brush" | "eraser" | "line" | "rect" | "ellipse" | "fill" | "picker";

const PALETTE = [
  "#000000","#808080","#800000","#808000","#008000","#008080","#000080","#800080",
  "#808040","#004040","#0080FF","#004080","#4000FF","#804000","#FFFFFF","#C0C0C0",
  "#FF0000","#FFFF00","#00FF00","#00FFFF","#0000FF","#FF00FF","#FFFF80","#00FF80",
  "#80FFFF","#8080FF","#FF0080","#FF8040",
];

export const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("pencil");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#FFFFFF");
  const [size, setSize] = useState(2);
  const drawing = useRef(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const lastPt = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, c.width, c.height);
  }, []);

  const getPos = (e: React.MouseEvent) => {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return { x: Math.floor(e.clientX - r.left), y: Math.floor(e.clientY - r.top) };
  };

  const onDown = (e: React.MouseEvent) => {
    const p = getPos(e);
    drawing.current = true;
    start.current = p;
    lastPt.current = p;
    const color = e.button === 2 ? bg : fg;
    const ctx = canvasRef.current!.getContext("2d")!;
    if (tool === "fill") { floodFill(ctx, p.x, p.y, color); drawing.current = false; return; }
    if (tool === "picker") {
      const d = ctx.getImageData(p.x, p.y, 1, 1).data;
      const hex = "#" + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
      e.button === 2 ? setBg(hex) : setFg(hex);
      drawing.current = false; return;
    }
    if (tool === "pencil" || tool === "brush" || tool === "eraser") {
      drawDot(ctx, p.x, p.y, tool === "eraser" ? bg : color, tool === "brush" ? size * 2 : size);
    }
  };
  const onMove = (e: React.MouseEvent) => {
    if (!drawing.current || !lastPt.current || !start.current) return;
    const p = getPos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    const ov = overlayRef.current!.getContext("2d")!;
    const color = (e.buttons & 2) ? bg : fg;
    if (tool === "pencil" || tool === "brush" || tool === "eraser") {
      drawLine(ctx, lastPt.current.x, lastPt.current.y, p.x, p.y, tool === "eraser" ? bg : color, tool === "brush" ? size * 2 : size);
      lastPt.current = p;
    } else if (tool === "line" || tool === "rect" || tool === "ellipse") {
      ov.clearRect(0, 0, overlayRef.current!.width, overlayRef.current!.height);
      ov.strokeStyle = color; ov.lineWidth = size;
      ov.beginPath();
      if (tool === "line") { ov.moveTo(start.current.x, start.current.y); ov.lineTo(p.x, p.y); }
      else if (tool === "rect") ov.rect(start.current.x, start.current.y, p.x - start.current.x, p.y - start.current.y);
      else ov.ellipse((start.current.x + p.x) / 2, (start.current.y + p.y) / 2, Math.abs(p.x - start.current.x) / 2, Math.abs(p.y - start.current.y) / 2, 0, 0, Math.PI * 2);
      ov.stroke();
    }
  };
  const onUp = (e: React.MouseEvent) => {
    if (!drawing.current || !start.current) return;
    const p = getPos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    const ov = overlayRef.current!.getContext("2d")!;
    const color = e.button === 2 ? bg : fg;
    if (tool === "line" || tool === "rect" || tool === "ellipse") {
      ctx.strokeStyle = color; ctx.lineWidth = size;
      ctx.beginPath();
      if (tool === "line") { ctx.moveTo(start.current.x, start.current.y); ctx.lineTo(p.x, p.y); }
      else if (tool === "rect") ctx.rect(start.current.x, start.current.y, p.x - start.current.x, p.y - start.current.y);
      else ctx.ellipse((start.current.x + p.x) / 2, (start.current.y + p.y) / 2, Math.abs(p.x - start.current.x) / 2, Math.abs(p.y - start.current.y) / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ov.clearRect(0, 0, overlayRef.current!.width, overlayRef.current!.height);
    }
    drawing.current = false; start.current = null; lastPt.current = null;
  };

  const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, s: number) => {
    ctx.fillStyle = color; ctx.fillRect(x - Math.floor(s/2), y - Math.floor(s/2), s, s);
  };
  const drawLine = (ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, color: string, s: number) => {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      drawDot(ctx, x0, y0, color, s);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  };
  const floodFill = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    const c = canvasRef.current!;
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const data = img.data;
    const idx = (x: number, y: number) => (y * c.width + x) * 4;
    const target = [data[idx(x,y)], data[idx(x,y)+1], data[idx(x,y)+2], data[idx(x,y)+3]];
    const hex = color.replace("#",""); const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    if (target[0]===r && target[1]===g && target[2]===b) return;
    const stack = [[x,y]];
    while (stack.length) {
      const [cx, cy] = stack.pop()!;
      if (cx<0||cy<0||cx>=c.width||cy>=c.height) continue;
      const i = idx(cx,cy);
      if (data[i]!==target[0]||data[i+1]!==target[1]||data[i+2]!==target[2]||data[i+3]!==target[3]) continue;
      data[i]=r; data[i+1]=g; data[i+2]=b; data[i+3]=255;
      stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }
    ctx.putImageData(img, 0, 0);
  };

  const clear = () => {
    const c = canvasRef.current!; const ctx = c.getContext("2d")!;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height);
  };
  const addImage = useDesktopFiles((s) => s.addImage);
  const save = () => {
    const url = canvasRef.current!.toDataURL("image/png");
    const file = addImage(url, "untitled");
    toast(`Saved "${file.name}" to Desktop`);
  };

  const tools: { id: Tool; label: string }[] = [
    { id: "pencil", label: "✏️" }, { id: "brush", label: "🖌️" }, { id: "eraser", label: "⌫" },
    { id: "fill", label: "🪣" }, { id: "picker", label: "👁" },
    { id: "line", label: "╱" }, { id: "rect", label: "▭" }, { id: "ellipse", label: "○" },
  ];

  return (
    <div className="h-full flex flex-col bg-w95-silver text-[11px]">
      <div className="flex gap-1 p-1 bevel-thin-out">
        <button className="w95-button px-2" onClick={clear}>New</button>
        <button className="w95-button px-2" onClick={save}>Save</button>
        <span className="mx-1 border-l border-w95-gray" />
        <label className="flex items-center gap-1">Size
          <input type="range" min={1} max={12} value={size} onChange={(e)=>setSize(+e.target.value)} className="w-16" />
        </label>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="bevel-out p-1 flex flex-col gap-1 w-14 shrink-0">
          {tools.map((t) => (
            <button key={t.id} className={`w-10 h-8 ${tool===t.id?"bevel-in":"bevel-out"} bg-w95-silver`} onClick={()=>setTool(t.id)} title={t.id}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 bg-w95-gray p-2 overflow-auto w95-scroll">
          <div className="relative inline-block bevel-in bg-white">
            <canvas ref={canvasRef} width={520} height={340} className="block cursor-crosshair"
              onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
              onContextMenu={(e)=>e.preventDefault()} />
            <canvas ref={overlayRef} width={520} height={340} className="absolute inset-0 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="bevel-thin-in p-1 flex items-center gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="w-6 h-3 border border-w95-gray" style={{ background: fg }} />
          <div className="w-6 h-3 border border-w95-gray" style={{ background: bg }} />
        </div>
        <div className="grid grid-cols-14 gap-0.5" style={{ gridTemplateColumns: "repeat(14, 1fr)" }}>
          {PALETTE.map((c) => (
            <button key={c} className="w-4 h-4 border border-w95-gray" style={{ background: c }}
              onClick={() => setFg(c)} onContextMenu={(e)=>{e.preventDefault(); setBg(c);}} />
          ))}
        </div>
      </div>
    </div>
  );
};
