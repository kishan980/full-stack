import Axios from "axios";
import { ARTYST_API_URL } from "../constants/api";
import ROUTES from "../constants/routes";

const axios = Axios.create({
  baseURL: ARTYST_API_URL,
  headers: {
    // "access-control-allow-origin" : "*",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  function (error) {
    if (window.location.pathname !== ROUTES.verify) {
      if (error?.response?.data?.error === "NOT_VERIFIED") {
        window.location.href = ROUTES.verify;
      }
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    return Promise.reject(error);
  }
);

export default axios;
