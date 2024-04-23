/* eslint-disable */
import httpClient from '../wrappers/axios';
import {authHeader} from '../_helpers';

export const ReportsService = {
  get,
  find,
  add,
  update,
  remove,
  getReportDatesForEachDay
};

async function get(uuid: string) {
  try {
    const response = await httpClient.get(`/api/reports/${uuid}?populate=address,user`, {
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
    const response = await httpClient.get(`/api/reports?populate=address,user`, {
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
    return await httpClient.post(`/api/reports`, addressPoint, {
      headers: {
        ...authHeader()
      },
    });
  } catch (err) {
    return Promise.reject();
  }
}

async function remove(_id: string) {
  try {
    return await httpClient.delete(`/api/reports/${_id}`, {
      headers: {
        ...authHeader()
      },
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

async function update(report: any) {
  try {
    return await httpClient.put(`/api/reports/${report._id}`, report, {
      headers: {
        ...authHeader()
      },
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getReportDatesForEachDay(data: any) {
  try {
    const response = await httpClient.get(`/api/getReportDatesForEachDay/${data.uuid}/${data.dateMonthYear}`, {
      headers: {
        ...authHeader()
      },
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
}