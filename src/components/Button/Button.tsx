import "./Button.scss";

interface ButtonProps {
  onClick: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  label: string;
  variant?: "filled" | "outlined";
}
const Button = ({ onClick, label, variant = "filled" }: ButtonProps) => {
  const buttonClassName = `button ${
    variant === "filled" ? "filled" : "outlined"
  }`;
  return (
    <button className={buttonClassName} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
