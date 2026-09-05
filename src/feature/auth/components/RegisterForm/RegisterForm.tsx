"use client";
import styles from "./RegisterForm.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, Tab } from "@mui/material";

import {
  createRegisterSchema,
  type RegisterFormValues,
} from "../../schemas/register.schema";

import Input from "@/components/kit/TextField/Input";
import { useTranslations } from "next-intl";
// import { useRegister } from "../../hooks/useRegister";

export function RegisterForm() {
  const t = useTranslations("Register");
  const registerSchema = createRegisterSchema(t);

  // const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      is_teacher: false,
    },
  });

  const isTeacher = watch("is_teacher");

  const handleRoleChange = (
    _event: React.SyntheticEvent,
    newValue: "student" | "teacher",
  ) => {
    setValue("is_teacher", newValue === "teacher", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = (data: RegisterFormValues) => {
    console.log("FORM DATA:", data);

    // اطلاعاتی که Backend می‌خواهد
    const requestData = {
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      is_teacher: data.is_teacher,
    };

    console.log("BACKEND DATA:", requestData);

    // registerMutation.mutate(requestData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {/* Student / Teacher */}
      <Tabs
        value={isTeacher ? "teacher" : "student"}
        onChange={handleRoleChange}
        variant="fullWidth"
      >
        <Tab value="student" label={t("student")} />

        <Tab value="teacher" label={t("teacher")} />
      </Tabs>

      {/* First Name */}
      <div className={styles.row}>
        <Input
          label={t("firstName")}
          type="text"
          {...register("first_name")}
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
        />

        {/* Last Name */}
        <Input
          label={t("lastName")}
          type="text"
          {...register("last_name")}
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
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
        />

        {/* Confirm Password */}

        <Input
          label={t("confirmPassword")}
          type="password"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        {t("submit")}
      </button>
    </form>
  );
}
