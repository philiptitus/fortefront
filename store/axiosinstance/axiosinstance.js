import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Your Django backend URL
  headers: {
    'X-CSRFTOKEN': Cookies.get('csrftoken'), // Get CSRF token from cookies
  },
  withCredentials: true, // Ensure cookies are sent with the request
});

export default axiosInstance;
