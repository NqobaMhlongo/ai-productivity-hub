import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { runAssistant } from "@/lib/ai.functions";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
};

export function ToolWorkbench({
  fields,
  system,
  buildPrompt,
  cta = "Generate",
  outputLabel = "AI draft (editable)",
}: {
  fields: Field[];
  system: string;
  buildPrompt: (values: Record<string, string>) => string;
  cta?: string;
  outputLabel?: string;
}) {
  const call = useServerFn(runAssistant);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.options?.[0] ?? ""])),
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (name: string, v: string) => setValues((p) => ({ ...p, [name]: v }));

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await call({ data: { system, prompt: buildPrompt(values) } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const missing = fields.some((f) => f.required && !values[f.name]?.trim());

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-panel)]">
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Prompt inputs
        </h2>
        <div className="mt-4 space-y-4">
          {fields.map((f) => (
            <label key={f.name} className="block space-y-1.5">
              <span className="text-sm font-medium">{f.label}</span>
              {f.type === "textarea" ? (
                <textarea
                  rows={5}
                  value={values[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              ) : f.type === "select" ? (
                <select
                  value={values[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                >
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={values[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              )}
            </label>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={loading || missing}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? "Working…" : cta}
        </button>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-panel)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {outputLabel}
          </h2>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            disabled={!output}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent disabled:opacity-40"
          >
            <Copy className="size-3.5" /> Copy
          </button>
        </div>
        <textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="Your AI draft appears here — edit it freely before you use it."
          className="mt-4 min-h-[420px] w-full resize-y rounded-lg border border-input bg-background px-4 py-3 font-mono text-[13px] leading-relaxed outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Responsible AI: generated content can be inaccurate or biased. Verify facts,
          remove sensitive data, and take ownership of anything you send.
        </p>
      </section>
    </div>
  );
}
