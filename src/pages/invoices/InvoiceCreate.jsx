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
const [deposit, setDeposit] = useState("");

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
  const [createdBy, setCreatedBy] = useState("");
  const [errors, setErrors] = useState({});

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
  // Calculate balance after deposit
  const depositAmount = Number(deposit) || 0;
const balance =
  status === "Paid" ? 0 : Math.max(invoiceTotal - depositAmount, 0);

 useEffect(() => {
  if (status === "Paid") {
    setDeposit(invoiceTotal); // auto-fill deposit
  }
}, [status, invoiceTotal]);

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

if (!clientName.trim()) {
  newErrors.clientName = "Client name is required";
}

if (!createdBy.trim()) {
  newErrors.createdBy = "Please enter who created this invoice";
}

if (items.length === 0) {
  newErrors.items = "Please add at least 1 invoice item";
}

if (depositAmount > invoiceTotal) {
  newErrors.deposit = "Deposit cannot be greater than total amount";
}

if (Object.keys(newErrors).length > 0) {
  setErrors(newErrors);
  return;
}

  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    const newInvoice = {
      id: "INV-" + Math.floor(Math.random() * 90000 + 10000),
      client: clientName,
      date: invoiceDate || new Date().toISOString().split("T")[0],
      createdBy: createdBy.trim(),
      items: items.map((item) => ({
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity),
    })),
      amount: invoiceTotal,
      deposit: depositAmount,
      balance: balance,
      status,
      userId: user.uid, // VERY IMPORTANT
      public: true, // VERY IMPORTANT
      companyName: company?.companyName || "",
      phone: company?.phone || "",
      address: company?.address || "",
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
              onChange={(e) => { setClientName(e.target.value);
                setErrors((prev) => ({ ...prev, clientName: "" }));
              }}

              placeholder="Enter client name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg 
              border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-600 
              placeholder-gray-400"
            />

            {errors.clientName && (
             <p className="text-red-400 text-sm mt-1">
              {errors.clientName}
            </p>
            )}
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

        <div className="mb-8">
          <label className="text-gray-300 mb-2 block font-semibold">
             Created By
          </label>
         <input
           type="text"
           value={createdBy}
           onChange={(e) => { setCreatedBy(e.target.value);
             setErrors((prev) => ({ ...prev, createdBy: "" }));
           }}
           placeholder="Enter staff name"
           className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg 
           border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-600 
         placeholder-gray-400"
        />

        {errors.createdBy && (
          <p className="text-red-400 text-sm mt-1">
         {errors.createdBy}
       </p>
        )}
      </div>

        {/* ITEMS */}
        <h2 className="text-2xl font-bold text-amber-500 mb-4">
          Invoice Items
        </h2>
         
         {errors.items && (
          <p className="text-red-400 text-sm mb-3">
           {errors.items}
          </p>
    )}
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

        {/* DEPOSIT */}
         <div className="mt-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
           <h3 className="text-xl font-bold text-amber-400 mb-2">Deposit</h3>

             <input
                type="number"
                value={deposit}
                onChange={(e) => { setDeposit(e.target.value);
                  setErrors((prev) => ({ ...prev, deposit: "" }));
                }}
                placeholder="Enter deposit amount"
                disabled={status === "Paid"}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg 
                border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-600 
              placeholder-gray-400 text-white 
               ${errors.deposit ? "border-red-500" : "border-white/20"} 
              disabled:opacity-50 disabled:cursor-not-allowed`}
             />
             {errors.deposit && (
               <p className="text-red-400 text-sm mt-2">
                 {errors.deposit}
              </p>
            )}

            {status === "Paid" && (
              <p className="text-green-400 text-sm mt-2">
                Invoice is marked as paid — deposit locked
              </p>
      )}
           </div>

           {/* BALANCE */}
            <div className="mt-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
             <h3 className="text-xl font-bold text-amber-400">Balance</h3>

            <p className="text-3xl font-extrabold text-amber-500 mt-2">
               ₦{balance > 0 ? balance.toLocaleString() : "0"}
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
