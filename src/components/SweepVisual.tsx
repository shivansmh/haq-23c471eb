import { useEffect, useState } from "react";
import { Check, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const INBOX = [
  { from: "HDFC Bank", subject: "Rs 2,000.00 debited via UPI to SWIGGY", flag: true },
  { from: "Zomato", subject: "Your weekend offers are here", flag: false },
  { from: "State Bank of India", subject: "ATM cash dispense incomplete — Rs 5,000", flag: true },
  { from: "LinkedIn", subject: "You appeared in 12 searches", flag: false },
  { from: "PhonePe", subject: "Payment failed — amount will be reversed", flag: true },
  { from: "Acme Traders", subject: "Invoice MSME-2026-441 — 61 days overdue", flag: true },
  { from: "Myntra", subject: "Your order has shipped", flag: false },
];

const RESULTS = [
  { ref: "ATM8829103", label: "ATM cash not dispensed", bank: "SBI", amount: "₹5,000", tag: "Ready" },
  { ref: "MSME-2026-441", label: "Overdue MSME invoice", bank: "Acme Traders", amount: "₹1,42,800", tag: "Ready" },
  { ref: "431209845123", label: "Failed UPI, money debited", bank: "HDFC · PhonePe", amount: "₹2,000", tag: "Review" },
];

const SCAN_MS = 650;

export function SweepVisual() {
  const [phase, setPhase] = useState<"scan" | "results">("scan");
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (phase === "scan") {
      if (cursor < INBOX.length) {
        const t = setTimeout(() => setCursor((c) => c + 1), SCAN_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("results"), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setCursor(0); setPhase("scan"); }, 6000);
    return () => clearTimeout(t);
  }, [phase, cursor]);

  const found = INBOX.slice(0, cursor).filter((e) => e.flag).length;
  const pct = Math.round((cursor / INBOX.length) * 100);

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel-border bg-panel text-panel-foreground shadow-panel" aria-label="Animated preview of an inbox sweep">
      {phase === "scan" ? (
        <div key="scan" className="animate-rise">
          <div className="flex items-center justify-between border-b border-panel-border px-4 py-3 text-sm">
            <span className="flex items-center gap-2 font-semibold"><Mail className="size-4 text-destructive" /> Gmail</span>
            <span className="flex items-center gap-1.5 text-xs text-primary"><span className="size-1.5 rounded-full bg-primary" /> Connected · read-only</span>
          </div>
          <ul className="relative">
            {INBOX.map((e, i) => {
              const done = i < cursor;
              const active = i === cursor;
              return (
                <li key={e.subject} className={cn("flex items-center gap-3 border-b border-panel-border px-4 py-2.5 transition-all duration-500", active && "bg-panel-raised", done && !e.flag && "opacity-35", done && e.flag && "bg-primary/10")}>
                  <span className={cn("grid size-5 shrink-0 place-items-center rounded border transition-colors", done && e.flag ? "border-primary bg-primary text-primary-foreground" : "border-panel-border")}>
                    {done && e.flag && <Check className="size-3" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{e.from}</p>
                    <p className="truncate text-xs text-panel-muted">{e.subject}</p>
                  </div>
                  {done && e.flag && <span className="animate-rise rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">Claimable?</span>}
                </li>
              );
            })}
          </ul>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold"><Sparkles className="size-3.5 text-primary" /> Sweep</span>
              <span className="text-panel-muted">{cursor < INBOX.length ? `Reading ${INBOX[cursor].from}…` : "Matching rules…"}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel-raised">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1.5 text-right text-[11px] text-panel-muted">{found} signals found</p>
          </div>
        </div>
      ) : (
        <div key="results" className="animate-rise">
          <div className="flex items-center justify-between border-b border-panel-border px-4 py-3 text-sm">
            <span className="font-semibold">Sweep results</span>
            <span className="text-xs text-primary">Scan complete</span>
          </div>
          <div className="px-4 pt-4">
            <p className="font-display text-4xl">₹1,49,800</p>
            <p className="text-xs text-panel-muted">3 possible claims · 2 ready, 1 needs review</p>
          </div>
          <ul className="space-y-2 p-4">
            {RESULTS.map((r, i) => (
              <li key={r.ref} className="animate-rise rounded-xl border border-panel-border bg-panel-raised p-3" style={{ animationDelay: `${i * 180}ms` }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{r.label}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", r.tag === "Ready" ? "bg-primary/20 text-primary" : "bg-warning/20 text-warning")}>{r.tag}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-panel-muted">
                  <span>{r.bank} · {r.ref}</span>
                  <span className="font-semibold text-panel-foreground">{r.amount}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
