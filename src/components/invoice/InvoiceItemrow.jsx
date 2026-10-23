import React from "react";

const InvoiceItemRow = ({ item, onChange, onRemove, mobile }) => {
    if (!item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(item.id, { ...item, [name]: value });
  };

  const total = (item.price || 0) * (item.quantity || 0);
   // MOBILE VERSION
  if (mobile) {
    return (
      <div className="bg-white  border border-slate-200 rounded-xl p-4 space-y-3">

        <input
          type="text"
          name="name"
          value={item.name}
          onChange={handleChange}
          placeholder="Item name"
          className="w-full px-3 py-2 rounded-lg bg-slate-50 text-slate-900 border border-slate-200"
        />

        <div className="grid grid-cols-2 gap-3">

          <input
            type="number"
            name="price"
            value={item.price}
            onChange={handleChange}
            placeholder="Price"
            className="px-3 py-2 rounded-lg bg-slate-50 text-slate-900 border border-slate-200"
          />

          <input
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={handleChange}
            placeholder="Qty"
            className="px-3 py-2 rounded-lg bg-slate-50 text-slate-900 border border-slate-200"
          />

        </div>

        <div className="flex justify-between items-center">

          <span className="text-teal-600 font-bold">
            ₦{total.toLocaleString()}
          </span>

          <button
            onClick={() => onRemove(item.id)}
            className="px-3 py-1 rounded-lg bg-red-600/30 border border-red-500/30 hover:bg-red-600"
          >
            Remove
          </button>

        </div>
      </div>
    );
  }

  // DESKTOP VERSION

  return (
    <div
      className="w-full grid grid-cols-12 gap-4 px-4 py-3 mb-3 rounded-xl bg-white  shadow-md border border-slate-200 hover:bg-slate-100 transition-all duration-300"
    >
      {/* Item Name */}
      <input
        type="text"
        name="name"
        value={item.name}
        onChange={handleChange}
        placeholder="Item name"
        className="col-span-4 px-3 py-2 rounded-lg text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-yellow-600 placeholder-gray-300"
      />

      {/* Price */}
      <input
        type="number"
        name="price"
        value={item.price}
        onChange={handleChange}
        placeholder="Price"
        className="col-span-2 px-3 py-2 rounded-lg text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-yellow-600 placeholder-gray-300"
      />

      {/* Quantity */}
      <input
        type="number"
        name="quantity"
        value={item.quantity}
        onChange={handleChange}
        placeholder="Qty"
        className="col-span-2 px-3 py-2 rounded-lg text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-yellow-600 placeholder-gray-300"
      />

      {/* Total */}
      <div
        className="col-span-2 flex items-center justify-center px-3 py-2 rounded-lg text-amber-700 font-semibold bg-slate-100 border border-slate-200"
      >
        ₦{(item.price * item.quantity || 0).toLocaleString()}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="col-span-1 h-full flex items-center justify-center rounded-lg text-slate-900 bg-yellow-600/30  border border-yellow-500/20 hover:bg-yellow-600/60 transition-all duration-300"
      >
        ✕
      </button>
    </div>
  );
};

export default InvoiceItemRow;
