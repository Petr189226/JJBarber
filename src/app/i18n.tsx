import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type Lang = "cs" | "en";

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "cs",
  setLang: () => {},
  t: (key) => key,
});

// Load translations in a separate chunk so the main bundle stays smaller (shorter critical path).
const translationsPromise = import("./i18n-translations").then((m) => m.translations);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("cs");
  const [translations, setTranslations] = useState<Record<string, Record<Lang, string>> | null>(null);

  useEffect(() => {
    translationsPromise.then(setTranslations);
  }, []);

  const t = useCallback(
    (key: string): string => (translations ? (translations[key]?.[lang] ?? key) : key),
    [lang, translations],
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LangContext);
}
