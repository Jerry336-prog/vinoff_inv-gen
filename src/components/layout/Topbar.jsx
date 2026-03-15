import React, { useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function Topbar({ toggleSidebar }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="
      w-full fixed top-0 left-0 z-40
      bg-slate-800/80 backdrop-blur-xl
      border-b border-white/10 shadow-xl
      px-6 py-4 flex items-center justify-between
    ">
      
      {/* Left Side */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="
            p-3 rounded-xl bg-white/10 border border-white/10
            text-white hover:bg-[#b8860b]/30 
            transition-all duration-300 md:hidden
          "
        >
          <Menu size={22} />
        </button>

        <h1 className="text-2xl font-bold text-[#b8860b] tracking-wide">
          Vinoff
        </h1>
      </div>

    <div className="flex items-center gap-2 sm:gap-3 px-1 sm:px-5 py-2 sm:py-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xl">

  <div className="text-left leading-tight">
    <p className="text-white font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
      {user?.email}
    </p>

    <p className="text-white/40 text-[10px] sm:text-xs">
      Active User
    </p>
  </div>

  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-500 flex items-center justify-center font-bold text-black text-xs sm:text-sm flex-shrink-0">
    {user?.email?.charAt(0).toUpperCase()}
  </div>

</div>

    </div>
  );
}
