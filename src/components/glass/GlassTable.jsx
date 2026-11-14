import React from 'react';

/**
 * GlassTable - Solid white glossy table container with crisp typography,
 * subtle alternating or hover rows, and clean responsive wrapping.
 */
export default function GlassTable({
  headers = [],
  children,
  className = '',
  empty = false,
  emptyMessage = 'No records found'
}) {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white/90 shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse text-xs">
        {headers.length > 0 && (
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFD]/90">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="py-3 px-4 text-[10px] font-semibold text-[#68758A] font-mono uppercase tracking-wider select-none"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-[#F1F5F9] text-[#172033]">
          {empty ? (
            <tr>
              <td
                colSpan={headers.length || 1}
                className="py-10 text-center text-xs text-[#94A3B8] font-sans"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
