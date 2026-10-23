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
import MainLayout from "../../layouts/MainLayout";


export default function Dashboard() {

  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);




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
    <MainLayout>
      <div className="dashboard-page">
        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-slate-900">
            Your business, at a glance.
          </h2>
          <p className="text-slate-500 mt-2">
            Keep an eye on your invoices and stay on top of what’s next.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by client or invoice ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 "
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="p-6 bg-white  border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-slate-600">Total Invoices</h3>
            <p className="text-4xl font-bold text-teal-700 mt-2">
              {loading ? "..." : totalInvoices}
            </p>
          </div>

          <div className="p-6 bg-white  border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-slate-600">Paid Invoices</h3>
            <p className="text-4xl font-bold text-emerald-700 mt-2">
              {loading ? "..." : paidInvoices}
            </p>
          </div>

          <div className="p-6 bg-white  border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-slate-600">Pending</h3>
            <p className="text-4xl font-bold text-amber-700 mt-2">
              {loading ? "..." : pendingInvoices}
            </p>
          </div>

            <div className="p-6 bg-white  border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-slate-600">Overdue</h3>
            <p className="text-4xl font-bold text-red-600 mt-2">
              {loading ? "..." : overdueInvoices}
            </p>
          </div>

        </div>

        {/* RECENT INVOICES */}
       <div className="bg-white  border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
  <h2 className="text-2xl font-bold text-slate-900 mb-6">
    Recent Invoices
  </h2>

  {loading ? (
    <p className="text-slate-500">Loading...</p>
  ) : recentInvoices.length === 0 ? (
    <p className="text-slate-500">No invoices found.</p>
  ) : (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-slate-600">
          <thead>
            <tr className="text-left border-b border-slate-200">
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
                className="border-b border-slate-200 hover:bg-slate-50 transition"
              >
                <td className="py-4">{inv.id}</td>
                <td>{inv.client}</td>
                <td>₦{inv.amount?.toLocaleString() || 0}</td>

                <td
                  className={
                    inv.status === "Paid"
                      ? "text-emerald-700"
                      : inv.status === "Pending"
                      ? "text-amber-700"
                      : "text-red-600"
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
            className="bg-slate-50 border border-slate-200 rounded-xl p-4 "
          >
            <div className="flex justify-between mb-2">
              <span className="text-slate-600 text-sm">Invoice ID</span>
              <span className=" text-slate-600  font-semibold">{inv.id}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-slate-600 text-sm">Client</span>
              <span className=" text-slate-600  font-semibold">{inv.client}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-slate-600 text-sm">Amount</span>
              <span className="text-teal-600 font-bold">
                ₦{inv.amount?.toLocaleString() || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Status</span>

              <span
                className={
                  inv.status === "Paid"
                    ? "text-emerald-700 font-semibold"
                    : inv.status === "Pending"
                    ? "text-amber-700 font-semibold"
                    : "text-red-600 font-semibold"
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
    </MainLayout>
  );
}
