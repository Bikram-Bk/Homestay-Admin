import api from "@/lib/api";

export const userApi = {
  getUsers: async (params = {}) => {
    const res = await api.get("/admin/users", { params });
    return res.data;
  },

  getUserById: async (id) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
};
