import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../utilis/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    businessName: "",
  });

  const [loading, setLoading] = useState(true);

  // Load customer
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const ref = doc(db, "customers", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setForm(snap.data());
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading customer:", error);
      }
    };

    fetchCustomer();
  }, [id]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Update customer in Firestore
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "customers", id), form);
      navigate(`/customerdetail/${id}`);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-slate-600">Loading customer data...</p>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-5 py-2 rounded-xl
          bg-white  border border-slate-200
          text-slate-900 hover:bg-slate-100 transition"
        >
          ← Back
        </button>

        <form
          onSubmit={handleUpdate}
          className="bg-white  border border-slate-200 rounded-2xl shadow-sm p-8"
        >
          <h1 className="text-3xl font-bold text-teal-700 mb-6">
            Edit Customer
          </h1>

          {/* Input Fields */}
          <div className="grid grid-cols-1 gap-5 text-slate-900">

            <div>
              <label className="text-sm text-slate-600">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200
                   focus:outline-none focus:border-teal-700 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200
                   focus:outline-none focus:border-teal-700 text-slate-900"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200
                   focus:outline-none focus:border-teal-700 text-slate-900"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200
                   focus:outline-none focus:border-teal-700 text-slate-900 h-24"
              ></textarea>
            </div>

            <div>
              <label className="text-sm text-slate-600">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={form.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200
                   focus:outline-none focus:border-teal-700 text-slate-900"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">

            {/* Cancel */}
            <button
              type="button"
              onClick={() => navigate(`/customerdetail/${id}`)}
              className="px-6 py-3 rounded-xl
              bg-white border border-slate-200 text-slate-900
               shadow-md hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            {/* Update */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl
              bg-teal-700/30 border border-teal-700/40 text-teal-700
               shadow-md hover:bg-teal-700/50 transition font-semibold"
            >
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
