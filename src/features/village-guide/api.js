import api from "@/lib/api";

export const villageGuideApi = {
  getAllGuides: async () => {
    const res = await api.get("/villages/guides");
    return res.data;
  },

  getGuideByName: async (name) => {
    const res = await api.get(`/villages/${encodeURIComponent(name)}/guide`);
    return res.data;
  },

  createGuide: async (data) => {
    const res = await api.post("/villages/guides", data);
    return res.data;
  },

  updateGuide: async (id, data) => {
    const res = await api.put(`/villages/guides/${id}`, data);
    return res.data;
  },

  deleteGuide: async (id) => {
    const res = await api.delete(`/villages/guides/${id}`);
    return res.data;
  },
};
