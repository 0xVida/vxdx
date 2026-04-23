import React from "react";

export const ImageViewer: React.FC<{ payload?: { dataUrl?: string; name?: string } }> = ({ payload }) => {
  if (!payload?.dataUrl) {
    return <div className="p-3 text-[11px]">No image to display.</div>;
  }
  return (
    <div className="h-full flex flex-col bg-w95-silver">
      <div className="flex-1 overflow-hidden bevel-in m-1 bg-w95-gray flex items-center justify-center w95-scroll">
        <img src={payload.dataUrl} alt={payload.name || "image"} className="max-w-full max-h-full object-contain" style={{ imageRendering: "pixelated" }} />
      </div>
      <div className="bevel-thin-in px-2 py-0.5 text-[11px]">{payload.name}</div>
    </div>
  );
};
