"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/features/review/api";

export const useReviews = (params = {}) => {
  return useQuery({
    queryKey: ["admin-reviews", params],
    queryFn: async () => {
      const res = await reviewApi.getReviews(params);
      return res;
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => reviewApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });
};
