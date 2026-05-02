export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-container">
      {/* Move your background glows here to keep them static during navigation */}
      {children}
    </div>
  );
}