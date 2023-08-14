import { ResultIs } from ".";
import { withResult } from "./with-result";

if (typeof window !== "undefined") {
  (window as any).ResultIs = ResultIs;
  (window as any).withResult = withResult;
} else {
  (globalThis as any).ResultIs = ResultIs;
  (globalThis as any).withResult = withResult;
}