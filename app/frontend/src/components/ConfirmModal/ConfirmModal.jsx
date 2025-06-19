import { FaExclamationTriangle } from "react-icons/fa";
import LoadingButton from "../../components/LoadingButton/LoadingButton";

const ConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm(); 
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start">
          <div className="">
            <h3 className="text-lg flex justify-center items-center gap-3 font-medium text-gray-900">
              <div className="flex-shrink-0 text-yellow-500">
                <FaExclamationTriangle className="h-5 w-5" />
              </div>
              Delete Confirmation
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 text-center">
                Are you sure you want to delete? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-center space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-cancel"
            disabled={loading}
          >
            Cancel
          </button>
          <LoadingButton
            type="button"
            onClick={handleConfirm}
            className="btn-delete"
            isLoading={loading}
          >
            Delete
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;