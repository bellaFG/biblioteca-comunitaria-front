import React, { createContext, useContext, useCallback, useState } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({ open: false, title: "", content: null, footer: null });

  const showModal = useCallback((content, options = {}) => {
    const { title = "", onOk, okLabel = "OK", size = "md" } = options;
    return new Promise((resolve) => {
      const handleClose = (result) => {
        setModal({ open: false, title: "", content: null, footer: null });
        resolve(result);
        if (typeof onOk === "function") onOk(result);
      };

      const footer = (
        <div className="flex justify-end gap-2">
          <Button onClick={() => handleClose(true)}>{okLabel}</Button>
        </div>
      );

      setModal({ open: true, title, content, footer, size, onClose: () => handleClose(false) });
    });
  }, []);

  const contextValue = { showModal };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <Modal isOpen={modal.open} onClose={modal.onClose} title={modal.title} footer={modal.footer} size={modal.size}>
        {typeof modal.content === "string" ? <p className="text-stone-700">{modal.content}</p> : modal.content}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

export default ModalContext;
