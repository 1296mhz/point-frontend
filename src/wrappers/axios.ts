import axios from 'axios';
import store from '@/store';
import router from '@/router';
const client = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_API_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  function (response) {
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      store.commit('setError', 'Ошибка сети.');
      return error.code;
    }

    if (error.response.data == 'Invalid Token') {
      store.commit('setError', 'Ошибка токена.');
      store.commit('logout');
      router.push('/login');
      return error.response.data;
    }

    if (error.response.status === 401) {
      store.commit('setError', 'Ошибка токена.');
      store.commit('logout');
      router.push('/login');
      return error.response.data;
    }

    if (error.response.status === 500) {
      if (error.response.data.code === 11000) {
        store.commit('setError', 'Такой адрес уже существует.');
        return error.response.data;
      }

      if (error.response.data.message === 'ReportExist') {
        store.commit('setError', 'Отчет уже существует!');
        return error.response.data;
      }
      store.commit('setError', 'Ошибка на сервере.');
      return error.response.data;
    }

    // store.commit('setError', error.response.statusText);
    if (error.response.status === 301)
      store.commit(
        'setError',
        error.response.data.message || error.response.statusText
      );
    return Promise.reject(error);
  }
);

export default client;
