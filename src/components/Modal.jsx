import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, footer, size = "md", className = "" }) => {
    const nodeRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        if (isOpen) {
            document.addEventListener("keydown", onKey);
            // lock scroll
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen && nodeRef.current) nodeRef.current.focus();
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-lg",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        full: "w-full h-full",
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                ref={nodeRef}
                className={`relative mx-4 ${sizes[size]} w-full ${className}`}
            >
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-stone-100">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                        <h3 className="font-serif text-lg text-stone-900">{title}</h3>
                        <button
                            onClick={onClose}
                            aria-label="Fechar"
                            className="text-stone-400 hover:text-[#9C6644] p-2 rounded-md transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6">{children}</div>

                    {footer && <div className="px-6 py-4 border-t border-stone-100">{footer}</div>}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
