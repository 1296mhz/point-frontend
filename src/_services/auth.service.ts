/* eslint-disable */
import httpClient from '../wrappers/axios';

export const AuthService = {
  login,
  getById,
};

async function getById(uuid: string) {
  try {
    const response = await httpClient.get(
      `/api/users/${uuid}`,  
    );
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function login(cred: any) {
  try {
    const result = await httpClient.post(
      `/auth/login`,
      cred,
    );
    return result
  } catch (err) {
    return Promise.reject(err);
  }
}
