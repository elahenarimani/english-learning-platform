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
import { useMe } from "../../hooks/useMe";
import axios from "axios";

export function LogInForm() {
  const { refetch: getCurrentUser } = useMe();
  const loginMutation = useLogin();
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
          const { data: user } = await getCurrentUser();
          console.log("user", user);
          toast.success(t("welcomeBack", { name: user.first_name }));
          if (user.is_teacher) {
            router.replace(`/${locale}/dashboard/teacher`);
          } else {
            router.replace(`/${locale}/dashboard/student`);
          }
        } catch (error) {
          toast.error(t("unableToGetUserInfo"));
          console.error(error);
        }
      },

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const detail = error.response?.data?.detail;

          if (
            error.response?.status === 401 &&
            detail === "No active account found with the given credentials"
          ) {
            toast.error(t("invalidCredentials"));
            return;
          }
        }

        toast.error(t("loginFailed"));
        console.error("Login error:", error);
      },

      onSettled: () => {
        console.log("Login request finished");
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
        {t("log in")}
      </Button>
    </form>
  );
}
