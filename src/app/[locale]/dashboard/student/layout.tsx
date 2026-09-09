import { Header } from "@/components/layout/Header/Header";
import type { ReactNode } from "react";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({
  children,
}: StudentLayoutProps) {
  return (
    <div>
        <Header/>
      {children}
    </div>
  );
}