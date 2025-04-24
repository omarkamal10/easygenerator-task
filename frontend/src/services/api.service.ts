import axios, { AxiosError, InternalAxiosRequestConfig} from 'axios';
import { AuthResponse, SignInFormValues, SignUpFormValues } from '../types/auth.types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  async signUp(userData: SignUpFormValues): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', userData);

      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw handleApiError(axiosError);
    }
  },


  async signIn(credentials: SignInFormValues): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signin', credentials);
 
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw handleApiError(axiosError);
    }
  },

  async getProfile() {
    try {
      const response = await api.get<AuthResponse>('/auth/profile');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw handleApiError(axiosError);
    }
  },

  signOut() {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};


const handleApiError = (error: AxiosError) => {
  if (error.response) {
    const data = error.response.data as { message?: string };
    return {
      message: data?.message || 'An error occurred',
      statusCode: error.response.status,
    };
  } else if (error.request) {
    return {
      message: 'No response from server. Please try again later.',
      statusCode: 500,
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      statusCode: 500,
    };
  }
};

export default api;