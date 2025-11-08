import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../types';
import { API_BASE_URL } from '../config/api';
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        console.log('🔐 API Client Interceptor:', {
          url: config.url,
          hasToken: !!token,
          tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
          hasHeaders: !!config.headers
        });
        
        if (token && config.headers) {
          // Use Axios 1.x compatible header setting
          config.headers.set('Authorization', `Bearer ${token}`);
          console.log('✅ Authorization header set');
        } else if (!token) {
          console.warn('❌ No token in localStorage');
        }
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for global error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });

              const { token } = response.data.data;
              localStorage.setItem('accessToken', token);

              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth/login';
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || error.response.data?.error || 'An error occurred',
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      return {
        message: 'Network error - please check your connection',
        status: 0,
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  // Generic request methods
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url);
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Set auth token
  setAuthToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  // Clear auth token
  clearAuthToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

export const apiClient = new ApiClient();
export default apiClient;

