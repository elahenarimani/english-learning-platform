"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createLogInSchema,
  type LogInFormValues,
} from "../../schemas/login.schema";

import Input from "@/components/kit/TextField/Input";
import { useTranslations } from "next-intl";
// import { useLogin } from "../../hooks/useLogin";

export function LogInForm() {
  const t = useTranslations("Register");
  const loginSchema = createLogInSchema(t);
  // const registerMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LogInFormValues) => {
    console.log("VALID:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label={t("username")}
        type="text"
        {...register("username")}
        error={!!errors.username}
        helperText={errors.username?.message}
      />

      <Input
        label={t("password")}
        type="password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <button type="submit">{t("submit")}</button>
    </form>
  );
}
