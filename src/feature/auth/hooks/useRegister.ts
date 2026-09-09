import { useMutation } from "@tanstack/react-query";
import { RegisterRequest, registerUser } from "../api/auth.api";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
  });
};