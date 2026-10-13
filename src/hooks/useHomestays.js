"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { homestayApi } from "@/features/homestay/api";

export const useHomestays = (params = {}) => {
  return useQuery({
    queryKey: ["admin-homestays", params],
    queryFn: async () => {
      const res = await homestayApi.getAllHomestays(params);
      return res;
    },
  });
};

export const useHomestayDetail = (id) => {
  return useQuery({
    queryKey: ["admin-homestay-detail", id],
    queryFn: async () => {
      const res = await homestayApi.getHomestayById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateHomestay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => homestayApi.createHomestay(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-homestays"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
};

export const useUpdateHomestay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => homestayApi.updateHomestay(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-homestays"] });
      queryClient.invalidateQueries({ queryKey: ["admin-homestay-detail", id] });
    },
  });
};

export const useDeleteHomestay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => homestayApi.deleteHomestay(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-homestays"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
};
