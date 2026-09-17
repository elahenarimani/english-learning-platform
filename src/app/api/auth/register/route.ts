import { NextRequest, NextResponse } from "next/server";

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

    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ??
          "application/json",
      },
    });
  } catch (error) {
    console.error("Register route error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}