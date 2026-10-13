import api from "@/lib/api";

export const homestayApi = {
  getAllHomestays: async (params = {}) => {
    const res = await api.get("/homestays", { params });
    return res.data;
  },

  getHomestayById: async (id) => {
    const res = await api.get(`/homestays/${id}`);
    return res.data;
  },

  createHomestay: async (data) => {
    const res = await api.post("/homestays", data);
    return res.data;
  },

  updateHomestay: async (id, data) => {
    const res = await api.put(`/homestays/${id}`, data);
    return res.data;
  },

  deleteHomestay: async (id) => {
    const res = await api.delete(`/homestays/${id}`);
    return res.data;
  },
};
