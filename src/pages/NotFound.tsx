import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-2xl space-y-8">
        {/* Giant 404 */}
        <div className="relative">
          <h1 className="text-[200px] md:text-[300px] font-black leading-none bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl">🎵</div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            Track Not Found
          </h2>
          <p className="text-lg opacity-60 max-w-md mx-auto">
            Looks like this page went off the grid. Let's get you back to the mix!
          </p>
          {location.pathname && (
            <p className="text-sm opacity-40 font-mono">
              <span className="opacity-60">Attempted path:</span> {location.pathname}
            </p>
          )}
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            to="/stream"
            className="group rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 hover:from-cyan-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-bold px-8 py-3 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50 inline-flex items-center gap-2"
          >
            <span>Browse Stream</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/dj"
            className="rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-3 transition-all hover:scale-105 active:scale-95"
          >
            Open DJ Studio
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link to="/" className="text-white/60 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/learn" className="text-white/60 hover:text-white transition-colors">
            Learn
          </Link>
          <Link to="/profile" className="text-white/60 hover:text-white transition-colors">
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
