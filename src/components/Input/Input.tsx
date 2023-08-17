import "./Input.scss";

interface InputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  value: string;
  id: string;
  label?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  errorText?: string | null;
}
const Input = ({
  onChange,
  label,
  value,
  id,
  errorText,
  ...props
}: InputProps) => {
  return (
    <div className="input-container">
      {label && <label htmlFor="title">{label}</label>}
      <input
        className={`input ${errorText ? "error" : ""}`}
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        {...props}
      />
      {errorText && <p className="helperText">{errorText}</p>}
    </div>
  );
};

export default Input;
