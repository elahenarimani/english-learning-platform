import AuthTabs from "@/feature/auth/components/AuthTabs/AuthTabs";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AuthTabs />

      {children}
    </div>
  );
}