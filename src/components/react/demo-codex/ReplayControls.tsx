// Replay machine controls — Start, Pause, Resume, Step, Jump-to-end, Reset,
// plus a 1x / 1.5x / 2x speed selector. Behaviour follows the Zustand store.
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  StepForward,
  StepBack,
  RotateCcw,
  FastForward,
} from 'lucide-react';
import { useDemoCodexStore, type Speed } from './store';

const SPEEDS: Speed[] = [1, 1.5, 2];

export default function ReplayControls() {
  const mode = useDemoCodexStore((s) => s.mode);
  const phase = useDemoCodexStore((s) => s.phase);
  const speed = useDemoCodexStore((s) => s.speed);

  const start = useDemoCodexStore((s) => s.start);
  const pause = useDemoCodexStore((s) => s.pause);
  const resume = useDemoCodexStore((s) => s.resume);
  const stepThrough = useDemoCodexStore((s) => s.stepThrough);
  const stepBackward = useDemoCodexStore((s) => s.stepBackward);
  const jumpToEnd = useDemoCodexStore((s) => s.jumpToEnd);
  const reset = useDemoCodexStore((s) => s.reset);
  const setSpeed = useDemoCodexStore((s) => s.setSpeed);

  const isPlaying = mode === 'playing';
  const isStopped = mode === 'stopped' && phase === 'idle';
  const isEnded = mode === 'ended' || phase === 'completed';

  const primaryLabel = isStopped
    ? 'Start replay'
    : isPlaying
      ? 'Pause'
      : isEnded
        ? 'Replay'
        : 'Resume';

  function onPrimary() {
    if (isStopped || isEnded) {
      reset();
      // brief defer so reset takes effect before start
      setTimeout(start, 0);
      return;
    }
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }

  // Primary CTA color flips based on mode: red while playing (the button
  // becomes Pause), green while paused (becomes Resume), neutral dark for
  // stopped/ended (Start replay / Replay).
  const primaryCls = isPlaying
    ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
    : mode === 'paused'
      ? 'bg-spruce-100 text-spruce-800 hover:bg-spruce-200'
      : 'bg-ink-900 text-paper hover:bg-ink-800';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Primary CTA */}
      <motion.button
        type="button"
        onClick={onPrimary}
        whileTap={{ scale: 0.97 }}
        className={`inline-flex h-9 items-center gap-2 rounded-full px-5 transition-colors ${primaryCls}`}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em]">
          {primaryLabel}
        </span>
      </motion.button>

      {/* Step back */}
      <SecondaryButton
        onClick={stepBackward}
        disabled={isPlaying || isStopped}
        label="Step back one phase"
      >
        <StepBack size={14} />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em]">Back</span>
      </SecondaryButton>

      {/* Step through */}
      <SecondaryButton
        onClick={stepThrough}
        disabled={isPlaying || phase === 'completed'}
        label="Step through one phase"
      >
        <StepForward size={14} />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em]">Step</span>
      </SecondaryButton>

      {/* Jump to end */}
      <button
        type="button"
        onClick={jumpToEnd}
        disabled={isStopped || phase === 'completed'}
        aria-label="Jump to final state"
        className="inline-flex h-9 items-center gap-2 rounded-full bg-accent px-3.5 text-paper shadow-soft transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
      >
        <FastForward size={14} />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em]">Jump to end</span>
      </button>

      {/* Reset */}
      <SecondaryButton
        onClick={reset}
        disabled={isStopped}
        label="Reset replay"
      >
        <RotateCcw size={14} />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em]">Reset</span>
      </SecondaryButton>

      {/* Speed */}
      <div
        role="radiogroup"
        aria-label="Replay speed"
        className="ml-auto inline-flex items-center gap-1 rounded-full border border-ink-100 bg-paper-muted/60 p-1"
      >
        <span className="px-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">
          Speed
        </span>
        {SPEEDS.map((s) => {
          const active = speed === s;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSpeed(s)}
              className={`relative rounded-full px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.08em] transition-colors ${
                active ? 'text-paper' : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="codex-speed-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-ink-900"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative">{s}×</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SecondaryButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-ink-200 bg-paper px-3.5 text-ink-700 shadow-soft transition-colors hover:border-ink-900 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:text-ink-700"
    >
      {children}
    </button>
  );
}
