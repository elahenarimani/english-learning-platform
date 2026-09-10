import { useQuery } from "@tanstack/react-query"
import { getMe } from "../api/auth.api"

export const useMe = ()=>{
    return useQuery({
         queryKey: ["me"],
         queryFn:getMe,
         enabled: false,
    })
}
