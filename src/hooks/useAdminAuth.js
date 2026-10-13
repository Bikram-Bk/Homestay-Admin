"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/api";
import { useAdminStore } from "@/store/adminStore";

export const useAdminAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { admin, isAuthenticated, setAdmin, logout, hydrate } = useAdminStore();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await authApi.login(email, password);
      const { user, accessToken } = response.data;
      if (user.role !== "ADMIN") {
        throw new Error("Access denied. Admin privileges required.");
      }
      return { user, accessToken };
    },
    onSuccess: ({ user, accessToken }) => {
      setAdmin(user, accessToken);
      queryClient.clear();
      router.push("/");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch (e) {
      }
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      router.push("/login");
    },
  });

  const meQuery = useQuery({
    queryKey: ["admin-me"],
    queryFn: async () => {
      const response = await authApi.getMe();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  return {
    admin,
    isAuthenticated,
    hydrate,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    currentUser: meQuery.data || admin,
  };
};
