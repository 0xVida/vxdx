import React from "react";

export const Resume: React.FC = () => (
  <div className="p-4 bg-w95-white text-w95-text text-[12px] leading-snug">
    <div className="text-center mb-3">
      <div className="text-2xl font-bold tracking-wide">VICTOR ADEMIJU</div>
      <div className="text-[11px]">
        Protocol Design Engineer · ademijuvictor@gmail.com · github.com/0xVida
      </div>
      <div className="border-b border-w95-text mt-2" />
    </div>

    <Section title="EXPERIENCE">
      <Job
        role="Protocol Design Engineer"
        company="Freelance / Project-based"
        date="2022 — Present"
        bullets={[
          "Led protocol design for a healthcare application currently serving thousands of users.",
          "Specializing in blockchain architecture across Solana, EVM and Move ecosystems.",
          "Winner of multiple Sui hackathons, including the Mysten Labs bootcamp hackathon.",
        ]}
      />
      <Job
        role="Blockchain Developer"
        company="Various Projects"
        date="2021 — 2024"
        bullets={[
          "Built end-to-end solutions combining robust server-side architectures with modern frontends.",
          "Extensive work with Sui primitives: Walrus, Seal, Nautilus, Deepbook and Enoki (ZK Login).",
          "Developed smart contracts and dApps on Solana, Ethereum and Base.",
        ]}
      />
      <Job
        role="Fullstack Developer"
        company="Software Systems"
        date="2020 — 2021"
        bullets={[
          "Crafted production-ready systems with scalable APIs and modern web frameworks.",
          "Focused on backend robustness and seamless integration across the entire stack.",
        ]}
      />
    </Section>

    <Section title="EDUCATION & RECOGNITION">
      <Job role="Move Programming Certification" company="Mysten Labs Bootcamp" date="2023" />
      <Job role="Hackathon Winner" company="Sui Overflow & Suihub Lagos" date="2023 — 2024" />
    </Section>

    <Section title="SKILLS">
      <p>Rust · Move · Solidity · TypeScript · Node.js · Solana · EVM · Sui Stack (Walrus/Seal/Enoki)</p>
    </Section>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-3">
    <div className="font-bold tracking-widest text-[11px] border-b border-w95-text mb-1">{title}</div>
    {children}
  </div>
);

const Job: React.FC<{ role: string; company: string; date: string; bullets?: string[] }> = ({
  role,
  company,
  date,
  bullets,
}) => (
  <div className="mb-2">
    <div className="flex justify-between">
      <div className="font-bold">
        {role} <span className="font-normal italic">— {company}</span>
      </div>
      <div className="text-[11px]">{date}</div>
    </div>
    {bullets && (
      <ul className="list-disc list-inside">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    )}
  </div>
);
