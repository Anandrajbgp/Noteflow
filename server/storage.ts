import { db } from "./db";
import { type User, type InsertUser, type Note, type InsertNote, type Task, type InsertTask, type TaskList, type InsertTaskList, users, notes, tasks, taskLists } from "@shared/schema";
import { eq, desc, and, max } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Notes
  getNotes(): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  deleteNote(id: number): Promise<void>;
  
  // Task Lists
  getTaskLists(): Promise<TaskList[]>;
  createTaskList(list: InsertTaskList): Promise<TaskList>;
  updateTaskList(id: number, updates: Partial<TaskList>): Promise<TaskList>;
  deleteTaskList(id: number): Promise<void>;
  
  // Tasks
  getTasks(): Promise<Task[]>;
  getTasksByList(listId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  deleteCompletedTasksByList(listId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Notes
  async getNotes(): Promise<Note[]> {
    return await db.select().from(notes).orderBy(desc(notes.createdAt));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async deleteNote(id: number): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  }

  // Task Lists
  async getTaskLists(): Promise<TaskList[]> {
    return await db.select().from(taskLists).orderBy(taskLists.sortOrder);
  }

  async createTaskList(list: InsertTaskList): Promise<TaskList> {
    const [newList] = await db.insert(taskLists).values(list).returning();
    return newList;
  }

  async updateTaskList(id: number, updates: Partial<TaskList>): Promise<TaskList> {
    const [updatedList] = await db.update(taskLists).set(updates).where(eq(taskLists.id, id)).returning();
    return updatedList;
  }

  async deleteTaskList(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.listId, id));
    await db.delete(taskLists).where(eq(taskLists.id, id));
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTasksByList(listId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.listId, listId)).orderBy(tasks.listOrder);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const [updatedTask] = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async deleteCompletedTasksByList(listId: number): Promise<void> {
    await db.delete(tasks).where(and(eq(tasks.listId, listId), eq(tasks.completed, true)));
  }
}

export const storage = new DatabaseStorage();
