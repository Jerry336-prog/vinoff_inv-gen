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
      <p className="text-center mt-20 text-gray-300">Loading customer data...</p>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-5 py-2 rounded-xl 
          bg-white/10 backdrop-blur-lg border border-white/20 
          text-white hover:bg-white/20 transition"
        >
          ← Back
        </button>

        <form
          onSubmit={handleUpdate}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-[#b8860b] mb-6">
            Edit Customer
          </h1>

          {/* Input Fields */}
          <div className="grid grid-cols-1 gap-5 text-white">

            <div>
              <label className="text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                  backdrop-blur-lg focus:outline-none focus:border-[#b8860b] text-white"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                  backdrop-blur-lg focus:outline-none focus:border-[#b8860b] text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                  backdrop-blur-lg focus:outline-none focus:border-[#b8860b] text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                  backdrop-blur-lg focus:outline-none focus:border-[#b8860b] text-white h-24"
              ></textarea>
            </div>

            <div>
              <label className="text-sm text-gray-300">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={form.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                  backdrop-blur-lg focus:outline-none focus:border-[#b8860b] text-white"
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
              bg-white/10 border border-white/20 text-white
              backdrop-blur-lg shadow-md hover:bg-white/20 transition"
            >
              Cancel
            </button>

            {/* Update */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl 
              bg-[#b8860b]/30 border border-[#b8860b]/40 text-[#b8860b]
              backdrop-blur-lg shadow-md hover:bg-[#b8860b]/50 transition font-semibold"
            >
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
