import { ok, fail } from ".";
import { withResult } from "./with-result";

if (typeof window !== "undefined") {
  (window as any).ok = ok;
  (window as any).fail = fail;
  (window as any).withResult = withResult;
} else {
  (globalThis as any).ok = ok;
  (globalThis as any).fail = fail;
  (globalThis as any).withResult = withResult;
}