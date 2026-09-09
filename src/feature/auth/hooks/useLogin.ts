import { useMutation } from "@tanstack/react-query";
import { LoginRequest, loginUser } from "../api/auth.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
  });
};
