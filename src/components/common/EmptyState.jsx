import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

/**
 * Reusable EmptyState Component
 * Provides meaningful, helpful empty states across tables, lists, and search queries.
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data to display for this view.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-slate-50/60 border border-dashed border-slate-200 ${className}`}>
      <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-2">
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="default" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {actionLabel && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
