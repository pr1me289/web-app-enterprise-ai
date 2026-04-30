import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState, type ReactNode } from 'react';
import { marked } from 'marked';

export type DocKind = 'pdf' | 'json' | 'markdown' | 'sheet' | 'docx';

interface SheetOverrides {
  tabs?: string[];
  skipRowsPerSheet?: number[];
  firstCellOverrides?: string[];
  // Per-sheet column-width hints. When a sheet has widths defined the table
  // switches to table-fixed and a <colgroup> applies the widths. Each entry
  // is the active sheet's array of CSS width strings (e.g. '8%', '120px').
  // Entries left undefined fall back to auto layout for that sheet.
  columnWidthsPerSheet?: (string[] | undefined)[];
}

interface Props {
  src: string;
  title: string;
  kind: DocKind;
  label?: string;
  overrides?: SheetOverrides;
  /** If provided, renders as the Dialog.Trigger instead of the default file-pill button. */
  trigger?: ReactNode;
}

const typeLabel: Record<DocKind, string> = {
  pdf: 'PDF',
  json: 'JSON',
  markdown: 'Markdown',
  sheet: 'Spreadsheet',
  docx: 'Word Document',
};

function FileIcon({ kind }: { kind: DocKind }) {
  const pillText =
    kind === 'sheet'
      ? 'XLSX'
      : kind === 'pdf'
        ? 'PDF'
        : kind === 'json'
          ? 'JSON'
          : kind === 'docx'
            ? 'DOCX'
            : 'MD';
  return (
    <span
      aria-hidden
      className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 bg-paper px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="14"
        viewBox="0 0 24 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 1 H3 a2 2 0 0 0 -2 2 v22 a2 2 0 0 0 2 2 h18 a2 2 0 0 0 2 -2 V9 Z" />
        <path d="M15 1 v8 h8" />
      </svg>
      {pillText}
    </span>
  );
}

export default function DocumentViewer({ src, title, kind, label, overrides, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [sheetData, setSheetData] = useState<{
    sheets: { name: string; rows: unknown[][] }[];
  } | null>(null);
  const [activeSheet, setActiveSheet] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (kind === 'pdf') return;

    let cancelled = false;
    setError(null);

    if (kind === 'sheet') {
      fetch(src.replace(/\.xlsx$/i, '.sheet.json'))
        .then((r) => {
          if (!r.ok) throw new Error(`${r.status}`);
          return r.json();
        })
        .then((data) => {
          if (!cancelled) {
            setSheetData(data);
            setActiveSheet(0);
          }
        })
        .catch((e) => !cancelled && setError(String(e)));
    } else if (kind === 'docx') {
      fetch(src.replace(/\.docx$/i, '.html.json'))
        .then((r) => {
          if (!r.ok) throw new Error(`${r.status}`);
          return r.json();
        })
        .then((data: { html: string }) => {
          if (!cancelled) setContent(data.html);
        })
        .catch((e) => !cancelled && setError(String(e)));
    } else {
      fetch(src)
        .then((r) => {
          if (!r.ok) throw new Error(`${r.status}`);
          return r.text();
        })
        .then((text) => {
          if (cancelled) return;
          if (kind === 'json') {
            try {
              setContent(JSON.stringify(JSON.parse(text), null, 2));
            } catch {
              setContent(text);
            }
          } else {
            setContent(text);
          }
        })
        .catch((e) => !cancelled && setError(String(e)));
    }

    return () => {
      cancelled = true;
    };
  }, [open, kind, src]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger ?? (
          <button
            type="button"
            className="group inline-flex max-w-full items-center gap-2 rounded-md border border-ink-200 bg-paper px-2.5 py-1.5 text-left text-xs text-ink-700 shadow-soft transition-colors hover:border-ink-900 hover:bg-paper-muted"
          >
            <FileIcon kind={kind} />
            <span className="min-w-0 break-all font-medium leading-snug group-hover:text-ink-900">
              {label ?? title}
            </span>
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 flex h-[88vh] w-[95vw] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-paper shadow-2xl"
        >
          <header className="flex items-start justify-between gap-4 border-b border-ink-100 bg-paper px-5 py-4">
            <div className="min-w-0">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-400">
                {typeLabel[kind]}
              </p>
              <Dialog.Title className="mt-1 truncate font-serif text-lg font-semibold text-ink-900">
                {title}
              </Dialog.Title>
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

          <div className="min-h-0 flex-1 overflow-auto bg-paper-muted">
            {error && (
              <div className="p-6 text-sm text-red-700">Failed to load document: {error}</div>
            )}
            {!error && kind === 'pdf' && (
              <iframe
                src={src}
                title={title}
                className="h-full w-full border-0 bg-paper"
              />
            )}
            {!error && kind === 'json' && (
              <pre className="m-0 h-full overflow-auto bg-paper p-6 font-mono text-xs leading-relaxed text-ink-800">
                {content ?? 'Loading…'}
              </pre>
            )}
            {!error && kind === 'markdown' && (
              <div
                className="prose-narrative max-w-none bg-paper p-8 text-sm leading-relaxed text-ink-800 [&_h1]:font-serif [&_h1]:text-2xl [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-xl [&_h3]:mt-5 [&_h3]:font-serif [&_h3]:text-lg [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_code]:rounded [&_code]:bg-paper-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs [&_code]:break-all [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:rounded [&_pre]:bg-paper-muted [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:leading-relaxed [&_pre_code]:bg-transparent [&_pre_code]:px-0 [&_table]:mt-4 [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_table]:text-xs [&_td]:border [&_td]:border-ink-100 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:break-words [&_th]:border [&_th]:border-ink-100 [&_th]:bg-paper-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:break-words"
                dangerouslySetInnerHTML={{
                  __html: content ? (marked.parse(content) as string) : 'Loading…',
                }}
              />
            )}
            {!error && kind === 'docx' && (
              <div
                className="prose-narrative bg-paper p-8 text-sm leading-relaxed text-ink-800 [&_h1]:mt-6 [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_td]:border [&_td]:border-ink-100 [&_td]:px-2 [&_td]:py-1 [&_td]:align-top [&_th]:border [&_th]:border-ink-100 [&_th]:bg-paper-muted [&_th]:px-2 [&_th]:py-1 [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{
                  __html: content ?? 'Loading…',
                }}
              />
            )}
            {!error && kind === 'sheet' && (
              <div className="flex h-full flex-col bg-paper">
                {sheetData && sheetData.sheets.length > 1 && (
                  <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-ink-100 bg-paper px-4 py-2">
                    {sheetData.sheets.map((s, i) => (
                      <button
                        key={s.name + i}
                        type="button"
                        onClick={() => setActiveSheet(i)}
                        className={`rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition-colors ${
                          i === activeSheet
                            ? 'bg-ink-900 text-paper'
                            : 'text-ink-600 hover:bg-paper-muted hover:text-ink-900'
                        }`}
                      >
                        {overrides?.tabs?.[i] ?? s.name}
                      </button>
                    ))}
                  </div>
                )}
                <div className="min-h-0 flex-1 overflow-auto p-4">
                  {!sheetData && (
                    <p className="p-4 text-sm text-ink-500">Loading…</p>
                  )}
                  {sheetData && (() => {
                    const widths = overrides?.columnWidthsPerSheet?.[activeSheet];
                    return (
                    <table
                      className={`w-full border-collapse text-xs ${widths ? 'table-fixed' : ''}`}
                    >
                      {widths && (
                        <colgroup>
                          {widths.map((w, i) => (
                            <col key={i} style={w ? { width: w } : undefined} />
                          ))}
                        </colgroup>
                      )}
                      <tbody>
                        {sheetData.sheets[activeSheet]?.rows
                          .slice(overrides?.skipRowsPerSheet?.[activeSheet] ?? 0)
                          .map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className={
                              rIdx === 0
                                ? 'bg-paper-muted font-mono uppercase tracking-[0.08em] text-ink-700'
                                : rIdx % 2
                                  ? 'bg-paper'
                                  : 'bg-paper-muted/40'
                            }
                          >
                            {(row as unknown[]).map((cell, cIdx) => {
                              const firstCellOverride =
                                overrides?.firstCellOverrides?.[activeSheet];
                              const displayCell =
                                rIdx === 0 && cIdx === 0 && firstCellOverride
                                  ? firstCellOverride
                                  : cell === null || cell === undefined
                                    ? ''
                                    : String(cell);
                              return (
                                <td
                                  key={cIdx}
                                  className={`border border-ink-100 px-3 py-2 align-top text-ink-800 ${
                                    rIdx === 0 ? 'whitespace-nowrap' : 'break-words'
                                  }`}
                                >
                                  {displayCell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
