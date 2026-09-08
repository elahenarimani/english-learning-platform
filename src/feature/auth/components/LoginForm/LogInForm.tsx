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

export function LogInForm() {
  const t = useTranslations("Register");
  const loginSchema = createLogInSchema(t);
  const loginMutation = useLogin()
  const {
     register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LogInFormValues>({
    resolver: zodResolver(loginSchema),
  });

 const onSubmit = (data: LogInFormValues) => {
  loginMutation.mutate(data, {
    onSuccess: () => {
      toast.success("Login successful!");
    },

    onError: (error) => {
      toast.error("Login failed!");
      console.log("Login error:", error);
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

      <Button  type="submit"
        variant="contained"
        fullWidth
        loading={loginMutation.isPending}
        disabled={loginMutation.isPending}
        >{t("log in")}</Button>
    </form>
  );
}
