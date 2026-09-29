import React, { useState } from "react";

export interface Screenshot {
  title: string;
  description: string;
  src: string;
}

interface ScreenshotPayload { project?: string; screenshots?: Screenshot[]; }

export const ScreenshotViewer: React.FC<{ payload?: ScreenshotPayload }> = ({ payload }) => {
  const screenshots = payload?.screenshots ?? [];
  const [selected, setSelected] = useState(0);
  const screenshot = screenshots[selected];

  if (!screenshot) return <div className="p-3 text-[11px]">No screenshots loaded.</div>;

  return (
    <div className="h-full flex flex-col bg-w95-silver text-[11px]">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray">
        {["File", "View", "Help"].map((item) => <span key={item}><u>{item[0]}</u>{item.slice(1)}</span>)}
      </div>
      <div className="flex-1 min-h-0 flex">
        <div className="w-36 shrink-0 p-1 border-r border-w95-gray overflow-auto w95-scroll">
          {screenshots.map((item, index) => (
            <button key={item.src} className={`w-full text-left p-1 mb-1 ${selected === index ? "bg-w95-navy text-w95-text-on-navy" : ""}`} onClick={() => setSelected(index)}>
              <img src={item.src} alt="" className="w-full h-20 object-cover border border-w95-dark mb-1" />
              <span className="leading-tight block">{item.title}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0 p-2 flex flex-col gap-2">
          <div className="bevel-in bg-w95-gray flex-1 min-h-0 overflow-auto w95-scroll flex items-center justify-center">
            <img src={screenshot.src} alt={screenshot.title} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="bevel-in bg-w95-white px-2 py-1">
            <div className="font-bold">{screenshot.title}</div>
            <div>{screenshot.description}</div>
          </div>
        </div>
      </div>
      <div className="bevel-thin-in px-2 py-0.5 truncate">{payload?.project ?? "Screenshots"} — {selected + 1} of {screenshots.length}</div>
    </div>
  );
};
