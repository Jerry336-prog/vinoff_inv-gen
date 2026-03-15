import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white p-6">
      {/* Glass Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 max-w-lg text-center">
        
        {/* 404 Text */}
        <h1 className="text-8xl font-extrabold text-amber-600 drop-shadow-lg">
          404
        </h1>

        <p className="mt-4 text-xl text-gray-300">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 items-center">
          
          {/* Home Button */}
          <Link
            to="/"
            className="
              text-lg font-semibold px-6 py-3 rounded-xl 
              backdrop-blur-lg bg-white/10
              border border-white/20
              shadow-xl
              transition-all duration-300
              hover:bg-amber-600 hover:text-black
              hover:border-amber-700
            "
          >
            Go Home
          </Link>

          {/* Contact Support Button */}
          <Link
            to="/support"
            className="
              text-lg font-semibold px-6 py-3 rounded-xl 
              backdrop-blur-lg bg-white/10
              border border-white/20
              shadow-xl
              transition-all duration-300
              hover:bg-amber-600 hover:text-black
              hover:border-amber-700
            "
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
