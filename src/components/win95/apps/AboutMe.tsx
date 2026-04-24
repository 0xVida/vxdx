import React from "react";

export const AboutMe: React.FC = () => (
  <div className="p-3 font-mono text-[12px] leading-relaxed text-w95-text whitespace-pre-wrap">
    {`================================
   ABOUT.TXT
================================

  Hi, I'm Vida.
  Full-Stack Developer & Designer.

  I build software the way I wish
  Windows 95 had been built:
  fast, opinionated, and a little
  nostalgic.

--------------------------------
  SKILLS
--------------------------------
  > React, TypeScript, Node.js
  > Tailwind, Vite, Next.js
  > PostgreSQL, Supabase
  > UI/UX, Design Systems
  > A questionable amount of CSS

--------------------------------
  INTERESTS
--------------------------------
  Retro UI, synthwave, mechanical
  keyboards, and pretending it's
  still 1995.

--------------------------------
  Double-click "Projects" on the
  desktop to see what I've built.
================================
`}
  </div>
);
