import { useCallback, useEffect, useRef } from "react";

const useDebonce = (fn: Function, delay: number) => {
  const timeOutRef = useRef<undefined | NodeJS.Timeout>(undefined);

  useEffect(() => {
    return () => {
        if (timeOutRef.current) clearTimeout(timeOutRef.current)
    }
  }, [timeOutRef])

  const debouncedFn = useCallback(() => {
    if (!timeOutRef.current) {
      return (timeOutRef.current = setTimeout(() => {
        return fn();
      }, delay));
    } else {
      clearTimeout(timeOutRef.current);
      return (timeOutRef.current = setTimeout(() => {
        return fn();
      }));
    }
  }, [fn, delay, timeOutRef]);

  return debouncedFn
};

export default useDebonce;
