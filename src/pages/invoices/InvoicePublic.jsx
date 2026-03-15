import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../../utilis/Firebase";
import { doc, getDoc } from "firebase/firestore";
import ShareModal from "../invoices/ShareModal";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "../invoices/InvoicePDF";

export default function InvoicePublic() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openShare, setOpenShare] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const location = useLocation();
  const isPublic = new URLSearchParams(location.search).get("public") === "true";

  // Fetch invoice only — company name is stored inside the invoice
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const ref = doc(db, "invoices", id);
        const snap = await getDoc(ref);
        if (snap.exists()) setInvoice(snap.data());
      } catch (err) {
        console.error("Error loading invoice:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const blob = await pdf(
        <InvoicePDF invoice={invoice} />  // ✅ no longer needs company prop
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${invoice?.id || id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading invoice...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-500">
        Invoice not found.
      </div>
    );
  }

  const totalAmount = invoice.items?.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const statusColors = {
    Paid: "text-green-400",
    Pending: "text-yellow-400",
    Overdue: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-10">

      {/* Company header — reads from invoice, works for public viewers too */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-xl">
          {invoice.companyName?.charAt(0)?.toUpperCase() || "C"}  {/* ✅ from invoice */}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {invoice.companyName || "Your Company"}  {/* ✅ from invoice */}
          </h2>
          {/* Only show email if user is logged in */}
          {user && (
            <p className="text-gray-400 text-sm">{user.email}</p>
          )}
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-500">
            {invoice.companyName || "Your Company"} Invoice  {/* ✅ from invoice */}
          </h1>
          <p className="text-gray-300 mt-2">
            Invoice ID: <span className="text-white font-semibold">{invoice.id}</span>
          </p>
          <p className="text-gray-300 mt-2">
            Invoice Date: <span className="text-white font-semibold">{invoice.date}</span>
          </p>
          <p className={`text-lg mt-1 font-semibold ${statusColors[invoice.status]}`}>
            {invoice.status}
          </p>
        </div>

        {/* Bill To */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6 mb-8">
          <h3 className="text-xl font-bold text-amber-500 mb-3">Bill To</h3>
          <p className="text-white text-lg font-semibold">{invoice.client}</p>
        </div>

        {/* Items */}
        <div className="bg-white/5 p-4 md:p-5 rounded-2xl border border-white/10 mb-8">
          <h2 className="text-xl font-bold text-amber-500 mb-5">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="py-3 px-2 md:px-3">Item</th>
                  <th className="py-3 px-2 md:px-3 text-center">Qty</th>
                  <th className="py-3 px-2 md:px-3 text-center">Price</th>
                  <th className="py-3 px-2 md:px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 hover:bg-white/10 transition-all"
                  >
                    <td className="py-3 px-2 md:px-3 font-semibold text-white">
                      {item.name}
                    </td>
                    <td className="py-3 px-2 md:px-3 text-center">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-2 md:px-3 text-center text-amber-400 font-semibold">
                      ₦{item.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 md:px-3 text-right font-bold text-amber-500">
                      ₦{(item.quantity * item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 shadow-xl flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-200">Total Amount</span>
          <span className="text-3xl font-extrabold text-amber-500">
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-between">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-white/10
            border border-white/20 backdrop-blur-lg shadow-xl
            hover:bg-amber-600 hover:text-black transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? "Generating PDF..." : "Download PDF"}
          </button>

          {/* Only show Share button if logged in user is viewing */}
          {!isPublic && user && (
            <button
              onClick={() => setOpenShare(true)}
              className="px-5 py-3 rounded-xl bg-white/10 border border-white/20
              backdrop-blur-lg hover:bg-yellow-500 hover:text-black
              transition-all duration-300 shadow-xl"
            >
              Share
            </button>
          )}

          {openShare && (
            <ShareModal
              link={`${window.location.origin}/invoicepublic/${id}?public=true`}  // ✅ always generates a clean public link
              onClose={() => setOpenShare(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}