"use client";
import { Tabs, Tab } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
export default function AuthTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1];
  const activeTab = pathname.endsWith("/register") ? 1 : 0;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      router.push(`/${locale}/login`);
    }

    if (newValue === 1) {
      router.push(`/${locale}/register`);
    }
  };
  return (
    <Tabs value={activeTab} onChange={handleChange} centered>
      {" "}
      <Tab label="Sign In" /> <Tab label="Register" />{" "}
    </Tabs>
  );
}
