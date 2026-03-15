import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../../utilis/Firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import CustomerDeleteModal from "./CustomerDeleteModal";

export default function CustomerDetails() {
    const [showDelete, setShowDelete] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const customerName = customer?.name || ""; // replace with real data

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const ref = doc(db, "customers", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCustomer(snap.data());
        }
      } catch (error) {
        console.error("Error loading customer:", error);
      }
    };

    fetchCustomer();
  }, [id]);

  const deleteCustomer = async () => {
  await deleteDoc(doc(db, "customers", id));
    setShowDelete(false);
    navigate("/customerlist");
  };

  if (!customer) return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8 flex justify-center">
      <div className="w-full max-w-3xl">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-5 py-2 rounded-xl 
          bg-white/10 backdrop-blur-lg border border-white/20 
          text-white hover:bg-white/20 transition"
        >
          ← Back
        </button>

        {/* Customer Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">

          {/* Title */}
          <h1 className="text-3xl font-bold mb-6 text-[#b8860b]">
            Customer Details
          </h1>

          {/* Customer Information */}
          <div className="space-y-4 text-white">
            <div>
              <p className="text-sm text-gray-300">Full Name</p>
              <p className="text-xl font-semibold">{customer.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-300">Email</p>
              <p>{customer.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-300">Phone</p>
              <p>{customer.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-300">Address</p>
              <p>{customer.address}</p>
            </div>

            <div>
              <p className="text-sm text-gray-300">Business Name</p>
              <p>{customer.company}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-10">
            
            {/* Edit */}
            <Link
              to={`/customeredit/${id}`}
              className="px-6 py-3 rounded-xl 
              bg-[#b8860b]/20 border border-[#b8860b]/40 text-[#b8860b]
              backdrop-blur-lg shadow-lg hover:bg-[#b8860b]/40 
              transition font-semibold"
            >
              Edit
            </Link>

            {/* Delete */}
            <button
             onClick={() => setShowDelete(true)}
              className="px-6 py-3 rounded-xl 
              bg-red-500/20 border border-red-500/40 text-red-400
              backdrop-blur-lg shadow-lg hover:bg-red-500/40 
              transition font-semibold"
            >
              Delete
            </button>

            <CustomerDeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={deleteCustomer}
        customerName={customerName}
      />

          </div>
        </div>
      </div>
    </div>
  );
}
