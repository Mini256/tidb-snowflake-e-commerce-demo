import axios, { AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export function createHttpClient(): AxiosInstance {
  return axios.create({
    baseURL: baseURL,
  });
}