export const setLocalStorage = (name: string, value: string) => {
  window.localStorage.setItem(name, value);
};

export const getLocalStorage = (name: string) => {
  return window.localStorage.getItem(name);
};

export const setLocalStorageEndpoint = (url: string) => {
  typeof window !== "undefined" && setLocalStorage("endpoint", url);
};

export const getLocalStorageEndpoint = () => {
  return typeof window === "undefined" ? "" : getLocalStorage("endpoint");
};
