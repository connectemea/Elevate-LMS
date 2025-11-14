"use client"
import { useEffect, useState } from "react"

export default async function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkScreen()
    window.addEventListener("resize", checkScreen)

    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  if (!isDesktop) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "#555",
        textAlign: "center",
        padding: 20,
      }}>
        This dashboard is available on desktop only.
      </div>
    )
  }

  return <>{children}</>
}
