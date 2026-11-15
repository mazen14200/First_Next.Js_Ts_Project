interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

const TableSkeleton = ({
  columns = 4,
  rows = 5,
}: TableSkeletonProps) => {
  return (
    <div
      className="animate-pulse"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex gap-6">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-3 flex-1 rounded bg-slate-100"
            />
          ))}
        </div>
      </div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-6 border-b border-slate-100 px-6 py-5 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 flex-1 rounded bg-slate-100"
              style={{
                maxWidth:
                  colIndex === columns - 1
                    ? "5rem"
                    : undefined,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
