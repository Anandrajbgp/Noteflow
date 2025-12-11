import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertTaskSchema, insertTaskListSchema, updateTaskListSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Config endpoint for Supabase credentials (public, anon key only)
  app.get("/api/config", (_req, res) => {
    res.json({
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    });
  });

  // Notes routes
  app.get("/api/notes", async (_req, res) => {
    try {
      const notes = await storage.getNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const validated = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validated);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid note data" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNote(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  // Task Lists routes
  app.get("/api/task-lists", async (_req, res) => {
    try {
      const lists = await storage.getTaskLists();
      res.json(lists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task lists" });
    }
  });

  app.post("/api/task-lists", async (req, res) => {
    try {
      const validated = insertTaskListSchema.parse(req.body);
      const list = await storage.createTaskList(validated);
      res.status(201).json(list);
    } catch (error) {
      res.status(400).json({ error: "Invalid task list data" });
    }
  });

  app.patch("/api/task-lists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = updateTaskListSchema.parse(req.body);
      const list = await storage.updateTaskList(id, validated);
      res.json(list);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  app.delete("/api/task-lists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTaskList(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task list" });
    }
  });

  app.delete("/api/task-lists/:id/completed", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCompletedTasksByList(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete completed tasks" });
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (_req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validated = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validated);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.updateTask(id, req.body);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  return httpServer;
}
