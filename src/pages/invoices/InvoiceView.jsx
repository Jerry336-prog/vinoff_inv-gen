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
    return <p className="p-6 bg-slate-900 min-h-screen flex items-center justify-center text-white">
      Loading invoice…</p>;
  if (error) 
    return <p className="p-6 text-red-400">
      {error}</p>;

  // Calculate total safely
const total = invoice.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;


  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
        
{/* company/user logged in header */}
   <div className="flex items-center gap-4 mb-8">
         <div className="w-14 h-14 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-xl">
           {company?.companyName?.charAt(0)?.toUpperCase() || "C"}
       </div>
       <div>
         <h2 className="text-2xl font-bold text-white">
          {company?.companyName || "Your Company"}
        </h2>

        <p className="text-gray-400 text-sm">
        {user?.email || ""}
       </p>
   </div>

</div> 

      <div className="max-w-3xl mx-auto bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl shadow-xl">

    {/* INVOICE WRAPPER */}
  <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl p-8 md:p-12">

    {/* TOP SECTION */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 lg:gap-6 mb-10">
      <div>
        <h2 className="text-3xl font-bold text-amber-500 mb-2">{company?.companyName || "Your Company"} Invoice</h2>
        <p className="text-gray-300 text-lg">
          Invoice ID: <span className="text-white font-semibold">{invoice.id}</span>
        </p>
      </div>

      <div className="text-gray-300 text-lg md:mt-0">
        <p>
          Invoice Date: <span className="text-white font-semibold">{invoice.date}</span>
        </p>
      </div>
    </div>

    {/* CLIENT SECTION */}
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6 mb-8">
      <h3 className="text-xl font-bold text-amber-500 mb-3">Bill To</h3>
      <p className="text-white text-lg font-semibold">{invoice.client}</p>
      
   
    </div>

    {/* ITEMS TABLE */}
<div className="overflow-x-auto">
  <table className="w-full text-sm md:text-base">
    <thead>
      <tr className="text-left text-gray-300 border-b border-white/20">
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
          className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all duration-300"
        >
          <td className="py-3 px-2 md:px-3 font-semibold text-white">
            {item.name}
          </td>

          <td className="py-3 px-2 md:px-3 text-center text-amber-400 font-semibold">
            ₦{item.price.toLocaleString()}
          </td>

          <td className="py-3 px-2 md:px-3 text-center">
            {item.quantity}
          </td>

          <td className="py-3 px-2 md:px-3 text-right font-bold text-amber-500">
            ₦{(item.price * item.quantity).toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

   {/* Status */}
        <div className=" mt-8">
          <h2 className="text-lg text-gray-300 mb-3">Status</h2>
          <span
            className={`px-4 py-2 rounded-xl font-semibold ${
              invoice.status === "Paid"
                ? "bg-green-600/20 text-green-400"
                : invoice.status === "Pending"
                ? "bg-yellow-600/20 text-yellow-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {invoice.status}
          </span>
        </div>

    {/* TOTAL */}
    <div className="mt-10 flex justify-center md:justify-end">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-xl w-full md:w-80">
        <h3 className="text-xl font-bold text-amber-500 mb-2">Total</h3>
        <p className="text-4xl font-extrabold text-amber-600">
          ₦{total.toLocaleString()}
        </p>
      </div>
    </div>

    {/* Deposit & Balance */}
       {invoice.status !== "Paid" && (
   <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
    
    <div className="bg-white/10 border border-white/20 p-5 rounded-xl">
      <h3 className="text-lg text-gray-300">Deposit</h3>
      <p className="text-2xl font-bold text-amber-400">
        ₦{invoice.deposit?.toLocaleString() || "0"}
      </p>
    </div>

    <div className="bg-white/10 border border-white/20 p-5 rounded-xl">
      <h3 className="text-lg text-gray-300">Balance</h3>
      <p className="text-2xl font-bold text-amber-500">
        ₦{invoice.balance?.toLocaleString() || "0"}
      </p>
    </div>

  </div>
)}
  
      <p className="text-gray-400 mt-4 text-sm">
          Prepared by: <span className="text-white">{invoice.createdBy}</span>
       </p>

 <div className="flex text-center flex-col sm:flex-row gap-4 mt-10"> 

          <Link 
          to={`/invoiceedit/${id}`}
           className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-xl" > 
           Edit </Link> 

            <Link
             to={`/invoicepublic/${id}`}
             className="px-5 py-3 rounded-lg bg-white/10 border border-white/20
             backdrop-blur-md hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-md">
             Preview
            </Link>

            </div>

  </div>
  </div>
  </div>

  );
}
