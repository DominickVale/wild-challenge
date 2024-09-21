import { useDebounceFn, useMount } from "ahooks";
import { DebounceOptions } from "ahooks/lib/useDebounce/debounceOptions";

export function useDebouncedOnResize(fn: (...args: unknown[]) => unknown, opts?: DebounceOptions) {
  const debouncedFn = useDebounceFn(fn, opts || { wait: 300, trailing: true });

  useMount(() => {
    window.addEventListener("resize", debouncedFn.run);

    return () => {
      window.removeEventListener("resize", debouncedFn.run);
    };
  });
}
