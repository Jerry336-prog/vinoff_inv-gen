import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../utilis/Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../../utilis/Firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\+?\d{10,15}$/.test(form.phone)) {
      setError("Enter a valid phone number");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Update profile name
      await updateProfile(userCredential.user, {
        displayName: `${form.fullName} (${form.companyName})`
      });

      // Save user info to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: form.fullName,
        companyName: form.companyName,
        email: form.email,
        address: form.address,
        phone: form.phone,
        createdAt: new Date()
      });

      // Redirect
      navigate("/login");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-6">

      <div className="w-full max-w-md p-10 rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl animate-fadeIn">

        <h1 className="text-4xl font-extrabold text-amber-600 text-center drop-shadow-lg">
          Create Account
        </h1>

        <p className="text-gray-300 text-center mt-2">
          Join us and start creating invoices
        </p>

        {error && (
          <p className="text-red-500 mt-2 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:border-amber-600 placeholder-gray-400"
          />

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:border-amber-600 placeholder-gray-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:border-amber-600 placeholder-gray-400"
          />

          <textarea
             name="address"
             placeholder="Company Address"
             value={form.address}
             onChange={handleChange}
             required
             rows={3}
             className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md 
             focus:outline-none focus:border-amber-600 placeholder-gray-400 resize-none"
           />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:border-amber-600 placeholder-gray-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:border-amber-600 placeholder-gray-400"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:border-amber-600 placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-lg backdrop-blur-lg bg-white/10 text-white border border-white/20 shadow-xl transition-all duration-300 hover:bg-amber-600 hover:text-black hover:border-amber-700"
          >
            Register
          </button>

        </form>

        <p className="mt-6 text-center text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-600 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>

      </div>

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