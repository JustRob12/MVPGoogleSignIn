import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { AuthModel } from '../model/AuthModel';

class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;
  private authModel: AuthModel;

  private constructor() {
    this.authModel = AuthModel.getInstance();
    this.api = axios.create({
      baseURL: 'https://your-api-base-url.com', // Replace with your API base URL
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await this.authModel.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token expiration or invalid token
          await this.authModel.signOut();
          // You might want to redirect to login screen here
        }
        return Promise.reject(error);
      }
    );
  }

  // Example API methods
  public async getProfile() {
    return this.api.get('/profile');
  }

  public async updateProfile(data: any) {
    return this.api.put('/profile', data);
  }
}

export const apiService = ApiService.getInstance(); 