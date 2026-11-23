import React from 'react';

/**
 * TrueFocus - Authoritative Fleet Section Title
 * Replaces distracting pulsating laser brackets and blurry words with crisp, authoritative typography.
 * Maintains full interface compatibility with legacy props across all routes.
 */
export default function TrueFocus({
  sentence = 'AUTRAIL Fleet System',
  separator = ' ',
  className = '',
  wordClassName = '',
  fontSize,
  ...props
}) {
  const words = React.useMemo(() => {
    return (sentence || '').split(separator).filter(word => word.trim() !== '');
  }, [sentence, separator]);

  return (
    <h1
      className={`inline-flex items-baseline flex-wrap gap-x-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 select-none ${className}`}
      style={fontSize ? { fontSize } : undefined}
    >
      {words.map((word, idx) => {
        // Last word gets a subtle commercial emphasis if multiple words
        const isLast = idx === words.length - 1 && words.length > 1;
        return (
          <span
            key={`${word}-${idx}`}
            className={`${wordClassName} ${isLast ? 'text-[#2879E8]' : 'text-slate-900'}`}
          >
            {word}
          </span>
        );
      })}
    </h1>
  );
}
