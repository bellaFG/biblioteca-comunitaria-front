import React from "react";

const Input = ({ label, type, value, onChange, placeholder, required }) => (
    <div className="mb-5 group">
        <label className="block text-stone-500 text-xs font-bold tracking-widest uppercase mb-2 ml-1 group-focus-within:text-[#9C6644] transition-colors">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-4 py-3 bg-[#FDFBF7] border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#9C6644] focus:border-[#9C6644] transition-all text-stone-800 placeholder-stone-300 font-serif"
        />
    </div>
);

export default Input;
