import axios from "axios";

const axiosIns1 = axios.create({
  baseURL: "https://finassist-project-zmh4.onrender.com/app/v1/users",
  withCredentials: true,
});
const axiosIns2 = axios.create({
  baseURL: "https://finassist-project-zmh4.onrender.com/app/v1/finances",
  withCredentials: true,
});

export { axiosIns1, axiosIns2 };
