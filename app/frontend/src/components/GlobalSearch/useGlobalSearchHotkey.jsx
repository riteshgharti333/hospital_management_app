// src/components/GlobalSearch/useGlobalSearchHotkey.js
import { useEffect } from "react";

export default function useGlobalSearchHotkey(openSearch) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // CTRL + K  OR CMD + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch(); // this opens your search modal
      }

      // ESC to close
      if (e.key === "Escape") {
        openSearch(false); // close search if ESC pressed
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);
}
