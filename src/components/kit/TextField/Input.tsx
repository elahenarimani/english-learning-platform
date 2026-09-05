import styles from "./Input.module.scss";
import clsx from "clsx";

type TInputSize = "sm" | "md" | "lg";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  inputSize?: TInputSize;
  error?: boolean;
  success?: boolean;
  fullWidth?: boolean;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  inputSize = "md",
  error = false,
  success = false,
  fullWidth = false,
  helperText,
  ...rest
}) => {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <input
        {...rest}
        className={clsx(
          styles.input,
          styles[inputSize],
          error && styles.error,
          success && styles.success,
          fullWidth && styles["full-width"]
        )}
      />

      {helperText && (
        <span
          className={clsx(
            styles.helperText,
            error && styles.errorText,
            success && styles.successText
          )}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;