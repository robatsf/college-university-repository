import { Upload } from "lucide-react";
import { useEffect, useState } from 'react';
import { getTokenData } from '../../../hooks/auth/token';

const StudentInfoCard = ({ onUploadClick }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = getTokenData();
      setUserData(user);
  }, []);

  if (!userData) {
    return null
  }

  const getWelcomeMessage = () => {
    const name = userData.user_name || 'User';
    const role = userData.user_type === 'teacher' ? 'Teacher' : 'Student';
    return `Welcome back, ${role} ${name}`;
  };

  const getDepartmentName = () => {
    return userData.department || 'Department of unknown';
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="font-semibold text-xl">{getDepartmentName()}</h3>
          <p className="text-gray-500 mt-1">{getWelcomeMessage()}</p>
        </div>
        <button 
          onClick={onUploadClick}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
        >
          <Upload className="h-5 w-5" />
          <span>Upload Project</span>
        </button>
      </div>
    </div>
  );
};

export default StudentInfoCard;