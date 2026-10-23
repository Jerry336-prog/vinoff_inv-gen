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
  const [company, setCompany] = useState(null);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
        Loading invoice...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500">
        Invoice not found.
      </div>
    );
  }

  const totalAmount = invoice.items?.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  );

  const statusColors = {
    Paid: "text-emerald-700",
    Pending: "text-amber-700",
    Overdue: "text-red-600",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-10">

      {/* Company header — reads from invoice, works for public viewers too */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-teal-700 rounded-lg flex items-center justify-center font-bold text-black text-xl">
          {invoice.companyName?.charAt(0)?.toUpperCase() || "C"}  {/* ✅ from invoice */}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {invoice.companyName || "Your Company"}  {/* ✅ from invoice */}
          </h2>
          {/* Only show email if user is logged in */}
          {user && (
            <p className="text-slate-500 text-sm">{user.email}</p>
          )}
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="max-w-3xl mx-auto bg-white  border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-700">
            {invoice.companyName || "Your Company"} Invoice  {/* ✅ from invoice */}
          </h1>
          <p className="text-slate-600 mt-2">
            Invoice ID: <span className="text-slate-900 font-semibold">{invoice.id}</span>
          </p>
          <p className="text-slate-600 mt-2">
            Invoice Date: <span className="text-slate-900 font-semibold">{invoice.date}</span>
          </p>
          <p className={`text-lg mt-1 font-semibold ${statusColors[invoice.status]}`}>
            {invoice.status}
          </p>
        </div>

        {/* Bill To */}
        <div className="bg-slate-50  border border-slate-200 rounded-xl p-4 md:p-6 mb-8">
          <h3 className="text-xl font-bold text-teal-700 mb-3">Bill To</h3>
          <p className="text-slate-900 text-lg font-semibold">{invoice.client}</p>
        </div>

        {/* Items */}
        <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-teal-700 mb-5">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
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
                    className="border-b border-slate-100 hover:bg-white transition-all"
                  >
                    <td className="py-3 px-2 md:px-3 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3 px-2 md:px-3 text-center">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-2 md:px-3 text-center text-teal-600 font-semibold">
                      ₦{item.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 md:px-3 text-right font-bold text-teal-700">
                      ₦{(item.quantity * item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white  p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <span className="text-xl font-semibold text-slate-600">Total Amount</span>
          <span className="text-3xl font-bold text-teal-700">
            ₦{totalAmount.toLocaleString()}
          </span>
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

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-between">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-white
            border border-slate-200  shadow-sm
            hover:bg-teal-700 hover:text-white transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? "Generating PDF..." : "Download PDF"}
          </button>

          {/* Only show Share button if logged in user is viewing */}
          {!isPublic && user && (
            <button
              onClick={() => setOpenShare(true)}
              className="px-5 py-3 rounded-xl bg-white border border-slate-200
               hover:bg-yellow-500 hover:text-white
              transition-all duration-300 shadow-sm"
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

        {/* ✅ FOOTER (OPTION 3) */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-slate-500 text-sm">
            <p className="font-semibold text-slate-900">
              {invoice?.companyName}
            </p>

            {invoice?.phone && <p>📞 {invoice.phone}</p>}
            {invoice?.address && <p>📍 {invoice.address}</p>}
            <p className="mt-2 text-xs">
              Thanks for your patronage🙏
            </p>

            <p className="mt-4 text-xs text-gray-500">
               Powered by{" "}
             <a
               href="https://vinoff.co"   // change to your domain later
               target="_blank"
               rel="noopener noreferrer"
               className="text-teal-700 font-semibold hover:underline"
              >
                Vinoff
             </a>
            </p>
          </div>

      </div>
    </div>
  );
}
