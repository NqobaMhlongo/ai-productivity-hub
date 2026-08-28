import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkbench } from "@/components/ToolWorkbench";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workflow AI" },
      {
        name: "description",
        content:
          "Produce structured research briefs with key findings, comparisons, risks, and open questions.",
      },
      { property: "og:title", content: "AI Research Assistant — Workflow AI" },
      {
        property: "og:description",
        content: "Structured research briefs for faster professional decisions.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell
      title="AI Research Assistant"
      subtitle="Structured briefs you can take into a decision"
    >
      <ToolWorkbench
        cta="Run research brief"
        outputLabel="Research brief (editable)"
        system="You are a rigorous research analyst. Distinguish clearly between established facts, general industry practice, and your own inference. State knowledge limitations and never fabricate sources, statistics, or citations."
        fields={[
          { name: "topic", label: "Research question", type: "textarea", placeholder: "How do mid-market SaaS teams price usage-based add-ons?", required: true },
          { name: "audience", label: "Audience", placeholder: "Exec team, non-technical" },
          { name: "depth", label: "Depth", type: "select", options: ["Quick brief", "Standard analysis", "Deep dive"] },
        ]}
        buildPrompt={(v) => `Research question: ${v.topic}
Audience: ${v.audience || "general professional"}
Depth: ${v.depth}

Return:
1. Executive summary
2. Key findings (with confidence: high/medium/low)
3. Different perspectives or trade-offs
4. Risks and unknowns
5. Recommended next steps and what to verify independently`}
      />
    </AppShell>
  );
}
