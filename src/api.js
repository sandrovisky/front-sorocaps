import axios from 'axios'
import store from './redux/store';
import { logout } from './redux/userSlice';



const api = axios.create({
    //http://localhost:3333
    baseURL: "http://localhost:3333"
})

api.interceptors.request.use(async config => {    
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  const status = error.response.status
  if( status === 401 ) {
    alert(error.response.data.error)
    store.dispatch(logout())
  }
  return Promise.reject(error);
});

export default api
