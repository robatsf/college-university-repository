// src/dataProvider/passwordProvider.ts
import { fetchUtils } from 'react-admin';

const httpClient = fetchUtils.fetchJson;
const apiUrl = process.env.REACT_APP_API_URL;

export const passwordProvider = {
  update: async (resource, params) => {
    if (resource !== 'updatePassword') {
      return Promise.reject('Invalid resource');
    }

    const { oldPassword, newPassword, confirmPassword } = params.data;

    if (newPassword !== confirmPassword) {
      return Promise.reject('Passwords do not match');
    }

    const url = `${apiUrl}/auth/update-password`;
    
    try {
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      return { data: json };
    } catch (error) {
      return Promise.reject(error);
    }
  },
};