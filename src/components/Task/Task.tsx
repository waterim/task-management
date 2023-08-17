import { useCallback, useState } from "react";
import Popup from "../Popup/Popup";
import { ReactComponent as TrashIcon } from "../../assets/icons/trash.svg";
import "./Task.scss";
import { TaskType } from "../../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";

type TaskProps = {
  task: TaskType;
  updateTask: (id: number, title: string, description: string) => void;
  deleteTask: (id: number) => void;
};

const Task = ({ task, updateTask, deleteTask }: TaskProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>(task.title);
  const [taskDesc, setTaskDesc] = useState<string>(task.description);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleUpdateTask = useCallback(() => {
    updateTask(task.id, taskTitle, taskDesc);
    closePopup();
  }, [updateTask, task.id, taskTitle, taskDesc]);

  if (isDragging)
    return <div ref={setNodeRef} style={style} className="task draggable" />;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task"
      onClick={openPopup}
    >
      <div className="header">
        <p className="title">{task.title}</p>
        <p className="status">{task.status}</p>
      </div>
      <p className="description">{task.description}</p>

      {isPopupOpen && (
        <Popup
          title="Edit task"
          closePopup={closePopup}
          handleSave={handleUpdateTask}
        >
          <Input
            label="Title:"
            id="title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <TextArea
            label="Description:"
            id="description"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />
        </Popup>
      )}
      <button className="delete-btn" onClick={() => deleteTask(task.id)}>
        <TrashIcon />
      </button>
    </div>
  );
};

export default Task;
