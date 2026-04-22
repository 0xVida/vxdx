import React from "react";
import { Dialog, DialogButton } from "./Dialog";

type IconKind = "error" | "info" | "warning" | "question";

const ErrorIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
    <circle cx="16" cy="16" r="13" fill="#FF0000" stroke="#000" />
    <circle cx="16" cy="16" r="11" fill="none" stroke="#FFF" strokeWidth="1" />
    <rect x="8" y="14" width="16" height="4" fill="#FFF" transform="rotate(45 16 16)" />
  </svg>
);
const InfoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
    <circle cx="16" cy="16" r="13" fill="#0000A8" stroke="#000" />
    <text x="16" y="24" textAnchor="middle" fontSize="22" fontFamily="Times New Roman, serif" fontStyle="italic" fontWeight="bold" fill="#FFF">i</text>
  </svg>
);
const WarnIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
    <polygon points="16,3 30,28 2,28" fill="#FFFF00" stroke="#000" strokeWidth="1.5" />
    <text x="16" y="26" textAnchor="middle" fontSize="20" fontFamily="serif" fontWeight="bold" fill="#000">!</text>
  </svg>
);
const QuestionIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
    <circle cx="16" cy="16" r="13" fill="#0000A8" stroke="#000" />
    <text x="16" y="24" textAnchor="middle" fontSize="22" fontFamily="serif" fontWeight="bold" fill="#FFF">?</text>
  </svg>
);

const ICONS: Record<IconKind, React.FC> = {
  error: ErrorIcon,
  info: InfoIcon,
  warning: WarnIcon,
  question: QuestionIcon,
};

interface MessageBoxProps {
  title: string;
  message: string;
  icon?: IconKind;
  onClose: () => void;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ title, message, icon = "error", onClose }) => {
  const I = ICONS[icon];
  React.useEffect(() => {
    // beep
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square"; o.frequency.value = 800;
      g.gain.value = 0.05;
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.12);
      setTimeout(() => ctx.close(), 200);
    } catch {}
  }, []);

  return (
    <Dialog
      title={title}
      width={360}
      onClose={onClose}
      buttons={<DialogButton primary onClick={onClose}>OK</DialogButton>}
    >
      <div className="flex gap-3 items-start">
        <I />
        <div className="text-[12px] whitespace-pre-line pt-1 flex-1">{message}</div>
      </div>
    </Dialog>
  );
};

// Hook for imperative usage
type MsgState = (Omit<MessageBoxProps, "onClose"> & { id: number }) | null;
let setter: ((m: MsgState) => void) | null = null;
let counter = 0;

export const showMessage = (opts: Omit<MessageBoxProps, "onClose">) => {
  if (setter) setter({ ...opts, id: ++counter });
};

export const MessageBoxHost: React.FC = () => {
  const [msg, setMsg] = React.useState<MsgState>(null);
  React.useEffect(() => { setter = setMsg; return () => { setter = null; }; }, []);
  if (!msg) return null;
  return <MessageBox key={msg.id} {...msg} onClose={() => setMsg(null)} />;
};
