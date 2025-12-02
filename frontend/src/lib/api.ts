const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Try to get token from cookie first, then from response if available
    const token = typeof window !== 'undefined' 
      ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Always include token in Authorization header if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Network error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  adminLogin: (email: string, password: string) =>
    apiClient.post('/auth/admin/login', { email, password }),
  
  adminRegister: (name: string, email: string, password: string) =>
    apiClient.post('/auth/admin/register', { name, email, password }),
  
  userLogin: (email: string, password: string) =>
    apiClient.post('/auth/user/login', { email, password }),
  
  userRegister: (name: string, email: string, password: string) =>
    apiClient.post('/auth/user/register', { name, email, password }),
  
  logout: () => apiClient.post('/auth/logout'),
  
  getMe: () => apiClient.get('/auth/me'),
};

// Admin API
export const adminApi = {
  analytics: {
    getOverview: () => apiClient.get('/admin/analytics/overview'),
  },
  orders: {
    getAll: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return apiClient.get(`/admin/orders${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiClient.get(`/admin/orders/${id}`),
    updateStatus: (id: string, status: string) =>
      apiClient.put(`/admin/orders/${id}/status`, { status }),
    delete: (id: string) => apiClient.delete(`/admin/orders/${id}`),
  },
  products: {
    getAll: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return apiClient.get(`/admin/products${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiClient.get(`/admin/products/${id}`),
    create: (data: any) => apiClient.post('/admin/products', data),
    update: (id: string, data: any) => apiClient.put(`/admin/products/${id}`, data),
    delete: (id: string) => apiClient.delete(`/admin/products/${id}`),
  },
  customers: {
    getAll: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return apiClient.get(`/admin/customers${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiClient.get(`/admin/customers/${id}`),
    update: (id: string, data: any) => apiClient.put(`/admin/customers/${id}`, data),
    delete: (id: string) => apiClient.delete(`/admin/customers/${id}`),
  },
  categories: {
    getAll: () => apiClient.get('/admin/categories'),
    create: (data: any) => apiClient.post('/admin/categories', data),
    update: (id: string, data: any) => apiClient.put(`/admin/categories/${id}`, data),
    delete: (id: string) => apiClient.delete(`/admin/categories/${id}`),
  },
  coupons: {
    getAll: () => apiClient.get('/admin/coupons'),
    getById: (id: string) => apiClient.get(`/admin/coupons/${id}`),
    create: (data: any) => apiClient.post('/admin/coupons', data),
    update: (id: string, data: any) => apiClient.put(`/admin/coupons/${id}`, data),
    delete: (id: string) => apiClient.delete(`/admin/coupons/${id}`),
  },
  banners: {
    getAll: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return apiClient.get(`/admin/banners${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiClient.get(`/admin/banners/${id}`),
    create: (data: any) => apiClient.post('/admin/banners', data),
    update: (id: string, data: any) => apiClient.put(`/admin/banners/${id}`, data),
    delete: (id: string) => apiClient.delete(`/admin/banners/${id}`),
  },
  reviews: {
    getAll: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return apiClient.get(`/admin/reviews${query ? `?${query}` : ''}`);
    },
    approve: (id: string) => apiClient.put(`/admin/reviews/${id}/approve`),
    hide: (id: string) => apiClient.put(`/admin/reviews/${id}/hide`),
    delete: (id: string) => apiClient.delete(`/admin/reviews/${id}`),
  },
};

