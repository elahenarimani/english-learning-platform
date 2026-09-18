
// import axios from "axios";

// export const apiClient = axios.create({
//   baseURL: "/api/backend",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api/backend", // ارسال درخواست به پروکسی داخلی
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Handling client redirection on auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login/";
    }
    return Promise.reject(error);
  }
);