export default function SourceCheckerLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="skeleton h-10 w-80 mx-auto rounded-xl mb-3" />
          <div className="skeleton h-4 w-64 mx-auto rounded-lg" />
        </div>
        <div className="skeleton h-40 rounded-2xl mb-6" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  );
}
