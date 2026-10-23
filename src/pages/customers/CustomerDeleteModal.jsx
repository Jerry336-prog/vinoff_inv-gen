import React from "react";

export default function CustomerDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  customerName,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

      {/* Modal */}
      <div className="bg-white border border-slate-200
        rounded-2xl shadow-sm p-8 w-full max-w-md animate-fadeIn">

        {/* Title */}
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-4">
          Delete Customer
        </h2>

        {/* Message */}
        <p className="text-slate-600 text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="text-teal-700 font-semibold">{customerName}</span>?
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">

          {/* Cancel */}
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl
              bg-white border border-slate-200 text-slate-900
               hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          {/* Delete */}
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-xl
              bg-red-600/30 border border-red-600/40 text-red-600
               hover:bg-red-600/50 transition font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
