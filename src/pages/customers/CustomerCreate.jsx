import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../utilis/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CustomerCreate() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "customers"), {
        ...customer,
        createdAt: serverTimestamp(),
      });

      navigate("/customerlist");
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white  shadow-sm rounded-2xl p-6 border border-slate-200">

        <h1 className="text-3xl font-semibold text-teal-700 mb-6">
          Create Customer
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">

          <div>
            <label className="block text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white text-slate-900 placeholder-gray-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white text-slate-900 placeholder-gray-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white text-slate-900 placeholder-gray-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Address</label>
            <textarea
              name="address"
              value={customer.address}
              onChange={handleChange}
              rows="2"
              className="w-full p-3 rounded-xl bg-white text-slate-900 placeholder-gray-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700"
              placeholder="Enter customer address"
            ></textarea>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Company Name</label>
            <input
              type="text"
              name="company"
              value={customer.company}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white text-slate-900 placeholder-gray-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700"
              placeholder="Enter company name"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl bg-white  border border-slate-200 text-slate-600 hover:bg-slate-100 transition shadow-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-teal-700 text-white font-semibold shadow-lg hover:bg-teal-800 transition"
            >
              Save Customer
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
