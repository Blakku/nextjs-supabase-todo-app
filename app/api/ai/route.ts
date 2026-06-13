import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { todos } = await req.json();

    if (!todos || !Array.isArray(todos)) {
      return NextResponse.json(
        { error: "Invalid todos payload" },
        { status: 400 }
      );
    }

    const list = todos.map((t: any) => `- ${t.title}`).join("\n");

const prompt = `
Extract tasks from the list.

For each item return:
- text
- type: ACTIONABLE | NOTE
- short reason

Do not add extra interpretation.

INPUT:
${list}
`;

    // 🔥 NEW SDK STYLE
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    const text = response.text;

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("AI ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}