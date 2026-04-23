import React, { useState } from "react";

const Btn: React.FC<{ label: React.ReactNode; on: () => void; w?: number; color?: string }> = ({ label, on, w = 1, color = "" }) => (
  <button
    type="button"
    className={`bevel-out bg-w95-silver h-7 text-[12px] active:bevel-pressed ${color}`}
    style={{ gridColumn: `span ${w}` }}
    onMouseDown={(e) => e.preventDefault()}
    onClick={on}
  >
    {label}
  </button>
);

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);
  const [memory, setMemory] = useState(0);

  const inputDigit = (d: string) => {
    setDisplay((cur) => {
      if (reset || cur === "0") { setReset(false); return d; }
      if (cur.length >= 16) return cur;
      return cur + d;
    });
    if (reset) setReset(false);
  };
  const inputDot = () => {
    setDisplay((cur) => {
      if (reset) { setReset(false); return "0."; }
      return cur.includes(".") ? cur : cur + ".";
    });
    if (reset) setReset(false);
  };
  const compute = (a: number, b: number, o: string) => {
    switch (o) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
    }
    return b;
  };
  const fmt = (n: number) => {
    if (!isFinite(n) || isNaN(n)) return "Error";
    const s = String(parseFloat(n.toPrecision(12)));
    return s.length > 16 ? n.toExponential(8) : s;
  };
  const setOperator = (o: string) => {
    const cur = parseFloat(display);
    if (prev !== null && op && !reset) {
      const r = compute(prev, cur, op);
      setDisplay(fmt(r));
      setPrev(r);
    } else {
      setPrev(cur);
    }
    setOp(o);
    setReset(true);
  };
  const equals = () => {
    if (prev === null || !op) return;
    const r = compute(prev, parseFloat(display), op);
    setDisplay(fmt(r));
    setPrev(null);
    setOp(null);
    setReset(true);
  };
  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setReset(false); };
  const clearEntry = () => { setDisplay("0"); setReset(false); };
  const backspace = () => setDisplay((cur) => (cur.length <= 1 || (cur.length === 2 && cur.startsWith("-"))) ? "0" : cur.slice(0, -1));
  const negate = () => setDisplay((cur) => cur.startsWith("-") ? cur.slice(1) : cur === "0" ? "0" : "-" + cur);
  const sqrt = () => { const v = parseFloat(display); setDisplay(v < 0 ? "Error" : fmt(Math.sqrt(v))); setReset(true); };
  const reciprocal = () => { const v = parseFloat(display); setDisplay(v === 0 ? "Error" : fmt(1 / v)); setReset(true); };
  const percent = () => {
    const cur = parseFloat(display);
    const r = prev !== null ? (prev * cur) / 100 : cur / 100;
    setDisplay(fmt(r));
    setReset(true);
  };

  return (
    <div className="h-full bg-w95-silver p-2 flex flex-col gap-2 text-[11px]">
      <div className="flex gap-3 text-[11px] -mt-1 mb-1">
        {["Edit", "View", "Help"].map((m) => <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>)}
      </div>
      <div className="bevel-in bg-white px-2 py-1 text-right font-mono text-[14px] truncate">{display}</div>
      <div className="flex gap-1 items-center">
        <div className="bevel-in bg-w95-silver w-7 h-5 text-center text-[11px]">{memory ? "M" : ""}</div>
        <div className="grid grid-cols-5 gap-1 flex-1">
          <Btn label="MC" on={() => setMemory(0)} color="text-w95-link" />
          <Btn label="MR" on={() => setDisplay(fmt(memory))} color="text-w95-link" />
          <Btn label="MS" on={() => setMemory(parseFloat(display))} color="text-w95-link" />
          <Btn label="M+" on={() => setMemory(memory + parseFloat(display))} color="text-w95-link" />
          <Btn label="←" on={backspace} color="text-red-700" />

          <Btn label="7" on={() => inputDigit("7")} />
          <Btn label="8" on={() => inputDigit("8")} />
          <Btn label="9" on={() => inputDigit("9")} />
          <Btn label="/" on={() => setOperator("/")} color="text-red-700" />
          <Btn label="sqrt" on={sqrt} color="text-w95-link" />

          <Btn label="4" on={() => inputDigit("4")} />
          <Btn label="5" on={() => inputDigit("5")} />
          <Btn label="6" on={() => inputDigit("6")} />
          <Btn label="*" on={() => setOperator("*")} color="text-red-700" />
          <Btn label="%" on={percent} color="text-w95-link" />

          <Btn label="1" on={() => inputDigit("1")} />
          <Btn label="2" on={() => inputDigit("2")} />
          <Btn label="3" on={() => inputDigit("3")} />
          <Btn label="-" on={() => setOperator("-")} color="text-red-700" />
          <Btn label="1/x" on={reciprocal} color="text-w95-link" />

          <Btn label="0" on={() => inputDigit("0")} />
          <Btn label="+/-" on={negate} />
          <Btn label="." on={inputDot} />
          <Btn label="+" on={() => setOperator("+")} color="text-red-700" />
          <Btn label="=" on={equals} color="text-red-700" />

          <Btn label="CE" on={clearEntry} color="text-red-700" w={2} />
          <Btn label="C" on={clear} color="text-red-700" w={3} />
        </div>
      </div>
    </div>
  );
};
