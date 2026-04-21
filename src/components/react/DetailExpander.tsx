import { useId, useState, type ReactNode } from 'react';

interface DetailExpanderProps {
  summary: string;
  kind?: 'default' | 'spec' | 'architecture';
  children: ReactNode;
  defaultOpen?: boolean;
}

const labelFor = (kind: DetailExpanderProps['kind']) => {
  switch (kind) {
    case 'spec':
      return 'Spec excerpt';
    case 'architecture':
      return 'Architectural detail';
    default:
      return 'More detail';
  }
};

export default function DetailExpander({
  summary,
  kind = 'default',
  children,
  defaultOpen = false,
}: DetailExpanderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const handleToggle = () => setOpen((v) => !v);

  return (
    <div className="my-6 overflow-hidden rounded-md border border-ink-100 bg-paper">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-paper-muted"
      >
        <span className="flex flex-col">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-400">
            {labelFor(kind)}
          </span>
          <span className="font-serif text-base text-ink-900">{summary}</span>
        </span>
        <span
          aria-hidden
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-600 transition-transform ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        hidden={!open}
        className="border-t border-ink-100 bg-paper-muted px-5 py-4 text-sm leading-relaxed text-ink-700"
      >
        {children}
      </div>
    </div>
  );
}
