// hooks/useEditProject.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import BackendUrl from '../hooks/config';
import tokenManager from '../uites/tokenManager';

export const useEditProject = (project) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    department: '',
    DepartmentId: '',
    file: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        author: project.author || '',
        description: project.description || '',
        department: project.department || '',
        DepartmentId: project.department_id || '',
        file: null
      });
    }
  }, [project]);

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

  const updateProject = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${BackendUrl.file}/update/${project.id}/`, {
        method: 'PUT',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${await tokenManager.getAuthHeaders()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const result = await response.json();
      setSuccess(true);
      toast.success('Project updated successfully');
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update project';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleFileChange,
    updateProject
  };
};