export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center justify-center gap-6">
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-spin"
          style={{ borderTopColor: "#00d4ff" }}
        />
        <div
          className="absolute inset-3 rounded-full border-2 border-purple-500/20 animate-spin"
          style={{
            borderTopColor: "#b347ff",
            animationDirection: "reverse",
            animationDuration: "0.7s",
          }}
        />
      </div>
      <div className="space-y-3 w-full max-w-lg">
        <div className="skeleton h-8 w-3/4 mx-auto rounded-lg" />
        <div className="skeleton h-4 w-1/2 mx-auto rounded-lg" />
        <div className="skeleton h-40 w-full rounded-2xl mt-6" />
        <div className="skeleton h-40 w-full rounded-2xl" />
      </div>
    </div>
  );
}
