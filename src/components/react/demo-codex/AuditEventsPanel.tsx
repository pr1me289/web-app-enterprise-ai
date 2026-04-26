// Renders a flat audit-event list as a clean ledger. Each event is colour-coded
// by its event-type prefix (retrieval, gate, escalation, etc.).
import { motion } from 'framer-motion';
import type { AuditEvent } from '../../../data/demo-codex/types';

function eventColor(type: string): string {
  if (type.startsWith('retrieval')) return 'text-spruce-700';
  if (type.startsWith('lookup')) return 'text-spruce-700';
  if (type.startsWith('determination')) return 'text-accent';
  if (type.startsWith('escalation') || type.startsWith('pipeline.halt')) return 'text-rose-700';
  if (type.startsWith('gate')) return 'text-spruce-700';
  if (type.startsWith('aggregation') || type.startsWith('package') || type.startsWith('run.'))
    return 'text-ink-700';
  return 'text-ink-600';
}

export default function AuditEventsPanel({ events }: { events: AuditEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="px-5 py-4 text-sm italic text-ink-500">No audit events recorded.</p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[0.72rem]">
        <thead className="bg-paper-muted/40 text-[0.6rem] uppercase tracking-[0.1em] text-ink-500">
          <tr>
            <th className="px-4 py-2 font-mono font-medium">Timestamp</th>
            <th className="px-4 py-2 font-mono font-medium">Event</th>
            <th className="px-4 py-2 font-mono font-medium">Payload</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {events.map((event, i) => (
            <motion.tr
              key={`${event.timestamp}-${i}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.22 }}
              className="align-top hover:bg-paper-muted/30"
            >
              <td className="whitespace-nowrap px-4 py-2 font-mono text-[0.68rem] text-ink-500">
                {event.timestamp.split('T')[1].slice(0, 12)}
              </td>
              <td
                className={`whitespace-nowrap px-4 py-2 font-mono text-[0.7rem] font-medium ${eventColor(event.type)}`}
              >
                {event.type}
              </td>
              <td className="px-4 py-2 font-mono text-[0.7rem] text-ink-700">
                <div>{event.payload}</div>
                {event.detail && (
                  <div className="mt-0.5 italic text-ink-500">{event.detail}</div>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
