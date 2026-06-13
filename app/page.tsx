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
  const [loading, setLoading] = useState(false);

  const [aiResult, setAiResult] = useState("");
  const [aiError, setAiError] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // FETCH TODOS
  const fetchTodos = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
    } else {
      setTodos(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ADD TODO
  const addTodo = async () => {
    if (!title.trim()) return;

    const { error } = await supabase
      .from("todos")
      .insert([{ title }]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    fetchTodos();
  };

  // DELETE TODO
  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // AI ANALYSIS
  const analyzeTodos = async () => {
    if (todos.length === 0) {
      setAiError("No todos to analyze");
      return;
    }

    setLoadingAI(true);
    setAiResult("");
    setAiError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todos }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI request failed");
      }

      setAiResult(data.result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong";

      setAiError(message);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>🧠 AI Todo App</h1>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Enter a todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* AI BUTTON */}
      <div style={{ marginTop: 20 }}>
        <button onClick={analyzeTodos} disabled={loadingAI}>
          {loadingAI ? "Analyzing..." : "Analyze with AI"}
        </button>
      </div>

      {/* STATUS */}
      {loadingAI && (
        <p style={{ color: "blue", marginTop: 10 }}>
          ⏳ AI is analyzing your todos...
        </p>
      )}

      {/* ERROR */}
      {aiError && (
        <p style={{ color: "red", marginTop: 10 }}>
          ❌ Error: {aiError}
        </p>
      )}

      {/* SUCCESS */}
      {aiResult && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            border: "1px solid green",
            borderRadius: 6,
            whiteSpace: "pre-wrap",
            background: "#f0fff0",
          }}
        >
          <h3>🧠 AI Analysis</h3>
          <p>{aiResult}</p>
        </div>
      )}

      {/* TODOS */}
      <div style={{ marginTop: 20 }}>
        {loading && <p>Loading...</p>}

        {!loading && todos.length === 0 && <p>No todos yet</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
                borderBottom: "1px solid #eee",
                paddingBottom: 5,
              }}
            >
              <span>{todo.title}</span>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}