export default function DashboardLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="skeleton h-8 w-48 rounded-full mb-3" />
          <div className="skeleton h-10 w-72 rounded-xl mb-2" />
          <div className="skeleton h-4 w-56 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="skeleton h-72 rounded-2xl lg:col-span-2" />
          <div className="skeleton h-72 rounded-2xl" />
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  );
}
