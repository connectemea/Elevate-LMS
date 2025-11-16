export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-wrapper">
      <div className="desktop-only">{children}</div>

      <div className="mobile-block-message">
        This dashboard is available on desktop only.
      </div>
    </div>
  )
}
