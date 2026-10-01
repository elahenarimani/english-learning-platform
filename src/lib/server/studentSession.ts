import "server-only";

import { cache } from "react";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { redirect } from "@/i18n/routing";
import { backendRequest } from "./backend";
import { BackendRequestError } from "./backendErrors";

const identitySchema = z.object({
  id: z.number().int().positive(),
  is_teacher: z.boolean(),
});

// React cache only deduplicates within a server render; fetch remains no-store.
const getIdentity = cache(async () => {
  const response = await backendRequest<unknown>({ path: "me/" });
  const identity = identitySchema.safeParse(response);
  if (!identity.success) throw new BackendRequestError("response");
  return identity.data;
});

export async function requireStudentSession() {
  const identity = await getIdentity();
  if (identity.is_teacher !== false) {
    redirect({ href: "/dashboard/teacher", locale: await getLocale() });
  }
  return identity;
}
