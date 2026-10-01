"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./LogInForm.module.scss";
import {
  createLogInSchema,
  type LogInFormValues,
} from "../../schemas/login.schema";

import Input from "@/components/kit/TextField/Input";
import { useTranslations } from "next-intl";
import Button from "@/components/kit/Button/Button";
import { useLogin } from "../../hooks/useLogin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { getMe } from "../../api/auth.api";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getLoginRedirect, loginUserSchema } from "../../utils/loginRedirect";

export function LogInForm() {
  const loginMutation = useLogin();
  const queryClient = useQueryClient();
  const t = useTranslations("Register");
  const loginSchema = createLogInSchema(t);
  const router = useRouter();
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LogInFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: async () => {
        try {
          // ۱. دریافت مشخصات کاربر بعد از ست شدن کوکی‌ها
          const user = await getMe();
          loginUserSchema.parse(user);

          // ۲. به‌روزرسانی کش React Query
          queryClient.setQueryData(["me"], user);

          toast.success(
            t("welcomeBack", { name: user.first_name || user.email })
          );

          const callbackUrl = new URL(window.location.href).searchParams.get("callbackUrl");
          const redirectPath = getLoginRedirect(callbackUrl, locale, user.is_teacher);

          router.replace(redirectPath);
          router.refresh();
        } catch (error) {
          console.error("Get user error:", error);
          toast.error(t("unableToGetUserInfo"));
        }
      },

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const detail = error.response?.data?.detail;
          if (detail) {
            toast.error(detail);
            return;
          }
        }
        toast.error(t("loginFailed"));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        label={t("email")}
        type="text"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <Input
        label={t("password")}
        type="password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        loading={loginMutation.isPending}
        disabled={loginMutation.isPending}
      >
        {t("login")}
      </Button>
    </form>
  );
}
