import clsx from "clsx";
import styles from "./button.module.scss";
import Spinner from "../Spinner/Spinner";
type TButtonVariant = "contained" | "outlined" | "text";
type TButtonSize = "sm" | "md" | "lg";
type TButtonColor =
  | "brand"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariant;
  size?: TButtonSize;
  color?: TButtonColor;
  fullWidth?: boolean;
  loading?: boolean;
  active?: boolean;
}
export default function Button({
  variant = "contained",
  size = "md",
  color = "brand",
  fullWidth = false,
  className,
  loading,
  active,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <>
      <button
        {...rest}
        disabled={loading || disabled}
        className={clsx(
          styles.button,
          variant && styles[variant],
          fullWidth && styles["full-width"],
          size && styles[size],
          active && styles["active"],
          loading && styles["loading"],
          color && styles[color],
          className,
        )}
      >
        {loading ? <Spinner size="sm" /> : children}
      </button>
    </>
  );
}
