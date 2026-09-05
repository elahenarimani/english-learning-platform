import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth.api.ts";


export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};