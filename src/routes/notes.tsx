import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkbench } from "@/components/ToolWorkbench";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workflow AI" },
      {
        name: "description",
        content:
          "Turn raw meeting transcripts and notes into decisions, action items, owners, and follow-ups.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workflow AI" },
      {
        property: "og:description",
        content: "Structured meeting summaries with decisions and action items.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell
      title="Meeting Notes Summarizer"
      subtitle="Decisions, owners, and next steps — extracted automatically"
    >
      <ToolWorkbench
        cta="Summarize notes"
        outputLabel="Summary (editable)"
        system="You are a meticulous meeting analyst. Summarize only what is present in the notes. Mark anything uncertain as 'unclear' rather than guessing owners or dates."
        fields={[
          { name: "context", label: "Meeting context", placeholder: "Weekly product sync, 6 attendees" },
          { name: "notes", label: "Raw notes or transcript", type: "textarea", placeholder: "Paste your transcript here…", required: true },
          { name: "focus", label: "Summary focus", type: "select", options: ["Balanced", "Action items only", "Executive summary", "Risks & blockers"] },
        ]}
        buildPrompt={(v) => `Summarize these meeting notes.
Context: ${v.context || "not provided"}
Focus: ${v.focus}

Sections to return:
1. TL;DR (3 bullets)
2. Key discussion points
3. Decisions made
4. Action items (task — owner — due date)
5. Open questions / risks

NOTES:
${v.notes}`}
      />
    </AppShell>
  );
}
