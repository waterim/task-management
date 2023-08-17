import { useState, useMemo } from "react";
import { ListType, TaskType } from "../types";
import "./Board.scss";
import { idGenerator } from "../utils/helpers";
import { defaultLists, defaultTasks } from "../constants";
import { List, Task } from "../components";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
const Board = () => {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [activeList, setActiveList] = useState<ListType | null>(null);
  const [newListTitle, setNewListTitle] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [lists, setLists] = useState<ListType[]>(defaultLists);
  const [tasks, setTasks] = useState<TaskType[]>(defaultTasks);
  const listsIds = useMemo(() => lists.map((list) => list.id), [lists]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 100, //100px
      },
    })
  );

  const createList = () => {
    if (!isValid || newListTitle === "") {
      setIsValid(false);
      return;
    }
    setLists([...lists, { id: idGenerator(), title: newListTitle }]);
    setNewListTitle("");
    setIsValid(false);
  };

  const deleteList = (id: number) => {
    const filteredLists = lists.filter((list) => list.id !== id);
    setLists(filteredLists);

    const updatedTasks = tasks.filter((task) => task.listId !== id);
    setTasks(updatedTasks);
  };

  const updateListTitle = (id: number, title: string) => {
    const updatedLists = lists.map((list) => {
      if (list.id === id) {
        list.title = title;
      }
      return list;
    });
    setLists(updatedLists);
  };

  const createTask = (
    listId: number,
    listTitle: string,
    title: string,
    description: string
  ) => {
    const newTask: TaskType = {
      id: idGenerator(),
      listId: listId,
      title: title,
      description: description,
      status: listTitle,
    };
    setTasks([...tasks, newTask]);
  };
  const updateTask = (id: number, title: string, description: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        task.title = title;
        task.description = description;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const handleNewListTitleChange = (value: string) => {
    const isValidTitle = /^[a-zA-Z0-9\s]*$/.test(value) && value.trim() !== "";
    setNewListTitle(value);
    setIsValid(isValidTitle);
  };

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "List") {
      setActiveList(e.active.data.current.data);
      return;
    }
    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveList(null);
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;

    const activeListId = active.id;
    const overListId = over.id;
    if (activeListId === overListId) return;
    setLists((lists) => {
      const activeListIndex = lists.findIndex(
        (list) => list.id === activeListId
      );

      const overListIndex = lists.findIndex((list) => list.id === overListId);

      return arrayMove(lists, activeListIndex, overListIndex);
    });
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!activeTask) return;
    // Drop a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);

        const overTaskIndex = tasks.findIndex((task) => task.id === overId);

        tasks[activeTaskIndex].listId = tasks[overTaskIndex].listId;
        tasks[activeTaskIndex].status = tasks[overTaskIndex].status;

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    // Drop a task to another column
    const isOverList = over.data.current?.type === "List";

    if (isActiveTask && isOverList) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[activeTaskIndex].listId = Number(overId);
        tasks[activeTaskIndex].status = over.data.current?.data.title;
        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  };

  return (
    <div className="board">
      <DndContext
        onDragOver={onDragOver}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <DragOverlay>
          {activeList && (
            <List
              data={activeList}
              deleteList={deleteList}
              tasks={tasks.filter((task) => task.listId === activeList.id)}
              createTask={createTask}
              updateListTitle={updateListTitle}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          )}
          {activeTask && (
            <Task
              task={activeTask}
              updateTask={updateTask}
              deleteTask={deleteList}
            />
          )}
        </DragOverlay>
        <div className="lists">
          <SortableContext items={listsIds}>
            {lists.map((list) => (
              <List
                key={list.id}
                data={list}
                tasks={tasks.filter((task) => task.listId === list.id)}
                deleteList={deleteList}
                updateListTitle={updateListTitle}
                createTask={createTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
          </SortableContext>
        </div>
        <div className="new-list-container">
          <Input
            value={newListTitle}
            onChange={(e) => handleNewListTitleChange(e.target.value)}
            id="listTitle"
            label="List Title"
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              createList();
            }}
            errorText={
              !isValid && newListTitle !== ""
                ? "Title can contain letters and numbers only and should not be empty."
                : null
            }
          />

          <Button label="Create list" onClick={createList} />
        </div>
      </DndContext>
    </div>
  );
};

export default Board;
