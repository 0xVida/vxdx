import React from "react";

export const Resume: React.FC = () => (
  <div className="p-4 bg-w95-white text-w95-text text-[12px] leading-snug">
    <div className="text-center mb-3">
      <div className="text-2xl font-bold tracking-wide">YOUR NAME</div>
      <div className="text-[11px]">
        Full-Stack Developer · you@example.com · github.com/you
      </div>
      <div className="border-b border-w95-text mt-2" />
    </div>

    <Section title="EXPERIENCE">
      <Job
        role="Senior Software Engineer"
        company="Acme Corp"
        date="2022 — Present"
        bullets={[
          "Led migration of legacy monolith to a typed React + Node stack.",
          "Built a real-time collaboration layer used by 40k DAUs.",
          "Mentored 5 engineers; introduced design-system practice.",
        ]}
      />
      <Job
        role="Software Engineer"
        company="Initech"
        date="2019 — 2022"
        bullets={[
          "Shipped customer-facing dashboards and billing flows.",
          "Reduced p95 API latency by 60% through query and cache work.",
        ]}
      />
    </Section>

    <Section title="EDUCATION">
      <Job role="B.Sc. Computer Science" company="State University" date="2015 — 2019" />
    </Section>

    <Section title="SKILLS">
      <p>TypeScript · React · Node.js · PostgreSQL · Tailwind · AWS · Design Systems</p>
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
