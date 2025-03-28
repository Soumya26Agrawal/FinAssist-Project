import axios from "axios";

const axiosIns1 = axios.create({
  baseURL: "http://localhost:8001/app/v1/users",
  withCredentials: true,
});
const axiosIns2 = axios.create({
  baseURL: "http://localhost:8001/app/v1/finances",
  withCredentials: true,
});

export { axiosIns1, axiosIns2 };
