import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance for token refresh (avoid interceptor loop)
const refreshClient = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await refreshClient.post('/auth/refresh-token', {}, {
      withCredentials: true // Sends refresh token cookie
    });
    
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data.accessToken;
    }
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

export const setupTokenRefreshInterceptor = (axiosInstance: typeof axios) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      
      // If 401 and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Check if it's a token expired error (not invalid credentials)
        const errorCode = (error.response?.data as any)?.code;
        
        if (errorCode === 'TOKEN_EXPIRED') {
          if (isRefreshing) {
            // Wait for the ongoing refresh
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve: (token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(axiosInstance(originalRequest));
              }, reject });
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshAccessToken();
            
            if (newToken) {
              processQueue(null, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            } else {
              // Refresh failed - logout user
              processQueue(new Error('Refresh failed'), null);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
              window.location.href = '/login?expired=true';
              return Promise.reject(error);
            }
          } catch (refreshError) {
            processQueue(refreshError as Error, null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login?expired=true';
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
        
        // Invalid token (not expired) - direct logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
      
      return Promise.reject(error);
    }
  );
};

export default { refreshAccessToken, setupTokenRefreshInterceptor };
