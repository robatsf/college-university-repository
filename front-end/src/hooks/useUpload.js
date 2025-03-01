// hooks/useProjectUpload.js
import { useState } from 'react';
import BackendUrl from './config';
import tokenManager from '../uites/tokenManager';
import { toast } from 'react-toastify';

export const useProjectUpload = (initialDepartment = '', initialDepartmentId = '') => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    department: initialDepartment,
    file: null,
    DepartmentId: initialDepartmentId
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file
      }));
    }
  };

  const uploadProject = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if(key != "DepartmentId" && key != "department"){
            formDataToSend.append(key, formData[key]);
        }
        if(key != "department") {
            formDataToSend.append("department_id", formData[key]);
        }
      });
      const response = await fetch(`${BackendUrl.apiUrl}/files/create/`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${await tokenManager.getAuthHeaders()}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload project');
      }

     await response.json();
      setSuccess(true);
      toast.success('Uploaded successful');
    } catch (err) {
      setError(err.message || 'Failed to upload project');
      toast.error('Signin successful');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      department: initialDepartment,
      file: null,
      DepartmentId: initialDepartmentId
    });
    setError(null);
    setSuccess(false);
  };

  return {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleFileChange,
    uploadProject,
    resetForm
  };
};