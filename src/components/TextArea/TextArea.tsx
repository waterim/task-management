import "./TextArea.scss";

interface TextAreaProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  id: string;
  label?: string;
  autoFocus?: boolean;
}
const TextArea = ({ onChange, label, value, id, ...props }: TextAreaProps) => {
  return (
    <div className="textarea-container">
      {label && <label htmlFor="title">{label}</label>}
      <textarea
        className="textArea"
        id={id}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default TextArea;
