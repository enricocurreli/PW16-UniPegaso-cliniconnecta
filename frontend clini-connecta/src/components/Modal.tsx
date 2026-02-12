import type { ReactNode } from "react";

interface ModalProps {
  id: string;
  title: string;
  children: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg";
}

const Modal = ({ 
  id, 
  title, 
  children, 
  onClose, 
  showCloseButton = true,
  size = "md" 
}: ModalProps) => {
  
  const handleClose = () => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
    onClose?.();
  };

  return (
    <dialog id={id} className="modal">
      <div className={`modal-box ${size === "lg" ? "max-w-5xl" : size === "sm" ? "max-w-sm" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          {showCloseButton && (
            <button 
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="py-4">
          {children}
        </div>
      </div>
      
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default Modal;
