import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../utilis/Firebase";

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState([]);
  const invoicesRef = collection(db, "invoices");

  // 🔥 Real-time listener for invoices
  useEffect(() => {
    const unsubscribe = onSnapshot(invoicesRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        _id: doc.id,       // Firestore document ID
        ...doc.data(),
      }));
      setInvoices(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Fetch single invoice by ID
  const getInvoiceById = async (id) => {
    if (!id) return null;

    try {
      const docRef = doc(db, "invoices", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      return null;
    }
  };

  // 🔥 Create invoice (NO manual state update — prevents duplicates)
  const addInvoice = async (invoice) => {
    try {
      await addDoc(invoicesRef, invoice);
      // ❌ DO NOT call setInvoices here — real-time listener handles it
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  // 🔥 Update invoice
  const updateInvoice = async (id, updatedData) => {
    try {
      const docRef = doc(db, "invoices", id);
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  // 🔥 Delete invoice
  const deleteInvoice = async (id) => {
    try {
      const docRef = doc(db, "invoices", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        getInvoiceById,
        addInvoice,
        updateInvoice,
        deleteInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoices = () => useContext(InvoiceContext);
