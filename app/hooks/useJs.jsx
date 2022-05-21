import { useEffect, useState } from "react";

export default function useJs() {
  const [js, setJs] = useState(false);
  useEffect(() => {
    setJs(true);
  }, []);
  return js;
}
