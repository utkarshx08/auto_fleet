import React from 'react';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-9 h-9 border-3',
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-[#343641] border-t-[#b49aff] animate-spin`}
      />
    </div>
  );
}

