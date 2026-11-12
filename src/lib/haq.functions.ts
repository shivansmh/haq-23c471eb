import { createServerFn } from "@tanstack/react-start";
import fixture from "./demo-sweep.json";
import type { SweepResult } from "./haq-types";

const BASE = "https://haq-api-u3pz.onrender.com";

/** Runs the sample-inbox sweep on the Haq API; falls back to a bundled copy if the API is asleep. */
export const runDemoSweep = createServerFn({ method: "POST" }).handler(async (): Promise<SweepResult & { source: "live-api" | "bundled" }> => {
  try {
    const res = await fetch(`${BASE}/v1/gmail/demo`, { method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    return { ...((await res.json()) as SweepResult), source: "live-api" };
  } catch (e) {
    console.error("Demo sweep API unavailable, using bundled sample", e);
    return { ...(fixture as unknown as SweepResult), source: "bundled" };
  }
});
