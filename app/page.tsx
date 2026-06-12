"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Todo = {
  id: string;
  title: string;
  created_at: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // FETCH TODOS
  const fetchTodos = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("FETCH ERROR:", error);
      setError(error.message);
    } else {
      setTodos(data || []);
      setError(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ADD TODO
  const addTodo = async () => {
    if (!title.trim()) return;

    setActionLoading(true);

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title }])
      .select();

    console.log("INSERT RESPONSE:", { data, error });

    if (error) {
      alert("Insert failed: " + error.message);
    } else {
      setTitle("");
      await fetchTodos(); // refresh list
    }

    setActionLoading(false);
  };

  // DELETE TODO
  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h1>Todo App</h1>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo..."
          style={{ flex: 1 }}
        />

        <button onClick={addTodo} disabled={actionLoading}>
          {actionLoading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {/* LOADING */}
      {loading && <p>Loading todos...</p>}

      {/* LIST */}
      {!loading && todos.length === 0 && (
        <p>No todos found</p>
      )}

      <ul style={{ marginTop: 20 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10
            }}
          >
            <span>{todo.title}</span>

            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}