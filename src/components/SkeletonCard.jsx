import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden animate-pulse flex flex-col">
      <div className="aspect-square bg-slate-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-4/5"></div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-slate-200 rounded-full"></div>
          ))}
          <div className="h-3 bg-slate-200 rounded w-8 ml-2"></div>
        </div>
        <div className="h-5 bg-slate-200 rounded w-1/2"></div>
        <div className="h-8 bg-slate-200 rounded-full w-full"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
