import axios, { AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export function createHttpClient(): AxiosInstance;
export function createHttpClient(url: string): AxiosInstance;

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
