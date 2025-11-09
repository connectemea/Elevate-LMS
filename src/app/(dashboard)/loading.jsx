import { Spin } from "antd";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.95)",
          padding: 40,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Spin size="large" />
        <div
          style={{
            marginTop: 20,
            fontSize: 16,
            color: "#667eea",
            fontWeight: 500,
          }}
        >
          Loading...
        </div>
      </div>
    </div>
  );
}