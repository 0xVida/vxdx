import React from "react";
import { useContextMenu } from "../ContextMenu";
import { useWM } from "../wm";
import { APPS } from "./registry";
import { NotepadIcon, BriefcaseIcon, FolderIcon, InboxIcon, QuestionDocIcon, PaintIcon } from "../Icons";

export const DOCS = [
  {
    id: "about-doc", label: "About Me.txt", appId: "notepad", title: "About Me.txt - Notepad",
    Icon: NotepadIcon,
    payload: {
      readOnly: true, content:
        `================================
   ABOUT ME
================================

  Hi, I'm Victor Ademiju (Vida).
  Protocol Design Engineer.

  I specialize in backend systems and 
  blockchain development, crafting 
  robust solutions across Solana, 
  EVM and Move ecosystems - Sui specifically.

--------------------------------
  EXPERTISE
--------------------------------
  > Protocol Architecture
  > Smart Contract Development
  > Distributed Systems
  > Rust, Move, Solidity, TS

--------------------------------
  HIGHLIGHTS
--------------------------------
  Bullposting Sui on a daily
  Unprofessional Rapper
  Can't code without music
  Plays basketball and soccer
  Kostas Kryptos cryptography student
` }
  },
  {
    id: "resume-doc", label: "Resume.doc", appId: "notepad", title: "Resume.doc - WordPad",
    Icon: BriefcaseIcon,
    payload: {
      readOnly: true, content:
        `VICTOR ADEMIJU
Protocol Design Engineer

EXPERIENCE
----------
• Protocol Design Engineer (2022–present)
  Led protocol design for a healthcare 
  application serving thousands of users.
  Won multiple Sui hackathons.

• Blockchain Developer (2021–present)
  Built on Sui, Solana and EVM.
  Expertise in Move Sui stack primitives:
  Walrus, Seal, Nautilus, Deepbook,
  Enoki for ZK login and Sui NS.

• Fullstack Developer (2020–present)
  Crafted robust backend architectures 
  and scalable API solutions.

EDUCATION & REWARDS
------------------
• Mysten Labs Bootcamp (2025) Hackathon Winner
` }
  },
  {
    id: "selfie-doc", label: "selfie.jpg", appId: "image-viewer", title: "selfie.jpg",
    Icon: PaintIcon,
    payload: { dataUrl: "/vida.png", name: "selfie.jpg" }
  },
  {
    id: "projects-doc", label: "Projects", appId: "projects", title: "Projects",
    Icon: FolderIcon, payload: {}
  },
  {
    id: "contact-doc", label: "Contact.eml", appId: "contact", title: "Contact - Inbox",
    Icon: InboxIcon, payload: {}
  },
  {
    id: "readme-doc", label: "README.txt", appId: "notepad", title: "README.txt - Notepad",
    Icon: QuestionDocIcon,
    payload: {
      readOnly: false, content:
        `Welcome to my Windows 95 portfolio!

• Double-click any document to open it.
• Right-click the desktop for options.
• Try Paint, Calculator, Minesweeper, or
  the Internet Explorer (it really browses).
` }
  },
];

export const Documents: React.FC = () => {
  const { open } = useWM();
  const { open: openMenu } = useContextMenu();
  const [sel, setSel] = React.useState<string | null>(null);

  const launch = (d: typeof DOCS[number]) => {
    const app = APPS[d.appId]; if (!app) return;
    open({
      id: d.id,
      appId: d.appId,
      title: d.title,
      icon: <d.Icon size={16} />,
      x: 80 + Math.random() * 80, y: 60 + Math.random() * 40,
      width: app.defaultSize.w, height: app.defaultSize.h,
      payload: d.payload,
    });
  };

  return (
    <div className="h-full flex flex-col bg-w95-silver">
      <div className="flex gap-3 px-2 py-0.5 border-b border-w95-gray text-[11px]">
        {["File", "Edit", "View", "Help"].map(m => <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>)}
      </div>
      <div className="flex-1 p-2 flex flex-wrap gap-1 content-start overflow-auto w95-scroll" onClick={() => setSel(null)}>
        {DOCS.map(d => {
          const isSel = sel === d.id;
          return (
            <button key={d.id} className="flex flex-col items-center p-1 focus:outline-none w-[75px]"
              onClick={(e) => {
                e.stopPropagation();
                if (sel === d.id) {
                  launch(d);
                } else {
                  setSel(d.id);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSel(d.id);
                openMenu({ x: e.clientX, y: e.clientY }, [
                  { kind: "item", label: "Open", bold: true, onClick: () => launch(d) },
                  { kind: "sep" },
                  { kind: "item", label: "Properties", disabled: true }
                ]);
              }}
            >
              <div className={isSel ? "opacity-70" : ""}><d.Icon size={32} /></div>
              <div className={`mt-1 px-0.5 text-[11px] text-center leading-tight ${isSel ? "bg-w95-navy text-w95-text-on-navy" : "text-w95-text"}`}>
                {d.label}
              </div>
            </button>
          );
        })}
      </div>
      <div className="bevel-thin-in px-2 py-0.5 text-[11px] bg-w95-silver">{DOCS.length} object(s)</div>
    </div>
  );
};
