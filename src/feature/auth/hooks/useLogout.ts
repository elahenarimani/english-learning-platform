// import { useMutation } from "@tanstack/react-query";
// import { logoutUser } from "../api/auth.api";

// export const useLogout = () => {
//   return useMutation({
//     mutationFn: logoutUser,
//   });
// };
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/auth.api";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // پاک‌سازی تمامی دیتاهای ذخیره‌شده در React Query
      queryClient.clear();
      // انتقال به صفحه ورود و به‌روزرسانی Server Components
      router.push("/login");
      router.refresh();
    },
  });
};