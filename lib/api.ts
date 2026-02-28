// API Configuration (يُستخدم محلياً وعند الرفع حسب NEXT_PUBLIC_API_URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
/** رابط الـ API للاستخدام في fetch (مثلاً في الأدمن) */
export const API_BASE_URL = API_URL;
/** أصل الخادم بدون /api (لصور المنتجات) */
export const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api').replace(/\/api\/?$/, '');

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function for API requests
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getAuthToken();

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({ message: 'حدث خطأ في الاتصال' }));
    } else {
      const text = await response.text();
      data = { message: text || `خطأ ${response.status}: ${response.statusText}` };
    }

    if (!response.ok) {
      // Handle 404 errors specifically
      if (response.status === 404) {
        throw new Error('المنتج غير موجود');
      }

      // استخراج رسالة الخطأ (تفضيل التفاصيل من Backend عند 500)
      let errorMessage = (response.status === 500 && data.error) ? data.error : (data.message || data.error || `حدث خطأ في الطلب (${response.status})`);

      // Handle validation errors from express-validator
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const errorMessages = data.errors.map((err: any) => err.msg || err.message).join('\n');
        errorMessage = errorMessages || errorMessage;
      }

      // Log error details
      console.error('API Error:', {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        data
      });

      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    // Handle network errors
    if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message?.includes('fetch')) {
      const isDev = process.env.NODE_ENV === 'development';
      throw new Error(isDev
        ? 'لا يمكن الاتصال بالخادم. تأكد من:\n1. تشغيل Backend على http://localhost:5005\n2. تشغيل MongoDB\n3. تشغيل Seeder: npm run seed:admin'
        : `لا يمكن الاتصال بالخادم. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.`
      );
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  google: (credential: string) =>
    apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),

  getMe: () => apiRequest('/auth/me'),

  updateProfile: (data: any) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Products API
export const productsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
    }
    return apiRequest(`/products?${query.toString()}`);
  },

  getById: (id: string) => apiRequest(`/products/${id}`),

  /** جلب المنتجات المميزة فقط - مسار مخصص */
  getFeatured: (params?: { page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) q.append(k, String(v));
      });
    }
    return apiRequest(`/products/featured${q.toString() ? `?${q.toString()}` : ''}`);
  },

  create: async (formData: FormData) => {
    const token = getAuthToken();

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // إذا لم يكن الرد JSON
        const text = await response.text();
        throw new Error(`خطأ ${response.status}: ${text || response.statusText}`);
      }

      if (!response.ok) {
        // استخراج رسالة الخطأ من الرد (تفضيل التفاصيل من Backend عند 500)
        let errorMessage = (response.status === 500 && data.error) ? data.error : (data.message || data.error || `حدث خطأ في الطلب (${response.status})`);

        // معالجة أخطاء التحقق من express-validator
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorMessages = data.errors.map((err: any) => err.msg || err.message).join('\n');
          errorMessage = errorMessages || errorMessage;
        }

        console.error('Product creation error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });

        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      // معالجة أخطاء الشبكة
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message?.includes('fetch')) {
        const isDev = process.env.NODE_ENV === 'development';
        throw new Error(isDev
          ? 'لا يمكن الاتصال بالخادم. تأكد من:\n1. تشغيل Backend على http://localhost:5005\n2. تشغيل MongoDB\n3. تسجيل الدخول كـ Admin'
          : 'لا يمكن الاتصال بالخادم. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.'
        );
      }
      throw error;
    }
  },

  update: async (id: string, formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  /** تعيين/إلغاء "مميز" من قائمة المنتجات */
  setFeatured: (id: string, isFeatured: boolean) =>
    apiRequest(`/products/${id}/featured`, {
      method: 'PUT',
      body: JSON.stringify({ isFeatured }),
    }),

  delete: (id: string) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),

};

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
  getById: (id: string) => apiRequest(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    return apiRequest(`/orders?${query.toString()}`);
  },

  getById: (id: string) => apiRequest(`/orders/${id}`),

  create: (data: any) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, data: { status: string; trackingNumber?: string }) =>
    apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Users API (Admin)
export const usersAPI = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    return apiRequest(`/users?${query.toString()}`);
  },
  getById: (id: string) => apiRequest(`/users/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getAll: (productId: string, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams({ productId });
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    return apiRequest(`/reviews?${query.toString()}`);
  },

  create: (data: any) =>
    apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  markHelpful: (id: string) =>
    apiRequest(`/reviews/${id}/helpful`, {
      method: 'PUT',
    }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          query.append(key, value);
        }
      });
    }
    return apiRequest(`/dashboard/stats?${query.toString()}`);
  },

  getProducts: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    return apiRequest(`/dashboard/products?${query.toString()}`);
  },
};

// Contact API
export const contactAPI = {
  create: (data: { name: string; email: string; phone?: string; message: string }) =>
    apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
    }
    return apiRequest(`/contact?${query.toString()}`);
  },

  getById: (id: string) => apiRequest(`/contact/${id}`),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/contact/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiRequest(`/contact/${id}`, {
      method: 'DELETE',
    }),
};

// Newsletter API (public subscribe, admin manage)
export const newsletterAPI = {
  subscribe: (data: { email: string; source?: string }) =>
    apiRequest('/newsletter', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  unsubscribe: (data: { email: string }) =>
    apiRequest('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) query.append(key, String(value));
      });
    }
    return apiRequest(`/newsletter?${query.toString()}`);
  },

  updateStatus: (id: string, status: string) =>
    apiRequest(`/newsletter/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiRequest(`/newsletter/${id}`, { method: 'DELETE' }),
};

// Public stats (no auth)
export const statsAPI = {
  getPublic: () => apiRequest('/stats/public'),
};

// Wishlist API (authenticated user)
export const wishlistAPI = {
  getAll: () => apiRequest('/wishlist'),
  add: (productId: string) =>
    apiRequest(`/wishlist/${productId}`, { method: 'POST' }),
  remove: (productId: string) =>
    apiRequest(`/wishlist/${productId}`, { method: 'DELETE' }),
  clear: () => apiRequest('/wishlist', { method: 'DELETE' }),
};
