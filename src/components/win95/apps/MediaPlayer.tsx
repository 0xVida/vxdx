import React, { useState } from "react";
import type { DemoVideo } from "./Projects";

interface MediaPayload { project?: string; videos?: DemoVideo[]; }
const youtubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const MediaPlayer: React.FC<{ payload?: MediaPayload }> = ({ payload }) => {
  const videos = payload?.videos ?? [];
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const video = videos[track];
  if (!video) return <div className="h-full grid place-items-center bg-w95-silver text-[11px]">No media loaded.</div>;

  const selectTrack = (index: number) => { setTrack(index); setPlaying(false); };

  return (
    <div className="h-full flex flex-col bg-w95-silver text-[11px]">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray">
        {["File", "View", "Play", "Help"].map((item) => <span key={item}><u>{item[0]}</u>{item.slice(1)}</span>)}
      </div>
      <div className="flex-1 min-h-0 p-2 flex flex-col gap-2">
        <div className="bevel-in bg-black flex-1 min-h-[180px] relative overflow-hidden grid place-items-center">
          {playing ? (
            <iframe key={video.youtubeId} className="w-full h-full" src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          ) : (
            <button className="absolute inset-0 w-full h-full group" onClick={() => setPlaying(true)} aria-label={`Play ${video.title}`}>
              <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" className="w-full h-full object-contain opacity-75 group-hover:opacity-90" />
              <span className="absolute inset-0 grid place-items-center"><span className="w95-button !min-w-0 !px-4 !py-2 text-base">▶ Play</span></span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="bevel-in bg-black text-green-400 font-mono px-2 py-1 shrink-0">{String(track + 1).padStart(2, "0")}</div>
          <select className="w95-input flex-1 min-w-0" value={track} onChange={(event) => selectTrack(Number(event.target.value))}>
            {videos.map((item, index) => <option key={item.youtubeId} value={index}>{item.title}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-1 justify-center">
          <button className="w95-button !min-w-0 px-2" onClick={() => selectTrack(Math.max(0, track - 1))} disabled={track === 0}>◀◀</button>
          <button className="w95-button !min-w-0 px-3" onClick={() => setPlaying(true)}>▶</button>
          <button className="w95-button !min-w-0 px-3" onClick={() => setPlaying(false)}>■</button>
          <button className="w95-button !min-w-0 px-2" onClick={() => selectTrack(Math.min(videos.length - 1, track + 1))} disabled={track === videos.length - 1}>▶▶</button>
          <button className="w95-button ml-2" onClick={() => window.open(youtubeUrl(video.youtubeId), "_blank", "noopener,noreferrer")}>YouTube</button>
        </div>
      </div>
      <div className="bevel-thin-in px-2 py-0.5 flex justify-between">
        <span className="truncate">{payload?.project ?? "Video CD"}: {video.title}</span>
        <span className="shrink-0 ml-2">{playing ? "Playing" : "Stopped"}</span>
      </div>
    </div>
  );
};
