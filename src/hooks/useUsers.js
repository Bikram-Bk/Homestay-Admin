"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/features/user/api";

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: async () => {
      const res = await userApi.getUsers(params);
      return res;
    },
  });
};

// Single traveler detail 
export const useUser = (id) => {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: async () => {
      const res = await userApi.getUserById(id);
      return res.data;
    },
    enabled: Boolean(id),
  });
};

// Delete traveler — cascade: bookings/reviews pani delete hunchan
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] }); 
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
};
