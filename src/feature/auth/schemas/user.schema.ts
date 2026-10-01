import { z } from "zod";
import { loginUserSchema } from "../utils/loginRedirect";

// Extend the existing login identity checks with the complete me response.
export const userSchema = loginUserSchema.extend({
  profile_picture: z.string().nullable(),
  has_tutor_profile: z.boolean(),
  tutor_id: z.number().int().positive().nullable(),
  tutor_approved: z.boolean().nullable(),
});
