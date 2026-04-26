// Renders one card per retrieved source for this step. Clicking a card opens
// a Radix Dialog with a placeholder document preview. Real document content
// will be wired in later — for now the dialog surfaces the source's metadata,
// retrieval lane reasoning, and a labelled placeholder body.
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';
import { AuthorityBadge, LaneBadge, TreatmentBadge } from './badges';
import type { DemoStep, RetrievedEvidenceItem } from '../../../data/demo-codex/types';

export default function SourceDocumentsDrawer({ step }: { step: DemoStep }) {
  if (step.retrievedEvidence.length === 0) {
    return (
      <p className="px-5 py-4 text-sm italic text-ink-500">No sources retrieved for this step.</p>
    );
  }
  return (
    <div className="grid gap-3 p-5 md:grid-cols-2">
      {step.retrievedEvidence.map((item) => (
        <SourceCard key={item.id} item={item} stepActor={step.actor} />
      ))}
    </div>
  );
}

function SourceCard({ item, stepActor }: { item: RetrievedEvidenceItem; stepActor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          className="flex flex-col gap-2 rounded-xl border border-ink-100 bg-paper p-3 text-left shadow-soft transition-colors hover:border-ink-300"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[0.72rem] text-ink-900">{item.name}</p>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">
                {item.type}
              </p>
            </div>
            <FileText size={14} className="shrink-0 text-ink-400" aria-hidden />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <AuthorityBadge tier={item.authorityTier} size="sm" />
            <LaneBadge lane={item.lane} size="sm" />
            <TreatmentBadge treatment={item.treatment} size="sm" />
          </div>
          <p className="text-[0.7rem] leading-relaxed text-ink-600">{item.reason}</p>
          <span className="mt-1 inline-flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-accent">
            <ExternalLink size={11} aria-hidden /> Open preview
          </span>
        </motion.button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 flex h-[80vh] w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-paper shadow-2xl"
        >
          <header className="flex items-start justify-between gap-4 border-b border-ink-100 bg-paper px-5 py-4">
            <div className="min-w-0">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-400">
                {item.type}
              </p>
              <Dialog.Title className="mt-1 truncate font-serif text-lg font-semibold text-ink-900">
                {item.name}
              </Dialog.Title>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <AuthorityBadge tier={item.authorityTier} size="sm" />
                <LaneBadge lane={item.lane} size="sm" />
                <TreatmentBadge treatment={item.treatment} size="sm" />
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-ink-900 hover:text-ink-900"
              >
                ×
              </button>
            </Dialog.Close>
          </header>

          <div className="min-h-0 flex-1 overflow-auto bg-paper-muted/40 p-6">
            <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-ink-200 bg-paper p-6">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-accent">
                Placeholder document preview
              </p>
              <p className="mt-2 font-serif text-lg text-ink-900">
                {item.name} — full content coming soon
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Real document content for <span className="font-mono">{item.name}</span> will be
                wired here once the upstream pipeline run is captured. The preview will render the
                relevant sections of the source as the {stepActor.toLowerCase()} agent saw them,
                with the same citation chips that appear in this demo.
              </p>
              <div className="mt-5 rounded-xl border border-ink-100 bg-paper-muted/40 p-4">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">
                  Why this source was {item.treatment === 'excluded' ? 'excluded' : 'included'}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-700">{item.reason}</p>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Stat label="Chunks retrieved" value={String(item.chunksRetrieved)} />
                <Stat label="Chunks admitted" value={String(item.chunksAdmitted)} />
              </div>
              <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-400">
                TODO: replace placeholder with real captured source view
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-paper-muted/40 p-3 text-center">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">{label}</p>
      <p className="mt-1 font-serif text-lg text-ink-900">{value}</p>
    </div>
  );
}
