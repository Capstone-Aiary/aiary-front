// src/shared/hooks/auth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/auth";
import type { ApiError, LoginRequest, LoginResponse, SignUpRequest, SignUpResponse } from "../types";

const authKeys = {
  all: ["auth"] as const,
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation<SignUpResponse, ApiError, SignUpRequest>({
    mutationFn: api.signUp,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: api.login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};
