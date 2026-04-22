import React from "react";
import {
  MyComputerIcon, RecycleBinIcon, NotepadIcon, IEIcon, MinesweeperIcon,
  BriefcaseIcon, InboxIcon, FolderIcon, HelpIcon, NetworkNeighborhoodIcon,
  PaintIcon, CalculatorIcon, SettingsIcon, MsDosIcon, RunIcon, FindIcon, WordPadIcon,
  MyDocumentsIcon,
} from "../Icons";
import { MyComputer } from "./MyComputer";
import { Projects } from "./Projects";
import { Contact } from "./Contact";
import { InternetExplorer } from "./InternetExplorer";
import { Minesweeper } from "./Minesweeper";
import { RecycleBin } from "./RecycleBin";
import { HelpApp } from "./HelpApp";
import { NetworkNeighborhood } from "./NetworkNeighborhood";
import { Paint } from "./Paint";
import { Calculator } from "./Calculator";
import { Notepad } from "./Notepad";
import { ControlPanel } from "./ControlPanel";
import { Documents } from "./Documents";
import { ImageViewer } from "./ImageViewer";
import { MsDosPrompt } from "./MsDosPrompt";
import { RunDialog } from "./RunDialog";
import { FindFiles } from "./FindFiles";
import { CdPlayer } from "./CdPlayer";
import { DriveBrowser } from "./DriveBrowser";
import { WordPad } from "./WordPad";

export interface AppDef {
  id: string;
  title: string;
  Icon: React.FC<{ size?: number }>;
  defaultSize: { w: number; h: number };
  Component: React.FC<{ payload?: any }>;
  hideFromDesktop?: boolean;
  hideFromStart?: boolean;
  variant?: "default" | "menu" | "raw";
  resizable?: boolean;
}

export const APPS: Record<string, AppDef> = {
  "my-computer": { id: "my-computer", title: "My Computer", Icon: MyComputerIcon, defaultSize: { w: 520, h: 360 }, Component: MyComputer },
  "network-neighborhood": { id: "network-neighborhood", title: "Network Neighborhood", Icon: NetworkNeighborhoodIcon, defaultSize: { w: 480, h: 320 }, Component: NetworkNeighborhood },
  inbox:    { id: "inbox", title: "Inbox", Icon: InboxIcon, defaultSize: { w: 480, h: 360 }, Component: Contact },
  documents:{ id: "documents", title: "My Documents", Icon: MyDocumentsIcon, defaultSize: { w: 560, h: 380 }, Component: Documents },
  projects: { id: "projects", title: "Projects", Icon: FolderIcon, defaultSize: { w: 600, h: 420 }, Component: Projects, hideFromDesktop: true },
  contact:  { id: "contact", title: "Contact - Inbox", Icon: InboxIcon, defaultSize: { w: 480, h: 360 }, Component: Contact, hideFromDesktop: true },
  ie:       { id: "ie", title: "Internet Explorer", Icon: IEIcon, defaultSize: { w: 760, h: 520 }, Component: InternetExplorer },
  minesweeper: { id: "minesweeper", title: "Minesweeper", Icon: MinesweeperIcon, defaultSize: { w: 162, h: 270 }, Component: Minesweeper, variant: "raw", resizable: false },
  "recycle-bin": { id: "recycle-bin", title: "Recycle Bin", Icon: RecycleBinIcon, defaultSize: { w: 460, h: 320 }, Component: RecycleBin },
  notepad:  { id: "notepad", title: "Untitled - Notepad", Icon: NotepadIcon, defaultSize: { w: 520, h: 380 }, Component: Notepad, hideFromDesktop: true },
  paint:    { id: "paint", title: "untitled - Paint", Icon: PaintIcon, defaultSize: { w: 680, h: 500 }, Component: Paint, hideFromDesktop: true },
  calculator: { id: "calculator", title: "Calculator", Icon: CalculatorIcon, defaultSize: { w: 230, h: 300 }, Component: Calculator, hideFromDesktop: true },
  "control-panel": { id: "control-panel", title: "Control Panel", Icon: SettingsIcon, defaultSize: { w: 520, h: 360 }, Component: ControlPanel, hideFromDesktop: true },
  help:     { id: "help", title: "Help", Icon: HelpIcon, defaultSize: { w: 420, h: 320 }, Component: HelpApp, hideFromDesktop: true },
  resume:   { id: "resume", title: "Resume.doc - WordPad", Icon: WordPadIcon, defaultSize: { w: 620, h: 500 }, Component: WordPad, hideFromDesktop: true },
  wordpad:  { id: "wordpad", title: "Document - WordPad", Icon: WordPadIcon, defaultSize: { w: 620, h: 500 }, Component: WordPad, hideFromDesktop: true },
  about:    { id: "about", title: "About Me - Notepad",   Icon: NotepadIcon,   defaultSize: { w: 520, h: 380 }, Component: Notepad, hideFromDesktop: true },
  "image-viewer": { id: "image-viewer", title: "Image Viewer", Icon: PaintIcon, defaultSize: { w: 560, h: 440 }, Component: ImageViewer, hideFromDesktop: true, hideFromStart: true },
  msdos: { id: "msdos", title: "MS-DOS Prompt", Icon: MsDosIcon, defaultSize: { w: 560, h: 380 }, Component: MsDosPrompt, hideFromDesktop: true },
  run: { id: "run", title: "Run", Icon: RunIcon, defaultSize: { w: 380, h: 200 }, Component: RunDialog, hideFromDesktop: true, hideFromStart: true },
  find: { id: "find", title: "Find: All Files", Icon: FindIcon, defaultSize: { w: 480, h: 360 }, Component: FindFiles, hideFromDesktop: true, hideFromStart: true },
  "cd-player": { id: "cd-player", title: "CD Player - [D:]", Icon: MyComputerIcon, defaultSize: { w: 320, h: 220 }, Component: CdPlayer, hideFromDesktop: true, hideFromStart: true },
  "drive-browser": { id: "drive-browser", title: "(C:)", Icon: FolderIcon, defaultSize: { w: 520, h: 380 }, Component: DriveBrowser, hideFromDesktop: true, hideFromStart: true },
};

export const DESKTOP_LAYOUT = [
  "my-computer",
  "network-neighborhood",
  "inbox",
  "recycle-bin",
  "documents",
  "ie",
  "minesweeper",
];
