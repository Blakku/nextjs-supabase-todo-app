# 🧠 AI-Powered Todo App (Next.js + Supabase + Gemini AI)

A full-stack AI-enhanced todo application built with **Next.js, Supabase, and Google Gemini AI**.  
This project transforms a simple todo app into an **intelligent task analysis system** that classifies, prioritizes, and improves user productivity.

---

## 🚀 Live Features

### ✅ Core Todo System
- Add, view, and manage todos
- Real-time database storage using Supabase
- Persistent task management

### 🧠 AI Task Intelligence (Gemini AI)
This app integrates Google Gemini AI to analyze user todos and provide:

- 📌 Task summarization
- 🔥 Priority ranking (high → low)
- 💡 Productivity suggestions
- 🧩 Classification of vague or emotional inputs
- 🧠 Detection of actionable vs non-actionable items

Example AI Output:
- Summary of user intent
- Breakdown of tasks into actionable steps
- Identification of unclear or emotional inputs
- Suggestions to improve task clarity

---

## 🏗️ Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **AI Engine:** Google Gemini (Generative AI API)
- **Styling:** Tailwind CSS (if used)

---

## ⚙️ AI System Architecture

1. User adds todos via UI
2. Todos are stored in Supabase
3. AI route (`/api/.../route.ts`) sends todos to Gemini
4. Gemini processes and returns structured analysis
5. Frontend displays:
   - Summary
   - Prioritized tasks
   - Suggestions

---

## 🧠 AI Capabilities

The AI system can:

- Interpret messy or natural language input
- Distinguish between actionable tasks and notes
- Infer intent when possible (controlled inference)
- Flag unclear items for clarification
- Improve productivity through structured breakdowns

---

## 📦 Example Use Case

### Input:
- "I want this now"
- "Concentrate on this"
- "Call John tomorrow"
- "I love programming"

### AI Output:
- Clear actionable tasks
- Identified unclear instructions
- Separated emotional statements
- Productivity suggestions

---

## 🔐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key