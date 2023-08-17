import { ListType, TaskType } from "./types";

export const defaultLists: ListType[] = [
  { id: 1020, title: "To do" },
  { id: 4300, title: "In progress" },
  { id: 6344, title: "Done" },
];

export const defaultTasks: TaskType[] = [
  {
    id: 1,
    listId: 1020,
    title: "Style issue",
    description: "Make frontend done",
    status: "To do",
  },
  {
    id: 2,
    listId: 1020,
    title: "Fix",
    description: "Fix graphQL",
    status: "To do",
  },
  {
    id: 3,
    listId: 4300,
    title: "Production down",
    description: "Fix ASAP!!!!!!",
    status: "In progress",
  },
  {
    id: 4,
    listId: 4300,
    title: "Backend",
    description: "Create an API",
    status: "In progress",
  },
  {
    id: 5,
    listId: 6344,
    title: "Broken datepicker",
    description: "Make sure it works",
    status: "Done",
  },
  {
    id: 6,
    listId: 6344,
    title: "Artem Makushov",
    description: "Home task done",
    status: "Done",
  },
];
