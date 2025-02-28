// hooks/useProjects.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import BackendUrl from '../hooks/config';
import tokenManager from '../uites/tokenManager';

export const useProjects = (departmentId) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BackendUrl.file}/list/`, {
        headers: {
          'Authorization': `Bearer ${await tokenManager.getAuthHeaders()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load projects', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await fetch(`${BackendUrl.file}/delete/${projectId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await tokenManager.getAuthHeaders()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project', 'error');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [departmentId]);

  return {
    projects,
    isLoading,
    error,
    refreshProjects: fetchProjects,
    deleteProject,
  };
};