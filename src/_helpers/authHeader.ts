/* eslint-disable */
export function authHeader() {
 // const user = store.getters['getterUser'];
  const token = JSON.parse(localStorage.getItem("token") as any);
  if (token) {
    return {
      "Authorization": `Bearer ${token}`,
    };
  } else {
    return { "Content-Type": "application/json" };
  }
}
