import TableSkeleton from "./TableSkeleton";

interface PageSkeletonProps {
  columns?: number;
  rows?: number;
}

const PageSkeleton = ({
  columns = 4,
  rows = 5,
}: PageSkeletonProps) => {
  return (
    <div className="space-y-5" aria-busy="true">
      <div className="animate-pulse">
        <div className="h-7 w-48 rounded-lg bg-slate-100" />
        <div className="mt-3 h-4 w-72 rounded-lg bg-slate-100" />
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="h-10 w-40 rounded-xl bg-slate-100" />
          <div className="h-10 w-32 rounded-xl bg-slate-100" />
          <div className="h-10 w-28 rounded-xl bg-slate-100" />
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <TableSkeleton columns={columns} rows={rows} />
      </section>
    </div>
  );
};

export default PageSkeleton;
