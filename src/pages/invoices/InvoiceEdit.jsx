import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import InvoiceItemRow from "../../components/invoice/InvoiceItemrow";
import { useInvoices } from "../../contexts/InvoiceContext";
import { db } from "../../utilis/Firebase";
import { doc, getDoc } from "firebase/firestore";

export default function InvoiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateInvoice } = useInvoices();

  // Local States
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
const [clientAddress, setClientAddress] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deposit, setDeposit] = useState(0);
const [createdBy, setCreatedBy] = useState("");
const [balance, setBalance] = useState(0);

  // Fetch invoice DIRECTLY from Firestore
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const ref = doc(db, "invoices", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = snap.data();

        setClientName(data.client || "");
        setClientEmail(data.clientEmail || "");
        setClientAddress(data.clientAddress || "");
        setInvoiceDate(data.date || "");
        setStatus(data.status || "Pending");
        setItems(data.items || []);
        setDeposit(data.deposit || 0);
        setCreatedBy(data.createdBy || "");

        setLoading(false);
      } catch (err) {
        console.error("Error loading invoice:", err);
        setNotFound(true);
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

// TOTAL
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    useEffect(() => {
  if (status === "Paid") {
    setDeposit(total);
    setBalance(0);
  } else {
    setBalance(Math.max(total - deposit, 0));
  }
}, [total, deposit, status]);

  useEffect(() => {
  if (status === "Paid") {
    setDeposit(total);
    setBalance(0);
  } else {
    setBalance(Math.max(total - deposit, 0));
  }
}, [total, deposit, status]);

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <p className="text-xl text-slate-600">Loading invoice...</p>
      </div>
    );
  }

  // NOT FOUND SCREEN
  if (notFound) {
    return (
      <div className="min-h-screen p-8 bg-slate-50 text-slate-900">
        <h1 className="text-2xl text-red-600">Invoice not found</h1>
        <Link to="/invoicelist" className="underline text-teal-700">
          Go Back
        </Link>
      </div>
    );
  }

  // ADD NEW ITEM
  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: "", price: 0, quantity: 1 },
    ]);
  };

  // UPDATE ITEM
  const updateItem = (itemId, updatedItem) => {
    setItems(items.map((i) => (i.id === itemId ? updatedItem : i)));
  };

  // REMOVE ITEM
  const removeItem = (itemId) => {
    setItems(items.filter((i) => i.id !== itemId));
  };



  // SUBMIT UPDATED INVOICE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedInvoice = {
  client: clientName,
  date: invoiceDate,
  status,
  items,
  amount: total,
  deposit,
  balance,
  createdBy,
};

    await updateInvoice(id, updatedInvoice);
    navigate("/invoicelist");
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-slate-50 text-slate-900">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="lg:text-4xl font-bold text-xl text-teal-700 ">
          Edit Invoice: {id}
        </h1>

        <Link
          to="/invoicelist"
          className="px-3 py-1 rounded-xl bg-white border border-slate-200
           hover:bg-teal-700 hover:text-white
          transition-all duration-300 shadow-sm"
        >
          ←
        </Link>
      </div>

      {/* FORM WRAPPER */}
      <form
        onSubmit={handleSubmit}
        className="bg-white  border border-slate-200
        rounded-2xl p-6 md:p-10 shadow-sm"
      >
        {/* CLIENT & DATE FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="text-slate-600 mb-2 block font-semibold">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client name"
              className="w-full px-4 py-3 rounded-xl bg-white
                border border-slate-200 focus:outline-none focus:ring-2
                focus:ring-teal-700 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="text-slate-600 mb-2 block font-semibold">
              Invoice Date
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-2 py-3 rounded-xl bg-white
                border border-slate-200 focus:outline-none focus:ring-2
                focus:ring-teal-700 text-slate-900"
            />
          </div>
        </div>

        {/* ITEMS SECTION */}
       {/* ITEMS SECTION */}
<h2 className="text-2xl font-bold text-teal-700 mb-4">
  Edit Invoice Items
</h2>

<div className="mb-8">

  {items.length === 0 && (
    <p className="text-slate-500 italic">No items added.</p>
  )}

  {/* DESKTOP VERSION */}
  <div className="hidden md:block space-y-3">
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

        {/* Add Item Button */}
        <button
          type="button"
          onClick={addItem}
          className="px-6 py-3 mb-6 rounded-xl bg-white border border-slate-200
           hover:bg-teal-700 hover:text-white transition-all duration-300 shadow-md"
        >
          + Add Item
        </button>

        {/* TOTAL AMOUNT */}
        <div className="mt-6 bg-white  border border-slate-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-teal-600">Total Amount</h3>
          <p className="text-3xl font-bold text-teal-700 mt-2">
            ₦{total.toLocaleString()}
          </p>
        </div>

{/* Deposit */}
<div className="mt-6">
  <label className="text-slate-600">Deposit</label>
  <input
    type="number"
    value={deposit}
    onChange={(e) => setDeposit(Number(e.target.value))}
    className="w-full p-3 rounded bg-white border border-slate-200"
  />
</div>

<div className="mt-6">
  <label className="text-slate-600">Balance</label>
  <input
    type="number"
    value={balance}
    readOnly
    className="w-full p-3 rounded bg-white border border-slate-200 text-slate-600"
  />
</div>

{/* Prepared By */}
<div className="mt-6">
    <label className="text-slate-600">Prepared By</label>
  <input
    value={createdBy}
    onChange={(e) => setCreatedBy(e.target.value)}
    className="w-full p-3 rounded bg-white border border-slate-200"
  />
</div>


        {/* STATUS */}
        <div className="mb-6 mt-6">
          <label className="block mb-2 text-sm text-slate-600">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200
            focus:border-teal-700 outline-none text-slate-900"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* SAVE CHANGES */}
        <div className="mt-10 flex justify-end">
          <button
            type="submit"
            className="px-8 py-4 rounded-xl bg-teal-700/30 border border-teal-700/30
             hover:bg-teal-700 hover:text-white
            transition-all duration-300 shadow-sm font-semibold text-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
