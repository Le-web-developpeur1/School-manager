import { useEffect } from "react";

function ModalWrapper({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  // 🎹 Gestion de la touche Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-3xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
