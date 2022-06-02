import axios, { AxiosInstance } from "axios";

export const BASE_URL = 'http://localhost:8080/api'

export function createHttpClient(): AxiosInstance {
  return axios.create({
    baseURL: BASE_URL
  });
}