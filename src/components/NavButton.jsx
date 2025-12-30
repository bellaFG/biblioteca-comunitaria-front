// src/components/NavButton.jsx
import React from "react";

const NavButton = ({ onClick, label, active }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-md text-sm transition-all duration-300 ${active
                ? "text-stone-900 font-semibold bg-[#F5F0E6]"
                : "text-stone-500 hover:text-[#9C6644] hover:bg-transparent"
            }`}
    >
        {label}
    </button>
);

export default NavButton;
