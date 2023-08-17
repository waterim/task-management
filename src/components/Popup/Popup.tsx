import Button from "../Button/Button";
import "./Popup.scss";

type PopupProps = {
  children: React.ReactNode;
  title: string;
  closePopup: () => void;
  handleSave: () => void;
};

const Popup = (props: PopupProps) => {
  return (
    <div
      className="popup-overlay"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape") props.closePopup();
      }}
    >
      <div className="popup">
        <h2>{props.title}</h2>
        <div className="formContainer">{props.children}</div>

        <div className="popup-btn-container">
          <Button
            label="Save"
            onClick={(e) => {
              e && e.preventDefault();
              e && e.stopPropagation();
              props.handleSave();
            }}
          />
          <Button
            label="Close"
            variant="outlined"
            onClick={(e) => {
              e && e.preventDefault();
              e && e.stopPropagation();
              props.closePopup();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Popup;
