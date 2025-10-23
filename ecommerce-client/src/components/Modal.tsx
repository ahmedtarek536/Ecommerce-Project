import React from "react";

interface ModalProps {
  isOpen: boolean; // Controls whether the modal is visible
  message: string; // The message to display in the modal
  onClose: () => void; // Function to close the modal
  onConfirm?: () => void; // Function to execute on "Okay" (optional)
  mode: "single" | "double"; // "single" for one button, "double" for two buttons
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  message,
  onClose,
  onConfirm,
  mode,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal when clicking outside of the content
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-secondary bg-opacity-25"
      onClick={handleOverlayClick} // Add this handler to the overlay
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <p className="text-lg font-medium text-gray-800">{message}</p>
        <div className="mt-4 flex justify-end space-x-3">
          {mode === "double" && (
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
          )}
          <button
            className="px-4 py-2 bg-black text-white rounded"
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
