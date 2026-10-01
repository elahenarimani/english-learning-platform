import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "@/feature/auth/schemas/user.schema";

const BACKEND_URL = process.env.API_URL;

export async function POST(request: NextRequest) {
  try {
    if (!BACKEND_URL) {
      throw new Error("API_URL is not defined");
    }

    const body = await request.text();

    const response = await fetch(
      `${BACKEND_URL}/register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
        cache: "no-store",
      },
    );

    const data: unknown = await response.json().catch(() => null);
    if (response.ok) {
      const result = userSchema.safeParse(data);
      if (!result.success) {
        return NextResponse.json(
          { message: "Invalid registration response", code: "invalid_registration_response" },
          { status: 502 },
        );
      }
      // Return only the validated User fields, never upstream cookies or tokens.
      return NextResponse.json(result.data, { status: response.status });
    }

    if (response.status === 400 && data !== null && typeof data === "object") {
      const fields: Record<string, string | string[]> = {};
      for (const key of ["email", "password", "first_name", "last_name", "is_teacher", "non_field_errors"]) {
        const value: unknown = Object.getOwnPropertyDescriptor(data, key)?.value;
        if (typeof value === "string" ||
          (Array.isArray(value) && value.every((item: unknown) => typeof item === "string"))) {
          fields[key] = value;
        }
      }
      if (Object.keys(fields).length > 0) {
        return NextResponse.json(fields, { status: 400 });
      }
    }
    return NextResponse.json(
      { message: "Registration failed", code: "registration_rejected" },
      { status: response.status },
    );
  } catch {

    return NextResponse.json(
      {
        message: "Registration service unavailable",
        code: "registration_unavailable",
      },
      {
        status: 502,
      },
    );
  }
}
