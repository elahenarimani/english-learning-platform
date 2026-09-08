"use client";
import styles from "./RegisterForm.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createRegisterSchema,
  type RegisterFormValues,
} from "../../schemas/register.schema";

import Input from "@/components/kit/TextField/Input";
import { useTranslations } from "next-intl";
import Button from "@/components/kit/Button/Button";
import { useState } from "react";
import { useRegister } from "../../hooks/useRegister";
import toast from "react-hot-toast";

export function RegisterForm() {
  const t = useTranslations("Register");
  const registerSchema = createRegisterSchema(t);
  const [selectedRole, setSelectedRole] = useState<
    "student" | "teacher" | "admin"
  >("student");
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      is_teacher: false,
    },
  });

  const handleRoleSelect = (role: "student" | "teacher" | "admin") => {
    setSelectedRole(role);
    setValue("is_teacher", role === "teacher", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = (data: RegisterFormValues) => {
    const requestData = {
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      is_teacher: data.is_teacher,
    };
    registerMutation.mutate(requestData, {
      onSuccess: () => {
        toast.success("Registration successful!");

        reset({
          is_teacher: false,
        });

        setSelectedRole("student");
      },

      onError: (error) => {
        toast.error("Registration failed!");
        console.log("Register error:", error);
      },

      onSettled: () => {
        console.log("Register request finished");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles["btn-wrapper"]}>
        <Button
          type="button"
          variant="outlined"
          className={styles.button}
          active={selectedRole === "student"}
          onClick={() => handleRoleSelect("student")}
        >
          {t("student")}
        </Button>
        <Button
          type="button"
          variant="outlined"
          className={styles.button}
          active={selectedRole === "teacher"}
          onClick={() => handleRoleSelect("teacher")}
        >
          {t("teacher")}
        </Button>
        <Button variant="outlined" disabled className={styles.button}>
          {t("admin")}
        </Button>
      </div>

      {/* First Name */}
      <div className={styles.row}>
        <Input
          label={t("firstName")}
          type="text"
          {...register("first_name")}
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
          className={styles.input}
        />

        {/* Last Name */}
        <Input
          label={t("lastName")}
          type="text"
          {...register("last_name")}
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
          className={styles.input}
        />
      </div>

      {/* Email */}
      <div className={styles.fields}>
        <Input
          label={t("email")}
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          className={styles.input}
        />
      </div>
      {/* Password */}
      <div className={styles.row}>
        <Input
          label={t("password")}
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          className={styles.input}
        />

        {/* Confirm Password */}

        <Input
          label={t("confirmPassword")}
          type="password"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          className={styles.input}
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        loading={registerMutation.isPending}
        disabled={registerMutation.isPending}
      >
        {t("create account")}
      </Button>
    </form>
  );
}
