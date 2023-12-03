import { ok, err } from ".";
import { withResult } from "./with-result";

if (typeof window !== "undefined") {
  (window as any).err = err;
  (window as any).ok = ok;
  (window as any).withResult = withResult;
} else {
  (globalThis as any).err = err;
  (globalThis as any).ok = ok;
  (globalThis as any).withResult = withResult;
}