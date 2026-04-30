import { useEffect, useState } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomableImage({ src, alt, className = '' }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`Zoom in on ${alt}`}
        className="group relative block w-full cursor-zoom-in border-0 bg-transparent p-0"
      >
        <img src={src} alt={alt} className={className} />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink-900/85 text-paper opacity-0 shadow-soft transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/85 p-6 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close zoomed image"
            className="absolute inset-0 cursor-zoom-out"
          />
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close zoom"
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-paper/95 text-ink-900 shadow-soft transition-colors hover:bg-paper"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img src={src} alt={alt} className="relative max-h-full max-w-full object-contain" />
        </div>
      )}
    </>
  );
}
