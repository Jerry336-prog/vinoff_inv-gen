import React, { useState } from "react";
 import { useEffect } from "react";
import InvoiceItemRow from "../../components/invoice/InvoiceItemrow";
import { Link, useNavigate } from "react-router-dom";
import { useInvoices } from "../../contexts/InvoiceContext";
import { db } from "../../utilis/Firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getDoc } from "firebase/firestore";

export default function CreateInvoice() {

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

useEffect(() => {
  if (!user) {
    navigate("/login");
  }
}, [user, navigate]);
 
const [company, setCompany] = useState(null);

useEffect(() => {
  if (!user) return;
  const fetchCompany = async () => {
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setCompany(snap.data());
    } catch (err) {
      console.error(err);
    }
  };
  fetchCompany();
}, [user]);

  // MAIN FIELDS
  const [clientName, setClientName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // INVOICE STATUS
  const [status, setStatus] = useState("Pending");

  // ITEMS ARRAY
  const [items, setItems] = useState([]);

  // Add new item row
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        name: "",
        price: "",
        quantity: 1,
      },
    ]);
  };

  // Update item
  const updateItem = (id, updated) => {
    setItems(items.map((i) => (i.id === id ? updated : i)));
  };

  // Remove item
  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  // Calculate total
  const invoiceTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!clientName) {
    alert("Client name is required.");
    return;
  }

  if (items.length === 0) {
    alert("Please add at least 1 invoice item.");
    return;
  }

  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    const newInvoice = {
      id: "INV-" + Math.floor(Math.random() * 90000 + 10000),
      client: clientName,
      date: invoiceDate || new Date().toISOString().split("T")[0],
      items: items.map((item) => ({
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity),
    })),
      amount: invoiceTotal,
      status,
      userId: user.uid, // VERY IMPORTANT
      public: true, // VERY IMPORTANT
      companyName: company?.companyName || "",
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "invoices", newInvoice.id), newInvoice);

    navigate("/invoicelist");

  } catch (error) {
    console.error("Error creating invoice:", error);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen p-6 md:p-10 bg-slate-900 text-white">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-amber-600 drop-shadow-lg">
          Create Invoice
        </h1>

        <Link
          to="/invoicelist"
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 
          backdrop-blur-lg hover:bg-amber-600 hover:text-black transition-all duration-300 shadow-xl"
        >
          ←
        </Link>
      </div>

      {/* FORM WRAPPER */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-10 shadow-xl"
      >
        {/* CLIENT & DATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="text-gray-300 mb-2 block font-semibold">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg 
              border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-600 
              placeholder-gray-400"
            />
          </div>

          <div>
            <label className="text-gray-300 mb-2 block font-semibold">
              Invoice Date
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-2 py-3 rounded-xl bg-white/10 backdrop-blur-lg 
              border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-600 text-white"
            />
          </div>
        </div>

        {/* ITEMS */}
        <h2 className="text-2xl font-bold text-amber-500 mb-4">
          Invoice Items
        </h2>

        {/* ITEM LIST */}
       <div className="mb-8">

  {items.length === 0 && (
    <p className="text-gray-400 italic">No items added yet.</p>
  )}

  {/* DESKTOP VERSION */}
  <div className="hidden md:block">
    {items.map((item) => (
      <InvoiceItemRow
        key={item.id}
        item={item}
        onChange={updateItem}
        onRemove={removeItem}
      />
    ))}
  </div>

  {/* MOBILE VERSION */}
  <div className="md:hidden space-y-4">
    {items.map((item) => (
      <InvoiceItemRow
        key={item.id}
        item={item}
        onChange={updateItem}
        onRemove={removeItem}
        mobile
      />
    ))}
  </div>

</div>

        {/* ADD ITEM BUTTON */}
        <button
          type="button"
          onClick={addItem}
          className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 
          backdrop-blur-xl hover:bg-amber-600 hover:text-black 
          transition-all duration-300 shadow-md"
        >
          + Add Item
        </button>

        {/* TOTAL */}
        <div className="mt-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-amber-400">Total Amount</h3>
          <p className="text-3xl font-extrabold text-amber-500 mt-2">
            ₦{invoiceTotal.toLocaleString()}
          </p>
        </div>

        {/* STATUS */}
        <div className="mb-6 mt-6">
          <label className="block mb-2 text-sm text-gray-300">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
            focus:border-amber-600 outline-none text-white"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="mt-10 flex justify-end">
          <button
       type="submit"
      disabled={isSubmitting}
       className="px-8 py-4 rounded-xl bg-amber-600/30 border border-amber-500/30 
       backdrop-blur-xl hover:bg-amber-600 hover:text-black 
       transition-all duration-300 shadow-xl font-semibold text-lg"
        >
       {isSubmitting ? "Saving..." : "Save Invoice"}
      </button>
    
        </div>
      </form>
    </div>
  );
}
