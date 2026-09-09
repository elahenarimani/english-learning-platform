import { z } from "zod";

type TranslateFunction = (key: string) => string;

export const createLogInSchema = (t: TranslateFunction) =>
  z.object({
    email: z.email(t("emailInvalid")),

    password: z.string().min(8, t("passwordMin")),
  });

export type LogInFormValues = z.infer<
  ReturnType<typeof createLogInSchema>
>;
