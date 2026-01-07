import React from "react";

const Button = ({
    children,
    onClick,
    variant = "primary",
    className = "",
    type = "button",
    disabled = false,
}) => {
    const baseStyle =
        "px-6 py-3 rounded-md text-sm font-medium tracking-wide transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

    const variants = {
        primary:
            "bg-stone-900 text-stone-50 hover:bg-[#5C4033] hover:shadow-stone-900/20",
        secondary: "bg-[#EBE5D9] text-stone-800 hover:bg-[#DED5C3]",
        outline:
            "border border-stone-300 text-stone-600 hover:border-stone-800 hover:text-stone-900 bg-transparent",
        ghost:
            "bg-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-100/50 shadow-none",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
