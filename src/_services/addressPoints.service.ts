/* eslint-disable */
import httpClient from '../wrappers/axios';
import {authHeader} from '../_helpers';

export const AddressPointsService = {
  get,
  find,
  add,
  update,
  remove
};

async function get(uuid: string) {
  try {
    const response = await httpClient.get(`/api/pointAddresses/${uuid}?populate=pointAddress`, {
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
    const response = await httpClient.get(`/api/pointAddresses`, {
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
    return await httpClient.post(`/api/pointAddresses`, addressPoint, {
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
    return await httpClient.delete(`/api/pointAddresses/${uuid}`, {
      headers: {
        ...authHeader()
      },
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

async function update(uuid: any, data: any) {
  try {
    return await httpClient.put(`/api/pointAddresses/${data._id}`, data, {
      headers: {
        ...authHeader()
      },
    });
  } catch (err) {
    return Promise.reject(err);
  }
}