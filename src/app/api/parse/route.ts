import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

interface ParsedTask {
  text: string;
  priority: "now" | "soon" | "later" | "thought";
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a task parser for a busy family. Take this brain dump and split it into individual tasks/items. For each one, assign a priority:

- "now": Needs to happen today or has an imminent deadline
- "soon": Needs to happen this week, or is fairly urgent
- "later": Eventually / no rush / sometime in the future
- "thought": Not really a task - just an idea, feeling, or observation

Keep each task short and clear (reword slightly if needed for clarity, but stay true to what they said). Do NOT add tasks they didn't mention.

Respond with ONLY a JSON array, no other text. Example:
[{"text": "Sign permission slip for Jake", "priority": "now"}, {"text": "Fix kitchen faucet", "priority": "soon"}]

Here's the brain dump:

${text}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response" },
        { status: 500 }
      );
    }

    // Extract JSON from response (handle possible markdown wrapping)
    let jsonStr = content.text.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }

    const tasks: ParsedTask[] = JSON.parse(jsonStr);

    return NextResponse.json({ tasks });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Parse error:", message, error);

    return NextResponse.json(
      { error: `Error: ${message}` },
      { status: 500 }
    );
  }
}
