import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkbench } from "@/components/ToolWorkbench";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workflow AI" },
      {
        name: "description",
        content:
          "Generate professional, on-tone workplace emails from a few bullet points and edit them before sending.",
      },
      { property: "og:title", content: "Smart Email Generator — Workflow AI" },
      {
        property: "og:description",
        content: "Draft clear professional emails in seconds with editable AI output.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell
      title="Smart Email Generator"
      subtitle="From rough notes to a send-ready message"
    >
      <ToolWorkbench
        cta="Draft email"
        outputLabel="Email draft (editable)"
        system="You are an expert business communication assistant. Write clear, concise, respectful workplace emails. Never invent facts, names, dates, or commitments that were not provided; use [bracketed placeholders] instead."
        fields={[
          { name: "recipient", label: "Recipient & relationship", placeholder: "Client CFO, first contact", required: true },
          { name: "purpose", label: "Purpose / key points", type: "textarea", placeholder: "Ask for a 30-min review, share Q3 numbers, propose Tuesday", required: true },
          { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Direct", "Formal", "Apologetic", "Persuasive"] },
          { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
        ]}
        buildPrompt={(v) => `Write a workplace email.
Recipient: ${v["recipient"]}
Key points: ${v["purpose"]}
Tone: ${v["tone"]}
Length: ${v["length"]}

Return: a subject line, then the email body with a greeting and sign-off. Plain text only.`}
      />
    </AppShell>
  );
}
