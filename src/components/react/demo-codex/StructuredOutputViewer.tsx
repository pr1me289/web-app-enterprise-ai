// Custom structured-output renderer: walks an arbitrary JSON-shaped value
// and emits coloured tokens consistent with the site palette. Top-level
// fields whose key matches a citation entry get a hoverable cite chip
// rendered alongside their value, so audit-trail discovery is one hover away.
import { useMemo } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Quote } from 'lucide-react';
import type { OutputCitation } from '../../../data/demo-codex/types';

interface Props {
  value: unknown;
  citations?: OutputCitation[];
  emptyLabel?: string;
}

const STR_CLS = 'text-[#7ee8c0]';
const NUM_CLS = 'text-[#f6c177]';
const BOOL_CLS = 'text-[#c4a8ff]';
const NULL_CLS = 'text-[#8c98a8] italic';
const KEY_CLS = 'text-[#9bd0ff]';
const PUNCT_CLS = 'text-[#465863]';

export default function StructuredOutputViewer({ value, citations, emptyLabel }: Props) {
  const citationsByKey = useMemo(() => {
    const map = new Map<string, OutputCitation>();
    (citations ?? []).forEach((c) => map.set(c.field, c));
    return map;
  }, [citations]);

  if (value === undefined || value === null) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-ink-100/40 bg-ink-950 p-4 font-mono text-[0.72rem] leading-relaxed text-ink-300">
        {emptyLabel ?? 'null'}
      </pre>
    );
  }

  return (
    <Tooltip.Provider delayDuration={150}>
      <pre className="overflow-x-auto rounded-lg border border-ink-100/40 bg-ink-950 p-4 font-mono text-[0.72rem] leading-relaxed text-ink-100">
        <code>
          <Token value={value} indent={0} citationsByKey={citationsByKey} />
        </code>
      </pre>
    </Tooltip.Provider>
  );
}

function Token({
  value,
  indent,
  citationsByKey,
  parentKey,
}: {
  value: unknown;
  indent: number;
  citationsByKey: Map<string, OutputCitation>;
  parentKey?: string;
}) {
  const pad = '  '.repeat(indent);
  const childPad = '  '.repeat(indent + 1);

  if (value === null) {
    return <span className={NULL_CLS}>null</span>;
  }

  if (typeof value === 'string') {
    return <span className={STR_CLS}>{`"${escapeString(value)}"`}</span>;
  }

  if (typeof value === 'number') {
    return <span className={NUM_CLS}>{String(value)}</span>;
  }

  if (typeof value === 'boolean') {
    return <span className={BOOL_CLS}>{value ? 'true' : 'false'}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className={PUNCT_CLS}>[]</span>;
    }
    return (
      <>
        <span className={PUNCT_CLS}>[</span>
        {value.map((item, idx) => (
          <span key={idx}>
            {'\n'}
            {childPad}
            <Token value={item} indent={indent + 1} citationsByKey={citationsByKey} />
            {idx < value.length - 1 && <span className={PUNCT_CLS}>,</span>}
          </span>
        ))}
        {'\n'}
        {pad}
        <span className={PUNCT_CLS}>]</span>
      </>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return <span className={PUNCT_CLS}>{'{}'}</span>;
    }
    return (
      <>
        <span className={PUNCT_CLS}>{'{'}</span>
        {entries.map(([k, v], idx) => {
          const citation = indent === 0 ? citationsByKey.get(k) : undefined;
          return (
            <span key={k}>
              {'\n'}
              {childPad}
              <span className={KEY_CLS}>{`"${k}"`}</span>
              <span className={PUNCT_CLS}>: </span>
              <Token
                value={v}
                indent={indent + 1}
                citationsByKey={citationsByKey}
                parentKey={k}
              />
              {idx < entries.length - 1 && <span className={PUNCT_CLS}>,</span>}
              {citation && <CitationChip citation={citation} />}
            </span>
          );
        })}
        {'\n'}
        {pad}
        <span className={PUNCT_CLS}>{'}'}</span>
      </>
    );
  }

  return <span>{String(value)}</span>;
}

function CitationChip({ citation }: { citation: OutputCitation }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          className="ml-2 inline-flex items-center gap-1 rounded-sm border border-accent/40 bg-accent/10 px-1.5 py-0.5 align-middle font-mono text-[0.55rem] uppercase tracking-[0.08em] text-accent-ring transition-colors hover:bg-accent/20"
        >
          <Quote size={9} aria-hidden />
          cite
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          align="center"
          sideOffset={6}
          className="z-50 max-w-[20rem] rounded-lg border border-ink-100/30 bg-ink-900 p-3 text-[0.7rem] leading-relaxed text-ink-100 shadow-2xl"
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-accent-ring">
            Cited from
          </p>
          <p className="mt-1 break-words font-mono text-[0.78rem] text-ink-50">
            {citation.source}
          </p>
          <Tooltip.Arrow className="fill-ink-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function escapeString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
