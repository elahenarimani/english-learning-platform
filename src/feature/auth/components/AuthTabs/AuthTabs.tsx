"use client";
import { Tabs, Tab } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import styles from "./AuthTabs.module.scss"
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
    <div  className={styles["tab-wrapper"]}>
      <Tabs value={activeTab} onChange={handleChange} centered className={styles.tabs}>
      {" "}
      <Tab label="Sign In" className={styles.tab}/> <Tab label="Register" className={styles.tab}/>{" "}
    </Tabs>
    </div>
  );
}
