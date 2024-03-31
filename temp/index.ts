/* eslint-disable */
import Vue from "vue";
import Vuex, { mapState } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { pointsService, districtsService, tasksService } from "../_services";

Vue.use(Vuex);

const STORAGE_KEY = "okoObjects";
const STORAGE_TASKS = "okoTasks";
const state = {
  districts: [],
  points: [],
  okoObjects: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"),
  // tasks: JSON.parse(window.localStorage.getItem(STORAGE_TASKS) || "[]"),
  tasks: [],
  settings: {
    displayDeleted: false,
  },
  loading: false,
  errors: [],
  snackbarMessages: [],
};

const mutations = {
  setError(state: any, error = "") {
    Vue.set(state, "errors", [...state.errors, error]);
  },
  setMessage(state: any, message: string) {
    Vue.set(state, "snackbarMessages", [...state.snackbarMessages, message]);
  },
  setLoading(state: any, loading: any) {
    Vue.set(state, "loading", loading);
  },
  addObject(state: { okoObjects: any[] }, obj: any) {
    state.okoObjects.push(obj);
  },
  setDistricts(state: { districts: any[] }, districts: any) {
    Vue.set(state, "districts", districts);
  },
  setPoints(state: { points: any[] }, points: any) {
    Vue.set(state, "points", points);
  },
  setTasks(state: { tasks: any }, tasks: any) {
    Vue.set(state, "tasks", tasks);
  },
  removeObject(state: { okoObjects: any[] }, obj: any) {
    state.okoObjects.splice(state.okoObjects.indexOf(obj), 1);
  },
  setPoint(state: any, obj: any) {
    state.okoObjects = [
      ...state.okoObjects.map((item: any) =>
        item.uuid !== obj.uuid ? item : { ...item, ...obj }
      ),
    ];
  },
  // addTask(state: { tasks: any[] }, obj: any) {
    // state.tasks.push(obj);
  // },
  // updatePointToTask(state: { tasks: any[] }, obj: any) {},
  // addPointToTask(state: { tasks: any[] }, data: any) {
  //   console.log(data);
  //   const newState = [...state.tasks];
  //   const exist = newState[data.index].pointsToCheck.some(
  //     (point: any) => point.uuid === data.point.uuid
  //   );

  //   if (!exist) {
  //     newState[data.index].pointsToCheck = [
  //       ...newState[data.index].pointsToCheck,
  //       { completed: false, uuid: data.point.uuid },
  //     ];
  //     Vue.set(state.tasks, "tasks", [...newState]);
  //   }
  // },
  // removePointToTask() {},
};

const actions = {
  setError({ commit }: any, payload: any) {
    commit("setError", payload);
  },
  setLoading({ commit }: any, payload: any) {
    commit("setLoading", payload);
  },
  setMessage({ commit }: any, payload: any) {
    commit("setMessage", payload);
  },
  async addPoint({ commit }: any, point: any) {
    try {
      await pointsService.add(point);
    } catch (err) {
      throw err;
    }
  },
  async updatePoint({ commit }: any, point: any) {
    try {
      await pointsService.update(point);
    } catch (err) {
      throw err;
    }
  },
  async getPoints({ commit }: any) {
    const _points = await pointsService.getAll();
    commit("setPoints", _points);
  },
  async getTasks({ commit }: any) {
    const _tasks = await tasksService.getAll();
    commit("setTasks", _tasks.data);
  },
  async getDistricts({ commit }: any) {
    const _districts = await districtsService.getAll();
    commit("setDistricts", _districts);
  },
  removeObject({ commit }: any, obj: any) {
    commit("removeObject", obj);
  },
  editPoint({ commit }: any, obj: any) {
    commit("setPoint", {
      ...obj,
    });
  },
  // addTask({ commit, state }: any, task: any) {
  //   console.log(task.dateOfInspection);

  //   const index = state.tasks.findIndex(
  //     (obj: any) => obj.dateOfInspection === task.dateOfInspection
  //   );
  //   if (index === -1) {
  //     commit("addTask", {
  //       uuid: uuidv4(),
  //       created: Date.now(),
  //       updated: null,
  //       ...task,
  //       enable: false,
  //     });
  //   }
  // },
};

const getters = {
  getterDistricts: (state: any) =>
    state.districts.map((v: any) => {
      return {
        ...v,
        text: v.name,
      };
    }),
  getterPoints: () => state.points,
    // state.points.map((v: any) => {
    //   return {
    //     ...v,
    //     district: state.districts.filter(
    //       (_district: any) => _district.id === v.districtId
    //     ),
    //   };
    // }),
  lastError: (state: any) => {
    return state.errors.length > 0 ? state.errors[state.errors.length - 1] : "";
  },
  errorsCount: (state: any) => {
    return state.errors.length;
  },
  lastMessage: (state: any) => {
    return state.snackbarMessages.length > 0
      ? state.snackbarMessages[state.snackbarMessages.length - 1]
      : "";
  },
  messagesCount: (state: any) => {
    return state.snackbarMessages.length;
  },
};

const plugins = [
  (store: any) => {
    store.subscribe((mutation: any, { okoObjects }: any) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(okoObjects));
    });
    store.subscribe((mutation: any, { tasks }: any) => {
      window.localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
    });
  },
];

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins,
});
