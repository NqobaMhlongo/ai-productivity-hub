import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, SendHorizonal, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppShell } from "@/components/AppShell";
import { runAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistant Chat — Workflow AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant that keeps full conversation context for emails, planning, and analysis.",
      },
      { property: "og:title", content: "Assistant Chat — Workflow AI" },
      {
        property: "og:description",
        content: "A context-aware AI chat assistant for professional work.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM =
  "You are Workflow AI, a workplace productivity assistant for professionals. Be concise, practical, and structured. Use markdown. If you are unsure, say so rather than guessing, and remind the user to verify important facts.";

const starters = [
  "Rewrite this update so it's clearer for executives",
  "Help me prepare an agenda for a 30-minute 1:1",
  "What questions should I ask in a vendor evaluation?",
];

function ChatPage() {
  const call = useServerFn(runAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const transcript = next
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n\n");
      const res = await call({
        data: {
          system: SYSTEM,
          prompt: `Conversation so far:\n\n${transcript}\n\nReply as the assistant to the latest user message.`,
        },
      });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  return (
    <AppShell title="Assistant Chat" subtitle="Context-aware help across your workday">
      <div className="mx-auto flex h-[calc(100vh-11rem)] max-w-3xl flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-panel)]">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="py-10 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Sparkles className="size-5" />
              </span>
              <p className="mt-4 font-display text-base font-semibold">
                What are you working on?
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose-chat space-y-2">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 border-t border-border p-3"
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask about drafting, planning, analysis…"
            className="max-h-40 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            aria-label="Send message"
          >
            <SendHorizonal className="size-4" />
          </button>
        </form>
      </div>
      <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-muted-foreground">
        AI responses may be inaccurate. Don't share confidential information and verify
        anything important.
      </p>
    </AppShell>
  );
}
