
export const getTokenData = () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;

      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
  
      return {
        user_id: decodedPayload.user_id,
        user_name : decodedPayload.user_name,
        department : decodedPayload.department,
        department_id : decodedPayload.department_id,
        email : decodedPayload.email,
        image_path : decodedPayload.image_path,
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