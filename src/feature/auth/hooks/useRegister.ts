
import { useMutation } from "@tanstack/react-query";
import { RegisterRequest, registerUser } from "../api/auth.api";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export const useRegister = () => {
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess: () => {
      // هدایت به لاگین همراه با پیشوند زبان صحیح
      router.push(`/${locale}/login`);
    },
  });
};