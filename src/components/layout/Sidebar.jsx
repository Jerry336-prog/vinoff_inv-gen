import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Sidebar() {

  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <nav className="space-y-4">

        <Link
          to="/dashboard"
          className="block px-4 py-2 rounded-xl text-white bg-white/10 border border-white/20 hover:bg-amber-600 hover:text-black transition"
        >
          Dashboard
        </Link>

        <Link
          to="/invoicelist"
          className="block px-4 py-2 rounded-xl text-gray-300 hover:bg-white/10 hover:text-amber-600 transition"
        >
          Invoices
        </Link>

        <Link
          to="/invoicecreate"
          className="block px-4 py-2 rounded-xl text-gray-300 hover:bg-white/10 hover:text-amber-600 transition"
        >
          Create Invoice
        </Link>

        <button
          onClick={handleLogout}
          className="block px-4 py-2 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>

      </nav>
    </div>
  );
}