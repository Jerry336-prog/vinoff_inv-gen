import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utilis/Firebase";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/dashboard"); // redirect after successful login
    } catch (err) {
      setError("Wrong email or password!");
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-6 relative">
      <div className="w-full max-w-md p-10 rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-amber-600 text-center drop-shadow-lg">Welcome Back</h1>
        <p className="text-gray-300 text-center mt-2">Login to continue</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 mt-1 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:border-amber-600 placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 mt-1 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:border-amber-600 placeholder-gray-400"
          />
          <Link to="/Forgotpass" className="text-amber-600 text-sm hover:underline block text-right">Forgot Password?</Link>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-lg backdrop-blur-lg bg-white/10 text-white border border-white/20 shadow-xl transition-all duration-300 hover:bg-amber-600 hover:text-black hover:border-amber-700"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-300">
          Don't have an account? <Link to="/register" className="text-amber-600 hover:underline font-semibold">Register</Link>
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-2xl w-11/12 max-w-sm text-center shadow-2xl">
            <h2 className="text-amber-600 font-bold text-xl mb-4">Login Failed</h2>
            <p className="text-white mb-6">{error}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 rounded-xl backdrop-blur-lg bg-white/10 text-white border border-white/20 shadow-xl transition-all duration-300 hover:bg-amber-600 hover:text-black hover:border-amber-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.9s ease-out forwards; }
        `}
      </style>
    </div>
  );
}
