import AuthLayout from "../../layouts/AuthLayout";
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
    <AuthLayout>

      <div className="w-full max-w-md p-10 rounded-2xl  bg-white border border-slate-200 shadow-sm ">

        <h1 className="text-4xl font-bold text-teal-700 text-center ">
          Create Account
        </h1>

        <p className="text-slate-600 text-center mt-2">
          Join us and start creating invoices
        </p>

        {error && (
          <p className="text-red-500 mt-2 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          <label className="auth-field"><span>Full Name</span><input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200  focus:outline-none focus:border-teal-700 placeholder-gray-400"
          /></label>

          <label className="auth-field"><span>Company Name</span><input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200  focus:outline-none focus:border-teal-700 placeholder-gray-400"
          /></label>

          <label className="auth-field"><span>Email</span><input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200  focus:outline-none focus:border-teal-700 placeholder-gray-400"
          /></label>

          <label className="auth-field"><span>Company address</span><textarea
             name="address"
             placeholder="Company Address"
             value={form.address}
             onChange={handleChange}
             required
             rows={3}
             className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200
             focus:outline-none focus:border-teal-700 placeholder-gray-400 resize-none"
           /></label>

          <label className="auth-field"><span>Phone Number</span><input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200  focus:outline-none focus:border-teal-700 placeholder-gray-400"
          /></label>

          <label className="auth-field"><span>Password</span><input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200  focus:outline-none focus:border-teal-700 placeholder-gray-400"
          /></label>

          <label className="auth-field"><span>Confirm Password</span><input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200  focus:outline-none focus:border-teal-700 placeholder-gray-400"
          /></label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-lg  bg-white text-slate-900 border border-slate-200 shadow-sm transition-all duration-300 hover:bg-teal-700 hover:text-white hover:border-teal-800"
          >
            Register
          </button>

        </form>

        <p className="mt-6 text-center text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-700 hover:underline font-semibold"
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
          . { animation: fadeIn 0.9s ease-out forwards; }
        `}
      </style>

    </AuthLayout>
  );
}
