import api from "@/lib/api";

export const bookingApi = {
  getAllBookings: async (params = {}) => {
    const res = await api.get("/admin/bookings", { params });
    return res.data;
  },

  getBookingById: async (id) => {
    const res = await api.get(`/bookings/${id}`);
    return res.data;
  },

  confirmBooking: async (id) => {
    const res = await api.patch(`/admin/bookings/${id}/confirm`);
    return res.data;
  },

  cancelBooking: async (id, reason) => {
    const res = await api.patch(`/bookings/${id}/cancel`, { reason });
    return res.data;
  },
};
