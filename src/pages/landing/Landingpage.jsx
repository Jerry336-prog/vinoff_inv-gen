import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-extrabold text-amber-600">
          Vinoff
        </h1>

        <div className="space-x-2">
          <Link
            to="/login"
            className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-3 py-2 rounded-xl bg-amber-600 text-black font-semibold hover:bg-amber-500 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 mt-20">

        <div className="max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Create Professional Invoices <br />
            <span className="text-amber-600">
              In Seconds
            </span>
          </h2>

          <p className="text-gray-400 mt-6 text-lg">
            Vinoff helps entrepreneurs and freelancers generate,
            track and manage invoices with real-time updates,
            beautiful designs and instant PDF downloads.
          </p>

          <div className="mt-10 flex justify-center gap-6 flex-wrap">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-amber-600 text-black font-bold text-lg shadow-xl hover:bg-amber-500 transition"
            >
              Start Free
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl text-white text-lg hover:bg-white/20 transition"
            >
              Login
            </Link>
          </div>
        </div>

      </section>

      {/* FEATURES SECTION */}
      <section className="mt-28 px-8 pb-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Choose Vinoff?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* FEATURE 1 */}
          <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
            <h4 className="text-xl font-bold text-amber-600 mb-4">
              Real-Time Dashboard
            </h4>
            <p className="text-gray-400">
              Track paid, pending and overdue invoices instantly.
              Updates live as your business grows.
            </p>
          </div>

          {/* FEATURE 2 */}
          <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
            <h4 className="text-xl font-bold text-amber-600 mb-4">
              Professional PDF Generator
            </h4>
            <p className="text-gray-400">
              Download branded A4 invoices with logos,
              paid stamps and custom colors.
            </p>
          </div>

          {/* FEATURE 3 */}
          <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
            <h4 className="text-xl font-bold text-amber-600 mb-4">
              Built for Entrepreneurs
            </h4>
            <p className="text-gray-400">
              Designed to help you look credible,
              professional and ready for serious clients.
            </p>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="text-center pb-20 px-6">
        <div className="max-w-3xl mx-auto p-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">

          <h3 className="text-3xl font-bold mb-6">
            Ready to Simplify Your Invoicing?
          </h3>

          <p className="text-gray-400 mb-8">
            Join Vinoff today and start generating invoices
            that make you look like a pro.
          </p>

          <Link
            to="/register"
            className="px-6 py-4 rounded-2xl bg-amber-600 text-black font-bold lg:text-lg text-md hover:bg-amber-500 transition"
          >
            Create Free Account
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Vinoff. All rights reserved.
      </footer>

    </div>
  );
}