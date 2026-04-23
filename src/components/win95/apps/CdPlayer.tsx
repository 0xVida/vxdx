import React, { useEffect, useRef, useState } from "react";

const TRACKS = [
  { n: 1, title: "Track 01", len: "03:24" },
  { n: 2, title: "Track 02", len: "04:11" },
  { n: 3, title: "Track 03", len: "02:58" },
  { n: 4, title: "Track 04", len: "05:02" },
  { n: 5, title: "Track 05", len: "03:47" },
];

export const CdPlayer: React.FC = () => {
  const [track, setTrack] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [playing]);

  const startTone = () => {
    try {
      const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 220 + track * 40;
      osc.type = "sine";
      gain.gain.value = 0.04;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
    } catch {/* ignore */}
  };
  const stopTone = () => {
    try { oscRef.current?.stop(); oscRef.current?.disconnect(); oscRef.current = null; } catch {/* ignore */}
  };

  const play = () => { setPlaying(true); startTone(); };
  const pause = () => { setPlaying(false); stopTone(); };
  const stop = () => { setPlaying(false); setElapsed(0); stopTone(); };
  const next = () => { setTrack((t) => Math.min(TRACKS.length, t + 1)); setElapsed(0); };
  const prev = () => { setTrack((t) => Math.max(1, t - 1)); setElapsed(0); };

  useEffect(() => () => stopTone(), []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="h-full flex flex-col bg-w95-silver text-[11px]">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray">
        {["Disc", "View", "Options", "Help"].map((m) => (
          <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>
        ))}
      </div>
      <div className="p-2 flex flex-col gap-2">
        <div className="bevel-in bg-black text-green-400 font-mono text-2xl px-3 py-2 text-center tracking-widest">
          {fmt(elapsed)}
        </div>
        <div className="flex items-center justify-between">
          <span>Track:</span>
          <select className="w95-input" value={track} onChange={(e) => { setTrack(+e.target.value); setElapsed(0); }}>
            {TRACKS.map((t) => <option key={t.n} value={t.n}>{`<${String(t.n).padStart(2, "0")}> ${t.title}`}</option>)}
          </select>
        </div>
        <div className="flex justify-between text-w95-text-disabled">
          <span>Total: {TRACKS.length} tracks</span>
          <span>Length: {TRACKS[track - 1].len}</span>
        </div>
        <div className="flex gap-1 justify-center mt-1">
          <button className="w95-button px-2" onClick={play} disabled={playing}>▶</button>
          <button className="w95-button px-2" onClick={pause} disabled={!playing}>‖</button>
          <button className="w95-button px-2" onClick={stop}>■</button>
          <button className="w95-button px-2" onClick={prev}>◀◀</button>
          <button className="w95-button px-2" onClick={next}>▶▶</button>
        </div>
      </div>
      <div className="bevel-thin-in mt-auto px-2 py-0.5 flex justify-between">
        <span>Audio CD in drive D:</span>
        <span>{playing ? "Playing" : "Stopped"}</span>
      </div>
    </div>
  );
};
