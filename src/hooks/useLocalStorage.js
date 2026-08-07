import { useCallback, useEffect, useRef, useState } from "react";
import { createSnapshot } from "../utils/dataProtection";

const WRITE_DELAY_MS = 140;

function readStoredValue(key, initialValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setStateValue] = useState(() => readStoredValue(key, initialValue));
  const latestValueRef = useRef(value);
  const writeTimerRef = useRef(null);

  const persist = useCallback((nextValue = latestValueRef.current) => {
    try {
      localStorage.setItem(key, JSON.stringify(nextValue));
      return true;
    } catch {
      window.ftosToast?.("Could not save app data", "warning");
      return false;
    }
  }, [key]);

  const setValue = useCallback((nextValue) => {
    setStateValue((currentValue) => {
      const resolvedValue = typeof nextValue === "function" ? nextValue(currentValue) : nextValue;
      if (Object.is(resolvedValue, currentValue)) return currentValue;
      createSnapshot(`Safe save: ${key}`);
      latestValueRef.current = resolvedValue;
      return resolvedValue;
    });
  }, [key]);

  useEffect(() => {
    latestValueRef.current = value;
    window.clearTimeout(writeTimerRef.current);

    const schedule = window.requestIdleCallback
      ? (callback) => window.requestIdleCallback(callback, { timeout: 500 })
      : (callback) => window.setTimeout(callback, WRITE_DELAY_MS);
    const cancel = window.cancelIdleCallback
      ? (handle) => window.cancelIdleCallback(handle)
      : (handle) => window.clearTimeout(handle);

    writeTimerRef.current = schedule(() => persist(value));
    return () => cancel(writeTimerRef.current);
  }, [persist, value]);

  useEffect(() => {
    const flush = () => persist();
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearTimeout(writeTimerRef.current);
      flush();
    };
  }, [persist]);

  return [value, setValue];
}
