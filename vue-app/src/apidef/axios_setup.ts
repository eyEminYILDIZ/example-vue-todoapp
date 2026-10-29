import axios from "axios"

export const setupAxios = () => {
  const axiosInstance = axios.create()

  axiosInstance.defaults.baseURL  = 'http://localhost:5000/api'

  // token setup
  const user = localStorage.getItem('CurrentUser')
    if (user) {
      axiosInstance.defaults.headers.Authorization = `Bearer ${JSON.parse(user).jwtToken}`
    }
  return axiosInstance
}

export const AxiosClient = setupAxios()
