"use client";

import { Result } from "antd";
import  Button  from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "#f0f2f5",
      }}
    >
      <Result
        status="404"
        title="Page Not Found"
        subTitle="The page you're looking for doesn't exist or was moved."
        extra={
          <Button type="primary" onClick={() => router.push("/courses")}>
            Go to Dashboard
          </Button>
        }
      />
    </div>
  );
}
