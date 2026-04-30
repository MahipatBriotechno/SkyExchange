import React from 'react';
import { useSnackbarStore } from '../store/snackbarStore';

export default function Snackbar() {
  const { message, type, isVisible, hide } = useSnackbarStore();

  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };

  return (
    <div 
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-lg shadow-2xl text-white font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 ${bgColors[type] || bgColors.success}`}
      onClick={hide}
    >
      <div className="flex items-center gap-3">
        {type === 'error' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        )}
        <span className="text-sm tracking-wide">{message}</span>
      </div>
    </div>
  );
}
