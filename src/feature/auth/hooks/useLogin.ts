
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginRequest, loginUser } from "../api/auth.api";
import { beginClientLogin, finishClientLogin } from "../utils/clientSession";


export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const generation = beginClientLogin();
      try {
        await queryClient.cancelQueries({ queryKey: ["me"] });
        return await loginUser(data);
      } finally {
        finishClientLogin(generation);
      }
    },
  });
};
