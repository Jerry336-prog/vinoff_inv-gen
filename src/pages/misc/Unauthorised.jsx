import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white p-6">

      {/* Glassmorphism Container */}
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 max-w-lg text-center animate-fadeIn">

        {/* Icon */}
        <div className="text-amber-600 text-7xl font-bold drop-shadow-lg">
          ⚠️
        </div>

        {/* Title */}
        <h1 className="text-4xl mt-4 mb-2 font-extrabold text-amber-600 tracking-wide">
          Unauthorized
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg mt-3 leading-relaxed">
          You don’t have permission to access this page.  
          Please contact your administrator or go back to safety.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 items-center">

          {/* Back Home */}
          <Link
            to="/"
            className="
              text-lg font-semibold px-6 py-3 rounded-xl 
              backdrop-blur-lg bg-white/10
              border border-white/20 shadow-xl
              transition-all duration-300
              hover:bg-amber-600 hover:text-black
              hover:border-amber-700
            "
          >
            Go Home
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="
              text-lg font-semibold px-6 py-3 rounded-xl 
              backdrop-blur-lg bg-white/10
              border border-white/20 shadow-xl
              transition-all duration-300
              hover:bg-amber-600 hover:text-black
              hover:border-amber-700
            "
          >
            Login Again
          </Link>

        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}
      </style>

    </div>
  );
}
