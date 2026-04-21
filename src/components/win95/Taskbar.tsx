import React, { useEffect, useState } from "react";
import { useWM } from "./wm";
import { APPS } from "./apps/registry";
import { StartFlagIcon, SpeakerIcon } from "./Icons";
import { StartMenu } from "./StartMenu";
import { ShutDownDialog } from "./ShutDownDialog";

export const Taskbar: React.FC = () => {
  const { windows, activeId, focus, minimize } = useWM();
  const [startOpen, setStartOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <>
      {startOpen && (
        <StartMenu
          onClose={() => setStartOpen(false)}
          onShutDown={() => {
            setStartOpen(false);
            setShutdownOpen(true);
          }}
        />
      )}
      {shutdownOpen && <ShutDownDialog onClose={() => setShutdownOpen(false)} />}
      <div data-start-button className="absolute bottom-0 left-0 right-0 h-7 bevel-out bg-w95-silver flex items-center px-0.5 gap-0.5 z-[9999]">
        <button
          className={`flex items-center gap-1 px-2 h-6 font-bold text-[11px] ${
            startOpen ? "bevel-pressed" : "bevel-out"
          } bg-w95-silver`}
          onClick={(e) => {
            e.stopPropagation();
            setStartOpen((v) => !v);
          }}
        >
          <StartFlagIcon size={18} />
          <span>Start</span>
        </button>

        <div className="bevel-thin-in h-6 w-px mx-0.5" />

        <div className="flex-1 flex items-center gap-0.5 overflow-hidden">
          {windows.map((w) => {
            const app = APPS[w.appId];
            const active = activeId === w.id && !w.minimized;
            return (
              <button
                key={w.id}
                onClick={() => (active ? minimize(w.id) : focus(w.id))}
                className={`flex items-center gap-1 px-1 h-6 max-w-[160px] text-[11px] bg-w95-silver ${
                  active ? "bevel-pressed" : "bevel-out"
                }`}
              >
                {app && <app.Icon size={16} />}
                <span className="truncate">{w.title.split(" - ")[0]}</span>
              </button>
            );
          })}
        </div>

        <div className="bevel-in h-6 px-2 flex items-center gap-2 text-[11px]">
          <SpeakerIcon size={16} />
          <span>{time}</span>
        </div>
      </div>
    </>
  );
};
