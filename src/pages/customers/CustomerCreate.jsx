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
    <div className="min-h-screen p-4 md:p-8 bg-[#121212] flex justify-center items-start">
      <div className="w-full max-w-2xl bg-[#2A2A2A]/50 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-white/10">
        
        <h1 className="text-3xl font-semibold text-[#DAA520] mb-6">
          Create Customer
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">

          <div>
            <label className="block text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-[#1E1E1E]/60 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-[#1E1E1E]/60 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-[#1E1E1E]/60 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Address</label>
            <textarea
              name="address"
              value={customer.address}
              onChange={handleChange}
              rows="2"
              className="w-full p-3 rounded-xl bg-[#1E1E1E]/60 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
              placeholder="Enter customer address"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Company Name</label>
            <input
              type="text"
              name="company"
              value={customer.company}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-[#1E1E1E]/60 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
              placeholder="Enter company name"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-gray-200 hover:bg-white/20 transition shadow-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-[#DAA520] text-black font-semibold shadow-lg hover:bg-[#e6b847] transition"
            >
              Save Customer
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
