import { useState, useCallback, useMemo } from "react";
import { ListType, TaskType } from "../../types";
import Task from "../Task/Task";
import Popup from "../Popup/Popup";
import { ReactComponent as TrashIcon } from "../../assets/icons/trash.svg";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus.svg";
import "./List.scss";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";

type ListProps = {
  data: ListType;
  tasks: TaskType[];
  deleteList: (id: number) => void;
  updateListTitle: (id: number, title: string) => void;
  createTask: (
    listId: number,
    listTitle: string,
    title: string,
    description: string
  ) => void;
  updateTask: (id: number, title: string, description: string) => void;
  deleteTask: (id: number) => void;
};

const List = ({
  data,
  tasks,
  deleteList,
  updateListTitle,
  createTask,
  updateTask,
  deleteTask,
}: ListProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  //Task states
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDesc, setTaskDesc] = useState<string>("");

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: data.id, data: { type: "List", data } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTaskTitle("");
    setTaskDesc("");
  };

  const handleCreateTask = useCallback(() => {
    createTask(data.id, data.title, taskTitle, taskDesc);
    setTaskTitle("");
    setTaskDesc("");
    closePopup();
  }, [createTask, data.id, data.title, taskTitle, taskDesc]);

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="list draggable" />;
  }
  return (
    <div ref={setNodeRef} style={style} className="list">
      <div className="list-header" {...attributes} {...listeners}>
        {!editMode ? (
          <p onClick={() => setEditMode(true)} className="list-title">
            {data.title}
          </p>
        ) : (
          <Input
            id="listTitle"
            value={data.title}
            onChange={(e) => updateListTitle(data.id, e.target.value)}
            onBlur={() => setEditMode(false)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditMode(false);
            }}
          />
        )}
        <div className="action-container">
          <button className="list-delete" onClick={() => deleteList(data.id)}>
            <TrashIcon />
          </button>
          <button className="list-add" onClick={openPopup}>
            <PlusIcon />
          </button>
        </div>
      </div>
      <div className="list-tasks-container">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))}
        </SortableContext>
      </div>
      {isPopupOpen && (
        <Popup
          title="Create task"
          closePopup={closePopup}
          handleSave={handleCreateTask}
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
    </div>
  );
};

export default List;
