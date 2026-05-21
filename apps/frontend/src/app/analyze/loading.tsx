export default function AnalyzeLoading() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="skeleton h-8 w-48 mx-auto rounded-full mb-5" />
          <div className="skeleton h-12 w-96 mx-auto rounded-xl mb-4" />
          <div className="skeleton h-5 w-72 mx-auto rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="skeleton h-[420px] rounded-2xl" />
          <div className="skeleton h-[420px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
