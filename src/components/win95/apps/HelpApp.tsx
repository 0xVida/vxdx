import React from "react";

export const HelpApp: React.FC = () => (
  <div className="p-3 text-[12px] leading-relaxed">
    <h2 className="font-bold text-base mb-2">Welcome to Windows 95</h2>
    <ul className="list-disc list-inside space-y-1">
      <li><b>Double-click</b> any desktop icon to open it.</li>
      <li><b>Right-click</b> the desktop, icons, or windows for menus.</li>
      <li>Drag window <b>title bars</b> to move; drag <b>edges</b> to resize.</li>
      <li>Use the <b>Start</b> button for Programs, Documents and Shut Down.</li>
      <li>Click taskbar buttons to <b>switch</b> or <b>minimize</b> windows.</li>
      <li>Try <b>Minesweeper</b> — right-click a cell to plant a flag.</li>
    </ul>
  </div>
);
