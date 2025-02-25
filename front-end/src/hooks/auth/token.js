// src/utils/token.js
export const getTokenData = () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;

      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

    //   department_head and librarian
  
      return {
        user_id: decodedPayload.user_id,
        email: decodedPayload.email,
        first_name: decodedPayload.first_name,
        last_name: decodedPayload.last_name,
        user_type: decodedPayload.user_type,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  
  export const removeToken = () => {
    localStorage.clear();
    window.location.href = '/login';
  };