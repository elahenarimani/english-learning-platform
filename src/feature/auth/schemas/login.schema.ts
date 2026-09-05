import { z } from "zod";

type TranslateFunction = (key: string) => string;

export const createLogInSchema = (t: TranslateFunction) =>
  z.object({
    username: z.string().min(3, t("usernameMin")).max(20, t("usernameMax")),

    password: z.string().min(8, t("passwordMin")),
  });

export type LogInFormValues = z.infer<
  ReturnType<typeof createLogInSchema>
>;
