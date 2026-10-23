import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useInvoices } from "../../contexts/InvoiceContext";
import { auth, db } from "../../utilis/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";


export default function InvoiceView() {
  const { id } = useParams();
  const { getInvoiceById } = useInvoices();
  const [company, setCompany] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const { user } = useContext(AuthContext);



// Fetch the logged-in user
 useEffect(() => {
  if (!user) return;


  const fetchCompany = async () => {
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCompany(snap.data());
      }
    } catch (err) {
      console.error(err);
    }
  };


  fetchCompany();
}, [user]);

  // Fetch invoice details
  useEffect(() => {
    if (!id) {
      setError("Invalid invoice ID");
      setLoading(false);
      return;
    }

    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceById(id);
        if (data) {
          setInvoice(data);
        } else {
          setError("Invoice not found");
        }
      } catch (err) {
        setError("Failed to fetch invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, getInvoiceById]);

  if (loading)
    return <p className="p-6 bg-slate-50 min-h-screen flex items-center justify-center text-slate-900">
      Loading invoice…</p>;
  if (error)
    return <p className="p-6 text-red-600">
      {error}</p>;

  // Calculate total safely
const total = invoice.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;


  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-900">

{/* company/user logged in header */}
   <div className="flex items-center gap-4 mb-8">
         <div className="w-14 h-14 bg-teal-700 rounded-lg flex items-center justify-center font-bold text-black text-xl">
           {company?.companyName?.charAt(0)?.toUpperCase() || "C"}
       </div>
       <div>
         <h2 className="text-2xl font-bold text-slate-900">
          {company?.companyName || "Your Company"}
        </h2>

        <p className="text-slate-500 text-sm">
        {user?.email || ""}
       </p>
   </div>

</div>

      <div className="max-w-3xl mx-auto bg-white border border-slate-200  rounded-2xl shadow-sm">

    {/* INVOICE WRAPPER */}
  <div className="bg-white  border border-slate-200 shadow-sm rounded-2xl p-8 md:p-12">

    {/* TOP SECTION */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 lg:gap-6 mb-10">
      <div>
        <h2 className="text-3xl font-bold text-teal-700 mb-2">{company?.companyName || "Your Company"} Invoice</h2>
        <p className="text-slate-600 text-lg">
          Invoice ID: <span className="text-slate-900 font-semibold">{invoice.id}</span>
        </p>
      </div>

      <div className="text-slate-600 text-lg md:mt-0">
        <p>
          Invoice Date: <span className="text-slate-900 font-semibold">{invoice.date}</span>
        </p>
      </div>
    </div>

    {/* CLIENT SECTION */}
    <div className="bg-slate-50  border border-slate-200 rounded-xl p-4 md:p-6 mb-8">
      <h3 className="text-xl font-bold text-teal-700 mb-3">Bill To</h3>
      <p className="text-slate-900 text-lg font-semibold">{invoice.client}</p>


    </div>

    {/* ITEMS TABLE */}
<div className="overflow-x-auto">
  <table className="w-full text-sm md:text-base">
    <thead>
      <tr className="text-left text-slate-600 border-b border-slate-200">
        <th className="py-3 px-2 md:px-3">Item</th>
        <th className="py-3 px-2 md:px-3 text-center">Price</th>
        <th className="py-3 px-2 md:px-3 text-center">Qty</th>
        <th className="py-3 px-2 md:px-3 text-right">Total</th>
      </tr>
    </thead>

    <tbody>
      {invoice.items?.map((item) => (
        <tr
          key={item.id}
          className="bg-slate-50  border border-slate-200 hover:bg-slate-100 transition-all duration-300"
        >
          <td className="py-3 px-2 md:px-3 font-semibold text-slate-900">
            {item.name}
          </td>

          <td className="py-3 px-2 md:px-3 text-center text-teal-600 font-semibold">
            ₦{item.price.toLocaleString()}
          </td>

          <td className="py-3 px-2 md:px-3 text-center">
            {item.quantity}
          </td>

          <td className="py-3 px-2 md:px-3 text-right font-bold text-teal-700">
            ₦{(item.price * item.quantity).toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

   {/* Status */}
        <div className=" mt-8">
          <h2 className="text-lg text-slate-600 mb-3">Status</h2>
          <span
            className={`px-4 py-2 rounded-xl font-semibold ${
              invoice.status === "Paid"
                ? "bg-green-600/20 text-emerald-700"
                : invoice.status === "Pending"
                ? "bg-yellow-600/20 text-amber-700"
                : "bg-red-600/20 text-red-600"
            }`}
          >
            {invoice.status}
          </span>
        </div>

    {/* TOTAL */}
    <div className="mt-10 flex justify-center md:justify-end">
      <div className="bg-white  border border-slate-200 p-6 rounded-xl w-full md:w-80">
        <h3 className="text-xl font-bold text-teal-700 mb-2">Total</h3>
        <p className="text-4xl font-bold text-teal-700">
          ₦{total.toLocaleString()}
        </p>
      </div>
    </div>

    {/* Deposit & Balance */}
       {invoice.status !== "Paid" && (
   <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

    <div className="bg-white border border-slate-200 p-5 rounded-xl">
      <h3 className="text-lg text-slate-600">Deposit</h3>
      <p className="text-2xl font-bold text-teal-600">
        ₦{invoice.deposit?.toLocaleString() || "0"}
      </p>
    </div>

    <div className="bg-white border border-slate-200 p-5 rounded-xl">
      <h3 className="text-lg text-slate-600">Balance</h3>
      <p className="text-2xl font-bold text-teal-700">
        ₦{invoice.balance?.toLocaleString() || "0"}
      </p>
    </div>

  </div>
)}

      <p className="text-slate-500 mt-4 text-sm">
          Prepared by: <span className="text-slate-900">{invoice.createdBy}</span>
       </p>

 <div className="flex text-center flex-col sm:flex-row gap-4 mt-10">

          <Link
          to={`/invoiceedit/${id}`}
           className="px-5 py-3 rounded-xl bg-white border border-slate-200  hover:bg-yellow-500 hover:text-white transition-all duration-300 shadow-sm" >
           Edit </Link>

            <Link
             to={`/invoicepublic/${id}`}
             className="px-5 py-3 rounded-lg bg-white border border-slate-200
              hover:bg-yellow-500 hover:text-white transition-all duration-300 shadow-md">
             Preview
            </Link>

            </div>

  </div>
  </div>
  </div>

  );
}
