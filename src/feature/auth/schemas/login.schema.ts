import { z } from "zod";

type TranslateFunction = (key: string) => string;

export const createLogInSchema = (t: TranslateFunction) =>
  z.object({
    email: z.string(),

    password: z.string().min(8, t("passwordMin")),
  });

export type LogInFormValues = z.infer<
  ReturnType<typeof createLogInSchema>
>;
