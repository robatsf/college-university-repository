// src/components/Agent/Agentview/ToggleButton.jsx
export const ToggleButton = ({ isOpen, onClick }) => (
    <button 
      onClick={onClick}
      className={`fixed top-1/2 transform -translate-y-1/2 z-50 bg-blue-500 text-white p-2 rounded-r-md shadow-lg transition-all duration-300 ${
        isOpen ? 'left-[320px]' : 'left-0'
      }`}
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );