import { useEffect, useState } from "hono/jsx";

export function useRouteQuery(name: string) {
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedParam = urlParams.get(name);
    if (selectedParam) {
      setValue(selectedParam);
    }
  }, []);

  return value;
}
