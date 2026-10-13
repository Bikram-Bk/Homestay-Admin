import api from "@/lib/api";

export const statsApi = {
  getStats: async () => {
    const res = await api.get("/admin/stats");
    return res.data;
  },
};
