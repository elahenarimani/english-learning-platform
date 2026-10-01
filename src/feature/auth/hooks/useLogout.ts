
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/auth.api";
import { useRouter } from "@/i18n/routing";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // پاک‌سازی تمامی دیتاهای ذخیره‌شده در React Query
      queryClient.clear();
      // انتقال به صفحه ورود و به‌روزرسانی Server Components
      router.replace("/login");
      router.refresh();
    },
  });
};
