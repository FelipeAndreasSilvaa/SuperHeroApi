export function HeroCardSkeleton() {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm animate-pulse">
        
        <div className="flex items-center gap-3">
          <div className="h-[72px] w-[72px] rounded-xl bg-gray-300 dark:bg-slate-700" />
  
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-slate-700" />
            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-600" />
          </div>
        </div>
  
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-700" />
          <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-slate-700" />
          <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-slate-700" />
        </div>
  
        <div className="mt-4 h-8 w-full rounded-lg bg-gray-300 dark:bg-slate-700" />
      </div>
    );
  }