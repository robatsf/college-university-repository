
const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
          <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
          <div className="flex space-x-3">
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };


export default LogoutConfirmModal;