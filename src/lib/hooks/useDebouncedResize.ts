import { useDebounce, useDebounceFn, useMount, useSize } from "ahooks";
import { DebounceOptions } from "ahooks/lib/useDebounce/debounceOptions";

export function useDebouncedOnResize(fn: (...args: unknown[]) => unknown, opts?: DebounceOptions & { initialRun: boolean}) {
  const debouncedFn = useDebounceFn(fn, opts || { wait: 300, trailing: true });

  useMount(() => {
    window.addEventListener("resize", debouncedFn.run);
    if(opts?.initialRun) debouncedFn.run();

    return () => {
      window.removeEventListener("resize", debouncedFn.run);
    };
  });
}

export function useDebouncedWindowSize(){
  const windowSize = useSize(typeof window === 'undefined' ? null : document.documentElement);
  const debouncedWindowSize = useDebounce(windowSize, { wait: 100, trailing: true});

  return debouncedWindowSize;
}
