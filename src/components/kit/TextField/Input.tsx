import styles from "./Input.module.scss";
import clsx from "clsx";

type TInputSize = "sm" | "md" | "lg";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: TInputSize;
  error?: boolean;
  success?:boolean;
  fullWidth?: boolean;
}
const Input: React.FC<InputProps> = ({
  inputSize = "md",
  error = false,
  fullWidth = false,
  children,
  success= false,
  ...rest
}) => {
  return (
    <>
      <input
      {...rest}
      className={clsx(
        styles.input,
        inputSize && styles[inputSize],
        error && styles["error"],
        success && styles["success"],
        fullWidth && styles["full-width"],
      )}
      >
      </input>
    </>
  );
};
export default Input;
