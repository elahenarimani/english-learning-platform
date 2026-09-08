import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { ThemeToggle } from "../theme-toggle/ThemeToggle";
import styles from "./AuthHeader.module.scss"

export default function AuthHeader() {
  return (
    <div className={styles.header}>
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}