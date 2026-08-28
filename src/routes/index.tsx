import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  NotebookPen,
  ListChecks,
  Telescope,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workflow AI — Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings, plan tasks, and research faster with an AI assistant built for professional teams.",
      },
      { property: "og:title", content: "Workflow AI — Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "An AI workspace for emails, meeting notes, task plans, research briefs, and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a few bullet points into a polished, on-tone email in seconds.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Condense transcripts into decisions, action items, and owners.",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    body: "Break a goal into a sequenced plan with priorities and estimates.",
  },
  {
    to: "/research",
    icon: Telescope,
    title: "AI Research Assistant",
    body: "Get structured briefs with key findings, risks, and open questions.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "Assistant Chat",
    body: "Ask anything about your work with full conversation context.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Your AI workspace for everyday professional tasks"
    >
      <section className="overflow-hidden rounded-2xl border border-border bg-[image:var(--gradient-hero)] p-8 text-primary-foreground shadow-[var(--shadow-panel)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
          Workplace copilot
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight md:text-4xl">
          Spend less time on busywork, more on the work that matters.
        </h2>
        <p className="mt-3 max-w-lg text-sm opacity-85">
          Five structured AI workflows with editable outputs — designed for people who
          still want the final word.
        </p>
        <Link
          to="/email"
          className="mt-6 inline-flex rounded-lg bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:opacity-90"
        >
          Start with an email draft
        </Link>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, body }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-panel)] transition hover:border-ring hover:-translate-y-0.5"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl border border-border bg-muted/60 p-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Responsible AI use</p>
          <p className="mt-1 leading-relaxed">
            Outputs are AI-generated and may be incomplete, outdated, or incorrect. Do
            not paste confidential or personal data, always review before sending, and
            keep a human accountable for every decision.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
