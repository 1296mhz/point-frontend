/* eslint-disable */
import Vue from 'vue';
import Vuex, {mapState} from 'vuex';
import {jwtDecode} from "jwt-decode";
import {
  AddressPointsService,
  UsersService,
  ReportsService,
  AuthService,
} from '../_services';
// import plugins from './plugins';

Vue.use(Vuex);

const user = JSON.parse(localStorage.getItem('user') as any);
const initialState = user
  ? {status: {loggedIn: true}, user}
  : {
    status: {loggedIn: false},
    user: null,
  };
const state = {
  auth: initialState,
  title: '',
  addresses: [],
  settings: {
    displayDeleted: false,
  },
  loading: false,
  errors: [],
  snackbarMessages: [],
  users: [],
  reports: [],
  managers: []
  // okoObjects: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"),
  // tasks: JSON.parse(window.localStorage.getItem(STORAGE_TASKS) || "[]"),
};

const mutations = {
  setError(state: any, error = '') {
    Vue.set(state, 'errors', [...state.errors, error]);
  },
  setMessage(state: any, message: string) {
    Vue.set(state, 'snackbarMessages', [...state.snackbarMessages, message]);
  },
  setLoading(state: any, loading: boolean) {
    Vue.set(state, 'loading', loading);
  },
  setTitle(state: any, payload: any) {
    Vue.set(state, 'title', payload);
  },
  setAddress(state: any, payload: any) {
    Vue.set(state, 'addresses', payload);
  },
  setUsers(state: any, payload: any) {
    Vue.set(state, 'users', payload);
  },
  setReports(state: any, payload: any) {
    Vue.set(state, 'reports', payload);
  },
  setManagers(state: any, payload: any) {
    Vue.set(state, 'managers', payload);
  },
  loginFailure(state: any) {
    localStorage.removeItem('user');
    Vue.set(state.auth.status, 'loggedIn', false);
    Vue.set(state.auth, 'user', {status: {loggedIn: false}});
  },
  logout(state: any) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    Vue.set(state.auth.status, 'loggedIn', false);
    Vue.set(state.auth, 'user', null);
    Vue.set(state.auth, 'token', null);
  },
  updateUser(state: any, item: any) {
    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(item.user));
    localStorage.removeItem('token');
    localStorage.setItem('token', JSON.stringify(item.token));
    Vue.set(state.auth.status, 'loggedIn', true);
    Vue.set(state.auth, 'user', item.user);
    Vue.set(state.auth, 'token', item.token);
  },
};

const actions = {
  setError({commit}: any, payload: any) {
    commit('setError', payload);
  },
  setLoading({commit}: any, payload: boolean) {
    commit('setLoading', payload);
  },
  setMessage({commit}: any, payload: any) {
    commit('setMessage', payload);
  },
  setTitle({commit}: any, payload: any) {
    commit('setTitle', payload);
  },
  async getAddressPoint({commit}: any, _id: any) {
    try {
      return await AddressPointsService.get(_id);
    } catch (err) {
      throw err;
    }
  },
  async findAddressPoint({commit}: any) {
    try {
      const result = await AddressPointsService.find();
      commit('setAddress', result.data);
    } catch (err) {
      throw err;
    }
  },
  async addAddressPoint({commit}: any, addressPoint: any) {
    try {
      return await AddressPointsService.add(addressPoint);
    } catch (err) {
      throw err;
    }
  },
  async removeAddressPoint({commit}: any, uuid: string) {
    await AddressPointsService.remove(uuid);
  },
  // async addAvatarPoint({commit}: any, formData: any) {
  //   try {
  //     return await PointsService.addAvatar(formData);
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  async login({commit}: any, payload: any) {
    try {
      const response = await AuthService.login({
        username: payload.username,
        password: payload.password,
      });

      const token: string = response.data.accessToken;
      const decoded: any = jwtDecode(token);
      commit('updateUser', {token: token, user: decoded.userId});
      return true;
    } catch (err) {
      commit('logout');
      return false;
    }
  },
  async findUsers({commit}: any) {
    try {
      const result = await UsersService.find();
      commit('setUsers', result.data);
    } catch (err) {
      throw err;
    }
  },
  async addUser({commit}: any, user: any) {
    try {
      const result = await UsersService.add(user);
      // commit('setUsers', result.data);
      return result;
    } catch (err) {
      throw err;
    }
  },
  async updateUser({commit, getters}: any, user: any) {
    try {
      const response = await UsersService.update(user);
      const currentUser = getters.getterUser
      if (currentUser._id === user._id) {
        const token: string = response.data.accessToken;
        const decoded: any = jwtDecode(token);
        commit('updateUser', {token: token, user: decoded.userId});
      }

      return response;
    } catch (err) {
      throw err;
    }
  },
  async addReport({commit}: any, report: any) {
    try {
      return await ReportsService.add(report);
    } catch (err) {
      throw err;
    }
  },
  async editReport({commit}: any, report: any) {
    try {
      return await ReportsService.update(report);
    } catch (err) {
      throw err;
    }
  },
  async findReports({commit}: any) {
    try {
      const response = await ReportsService.find();
      commit('setReports', response.data);
    } catch (err) {
      throw err;
    }
  },
  async findManagers({commit}: any) {
    try {
      const response = await UsersService.findManagers();
      commit('setManagers', response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  async getReportDatesForEachDay({commit}: any, data: any) {
    try {
      const response = await ReportsService.getReportDatesForEachDay(data);
      // commit('setManagers', response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  logout({commit}: any) {
    commit('logout');
  },
};

const getters = {
  getterUser: (state: any) => state.auth.user,
  isLoggedIn: (state: any) => !!state.auth.status.loggedIn,
  getterTitle: (state: any) => state.title,
  getterAddresses: (state: any) => state.addresses,
  getterReports: (state: any) => state.reports,
  getterUsers: (state: any) => state.users,
  getterManagers: (state: any) => state.managers,
  lastError: (state: any) => {
    return state.errors.length > 0 ? state.errors[state.errors.length - 1] : '';
  },
  errorsCount: (state: any) => {
    return state.errors.length;
  },
  lastMessage: (state: any) => {
    return state.snackbarMessages.length > 0
      ? state.snackbarMessages[state.snackbarMessages.length - 1]
      : '';
  },
  messagesCount: (state: any) => {
    return state.snackbarMessages.length;
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  // plugins,
});
