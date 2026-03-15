import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import InvoiceDeleteModal from "./InvoiceDeleteModal";
import { useInvoices } from "../../contexts/InvoiceContext"; // ✅ import context
import { db } from "../../utilis/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function InvoiceList() {
  const { user } = useContext(AuthContext);
  const { deleteInvoice } = useInvoices(); // ✅ get deleteInvoice from context
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, invoiceId: null });
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [search, setSearch] = useState("");

  // Protect page
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch user's invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "invoices"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        setInvoices(data);
        setFilteredInvoices(data);
      } catch (error) {
        console.error("Error loading invoices:", error);
      }
    };
    fetchInvoices();
  }, [user]);

  // Search filter
  useEffect(() => {
    const filtered = invoices.filter((inv) => {
      const client = inv.client?.toLowerCase() || "";
      const id = inv.id?.toLowerCase() || "";
      const searchText = search.toLowerCase();
      return client.includes(searchText) || id.includes(searchText);
    });
    setFilteredInvoices(filtered); // ✅ actually update state
  }, [search, invoices]);

  // Modal handlers
  const handleDeleteClick = (invoiceId) => {
    setDeleteModal({ isOpen: true, invoiceId }); 
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteInvoice(deleteModal.invoiceId); // ✅ now calls context deleteInvoice
      // Also remove from local state so UI updates instantly
      setInvoices((prev) => prev.filter((inv) => inv._id !== deleteModal.invoiceId));
      setDeleteModal({ isOpen: false, invoiceId: null });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleDeleteClose = () => {
    setDeleteModal({ isOpen: false, invoiceId: null });
  };

  const statusColor = {
    Paid: "text-green-400",
    Pending: "text-yellow-400",
    Overdue: "text-red-400",
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-900 text-white">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-amber-600 drop-shadow-lg">
          Invoice List
        </h1>
        <Link
          to="/invoicecreate"
          className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg
          hover:bg-amber-600 hover:text-black transition-all duration-300 shadow-xl text-center"
        >
          + Create Invoice
        </Link>
      </div>

      {/* SEARCH */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20
          focus:outline-none focus:border-amber-600 placeholder-gray-400 text-white"
        />
      </div>

      {/* ✅ Modal moved OUTSIDE the map loop */}
      <InvoiceDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        invoiceId={deleteModal.invoiceId}
      />

      {/* TABLE */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 shadow-xl">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((inv) => (
            <div
              key={inv._id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 mt-4 rounded-xl
              bg-white/5 backdrop-blur-lg border border-white/10
              hover:bg-white/20 transition-all duration-300"
            >
              <div className="md:col-span-3 font-semibold">{inv.id}</div>
              <div className="md:col-span-3">{inv.client}</div>
              <div className="md:col-span-2 font-bold text-amber-500">
                ₦{inv.amount.toLocaleString()}
              </div>
              <div className={`md:col-span-2 font-semibold ${statusColor[inv.status]}`}>
                {inv.status}
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Link
                  to={`/invoiceview/${inv._id}`}
                  className="px-2 py-1 rounded-lg text-[11px] bg-white/10 border border-white/20
                  hover:bg-amber-600 hover:text-black"
                >
                  View
                </Link>
                <Link
                  to={`/invoiceedit/${inv._id}`}
                  className="px-2 py-1 rounded-lg text-[11px] bg-white/10 border border-white/20
                  hover:bg-yellow-500 hover:text-black"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(inv._id)} // ✅ use inv._id
                  className="px-2 py-1 rounded-lg text-[11px] bg-red-600/20 border border-red-500/30
                  hover:bg-red-600/60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-6">No invoices found</p>
        )}
      </div>
    </div>
  );
}