// Small visual primitives — authority tier badges, lane badges, source badges.
// Co-located in one file because they're tiny and always travel together.
import { Database, Search, FileText } from 'lucide-react';
import type { AuthorityTier, RetrievalLane, SourceTreatment } from '../../../data/demo-codex/types';

export const tierMeta: Record<
  AuthorityTier,
  { label: string; cls: string; dotCls: string; description: string }
> = {
  1: {
    label: 'Tier 1',
    cls: 'bg-spruce-50 text-spruce-700 border-spruce-700/30',
    dotCls: 'bg-spruce-700',
    description: 'Authoritative — policy, matrix, registry',
  },
  2: {
    label: 'Tier 2',
    cls: 'bg-accent-soft text-accent border-accent/40',
    dotCls: 'bg-accent',
    description: 'Vendor-supplied claim — informative',
  },
  3: {
    label: 'Tier 3',
    cls: 'bg-ink-100 text-ink-700 border-ink-200',
    dotCls: 'bg-ink-500',
    description: 'Internal context — supporting',
  },
  4: {
    label: 'Tier 4',
    cls: 'bg-ink-50 text-ink-500 border-ink-100',
    dotCls: 'bg-ink-300',
    description: 'Conversational — supplementary only',
  },
};

export function AuthorityBadge({ tier, size = 'md' }: { tier: AuthorityTier; size?: 'sm' | 'md' }) {
  const c = tierMeta[tier];
  const padding = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-0.5';
  const text = size === 'sm' ? 'text-[0.6rem]' : 'text-[0.65rem]';
  return (
    <span
      title={c.description}
      className={`inline-flex items-center gap-1.5 rounded border font-mono font-medium uppercase tracking-[0.1em] ${padding} ${text} ${c.cls}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${c.dotCls}`} />
      {c.label}
    </span>
  );
}

export const laneMeta: Record<
  RetrievalLane,
  { label: string; icon: typeof Database; iconCls: string; description: string }
> = {
  direct_structured: {
    label: 'direct_structured',
    icon: Database,
    iconCls: 'text-spruce-700',
    description: 'Row / registry / manifest — exact lookup, no ranking',
  },
  indexed_hybrid: {
    label: 'indexed_hybrid',
    icon: Search,
    iconCls: 'text-accent',
    description: 'Dense + lexical, cross-encoder reranked',
  },
  non_retrieval: {
    label: 'non_retrieval',
    icon: FileText,
    iconCls: 'text-ink-700',
    description: 'Already-governed upstream output — no further fetch',
  },
};

export function LaneBadge({ lane, size = 'md' }: { lane: RetrievalLane; size?: 'sm' | 'md' }) {
  const c = laneMeta[lane];
  const Icon = c.icon;
  const padding = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-0.5';
  const text = size === 'sm' ? 'text-[0.6rem]' : 'text-[0.65rem]';
  return (
    <span
      title={c.description}
      className={`inline-flex items-center gap-1 rounded border border-ink-100 bg-paper font-mono uppercase tracking-[0.08em] text-ink-700 ${padding} ${text}`}
    >
      <Icon size={11} className={c.iconCls} aria-hidden />
      {c.label}
    </span>
  );
}

const treatmentMeta: Record<SourceTreatment, { label: string; cls: string }> = {
  primary: {
    label: 'primary',
    cls: 'bg-paper text-ink-700 border-ink-100',
  },
  supplementary: {
    label: 'supplementary',
    cls: 'bg-ink-50 text-ink-600 border-ink-100',
  },
  excluded: {
    label: 'excluded',
    cls: 'bg-rose-50 text-rose-700 border-rose-700/20',
  },
};

export function TreatmentBadge({
  treatment,
  size = 'sm',
}: {
  treatment: SourceTreatment;
  size?: 'sm' | 'md';
}) {
  const c = treatmentMeta[treatment];
  const padding = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-0.5';
  const text = size === 'sm' ? 'text-[0.6rem]' : 'text-[0.65rem]';
  return (
    <span
      className={`inline-flex items-center rounded border font-mono uppercase tracking-[0.08em] ${padding} ${text} ${c.cls}`}
    >
      {c.label}
    </span>
  );
}
