import { useEffect, useState } from "react";
import { Desktop } from "@/components/win95/Desktop";
import { Taskbar } from "@/components/win95/Taskbar";
import { Window } from "@/components/win95/Window";
import { useWM } from "@/components/win95/wm";
import { APPS } from "@/components/win95/apps/registry";
import { ContextMenuProvider } from "@/components/win95/ContextMenu";
import { MessageBoxHost } from "@/components/win95/MessageBox";
import { DOCS } from "@/components/win95/apps/Documents";

const Index = () => {
  const [booted, setBooted] = useState(true);
  const { windows, open } = useWM();

  useEffect(() => {
    const sw = window.innerWidth;
    const sh = window.innerHeight;
    const taskbarHeight = 28;

    const docsApp = APPS["documents"];
    const docsW = docsApp.defaultSize.w;
    const docsH = docsApp.defaultSize.h;

    const docsX = sw > docsW + 40 ? (sw > 800 ? sw - docsW - 40 : 20) : 10;
    const docsY = sh > docsH + 80 ? (sh > 600 ? sh - docsH - 80 : 150) : 40;

    open({
      id: "docs-init",
      appId: "documents",
      title: docsApp.title,
      icon: <docsApp.Icon size={16} />,
      x: docsX,
      y: docsY,
      width: docsW, height: docsH,
      minimized: true,
    });

    const otherDocs = DOCS.filter(d => d.id !== "resume-doc" && d.id !== "about-doc" && d.appId !== "projects" && d.appId !== "contact");

    otherDocs.forEach((d, idx) => {
      const app = APPS[d.appId];
      if (!app) return;
      const w = app.defaultSize.w;
      const h = app.defaultSize.h;

      // Calculate a safe range for scattering
      const safeWidth = Math.max(0, sw - w - 40);
      const safeHeight = Math.max(0, sh - h - 100);

      // use a fraction of the safe area based on index
      const stepX = otherDocs.length > 1 ? safeWidth / (otherDocs.length - 1) : 0;
      const stepY = otherDocs.length > 1 ? 40 / (otherDocs.length - 1) : 0;

      open({
        id: d.id,
        appId: d.appId,
        title: d.title,
        icon: <d.Icon size={16} />,
        x: 20 + (idx * stepX),
        y: 80 + (idx * stepY),
        width: w, height: h,
        payload: d.payload,
        minimized: true,
      });
    });

    const topApps = [
      { id: "projects-doc", offset: 40 },
      { id: "resume-doc", offset: 20 },
      { id: "about-doc", offset: -20 }
    ];

    topApps.forEach(({ id, offset }) => {
      const doc = DOCS.find(d => d.id === id);
      if (doc) {
        const app = APPS[doc.appId];
        let w = app.defaultSize.w;
        let h = app.defaultSize.h;

        let x = Math.max(10, (sw - w) / 2 + offset);
        let y = Math.max(10, (sh - h - taskbarHeight) / 2 + offset);

        if (id === "about-doc" && sw < 640) {
          w = sw - 20;
          h = sh - taskbarHeight - 50;
          x = 10;
          y = 40;
        }

        const finalX = sw < w + x ? Math.max(0, sw - w) : x;
        const finalY = sh < h + y + taskbarHeight ? Math.max(0, sh - h - taskbarHeight) : y;

        open({
          id: doc.id,
          appId: doc.appId,
          title: doc.title,
          icon: <doc.Icon size={16} />,
          x: finalX,
          y: finalY,
          width: w, height: h,
          payload: doc.payload,
          minimized: id !== "about-doc",
        });
      }
    });
  }, []);

  useEffect(() => {
    document.title = "vida: the retro experience";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "Interactive Windows 95 portfolio: drag windows, right-click, play Minesweeper, browse my work."
    );
  }, []);

  return (
    <ContextMenuProvider>
      <main className="absolute inset-0 select-none">
        <Desktop>
          {windows.map((w) => {
            const app = APPS[w.appId];
            if (!app) return null;
            const Comp = app.Component;
            return (
              <Window key={w.id} win={w} variant={app.variant} resizable={app.resizable}>
                <Comp payload={w.payload} />
              </Window>
            );
          })}
        </Desktop>
        <Taskbar />
        <MessageBoxHost />
      </main>
    </ContextMenuProvider>
  );
};

export default Index;
