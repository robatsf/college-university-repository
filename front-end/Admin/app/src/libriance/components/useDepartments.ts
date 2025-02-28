// src/hooks/useDepartments.ts
import { useState, useEffect } from "react";
import { tokenManager } from "../../utils/tokenManager";
import { apibase } from "../../dataProvider";

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = await tokenManager.getAuthHeaders();
        if (!token) throw new Error('No token found');

        const response = await fetch(`${apibase}/departments/?all=true`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch departments');
        
        const result = await response.json();
        
        if (result.status === 'success') {
          const departmentChoices = result.data.departments.map(dept => ({
            id: dept.id,
            name: dept.name
          }));
          setDepartments(departmentChoices);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);

  return departments;
};