// Generic Radix Collapsible wrapper styled for the Demo page. Used everywhere
// a section needs to default-collapsed inspection.
import * as Collapsible from '@radix-ui/react-collapsible';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  id: string;
  title: string;
  eyebrow?: string;
  meta?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  tone?: 'default' | 'accent' | 'mono';
}

export default function ExpandableDrawer({
  id,
  title,
  eyebrow,
  meta,
  open,
  onOpenChange,
  children,
  tone = 'default',
}: Props) {
  const headerCls =
    tone === 'accent'
      ? 'bg-accent-soft/40 hover:bg-accent-soft/70'
      : tone === 'mono'
        ? 'bg-ink-950 text-ink-100 hover:bg-ink-900'
        : 'bg-paper-muted/40 hover:bg-paper-muted/70';

  const titleCls =
    tone === 'mono' ? 'font-serif text-base text-ink-50' : 'font-serif text-base text-ink-900';

  const eyebrowCls =
    tone === 'mono'
      ? 'font-mono text-[0.62rem] uppercase tracking-[0.12em] text-accent-ring'
      : 'font-mono text-[0.62rem] uppercase tracking-[0.12em] text-accent';

  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange}>
      <div
        id={id}
        className={`overflow-hidden rounded-2xl border ${
          tone === 'mono' ? 'border-ink-900/40' : 'border-ink-100'
        } bg-paper shadow-soft`}
      >
        <Collapsible.Trigger asChild>
          <button
            type="button"
            className={`group flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors ${headerCls}`}
          >
            <div className="flex flex-col gap-0.5">
              {eyebrow && <span className={eyebrowCls}>{eyebrow}</span>}
              <span className={titleCls}>{title}</span>
              {meta && <span className="mt-1 flex items-center gap-2 text-[0.72rem] text-ink-500">{meta}</span>}
            </div>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className={`shrink-0 rounded-full border ${
                tone === 'mono' ? 'border-ink-700 text-ink-300' : 'border-ink-200 text-ink-500'
              } bg-paper p-1.5 group-hover:border-ink-300`}
            >
              <ChevronDown size={14} aria-hidden />
            </motion.span>
          </button>
        </Collapsible.Trigger>

        <Collapsible.Content forceMount>
          <motion.div
            initial={false}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            aria-hidden={!open}
          >
            <div className={tone === 'mono' ? 'bg-ink-950' : 'border-t border-ink-100 bg-paper'}>
              {children}
            </div>
          </motion.div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
