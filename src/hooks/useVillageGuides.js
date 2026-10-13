"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { villageGuideApi } from "@/features/village-guide/api";

export const useVillageGuides = () => {
  return useQuery({
    queryKey: ["admin-village-guides"],
    queryFn: async () => {
      const res = await villageGuideApi.getAllGuides();
      return res.data;
    },
  });
};

export const useCreateVillageGuide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => villageGuideApi.createGuide(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-village-guides"] });
    },
  });
};

export const useUpdateVillageGuide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => villageGuideApi.updateGuide(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-village-guides"] });
    },
  });
};

export const useDeleteVillageGuide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => villageGuideApi.deleteGuide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-village-guides"] });
    },
  });
};
