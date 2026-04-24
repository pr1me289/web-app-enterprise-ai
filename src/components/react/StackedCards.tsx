import { motion } from 'framer-motion';
import { useState } from 'react';

interface Card {
  title: string;
  body: string;
}

interface Props {
  cards: Card[];
}

export default function StackedCards({ cards }: Props) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));

  const handleNext = () => {
    setOrder((current) => {
      const [first, ...rest] = current;
      return [...rest, first];
    });
  };

  const handlePrev = () => {
    setOrder((current) => {
      const last = current[current.length - 1];
      return [last, ...current.slice(0, -1)];
    });
  };

  const topCardIdx = order[0];

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative min-h-[15rem] sm:min-h-[14rem]">
        {order.map((cardIdx, positionIdx) => {
          const card = cards[cardIdx];
          const depth = positionIdx;
          return (
            <motion.div
              key={cardIdx}
              animate={{
                y: depth * 10,
                x: depth * 6,
                scale: 1 - depth * 0.04,
                opacity: depth < 4 ? 1 - depth * 0.15 : 0,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              style={{
                zIndex: cards.length - depth,
                pointerEvents: depth === 0 ? 'auto' : 'none',
              }}
              className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-ink-100 bg-paper p-6 shadow-soft"
            >
              <div>
                <h4 className="font-serif text-xl font-semibold text-ink-900">{card.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{card.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-1.5" aria-hidden="true">
          {cards.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === topCardIdx ? 'w-6 bg-accent' : 'w-1.5 bg-ink-200'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous card"
            className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 bg-paper text-ink-600 transition-colors hover:border-ink-900 hover:text-ink-900"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next card"
            className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Next
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-ink-400">
        {topCardIdx + 1} of {cards.length}
      </p>
    </div>
  );
}
