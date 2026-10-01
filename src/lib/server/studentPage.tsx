import "server-only";

import type { ReactNode } from "react";
import SessionRecovery from "@/feature/auth/components/SessionRecovery/SessionRecovery";
import { SessionRecoveryRequired } from "./backendErrors";
import { requireStudentSession } from "./studentSession";

// Invoke from each page, not a persistent layout. Data loaders keep their own guard.
export async function renderStudentPage(content: ReactNode) {
  try {
    await requireStudentSession();
  } catch (error) {
    if (error instanceof SessionRecoveryRequired) {
      return <SessionRecovery needsRecovery renderId={crypto.randomUUID()} />;
    }
    // Preserve redirects and temporary errors without starting session recovery.
    throw error;
  }

  return (
    <SessionRecovery needsRecovery={false} renderId={crypto.randomUUID()}>
      {content}
    </SessionRecovery>
  );
}
