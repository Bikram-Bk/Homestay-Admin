"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "@/features/booking/api";

export const useAllBookings = (params = {}) => {
  return useQuery({
    queryKey: ["admin-bookings", params],
    queryFn: async () => {
      const res = await bookingApi.getAllBookings(params);
      return res;
    },
  });
};

export const useBookingDetail = (id) => {
  return useQuery({
    queryKey: ["admin-booking-detail", id],
    queryFn: async () => {
      const res = await bookingApi.getBookingById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bookingApi.confirmBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-booking-detail"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => bookingApi.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-booking-detail"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
};
