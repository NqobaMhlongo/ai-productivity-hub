import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkbench } from "@/components/ToolWorkbench";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workflow AI" },
      {
        name: "description",
        content:
          "Break any work goal into a prioritized, sequenced task plan with estimates and milestones.",
      },
      { property: "og:title", content: "AI Task Planner — Workflow AI" },
      {
        property: "og:description",
        content: "Turn goals into prioritized, time-boxed task plans.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell title="AI Task Planner" subtitle="Goals in, an executable plan out">
      <ToolWorkbench
        cta="Build plan"
        outputLabel="Task plan (editable)"
        system="You are a pragmatic project planner. Produce realistic, specific plans. Prefer fewer, higher-leverage tasks over long generic checklists."
        fields={[
          { name: "goal", label: "Goal or project", type: "textarea", placeholder: "Launch the customer onboarding revamp", required: true },
          { name: "deadline", label: "Timeframe", placeholder: "6 weeks, ending 30 Sept" },
          { name: "capacity", label: "Team / capacity", placeholder: "Me + 1 designer, ~10 hrs/week" },
          { name: "style", label: "Plan style", type: "select", options: ["Weekly milestones", "Kanban backlog", "Daily schedule", "RACI breakdown"] },
        ]}
        buildPrompt={(v) => `Create a task plan.
Goal: ${v.goal}
Timeframe: ${v.deadline || "unspecified"}
Capacity: ${v.capacity || "unspecified"}
Format: ${v.style}

Include: prioritized tasks (P1/P2/P3), effort estimates, dependencies, milestones, and the top 3 risks with mitigations.`}
      />
    </AppShell>
  );
}
