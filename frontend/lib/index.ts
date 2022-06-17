import { useEffect, useState } from "react";
import axios, { AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const setLocalStorage = (name: string, value: string) => {
  window.localStorage.setItem(name, value);
};

export const getLocalStorage = (name: string) => {
  return window.localStorage.getItem(name) || "";
};

export const setLocalStorageEndpoint = (url: string) => {
  typeof window !== "undefined" && setLocalStorage("endpoint", url);
};

export const getLocalStorageEndpoint = () => {
  return typeof window === "undefined" ? "" : getLocalStorage("endpoint");
};

export function createHttpClient(url?: string): AxiosInstance {
  if (url) {
    return axios.create({
      baseURL: url,
    });
  }
  return axios.create({
    baseURL: baseURL === undefined ? "http://127.0.0.1:8080" : baseURL,
  });
}

export const useHttpClient = (): [AxiosInstance, string] => {
  const [url, setUrl] = useState(process.env.NEXT_PUBLIC_BASE_URL || "");

  let client = createHttpClient(url);

  useEffect(() => {
    const localCfgUrl = getLocalStorageEndpoint();
    if (localCfgUrl) {
      setUrl(localCfgUrl);
    }
  }, []);

  useEffect(() => {
    console.log(`testttt ====== `, url);
    client = createHttpClient(url);
  }, [url]);

  return [client, url];
};
