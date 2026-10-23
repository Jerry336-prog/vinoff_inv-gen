import AuthLayout from "../../layouts/AuthLayout";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../utilis/Firebase";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(null); // success or error message
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    // actionCodeSettings tells Firebase where to redirect after clicking link
    const actionCodeSettings = {
      url: "https://vinoff-inv-gen.vercel.app/resetpass", // must be authorized domain
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setStatus({ type: "success", message: "Reset link sent — check your email." });
      setModalMessage("Password reset email sent! Check your inbox.");
      setShowModal(true);
    } catch (err) {
      // Map common Firebase errors to friendly messages
      let message = err.message;
      if (err.code === "auth/user-not-found") message = "No account found for that email.";
      if (err.code === "auth/invalid-email") message = "Please enter a valid email address.";
      setModalMessage(err.message);
      setShowModal(true);
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-10 rounded-2xl  bg-white border border-slate-200 shadow-sm ">
        <h1 className="text-4xl font-bold text-teal-700 text-center ">
          Forgot Password
        </h1>

         {status && (
        <div className={status.type === "success" ? "text-emerald-700" : "text-red-600"}>
          {status.message}
        </div>
      )}

        <p className="text-slate-600 text-center mt-2">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-50 text-slate-900 border border-slate-200  focus:outline-none focus:border-teal-700 placeholder-gray-400"
          />

          <button className="w-full py-3 rounded-xl font-semibold text-lg  bg-white text-slate-900 border border-slate-200 shadow-sm transition-all duration-300 hover:bg-teal-700 hover:text-white hover:border-teal-800"
           disabled={loading} type="submit">
          {loading ? "Sending..." : "Send reset link"}
        </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-teal-700 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white  border border-slate-200 p-6 rounded-2xl w-11/12 max-w-sm text-center shadow-sm">
            <h2 className="text-teal-700 font-bold text-xl mb-4">Notification</h2>
            <p className="text-slate-900 mb-6">{modalMessage}</p>
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
