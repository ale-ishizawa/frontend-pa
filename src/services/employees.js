import { api } from './api';

export const getEmployees = async () => {
  try {
    const response = await api.get('api/employees');
    return response.data;
  } catch (error) {
    return error;
  }
};
