import api from "./api";

export const apiClient = {
  get: async <T>(url: string, params?: object): Promise<T> => {
    const response = await api.get(url, {
      params,
    });

    return response.data;
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.post(url, data);

    return response.data;
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.put(url, data);

    return response.data;
  },

  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.patch(url, data);

    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete(url);

    return response.data;
  },
};
