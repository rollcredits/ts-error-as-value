import { ok, err } from ".";

if (typeof window !== "undefined" || (process as any).browser) {
  (window as any).ok = ok;
  (window as any).err = err;
} else {
  (globalThis as any).ok = ok;
  (globalThis as any).err = err;
}