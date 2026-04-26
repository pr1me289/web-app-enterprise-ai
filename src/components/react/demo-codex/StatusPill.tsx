import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  CircleSlash,
  CircleDashed,
  Loader2,
  Lock,
} from 'lucide-react';
import type { StepStatus } from '../../../data/demo-codex/types';

interface Props {
  status: StepStatus;
  size?: 'sm' | 'md';
  withLabel?: boolean;
  pulse?: boolean;
}

const config: Record<
  StepStatus,
  { label: string; icon: typeof CheckCircle2; cls: string; ringCls: string }
> = {
  PENDING: {
    label: 'Pending',
    icon: CircleDashed,
    cls: 'bg-ink-50 text-ink-500 border-ink-200',
    ringCls: '',
  },
  IN_PROGRESS: {
    label: 'In progress',
    icon: Loader2,
    cls: 'bg-accent-soft text-accent border-accent/40',
    ringCls: 'shadow-[0_0_0_3px_rgba(157,87,40,0.14)]',
  },
  COMPLETE: {
    label: 'Complete',
    icon: CheckCircle2,
    cls: 'bg-spruce-50 text-spruce-700 border-spruce-700/30',
    ringCls: 'shadow-[0_0_0_3px_rgba(33,71,60,0.10)]',
  },
  ESCALATED: {
    label: 'Escalated',
    icon: AlertTriangle,
    cls: 'bg-accent-soft text-accent border-accent/40',
    ringCls: 'shadow-[0_0_0_3px_rgba(157,87,40,0.14)]',
  },
  BLOCKED: {
    label: 'Blocked',
    icon: CircleSlash,
    cls: 'bg-rose-50 text-rose-700 border-rose-700/30',
    ringCls: 'shadow-[0_0_0_3px_rgba(143,77,74,0.12)]',
  },
  NOT_RUN: {
    label: 'Did not run',
    icon: Lock,
    cls: 'bg-ink-50 text-ink-400 border-ink-200',
    ringCls: '',
  },
};

export default function StatusPill({ status, size = 'md', withLabel = true, pulse = false }: Props) {
  const c = config[status];
  const Icon = c.icon;
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const iconSize = size === 'sm' ? 12 : 14;
  const text = size === 'sm' ? 'text-[0.62rem]' : 'text-[0.72rem]';
  const spinning = status === 'IN_PROGRESS';

  return (
    <motion.span
      layout
      className={`relative inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-[0.12em] ${padding} ${text} ${c.cls} ${c.ringCls}`}
    >
      {pulse && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full ring-2 ring-current"
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <Icon
        size={iconSize}
        strokeWidth={2.4}
        className={spinning ? 'animate-spin' : ''}
        aria-hidden
      />
      {withLabel && c.label}
    </motion.span>
  );
}
