import api from "@/lib/api";

export const reviewApi = {
  getReviews: async (params = {}) => {
    const res = await api.get("/admin/reviews", { params });
    return res.data;
  },

  deleteReview: async (id) => {
    const res = await api.delete(`/admin/reviews/${id}`);
    return res.data;
  },
};
