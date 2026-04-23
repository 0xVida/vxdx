import React, { useEffect, useRef, useState } from "react";
import { IEIcon } from "../Icons";

const HOME = "https://en.wikipedia.org/wiki/Windows_95";

const normalizeUrl = (raw: string) => {
  const s = raw.trim();
  if (!s) return HOME;
  if (/^https?:\/\//i.test(s)) return s;
  if (s.includes(".") && !s.includes(" ")) return "https://" + s;
  return "https://duckduckgo.com/?q=" + encodeURIComponent(s);
};

// Render via a CORS-friendly proxy so most sites display in the iframe.
// We use a query param 'cb' as a cache-buster to ensure fresh loads.
const proxied = (url: string) => `https://r.jina.ai/${url}?cb=${Date.now()}`;

export const InternetExplorer: React.FC = () => {
  const [history, setHistory] = useState<string[]>([HOME]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState(HOME);
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const url = history[idx];

  // Safeguard: Clear loading state if it takes too long
  useEffect(() => {
    if (loading) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setLoading(false);
        console.warn("IE: Page load timed out.");
      }, 8000);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loading]);

  const go = (raw: string) => {
    const u = normalizeUrl(raw);
    const next = [...history.slice(0, idx + 1), u];
    setHistory(next);
    setIdx(next.length - 1);
    setInput(u);
    setLoading(true);
  };

  const back = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setInput(history[idx - 1]);
      setLoading(true);
    }
  };

  const fwd = () => {
    if (idx < history.length - 1) {
      setIdx(idx + 1);
      setInput(history[idx + 1]);
      setLoading(true);
    }
  };

  const refresh = () => {
    setLoading(true);
    if (iframeRef.current) {
      // Small trick to force a reload of the same URL
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
      }, 10);
    }
  };

  const home = () => go(HOME);

  const stop = () => {
    setLoading(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <div className="h-full flex flex-col bg-w95-silver text-[11px]">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray">
        {["File", "Edit", "View", "Go", "Favorites", "Help"].map((m) => (
          <span key={m} className="cursor-default">
            <u>{m[0]}</u>
            {m.slice(1)}
          </span>
        ))}
      </div>
      <div className="flex gap-1 p-1 bevel-thin-out">
        <button className="w95-button px-2" onClick={back} disabled={idx === 0}>
          ← Back
        </button>
        <button className="w95-button px-2" onClick={fwd} disabled={idx === history.length - 1}>
          Forward →
        </button>
        <button className="w95-button px-2" onClick={stop}>
          Stop
        </button>
        <button className="w95-button px-2" onClick={refresh}>
          Refresh
        </button>
        <button className="w95-button px-2" onClick={home}>
          Home
        </button>
      </div>
      <div className="flex items-center gap-1 px-1 pb-1">
        <span>Address:</span>
        <input
          className="w95-input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go(input)}
        />
        <button className="w95-button px-2" onClick={() => go(input)}>
          Go
        </button>
        <div className="ml-1 animate-spin-slow">
          <IEIcon size={20} />
        </div>
      </div>
      <div className="flex-1 bevel-in bg-white relative overflow-hidden">
        <iframe
          ref={iframeRef}
          key={url}
          src={proxied(url)}
          className="w-full h-full bg-white font-mono"
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
          title="IE"
        />
        {loading && (
          <div className="absolute top-1 right-2 text-[10px] text-w95-text-disabled animate-pulse bg-white/80 px-1 border border-w95-gray">
            Opening page...
          </div>
        )}
      </div>
      <div className="bevel-thin-in px-2 py-0.5 flex justify-between bg-w95-silver">
        <span>{loading ? "Connecting to host..." : "Done"}</span>
        <div className="flex items-center gap-2">
          <span>Internet zone</span>
          <div className="w-16 h-4 bevel-thin-in bg-w95-silver overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 bg-w95-navy/30 animate-[loading-bar_2s_infinite]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
