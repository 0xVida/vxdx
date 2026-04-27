import React, { useState } from "react";
import { FolderIcon, NotepadIcon, IEIcon } from "../Icons";

interface Project {
  name: string;
  type: string;
  size: string;
  modified: string;
  description: string;
  stack: string[];
  url?: string;
  sourceUrl?: string;
  Icon: React.FC<{ size?: number }>;
}

const PROJECTS: Project[] = [
  {
    name: "Otter Protocol.exe",
    type: "Application",
    size: "3.2 MB",
    modified: "03/15/2026 10:45",
    description:
      "Sui's first programmable data exchange layer. Connects providers and consumers through secure access-control and data chunking.",
    stack: ["Move", "Sui", "Walrus", "Seal", "TypeScript"],
    url: "https://otter-protocol.vercel.app/",
    sourceUrl: "https://github.com/0xVida/Otter",
    Icon: NotepadIcon,
  },
  {
    name: "Penguin.exe",
    type: "Application",
    size: "2.1 MB",
    modified: "02/10/2026 14:22",
    description:
      "Decentralized, privacy-focused messaging on Sui. Uses Walrus for storage, Seal for access control, and Enoki for ZK onboarding.",
    stack: ["Sui", "Walrus", "Seal", "Enoki", "SuiNS"],
    url: "https://penguin-rose.vercel.app/",
    sourceUrl: "https://github.com/theloneson/Penguin",
    Icon: IEIcon,
  },
  {
    name: "SHIELD.exe",
    type: "Application",
    size: "1.5 MB",
    modified: "01/05/2026 09:15",
    description:
      "Sui wallet management tool for burning unwanted NFTs or hiding them in a Soulbound Token (SBT) vault.",
    stack: ["Move", "Sui", "TypeScript", "SBT"],
    url: "https://wallet-cleaner-app.vercel.app/",
    sourceUrl: "https://github.com/0xVida/wallet-cleaner-app",
    Icon: NotepadIcon,
  },
  {
    name: "Memo Protocol",
    type: "File Folder",
    size: "—",
    modified: "11/20/2025 16:30",
    description:
      "Public utility protocol for attaching memos to Sui transactions. Includes on-chain contracts and a TypeScript SDK.",
    stack: ["Sui", "Move", "TypeScript", "SDK"],
    url: "https://testnet.suivision.xyz/package/0x21eba4a9ac6005260f45e776afebf02de42eada48438deceac0b76b9886e37d8",
    sourceUrl: "https://github.com/0xVida/memo-protocol",
    Icon: FolderIcon,
  },
  {
    name: "Sui Wrapped",
    type: "Application",
    size: "1.1 MB",
    modified: "12/28/2025 23:59",
    description:
      "Wallet activity summary tool that visualizes on-chain behavior. Used by hundreds in the Sui community.",
    stack: ["Sui", "TypeScript", "Sui NS", "Analytics"],
    url: "https://sui-wrapped.vercel.app/",
    Icon: IEIcon,
  },
];

export const Projects: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(0);
  const sel = selected !== null ? PROJECTS[selected] : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex">
        {/* List */}
        <div className="flex-1 bg-w95-white">
          <table className="w-full text-[11px]">
            <thead className="bg-w95-silver text-left">
              <tr>
                {["Name", "Type", "Size", "Modified"].map((h) => (
                  <th key={h} className="bevel-out px-1 py-0.5 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p, i) => {
                const isSel = selected === i;
                return (
                  <tr
                    key={p.name}
                    onClick={() => setSelected(i)}
                    onDoubleClick={() => p.url && window.open(p.url, "_blank")}
                    className={`cursor-default ${isSel ? "bg-w95-navy text-w95-text-on-navy" : ""}`}
                  >
                    <td className="px-1 py-0.5 flex items-center gap-1">
                      <p.Icon size={16} />
                      {p.name}
                    </td>
                    <td className="px-1 py-0.5">{p.type}</td>
                    <td className="px-1 py-0.5">{p.size}</td>
                    <td className="px-1 py-0.5">{p.modified}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Details */}
        {sel && (
          <div className="w-56 shrink-0 border-l border-w95-gray bg-w95-silver p-2 text-[11px] flex flex-col">
            <div className="flex flex-col items-center mb-2">
              <sel.Icon size={32} />
              <div className="mt-1 font-bold">{sel.name}</div>
            </div>
            <div className="bevel-in bg-w95-white p-2 mb-2 flex-1 overflow-auto w95-scroll">
              <p className="mb-2">{sel.description}</p>
              <div className="text-w95-text-disabled">Stack:</div>
              <div>{sel.stack.join(", ")}</div>
            </div>
            <div className="flex flex-col gap-1">
              {sel.url && (
                <button
                  className="w95-button w-full"
                  onClick={() => window.open(sel.url, "_blank")}
                >
                  Launch Demo
                </button>
              )}
              {sel.sourceUrl && (
                <button
                  className="w95-button w-full"
                  onClick={() => window.open(sel.sourceUrl, "_blank")}
                >
                  View Source
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="bevel-thin-in px-2 py-0.5 text-[11px] bg-w95-silver">
        {PROJECTS.length} object(s) — double-click to launch
      </div>
    </div>
  );
};
