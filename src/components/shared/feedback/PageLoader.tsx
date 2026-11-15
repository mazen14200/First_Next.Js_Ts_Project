import PageSkeleton from "./PageSkeleton";

interface PageLoaderProps {
  columns?: number;
  rows?: number;
}

const PageLoader = ({ columns, rows }: PageLoaderProps) => {
  return <PageSkeleton columns={columns} rows={rows} />;
};

export default PageLoader;
