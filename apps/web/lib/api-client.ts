import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
