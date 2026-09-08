import AuthHeader from "@/components/layout/AuthHeader/AuthHeader";
import AuthTabs from "@/feature/auth/components/AuthTabs/AuthTabs";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AuthHeader />
      <AuthTabs />
      {children}
    </div>
  );
}