/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = "https://axis-server.vercel.app/api/tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState<"low" | "medium" | "high">("medium");

  // Load tasks
  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add Task
  const addTask = async () => {
    if (!newTask.trim()) return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTask, priority: newPriority }),
    });

    const newItem = await res.json();
    setTasks([...tasks, newItem]);
    setNewTask("");
    setNewPriority("medium");
  };

  // Toggle Complete
  const toggleTask = async (id: string, completed: boolean) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });

    const updated = await res.json();
    setTasks(tasks.map((t) => (t._id === id ? updated : t)));
  };

  // Start Edit
  const startEdit = (id: string, text: string, priority: any) => {
    setEditingId(id);
    setEditingText(text);
    setEditingPriority(priority);
  };

  // Save Edit
  const saveEdit = async () => {
    if (!editingText.trim()) return;

    const res = await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: editingText,
        priority: editingPriority,
      }),
    });

    const updated = await res.json();
    setTasks(tasks.map((t) => (t._id === editingId ? updated : t)));

    setEditingId(null);
    setEditingText("");
    setEditingPriority("medium");
  };

  // Delete Task
  const deleteTask = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  // Priority color map
  const priorityColors: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-yellow-400",
    high: "bg-orange-500",
  };

  // Format date (just YYYY-MM-DD)
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Tasks</h1>

      {/* Add Task */}
      <div className="flex items-center gap-2 mb-6">
        <Input
          placeholder="Add new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />

        {/* Priority Buttons */}
        {["low", "medium", "high"].map((p) => (
          <button
            key={p}
            className={`w-6 h-6 rounded-full border-2 ${
              newPriority === p ? priorityColors[p] : "border-gray-400"
            }`}
            onClick={() => setNewPriority(p as any)}
          ></button>
        ))}

        <Button onClick={addTask}>Add</Button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex items-center justify-between border p-2 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id, task.completed)}
              />

              {editingId !== task._id ? (
                <div className="flex flex-col">
                  <span
                    className={task.completed ? "line-through opacity-60" : ""}
                  >
                    {task.text}
                  </span>
                  <span className="text-xs flex items-center gap-2">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${priorityColors[task.priority]}`}
                    ></span>
                    <span>{task.priority}</span>
                    <span>{task.createdAt ? formatDate(task.createdAt) : ""}</span>
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <Input
                    className="border p-1 rounded"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />

                  <div className="flex items-center gap-2">
                    {["low", "medium", "high"].map((p) => (
                      <button
                        key={p}
                        className={`w-5 h-5 rounded-full border-2 ${
                          editingPriority === p ? priorityColors[p] : "border-gray-400"
                        }`}
                        onClick={() => setEditingPriority(p as any)}
                      ></button>
                    ))}
                    {tasks.find((t) => t._id === editingId)?.createdAt && (
                      <span className="text-xs ml-2">
                        {formatDate(tasks.find((t) => t._id === editingId)?.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {editingId === task._id ? (
                <button onClick={saveEdit} className="text-green-600">
                  <Check />
                </button>
              ) : (
                <button
                  onClick={() =>
                    startEdit(task._id, task.text, task.priority)
                  }
                >
                  <Pencil size={18} />
                </button>
              )}

              <button onClick={() => deleteTask(task._id)}>
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
