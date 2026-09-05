import { z } from "zod";

type TranslateFunction = (key: string) => string;

export const createRegisterSchema = (t: TranslateFunction) =>
  z
    .object({
      first_name: z
        .string()
        .min(2, t("firstNameMin")),

      last_name: z
        .string()
        .min(3, t("lastNameMin")),

      email: z
        .email(t("emailInvalid")),

      password: z
        .string()
        .min(8, t("passwordMin")),

      confirmPassword: z
        .string()
        .min(8, t("confirmPasswordMin")),

      is_teacher: z.boolean(),
    })
    .refine(
      (data) => data.password === data.confirmPassword,
      {
        message: t("passwordMismatch"),
        path: ["confirmPassword"],
      }
    );

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;