import React, { useState } from "react";

export const Contact: React.FC = () => {
  const [form, setForm] = useState({ to: "you@example.com", subject: "", body: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="h-full flex flex-col p-2 gap-2 bg-w95-silver">
      <div className="grid grid-cols-[60px_1fr] gap-1 items-center text-[11px]">
        <label>To:</label>
        <input className="w95-input" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
        <label>From:</label>
        <input className="w95-input" defaultValue="visitor@portfolio.com" />
        <label>Subject:</label>
        <input
          className="w95-input"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
      </div>
      <textarea
        className="w95-input flex-1 resize-none font-mono"
        placeholder="Type your message..."
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />
      <div className="flex gap-2 items-center">
        <button
          className="w95-button"
          onClick={() => {
            const url = `mailto:${form.to}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(form.body)}`;
            window.location.href = url;
            setSent(true);
            setTimeout(() => setSent(false), 3000);
          }}
        >
          Send
        </button>
        <button className="w95-button" onClick={() => setForm({ to: "you@example.com", subject: "", body: "" })}>
          Clear
        </button>
        {sent && <span className="text-[11px]">Mail client opened.</span>}
      </div>
      <div className="text-[11px] mt-1">
        Or reach me at:{" "}
        <a className="text-w95-link underline" href="https://github.com" target="_blank" rel="noreferrer">
          github
        </a>{" "}
        ·{" "}
        <a className="text-w95-link underline" href="https://linkedin.com" target="_blank" rel="noreferrer">
          linkedin
        </a>{" "}
        ·{" "}
        <a className="text-w95-link underline" href="https://twitter.com" target="_blank" rel="noreferrer">
          twitter
        </a>
      </div>
    </div>
  );
};
