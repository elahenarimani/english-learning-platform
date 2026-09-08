import clsx from "clsx";
import styles from "./Spinner.module.scss";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export default function Spinner({ size = "md" }: SpinnerProps) {
  return <span className={clsx(styles.spinner, styles[size])} />;
}