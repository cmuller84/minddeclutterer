import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const client = new Anthropic();

const ParsedDump = z.object({
  tasks: z.array(
    z.object({
      text: z.string(),
      category: z.enum(["A", "B", "C", "D", "E"]),
      // Order among A tasks, 1 = most important. 0 for non-A tasks.
      rank: z.number().int(),
      // Who could take a D task ("Chris", "the kids", "a handyman"). Empty otherwise.
      delegateTo: z.string(),
    })
  ),
});

const SYSTEM_PROMPT = `You sort a busy stay-at-home mom's brain dump using the A-B-C-D-E method from Brian Tracy's "Eat That Frog". She has three kids and a husband who works long hours. Her dumps are often texted to him, so "you" usually means her husband.

Split the dump into separate items, then give each one a category:
- A: Must do. Serious consequences if it doesn't get done (deadlines, health, money, kids' school obligations, safety). Rank the A items 1, 2, 3... by importance; A-1 is "the frog", the one thing to tackle first.
- B: Should do. Mild consequences if skipped. Never more important than an A.
- C: Nice to do. Wants, ideas, and someday projects with no real consequence if they wait.
- D: Delegate. Something someone else could reasonably do. Put who in delegateTo: her husband if the dump addresses him or it's clearly his kind of task, otherwise a short guess like "the kids" or "a handyman".
- E: Eliminate. Low-value items she'd be fine letting go of. Use sparingly and only when it's genuinely optional.

Write each item as a short, clear task in her own spirit (strip bullets and filler, keep specifics like names, places, and dates). Questions become tasks ("what time is the Cavs game?" -> "Look up Cavs game time"). Don't invent items she didn't mention. A single line that holds several things becomes several items.

Use rank 0 for anything that isn't an A. Use an empty delegateTo for anything that isn't a D.`;

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    const response = await client.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: {
        effort: "low",
        format: zodOutputFormat(ParsedDump),
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return NextResponse.json(
        { error: "Couldn't sort that one. Try rewording, or use quick add." },
        { status: 422 }
      );
    }

    return NextResponse.json(response.parsed_output);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "The API key was rejected. Check ANTHROPIC_API_KEY in Vercel." },
        { status: 500 }
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Too many requests right now. Try again in a minute." },
        { status: 429 }
      );
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", error.status, error.message);
      return NextResponse.json(
        { error: `Sorting failed (${error.status}): ${error.message}` },
        { status: 502 }
      );
    }
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Something went wrong sorting that. Try again." },
      { status: 500 }
    );
  }
}
