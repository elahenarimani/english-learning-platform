// import { useQuery } from "@tanstack/react-query"
// import { getMe } from "../api/auth.api"

// export const useMe = ()=>{
//     return useQuery({
//          queryKey: ["me"],
//          queryFn:getMe,
//          enabled: false,
//     })
// }
import { useQuery } from "@tanstack/react-query";
import { getMe, User } from "../api/auth.api";

export const useMe = () => {
  return useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 15, // ۱۵ دقیقه معتبر بودن اطلاعات در حافظه
    retry: 1, // در صورت خطا فقط یک بار مجدداً تلاش کند
  });
};