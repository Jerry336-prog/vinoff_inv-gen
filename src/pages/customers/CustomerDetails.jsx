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

  if (!customer) return <p className="text-center mt-20 text-slate-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 flex justify-center">
      <div className="w-full max-w-3xl">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-5 py-2 rounded-xl
          bg-white  border border-slate-200
          text-slate-900 hover:bg-slate-100 transition"
        >
          ← Back
        </button>

        {/* Customer Card */}
        <div className="bg-white  border border-slate-200 rounded-2xl p-8 shadow-sm">

          {/* Title */}
          <h1 className="text-3xl font-bold mb-6 text-teal-700">
            Customer Details
          </h1>

          {/* Customer Information */}
          <div className="space-y-4 text-slate-900">
            <div>
              <p className="text-sm text-slate-600">Full Name</p>
              <p className="text-xl font-semibold">{customer.name}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p>{customer.email}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Phone</p>
              <p>{customer.phone}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Address</p>
              <p>{customer.address}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Business Name</p>
              <p>{customer.company}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-10">

            {/* Edit */}
            <Link
              to={`/customeredit/${id}`}
              className="px-6 py-3 rounded-xl
              bg-teal-700/20 border border-teal-700/40 text-teal-700
               shadow-lg hover:bg-teal-700/40
              transition font-semibold"
            >
              Edit
            </Link>

            {/* Delete */}
            <button
             onClick={() => setShowDelete(true)}
              className="px-6 py-3 rounded-xl
              bg-red-500/20 border border-red-500/40 text-red-600
               shadow-lg hover:bg-red-500/40
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
