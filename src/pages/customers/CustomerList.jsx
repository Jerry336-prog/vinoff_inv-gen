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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-500">
            Customers
          </h1>

          <Link
            to="/customercreate"
            className="px-5 py-3 rounded-xl bg-amber-600/30 
            border border-amber-500/30 backdrop-blur-lg shadow-lg 
            hover:bg-amber-500 hover:text-black transition-all duration-300"
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
            className="w-full px-4 py-3 rounded-xl bg-white/10 
            border border-white/20 backdrop-blur-xl 
            placeholder-gray-400 text-white
            focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* TABLE */}
        <div
          className="bg-white/10 border border-white/20 backdrop-blur-xl 
          rounded-3xl shadow-2xl overflow-hidden"
        >
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-300">
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
                  <td colSpan="4" className="text-center p-6 text-gray-400">
                    No customers found
                  </td>
                </tr>
              )}

              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="border-b border-white/10 hover:bg-white/10 transition"
                >
                  <td className="p-4">{cust.name}</td>
                  <td className="p-4">{cust.email}</td>
                  <td className="p-4">{cust.phone}</td>

                  <td className="p-4 flex gap-3">

                    {/* VIEW */}
                    <Link
                      to={`/customerdetail/${cust.id}`}
                      className="px-3 py-2 rounded-lg bg-amber-600/30 border border-amber-500/30 
                      backdrop-blur-lg hover:bg-amber-500 hover:text-black transition-all duration-300"
                    >
                      View
                    </Link>

                    {/* EDIT */}
                    <Link
                      to={`/customeredit/${cust.id}`}
                      className="px-3 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 
                      backdrop-blur-lg hover:bg-blue-500 hover:text-black transition-all duration-300"
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
                      backdrop-blur-lg hover:bg-red-500 hover:text-black transition-all duration-300"
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
