import { useState, useEffect } from "react";

export const useTypeWriter = (text, speed) => {
  const [displayed, setDisplayed] = useState(text[0] || "");
  const [cursor, setCursor] = useState("|");

  useEffect(() => {
    if (text.length < 2) return setDisplayed(text);

    let i = 0;
    const interval = setInterval(() => {
      i++;

      if (i >= text.length) {
        clearInterval(interval);
        setCursor("");
        return;
      }

      setDisplayed((prev) => prev + text[i]);
      setCursor(i % 2 === 0 ? "|" : "");
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed + cursor;
};
