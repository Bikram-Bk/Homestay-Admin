"use client";

import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/features/stats/api";

export const useStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await statsApi.getStats();
      return res.data;
    },
    refetchInterval: 60 * 1000,
  });
};
