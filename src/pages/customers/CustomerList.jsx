import React, { useEffect, useState } from "react";
import { db } from "../../utilis/Firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import CustomerDeleteModal from "./CustomerDeleteModal";


export default function CustomerList() {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  // const { id } = useParams();
  const customerName = customers?.name || "";


  // Fetch customers from Firestore
  const loadCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

   const deleteCustomer = async () => {
    if (!selectedCustomerId) return;
    await deleteDoc(doc(db, "customers", selectedCustomerId));
      setShowDelete(false);
      loadCustomers();
      // navigate("/customerlist");
    };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((cust) =>
    cust.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-700">
            Customers
          </h1>

          <Link
            to="/customercreate"
            className="px-5 py-3 rounded-xl bg-teal-700/30
            border border-teal-700/30  shadow-lg
            hover:bg-teal-700 hover:text-white transition-all duration-300"
          >
            + Add Customer
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white
            border border-slate-200
            placeholder-gray-400 text-slate-900
            focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>

        {/* TABLE */}
        <div
          className="bg-white border border-slate-200
          rounded-3xl shadow-sm overflow-hidden"
        >
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-sm uppercase tracking-wide">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-slate-500">
                    No customers found
                  </td>
                </tr>
              )}

              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="border-b border-slate-200 hover:bg-white transition"
                >
                  <td className="p-4">{cust.name}</td>
                  <td className="p-4">{cust.email}</td>
                  <td className="p-4">{cust.phone}</td>

                  <td className="p-4 flex gap-3">

                    {/* VIEW */}
                    <Link
                      to={`/customerdetail/${cust.id}`}
                      className="px-3 py-2 rounded-lg bg-teal-700/30 border border-teal-700/30
                       hover:bg-teal-700 hover:text-white transition-all duration-300"
                    >
                      View
                    </Link>

                    {/* EDIT */}
                    <Link
                      to={`/customeredit/${cust.id}`}
                      className="px-3 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
                       hover:bg-blue-500 hover:text-white transition-all duration-300"
                    >
                      Edit
                    </Link>

                    {/* DELETE */}
                    <button
                       onClick={() => {
                              setSelectedCustomerId(cust.id);
                              setSelectedCustomerName(cust.name);
                              setShowDelete(true);
                       }}
                      className="px-3 py-2 rounded-lg bg-red-600/20 border border-red-500/30
                       hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
         <CustomerDeleteModal
                            isOpen={showDelete}
                            onClose={() => setShowDelete(false)}
                            onConfirm={deleteCustomer}
                            customerName={selectedCustomerName}
                          />
    </div>
  );
}
