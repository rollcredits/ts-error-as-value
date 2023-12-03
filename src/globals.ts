import { ok, err } from ".";
import { withResult } from "./with-result";
import { partitionResults } from "./partition-results";

if (typeof window !== "undefined") {
  (window as any).err = err;
  (window as any).ok = ok;
  (window as any).withResult = withResult;
  (window as any).partitionResults = partitionResults;
} else {
  (globalThis as any).err = err;
  (globalThis as any).ok = ok;
  (globalThis as any).withResult = withResult;
  (globalThis as any).partitionResults = partitionResults;
}