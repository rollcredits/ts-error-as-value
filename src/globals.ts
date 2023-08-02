import { ok, err } from ".";
import { withResult } from "./with-result";

if (typeof window !== "undefined" || (process as any).browser) {
  (window as any).ok = ok;
  (window as any).err = err;
  (window as any).withResult = withResult;
} else {
  (globalThis as any).ok = ok;
  (globalThis as any).err = err;
  (globalThis as any).withResult = withResult;
}