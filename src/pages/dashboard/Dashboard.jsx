import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "../../utilis/Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const auth = getAuth();

  // ==============================
  // AUTH LISTENER (USER SWITCH SAFE)
  // ==============================
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInvoices([]);
      setFilteredInvoices([]);
    });

    return () => unsubscribeAuth();
  }, []);

  // ==============================
  // REAL-TIME INVOICE LISTENER
  // ==============================
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const q = query(
      collection(db, "invoices"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userInvoices = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInvoices(userInvoices);
      setFilteredInvoices(userInvoices);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // ==============================
  // SEARCH FILTER
  // ==============================
  useEffect(() => {
    const filtered = invoices.filter((inv) =>
      inv.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  // ==============================
  // STATS CALCULATION
  // ==============================
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === "Paid").length;
  const pendingInvoices = invoices.filter(inv => inv.status === "Pending").length;
  const overdueInvoices = invoices.filter(inv => inv.status === "Overdue").length;

  const recentInvoices = filteredInvoices.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-900 flex">

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <aside className="fixed top-0 left-0 h-full w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 p-6 md:hidden z-50">
          <button
            className="text-white mb-6 text-lg bg-white/10 px-3 py-1 rounded-lg"
            onClick={closeSidebar}
          >
            ☓
          </button>

          <Sidebar />
        </aside>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:block w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 pt-26 p-6">
        <Sidebar />
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-8 relative">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="h-24"></div>

        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-white">
            Welcome Back 👋
          </h2>
          <p className="text-gray-400 mt-2">
            Here's your live invoice activity.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by client or invoice ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 backdrop-blur-xl"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
            <h3 className="text-gray-300">Total Invoices</h3>
            <p className="text-4xl font-bold text-amber-600 mt-2">
              {loading ? "..." : totalInvoices}
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
            <h3 className="text-gray-300">Paid Invoices</h3>
            <p className="text-4xl font-bold text-green-500 mt-2">
              {loading ? "..." : paidInvoices}
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
            <h3 className="text-gray-300">Pending</h3>
            <p className="text-4xl font-bold text-yellow-400 mt-2">
              {loading ? "..." : pendingInvoices}
            </p>
          </div>

            <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
            <h3 className="text-gray-300">Overdue</h3>
            <p className="text-4xl font-bold text-red-400 mt-2">
              {loading ? "..." : overdueInvoices}
            </p>
          </div>

        </div>

        {/* RECENT INVOICES */}
       <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-xl">
  <h2 className="text-2xl font-bold text-white mb-6">
    Recent Invoices
  </h2>

  {loading ? (
    <p className="text-gray-400">Loading...</p>
  ) : recentInvoices.length === 0 ? (
    <p className="text-gray-400">No invoices found.</p>
  ) : (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-gray-300">
          <thead>
            <tr className="text-left border-b border-white/20">
              <th className="py-3">Invoice ID</th>
              <th className="py-3">Client</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {recentInvoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-white/10 hover:bg-white/5 transition"
              >
                <td className="py-4">{inv.id}</td>
                <td>{inv.client}</td>
                <td>₦{inv.amount?.toLocaleString() || 0}</td>

                <td
                  className={
                    inv.status === "Paid"
                      ? "text-green-400"
                      : inv.status === "Pending"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }
                >
                  {inv.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden flex flex-col gap-4">
        {recentInvoices.map((inv) => (
          <div
            key={inv.id}
            className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-lg"
          >
            <div className="flex justify-between mb-2">
              <span className="text-gray-300 text-sm">Invoice ID</span>
              <span className=" text-gray-300  font-semibold">{inv.id}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-300 text-sm">Client</span>
              <span className=" text-gray-300  font-semibold">{inv.client}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-300 text-sm">Amount</span>
              <span className="text-amber-400 font-bold">
                ₦{inv.amount?.toLocaleString() || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Status</span>

              <span
                className={
                  inv.status === "Paid"
                    ? "text-green-400 font-semibold"
                    : inv.status === "Pending"
                    ? "text-yellow-400 font-semibold"
                    : "text-red-400 font-semibold"
                }
              >
                {inv.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>

      </div>
    </div>
  );
}