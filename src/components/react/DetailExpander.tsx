import { useState, type ReactNode } from 'react';

interface DetailExpanderProps {
  summary: string;
  children: ReactNode;
}

export default function DetailExpander({ summary, children }: DetailExpanderProps) {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((v) => !v);

  return (
    <div className="my-4 rounded-md border border-slate-200">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-medium"
      >
        <span>{summary}</span>
        <span aria-hidden>{open ? '–' : '+'}</span>
      </button>
      {open && <div className="border-t border-slate-200 px-4 py-3 text-sm">{children}</div>}
    </div>
  );
}
