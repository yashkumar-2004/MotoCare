import React from 'react';
import { AlertOctagon, RotateCcw, PhoneCall } from 'lucide-react';
import { SUPPORT_PHONE } from '../../utils/constants';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this data. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-rose-50/50 rounded-2xl border border-rose-200">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <AlertOctagon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-rose-950 mb-1">{title}</h3>
      <p className="text-sm text-rose-700 max-w-md mb-6">{message}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition shadow-sm active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Action
          </button>
        )}
        <a
          href={`tel:${SUPPORT_PHONE}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-800 text-sm font-medium transition"
        >
          <PhoneCall className="w-4 h-4 text-rose-600" />
          Call Support ({SUPPORT_PHONE})
        </a>
      </div>
    </div>
  );
};
