import { useState, useEffect, useRef } from "react";
import { searchGpus } from "../api/gpuApi";

export function useSearch(delay = 300) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ gpus: [], cloud: [], systems: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ gpus: [], cloud: [], systems: [], total: 0 });
      return;
    }

    setLoading(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchGpus(query);
        setResults(data);
      } catch {
        setResults({ gpus: [], cloud: [], systems: [], total: 0 });
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, delay]);

  return { query, setQuery, results, loading };
}
