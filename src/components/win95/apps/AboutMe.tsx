import React from "react";

const TALK_URL = "https://x.com/0xvxda/status/2102321824512069838";

export const AboutMe: React.FC = () => (
  <div className="p-3 font-mono text-[12px] leading-relaxed text-w95-text bg-w95-white">
    <pre className="font-inherit whitespace-pre-wrap">{`================================
   ABOUT_ME.TXT
================================

  Hi, I'm Victor Ademiju (vida).
  Protocol Design Engineer.

  I specialize in backend systems and
  blockchain development, crafting
  robust solutions across Solana, Stellar,
  EVM and Move ecosystems.

  Currently building FynMarket.

--------------------------------
  EXPERTISE
--------------------------------
  > Protocol Architecture
  > Smart Contract Development
  > Distributed Systems
  > Rust, Move, Solidity, TS
  > Cryptography student — learning ZK

--------------------------------
  HIGHLIGHTS
--------------------------------
  Speaker in the Solana ecosystem
  Posting about cryptography and ZK
  Unprofessional Rapper
  Can't code without music
  Plays basketball and soccer

--------------------------------
  SPEAKING
--------------------------------`}</pre>

    <div className="my-2 bevel-in bg-w95-silver p-1">
      <iframe
        className="w-full h-[250px] bg-white"
        src="https://platform.twitter.com/embed/Tweet.html?id=2102321824512069838&theme=light"
        title="vida speaking at a Solana event"
        loading="lazy"
      />
    </div>
    <a className="text-w95-link underline" href={TALK_URL} target="_blank" rel="noreferrer">
      View the Solana speaking post on X
    </a>

    <pre className="font-inherit whitespace-pre-wrap mt-3">{`--------------------------------
  WRITING
--------------------------------`}</pre>
    <div className="bevel-in bg-w95-silver p-2 my-2 flex flex-col gap-2">
      <a className="text-w95-link underline" href="https://substack.com/@vxdx" target="_blank" rel="noreferrer">
        Threads by vida — Substack
      </a>
      <a className="text-w95-link underline" href="https://threadsbyvida.substack.com/p/build-solana-on-mobile" target="_blank" rel="noreferrer">
        Build Solana on Mobile
      </a>
      <a className="text-w95-link underline" href="https://threadsbyvida.substack.com/p/the-sui-mindset-a-non-technical-introduction-to-sui" target="_blank" rel="noreferrer">
        The Sui Mindset: A Non-Technical Introduction to Sui
      </a>
      <a className="text-w95-link underline" href="https://threadsbyvida.substack.com/p/how-suis-object-versioning-really" target="_blank" rel="noreferrer">
        How Sui's Object Versioning Really Works
      </a>
    </div>

    <pre className="font-inherit whitespace-pre-wrap mt-3">{`--------------------------------
  Double-click "Projects" on the
  desktop to see my work.
================================`}</pre>
  </div>
);
