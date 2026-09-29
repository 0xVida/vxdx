import React, { useState } from "react";
import { FolderIcon, IEIcon, NotepadIcon, CdPlayerIcon, PaintIcon } from "../Icons";
import { useWM } from "../wm";
import type { Screenshot } from "./ScreenshotViewer";

export interface DemoVideo { title: string; youtubeId: string; }

interface Project {
  name: string;
  type: string;
  status: "Live" | "Building";
  description: string;
  stack: string[];
  url?: string;
  sourceUrl?: string;
  socialUrl?: string;
  extraUrl?: string;
  extraLabel?: string;
  fallbackUrl?: string;
  videos?: DemoVideo[];
  screenshots?: Screenshot[];
  Icon: React.FC<{ size?: number }>;
}

const PROJECTS: Project[] = [
  {
    name: "OpenHacks.exe", type: "Application", status: "Live", Icon: IEIcon,
    description: "Escrow and bounty infrastructure for autonomous agents and human contributors. It connects GitHub issues to automatic payouts when accepted work is merged, with headless agent registration through GitHub Device Flow.",
    stack: ["Next.js", "TypeScript", "GitHub API", "Escrow", "AI Agents"],
    url: "https://openhacks-pro.vercel.app", sourceUrl: "https://github.com/0xVida/openhacks",
    videos: [{ title: "OpenHacks Demo", youtubeId: "0bejBx4jCJI" }],
  },
  {
    name: "Knapstore.exe", type: "Application", status: "Live", Icon: IEIcon,
    description: "Solana's NFT trait marketplace. Collectors can preview, buy, sell, attach, detach and upgrade individual NFT attributes instead of trading the entire collectible.",
    stack: ["Solana", "Anchor", "Next.js", "MPL Core", "NFT Traits"],
    sourceUrl: "https://github.com/knapstore-xyz",
    socialUrl: "https://x.com/knapstore",
    videos: [
      { title: "Knapstore Demo", youtubeId: "tRMLAzb2WzE" },
      { title: "Knapstore Visualizer", youtubeId: "tZIAC7S4Tg0" },
    ],
  },
  {
    name: "Moringa OS.exe", type: "Application", status: "Live", Icon: IEIcon,
    description: "A personal AI operating system on 0G. One conversational interface can create dockable mini apps, prepare wallet actions for confirmation, run metered AI inference and persist chat history on decentralized storage.",
    stack: ["0G Compute", "0G Storage", "AI Agents", "Web3", "TypeScript"],
    url: "https://moringa-os.vercel.app/", sourceUrl: "https://github.com/0xVida/moringa-os",
    videos: [{ title: "Moringa OS Demo", youtubeId: "8bazh8MLPGE" }],
  },
  {
    name: "Inter-Stellar Battle.exe", type: "Game", status: "Live", Icon: IEIcon,
    description: "A retro 16-bit wagered fighting game on Stellar. Noir proofs and Soroban contracts resolve combat while keeping player moves private; Blind Duel also hides fighter, health and energy state.",
    stack: ["Stellar", "Soroban", "Noir", "Zero Knowledge", "Phaser"],
    url: "https://inter-stellar-battle.vercel.app/", sourceUrl: "https://github.com/0xVida/inter-stellar-battle",
    videos: [{ title: "Inter-Stellar Battles Demo", youtubeId: "JcurxlGZnG8" }],
  },
  {
    name: "Otter Protocol.txt", type: "Protocol", status: "Live", Icon: NotepadIcon,
    description: "A programmable data exchange layer on Sui that connects data providers and consumers through encrypted storage, access control and chunked delivery.",
    stack: ["Move", "Sui", "Walrus", "Seal", "TypeScript"],
    url: "https://otter-protocol.vercel.app/", sourceUrl: "https://github.com/0xVida/Otter",
  },
  {
    name: "Penguin.exe", type: "Application", status: "Live", Icon: IEIcon,
    description: "Privacy focused decentralized messaging on Sui, using Walrus for storage, Seal for access control and Enoki for zero knowledge onboarding.",
    stack: ["Sui", "Walrus", "Seal", "Enoki", "SuiNS"],
    url: "https://penguin-rose.vercel.app/", sourceUrl: "https://github.com/theloneson/Penguin",
  },
  {
    name: "Memo Protocol", type: "Protocol", status: "Live", Icon: FolderIcon,
    description: "A public utility protocol for attaching memos to Sui transactions, with on-chain Move contracts and a TypeScript SDK for application developers.",
    stack: ["Sui", "Move", "TypeScript", "SDK"],
    url: "https://testnet.suivision.xyz/package/0x21eba4a9ac6005260f45e776afebf02de42eada48438deceac0b76b9886e37d8",
    sourceUrl: "https://github.com/0xVida/memo-protocol",
  },
  {
    name: "FynMarket [WIP]", type: "Protocol", status: "Building", Icon: FolderIcon,
    description: "Currently building a strategy market with on-chain request execution, curve pricing, position accounting, venue adapters, NAV calculation and safety monitoring across Solana and prediction-market infrastructure.",
    stack: ["Solana", "TypeScript", "PostgreSQL", "Polymarket", "Protocol Design"],
    sourceUrl: "https://github.com/Fynmarket/",
    socialUrl: "https://x.com/Fynmarket",
  },
  {
    name: "Paymod.exe", type: "Protocol", status: "Live", Icon: NotepadIcon,
    description: "Programmable financial authority for AI agents. A deterministic policy engine decides whether a payment can proceed, needs Telegram approval or must be denied, while every outcome is recorded in an audit trail.",
    stack: ["MCP", "Telegram", "Policy Engine", "Payments", "Audit Trail"],
    url: "https://paymod.xyz", sourceUrl: "https://github.com/0xVida/paymod",
    extraUrl: "https://marketplace.visualstudio.com/items?itemName=paymod.paymod-code",
    extraLabel: "Paymod Code",
    fallbackUrl: "https://paymod.vercel.app",
    screenshots: [
      { title: "ChatGPT MCP transfer", description: "A ChatGPT agent requests a 0.11 USDC transfer through the Paymod MCP and receives confirmation after approval.", src: "/paymod/chatgpt-transfer-confirmed.jpg" },
      { title: "Telegram approval", description: "Paymod asks for human approval in Telegram before moving funds.", src: "/paymod/telegram-approval.jpg" },
    ],
  },
];

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

export const Projects: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const { open } = useWM();
  const sel = PROJECTS[selected];

  const openVideos = (project: Project) => {
    if (!project.videos?.length) return;
    const width = Math.min(700, Math.max(320, window.innerWidth - 30));
    const height = Math.min(520, Math.max(300, window.innerHeight - 70));
    open({
      id: `media-${project.name}`, appId: "media-player",
      title: `${project.name.replace(/\.(exe|txt)$/i, "")} - Media Player`,
      icon: <CdPlayerIcon size={16} />,
      x: Math.max(0, Math.round((window.innerWidth - width) / 2)),
      y: Math.max(0, Math.round((window.innerHeight - height - 28) / 2)),
      width, height, minWidth: 320, minHeight: 300,
      payload: { project: project.name, videos: project.videos },
    });
  };

  const openScreenshots = (project: Project) => {
    if (!project.screenshots?.length) return;
    const width = Math.min(680, Math.max(340, window.innerWidth - 30));
    const height = Math.min(520, Math.max(340, window.innerHeight - 70));
    open({
      id: `screenshots-${project.name}`, appId: "screenshot-viewer",
      title: `${project.name.replace(/\.(exe|txt)$/i, "")} - Payment Proofs`,
      icon: <PaintIcon size={16} />,
      x: Math.max(0, Math.round((window.innerWidth - width) / 2)),
      y: Math.max(0, Math.round((window.innerHeight - height - 28) / 2)),
      width, height, minWidth: 340, minHeight: 340,
      payload: { project: project.name, screenshots: project.screenshots },
    });
  };

  return (
    <div className="h-full flex flex-col bg-w95-silver">
      <div className="flex-1 min-h-0 flex flex-col sm:flex-row">
        <div className="flex-1 min-h-[145px] bg-w95-white overflow-auto w95-scroll">
          <table className="w-full min-w-[420px] text-[11px]">
            <thead className="bg-w95-silver text-left sticky top-0 z-10">
              <tr>{["Name", "Type", "Status"].map((heading) => <th key={heading} className="bevel-out px-1 py-0.5 font-normal">{heading}</th>)}</tr>
            </thead>
            <tbody>
              {PROJECTS.map((project, index) => (
                <tr key={project.name} onClick={() => setSelected(index)} onDoubleClick={() => project.url && openExternal(project.url)}
                  className={`cursor-default ${selected === index ? "bg-w95-navy text-w95-text-on-navy" : ""}`}>
                  <td className="px-1 py-0.5 flex items-center gap-1 whitespace-nowrap"><project.Icon size={16} /> {project.name}</td>
                  <td className="px-1 py-0.5 whitespace-nowrap">{project.type}</td>
                  <td className="px-1 py-0.5 whitespace-nowrap">{project.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:w-64 sm:border-l border-t sm:border-t-0 border-w95-gray p-2 text-[11px] flex flex-col min-h-0 max-h-[55%] sm:max-h-none">
          <div className="flex items-center gap-2 mb-2">
            <sel.Icon size={32} />
            <div className="min-w-0">
              <div className="font-bold truncate">{sel.name}</div>
              <div className={`inline-block mt-1 px-1 bevel-in bg-w95-white ${sel.status === "Building" ? "text-w95-link" : "text-w95-text-disabled"}`}>
                {sel.status === "Building" ? "Under Construction" : "Personal Project"}
              </div>
            </div>
          </div>
          <div className="bevel-in bg-w95-white p-2 mb-2 flex-1 overflow-auto w95-scroll min-h-[80px]">
            <p className="mb-2">{sel.description}</p>
            <div className="text-w95-text-disabled mb-0.5">Built with:</div>
            <div>{sel.stack.join(" · ")}</div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {sel.url && <button className="w95-button !min-w-0" onClick={() => openExternal(sel.url!)}>Launch</button>}
            {sel.sourceUrl && <button className="w95-button !min-w-0" onClick={() => openExternal(sel.sourceUrl!)}>Source</button>}
            {sel.socialUrl && <button className="w95-button !min-w-0" onClick={() => openExternal(sel.socialUrl!)}>X Profile</button>}
            {sel.extraUrl && <button className="w95-button !min-w-0" onClick={() => openExternal(sel.extraUrl!)}>{sel.extraLabel ?? "More"}</button>}
            {sel.fallbackUrl && <button className="w95-button !min-w-0" onClick={() => openExternal(sel.fallbackUrl!)}>Backup Site</button>}
            {sel.screenshots?.length && <button className="w95-button !min-w-0 col-span-2" onClick={() => openScreenshots(sel)}>View Payment Proofs</button>}
            {sel.videos?.length && <button className="w95-button !min-w-0 col-span-2 flex items-center justify-center gap-1" onClick={() => openVideos(sel)}>
              <CdPlayerIcon size={16} /> {sel.videos.length > 1 ? `Watch ${sel.videos.length} Demos` : "Watch Demo"}
            </button>}
          </div>
        </div>
      </div>
      <div className="bevel-thin-in px-2 py-0.5 text-[11px] bg-w95-silver flex justify-between">
        <span>{PROJECTS.length} object(s)</span><span className="hidden sm:inline">Select for details · double-click to launch</span>
      </div>
    </div>
  );
};
