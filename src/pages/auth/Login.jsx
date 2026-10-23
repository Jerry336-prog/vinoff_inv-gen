import AuthLayout from "../../layouts/AuthLayout";
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
    <AuthLayout>
      <div className="w-full max-w-md p-10 rounded-2xl  bg-white border border-slate-200 shadow-sm ">
        <h1 className="text-4xl font-bold text-teal-700 text-center ">Welcome Back</h1>
        <p className="text-slate-600 text-center mt-2">Login to continue</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <label className="auth-field"><span>Email</span><input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-50 text-slate-900 border border-slate-200  focus:outline-none focus:border-teal-700 placeholder-gray-400"
          /></label>
          <label className="auth-field"><span>Password</span><input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-50 text-slate-900 border border-slate-200  focus:outline-none focus:border-teal-700 placeholder-gray-400"
          /></label>
          <Link to="/forgotpass" className="text-teal-700 text-sm hover:underline block text-right">Forgot Password?</Link>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-lg  bg-white text-slate-900 border border-slate-200 shadow-sm transition-all duration-300 hover:bg-teal-700 hover:text-white hover:border-teal-800"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-slate-600">
          Don't have an account? <Link to="/register" className="text-teal-700 hover:underline font-semibold">Register</Link>
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white  border border-slate-200 p-6 rounded-2xl w-11/12 max-w-sm text-center shadow-sm">
            <h2 className="text-teal-700 font-bold text-xl mb-4">Login Failed</h2>
            <p className="text-slate-900 mb-6">{error}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 rounded-xl  bg-white text-slate-900 border border-slate-200 shadow-sm transition-all duration-300 hover:bg-teal-700 hover:text-white hover:border-teal-800"
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
          . { animation: fadeIn 0.9s ease-out forwards; }
        `}
      </style>
    </AuthLayout>
  );
}
