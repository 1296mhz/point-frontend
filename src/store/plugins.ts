const STORAGE_KEY = "okoObjects";
const STORAGE_TASKS = "okoTasks";

export const plugins = [
  (store: any) => {
    store.subscribe((mutation: any, { okoObjects }: any) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(okoObjects));
    });
    store.subscribe((mutation: any, { tasks }: any) => {
      window.localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
    });
  },
];