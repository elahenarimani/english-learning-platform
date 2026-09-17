"use client";

import { useState } from "react";

export default function TestError() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error("این یک خطای آزمایشی در MyCourses است.");
  }

  return (
    <button type="button" onClick={() => setHasError(true)}>
      ایجاد خطای آزمایشی
    </button>
  );
}