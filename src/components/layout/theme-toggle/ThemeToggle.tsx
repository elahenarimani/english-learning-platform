"use client";
import { useTheme } from "@wrksz/themes/client";
import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.scss";
import Button from "@/components/kit/Button/Button";
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <Button
      type="button"
      variant="text"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={styles.button}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}{" "}
    </Button>
  );
}
