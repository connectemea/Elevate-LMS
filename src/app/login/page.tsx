"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";
import FadeIn from "@/components/common/FadeIn";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FadeIn>
        <LoginForm />
      </FadeIn>
    </Suspense>
  );
}
