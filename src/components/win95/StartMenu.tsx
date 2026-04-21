import React from "react";
import { useWM } from "./wm";
import { APPS } from "./apps/registry";
import {
  FolderIcon,
  NotepadIcon,
  SettingsIcon,
  FindIcon,
  HelpIcon,
  RunIcon,
  ShutDownIcon,
  MinesweeperIcon,
  IEIcon,
  CalculatorIcon,
  PaintIcon,
  MsDosIcon,
  BriefcaseIcon,
  MyComputerIcon,
  WordPadIcon,
  PrintersIcon,
  ProgramsIcon,
  DocumentsStartIcon,
  ProgramGroupIcon,
} from "./Icons";


interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  appId?: string;
  submenu?: MenuItem[];
  action?: () => void;
  separator?: boolean;
  bold?: boolean;
}

export const StartMenu: React.FC<{ onClose: () => void; onShutDown: () => void }> = ({
  onClose,
  onShutDown,
}) => {
  const { open } = useWM();
  const [hover, setHover] = React.useState<string | null>(null);

  const launch = (appId: string) => {
    const app = APPS[appId];
    if (!app) return;
    const w = app.defaultSize.w;
    const h = app.defaultSize.h;
    open({
      id: `${appId}-${Date.now()}`,
      appId,
      title: app.title,
      icon: <app.Icon size={16} />,
      x: Math.max(20, Math.floor((window.innerWidth - w) / 2)),
      y: Math.max(20, Math.floor((window.innerHeight - h) / 2 - 40)),
      width: w,
      height: h,
    });
    onClose();
  };

  const items: MenuItem[] = [
    {
      label: "Programs",
      icon: <ProgramsIcon size={20} />,
      submenu: [
        {
          label: "Accessories",
          icon: <ProgramGroupIcon size={16} />,
          submenu: [
            { label: "Calculator", icon: <CalculatorIcon size={16} />, appId: "calculator" },
            { label: "Notepad", icon: <NotepadIcon size={16} />, appId: "notepad" },
            { label: "Paint", icon: <PaintIcon size={16} />, appId: "paint" },
            { label: "WordPad", icon: <WordPadIcon size={16} />, appId: "wordpad" },
          ],
        },
        {
          label: "Games",
          icon: <ProgramGroupIcon size={16} />,
          submenu: [{ label: "Minesweeper", icon: <MinesweeperIcon size={16} />, appId: "minesweeper" }],
        },
        { label: "StartUp", icon: <ProgramGroupIcon size={16} />, submenu: [{ label: "(Empty)" }] },
        { separator: true, label: "" },
        { label: "Internet Explorer", icon: <IEIcon size={16} />, appId: "ie" },
        { label: "MS-DOS Prompt", icon: <MsDosIcon size={16} />, appId: "msdos" },
        { label: "Windows Explorer", icon: <MyComputerIcon size={16} />, appId: "my-computer" },
      ],
    },
    {
      label: "Documents",
      icon: <DocumentsStartIcon size={20} />,
      submenu: [
        { label: "My Documents", icon: <FolderIcon size={16} />, appId: "documents" },
        { label: "About Me.txt", icon: <NotepadIcon size={16} />, appId: "documents" },
        { label: "Resume.doc", icon: <BriefcaseIcon size={16} />, appId: "documents" },
        { label: "Projects", icon: <FolderIcon size={16} />, appId: "projects" },
      ],
    },
    {
      label: "Settings",
      icon: <SettingsIcon size={20} />,
      submenu: [
        { label: "Control Panel", icon: <SettingsIcon size={16} />, appId: "control-panel" },
        { label: "Printers", icon: <PrintersIcon size={16} />, appId: "control-panel" },
        { label: "Taskbar...", icon: <SettingsIcon size={16} />, appId: "control-panel" },
      ],
    },
    {
      label: "Find",
      icon: <FindIcon size={20} />,
      submenu: [
        { label: "Files or Folders...", icon: <FindIcon size={16} />, appId: "find" },
        { label: "Computer...", icon: <MyComputerIcon size={16} />, appId: "network-neighborhood" },
      ],
    },
    { label: "Help", icon: <HelpIcon size={20} />, appId: "help" },
    { label: "Run...", icon: <RunIcon size={20} />, appId: "run" },
    { separator: true, label: "" },
    { label: "Shut Down...", icon: <ShutDownIcon size={20} />, action: onShutDown },
  ];

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-start-menu]") && !t.closest("[data-start-button]")) onClose();
    };
    setTimeout(() => window.addEventListener("mousedown", onDown), 0);
    return () => window.removeEventListener("mousedown", onDown);
  }, [onClose]);

  return (
    <div
      data-start-menu
      className="absolute bottom-7 left-0 bevel-out bg-w95-silver flex z-[9999] text-[11px]"
      style={{ width: 200 }}
    >
      {/* Vertical Windows 95 banner */}
      <div className="bg-w95-gray flex items-end justify-start" style={{ width: 21 }}>
        <div
          className="font-bold pb-2 pl-1 select-none"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            letterSpacing: "0.04em",
            color: C_white,
            fontSize: 18,
          }}
        >
          <span style={{ color: C_white }}>Windows</span>
          <span style={{ color: "#C0C0C0", marginLeft: 4 }}>95</span>
        </div>
      </div>

      <div className="flex-1 py-1">
        {items.map((it, i) => <Item key={i} item={it} hover={hover} setHover={setHover} launch={launch} path={`${i}`} />)}
      </div>
    </div>
  );
};

const C_white = "#FFFFFF";

const Item: React.FC<{
  item: MenuItem;
  path: string;
  hover: string | null;
  setHover: (s: string | null) => void;
  launch: (id: string) => void;
}> = ({ item, hover, setHover, launch, path }) => {
  if (item.separator) return <div className="border-t border-w95-gray border-b border-b-w95-white my-1 mx-1" />;
  const isHover = hover?.startsWith(path);
  const exact = hover === path || hover?.startsWith(path + ".");
  return (
    <div
      className={`relative flex items-center justify-between pl-2 pr-3 py-1 cursor-default ${
        exact ? "bg-w95-navy text-w95-text-on-navy" : ""
      }`}
      onMouseEnter={() => setHover(path)}
      onClick={(e) => {
        e.stopPropagation();
        if (item.action) item.action();
        else if (item.appId) launch(item.appId);
      }}
    >
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 flex items-center justify-center shrink-0">{item.icon}</span>
        <span>{item.label}</span>
      </div>
      {item.submenu && <span className="ml-2">▶</span>}
      {isHover && item.submenu && (
        <div
          className="absolute left-full top-0 -ml-px bevel-out bg-w95-silver py-1 text-w95-text z-[10000]"
          style={{ minWidth: 180 }}
        >
          {item.submenu.map((s, j) => (
            <Item key={j} item={s} hover={hover} setHover={setHover} launch={launch} path={`${path}.${j}`} />
          ))}
        </div>
      )}
    </div>
  );
};
