import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../utilis/Firebase";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [oobCode, setOobCode] = useState(""); // Code from URL
  const [isValidCode, setIsValidCode] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the oobCode from URL
  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (!code) {
      setModalMessage("Invalid password reset link.");
      setShowModal(true);
      setIsValidCode(false);
    } else {
      setOobCode(code);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setModalMessage("Passwords do not match!");
      setShowModal(true);
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setModalMessage("Password has been reset successfully!");
      setShowModal(true);

      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setModalMessage(err.message);
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-6 relative">
      <div className="w-full max-w-md p-10 rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-amber-600 text-center drop-shadow-lg">
          Reset Password
        </h1>
        <p className="text-gray-300 text-center mt-2">
          Enter your new password to continue
        </p>

        {isValidCode && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:border-amber-600 placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 rounded-xl bg-white/5 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:border-amber-600 placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-lg backdrop-blur-lg bg-white/10 text-white border border-white/20 shadow-xl transition-all duration-300 hover:bg-amber-600 hover:text-black hover:border-amber-700"
            >
              Reset Password
            </button>
          </form>
        )}

        {!isValidCode && (
          <p className="mt-6 text-center text-red-500">
            Invalid or expired link. Please request a new reset email.
          </p>
        )}

        <p className="mt-6 text-center text-gray-300">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-amber-600 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-2xl w-11/12 max-w-sm text-center shadow-2xl">
            <h2 className="text-amber-600 font-bold text-xl mb-4">Notification</h2>
            <p className="text-white mb-6">{modalMessage}</p>
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
