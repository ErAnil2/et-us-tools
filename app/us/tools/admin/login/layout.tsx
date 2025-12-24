export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page has its own full-screen styling, just pass through
  return <>{children}</>;
}
