import React, { createContext, useCallback, useContext, useState } from "react";

interface LiveAnnouncerContextValue {
  announce: (message: string) => void;
}

const LiveAnnouncerContext = createContext<LiveAnnouncerContextValue>({
  announce: () => {},
});

export function LiveAnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");

  const announce = useCallback((nextMessage: string) => {
    setMessage("");
    window.setTimeout(() => {
      setMessage(nextMessage);
    }, 30);
  }, []);

  return (
    <LiveAnnouncerContext.Provider value={{ announce }}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </LiveAnnouncerContext.Provider>
  );
}

export function useLiveAnnouncer() {
  return useContext(LiveAnnouncerContext);
}
