import React, { useState } from "react";
import {
  AccessibilityIcon, AddHardwareIcon, AddRemoveIcon, DateTimeIcon, DisplayIcon,
  FontsIcon, InternetCplIcon, JoystickIcon, KeyboardIcon, InboxIcon, ModemsIcon,
  MouseIcon, MultimediaIcon, NetworkCplIcon, PasswordsIcon, PowerIcon, PrintersIcon,
  RegionalIcon, SoundsCplIcon, SystemIcon,
} from "../Icons";
import { showMessage } from "../MessageBox";
import { useWM } from "../wm";
import { useContextMenu } from "../ContextMenu";
import { APPS } from "./registry";

interface Applet {
  id: string;
  label: string;
  Icon: React.FC<{ size?: number }>;
  status: string;
}

const APPLETS: Applet[] = [
  { id: "accessibility", label: "Accessibility\nOptions", Icon: AccessibilityIcon, status: "Customizes accessibility features." },
  { id: "addhardware", label: "Add New\nHardware", Icon: AddHardwareIcon, status: "Installs new hardware on your computer." },
  { id: "addremove", label: "Add/Remove\nPrograms", Icon: AddRemoveIcon, status: "Sets up programs and creates shortcuts." },
  { id: "datetime", label: "Date/Time", Icon: DateTimeIcon, status: "Sets the date, time and time zone." },
  { id: "display", label: "Display", Icon: DisplayIcon, status: "Changes settings for your display." },
  { id: "fonts", label: "Fonts", Icon: FontsIcon, status: "Views, adds and removes fonts." },
  { id: "internet", label: "Internet", Icon: InternetCplIcon, status: "Configures Internet settings." },
  { id: "joystick", label: "Joystick", Icon: JoystickIcon, status: "Configures game controllers." },
  { id: "keyboard", label: "Keyboard", Icon: KeyboardIcon, status: "Changes settings for your keyboard." },
  { id: "mail", label: "Mail", Icon: InboxIcon, status: "Microsoft Mail Postoffice." },
  { id: "modems", label: "Modems", Icon: ModemsIcon, status: "Installs a new modem and changes properties." },
  { id: "mouse", label: "Mouse", Icon: MouseIcon, status: "Changes settings for your mouse." },
  { id: "multimedia", label: "Multimedia", Icon: MultimediaIcon, status: "Changes settings for multimedia devices." },
  { id: "network", label: "Network", Icon: NetworkCplIcon, status: "Configures network hardware and software." },
  { id: "passwords", label: "Passwords", Icon: PasswordsIcon, status: "Changes passwords and sets security options." },
  { id: "power", label: "Power", Icon: PowerIcon, status: "Changes Power Management settings." },
  { id: "printers", label: "Printers", Icon: PrintersIcon, status: "Adds, removes and changes printer settings." },
  { id: "regional", label: "Regional\nSettings", Icon: RegionalIcon, status: "Changes how numbers, currencies, dates display." },
  { id: "sounds", label: "Sounds", Icon: SoundsCplIcon, status: "Assigns sounds to system events." },
  { id: "system", label: "System", Icon: SystemIcon, status: "Provides system information." },
];

const BG_COLORS = [
  { name: "Teal", value: "180 100% 25%" },
  { name: "Navy", value: "240 100% 25%" },
  { name: "Maroon", value: "0 100% 25%" },
  { name: "Olive", value: "60 100% 20%" },
  { name: "Purple", value: "300 60% 25%" },
  { name: "Black", value: "0 0% 0%" },
];

export const ControlPanel: React.FC = () => {
  const { open: openApp } = useWM();
  const { open: openMenu } = useContextMenu();
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const launch = (id: string) => {
    if (id === "display") { setOpen("display"); return; }
    if (id === "sounds") { setOpen("sounds"); return; }
    if (id === "datetime") { setOpen("datetime"); return; }
    if (id === "mouse") { setOpen("mouse"); return; }
    if (id === "keyboard") { setOpen("keyboard"); return; }

    const applet = APPLETS.find(a => a.id === id);
    showMessage({
      title: applet?.label.replace("\n", " ") ?? "Control Panel",
      message: `${applet?.status}\n\nThis applet is not available in this demo.`,
      icon: "info",
    });
  };

  if (open === "display") {
    return (
      <Subpanel title="Display Properties" onClose={() => setOpen(null)}>
        <div className="font-bold mb-2">Background</div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {BG_COLORS.map(c => (
            <button key={c.name} className="bevel-out p-2 flex items-center gap-2"
              onClick={() => document.documentElement.style.setProperty("--w95-teal", c.value)}>
              <div className="w-6 h-6 border border-w95-gray" style={{ background: `hsl(${c.value})` }} />
              {c.name}
            </button>
          ))}
        </div>
      </Subpanel>
    );
  }

  if (open === "sounds") {
    const beep = () => {
      const ctx = new window.AudioContext();
      const o = ctx.createOscillator(); o.frequency.value = 880; o.connect(ctx.destination);
      o.start(); setTimeout(() => { o.stop(); ctx.close(); }, 150);
    };
    return (
      <Subpanel title="Sounds Properties" onClose={() => setOpen(null)}>
        <div className="mb-2">Test the system Default Beep:</div>
        <button className="w95-button px-3" onClick={beep}>▶ Test</button>
      </Subpanel>
    );
  }

  if (open === "datetime") {
    return (
      <Subpanel title="Date/Time Properties" onClose={() => setOpen(null)}>
        <div className="mb-2">Current system time:</div>
        <div className="bevel-in bg-white p-2 font-mono">{new Date().toLocaleString()}</div>
      </Subpanel>
    );
  }

  if (open === "mouse") {
    return (
      <Subpanel title="Mouse Properties" onClose={() => setOpen(null)}>
        <div className="mb-2">Double-click speed:</div>
        <input type="range" min={1} max={10} defaultValue={5} className="w-full" />
      </Subpanel>
    );
  }

  if (open === "keyboard") {
    return (
      <Subpanel title="Keyboard Properties" onClose={() => setOpen(null)}>
        <div className="mb-2">Repeat rate:</div>
        <input type="range" min={1} max={10} defaultValue={5} className="w-full" />
      </Subpanel>
    );
  }

  const selectedApplet = APPLETS.find(a => a.id === selected);

  return (
    <div className="h-full flex flex-col bg-w95-silver">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray text-[11px]">
        {["File", "Edit", "View", "Help"].map((m) => <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>)}
      </div>
      <div
        className="flex-1 p-2 flex flex-wrap gap-1 content-start overflow-auto w95-scroll"
        onClick={() => setSelected(null)}
      >
        {APPLETS.map(({ id, label, Icon }) => {
          const isSel = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (selected === id) {
                  launch(id);
                } else {
                  setSelected(id);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelected(id);
                openMenu({ x: e.clientX, y: e.clientY }, [
                  { kind: "item", label: "Open", bold: true, onClick: () => launch(id) }
                ]);
              }}
              className="flex flex-col items-center p-1 focus:outline-none w-[75px]"
            >
              <div className={isSel ? "opacity-70" : ""}><Icon size={32} /></div>
              <div className={`mt-1 px-0.5 text-[11px] text-center leading-tight whitespace-pre-line ${isSel ? "bg-w95-navy text-w95-text-on-navy" : "text-w95-text"}`}>
                {label}
              </div>
            </button>
          );
        })}
      </div>
      <div className="bevel-thin-in px-2 py-0.5 text-[11px] bg-w95-silver">
        {selectedApplet ? selectedApplet.status : `${APPLETS.length} object(s)`}
      </div>
    </div>
  );
};

const Subpanel: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="h-full flex flex-col bg-w95-silver p-3 text-[11px]">
    <div className="font-bold mb-2">{title}</div>
    <div className="flex-1 bevel-in bg-w95-silver p-3">{children}</div>
    <div className="flex justify-end gap-2 mt-2">
      <button className="w95-button px-4" onClick={onClose}>OK</button>
      <button className="w95-button px-4" onClick={onClose}>Cancel</button>
    </div>
  </div>
);
