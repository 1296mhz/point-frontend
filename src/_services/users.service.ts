/* eslint-disable */
import httpClient from '../wrappers/axios';
import {authHeader} from '../_helpers';

export const UsersService = {
  get,
  find,
  findManagers,
  add,
  update,
  remove
};

async function get(uuid: string) {
  try {
    const response = await httpClient.get(`/api/users/${uuid}`, {
      headers: {
        ...authHeader()
      },
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function find() {
  try {
    const response = await httpClient.get(`/api/users?populate=pointAddress`, {
      headers: {
        ...authHeader()
      },
    });
    return response;
  } catch (err) {
    return Promise.reject();
  }
}

async function add(addressPoint: any) {
  try {
    return await httpClient.post(`/api/users`, addressPoint, {
      headers: {
        ...authHeader()
      },
    });
  } catch (err) {
    return Promise.reject();
  }
}

async function remove(uuid: string) {
  try {
    return await httpClient.delete(`/api/users/${uuid}`, {
      headers: {
        ...authHeader()
      },
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

async function update(user: any) {
  try {
    return await httpClient.put(`/api/users/${user._id}`, user, {
      headers: {
        ...authHeader()
      },
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

async function findManagers() {
  try {
    const response = await httpClient.get(`/api/managers`, {
      headers: {
        ...authHeader()
      },
    });
    return response;
  } catch (err) {
    return Promise.reject();
  }
}