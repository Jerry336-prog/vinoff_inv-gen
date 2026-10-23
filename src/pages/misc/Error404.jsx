import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900 p-6">
      {/* Glass Card */}
      <div className=" bg-white border border-slate-200 shadow-sm rounded-2xl p-10 max-w-lg text-center">

        {/* 404 Text */}
        <h1 className="text-8xl font-bold text-teal-700 ">
          404
        </h1>

        <p className="mt-4 text-xl text-slate-600">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 items-center">

          {/* Home Button */}
          <Link
            to="/"
            className="
              text-lg font-semibold px-6 py-3 rounded-xl
               bg-white
              border border-slate-200
              shadow-sm
              transition-all duration-300
              hover:bg-teal-700 hover:text-white
              hover:border-teal-800
            "
          >
            Go Home
          </Link>

          {/* Contact Support Button */}
          <Link
            to="/support"
            className="
              text-lg font-semibold px-6 py-3 rounded-xl
               bg-white
              border border-slate-200
              shadow-sm
              transition-all duration-300
              hover:bg-teal-700 hover:text-white
              hover:border-teal-800
            "
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
