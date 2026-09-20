"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./translations/en.json";
import hi from "./translations/hi.json";
import ta from "./translations/ta.json";
import ml from "./translations/ml.json";

type Translations = Record<string, string>;

const dictionaries: Record<string, Translations> = {
  en,
  hi,
  ta,
  ml,
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = "orca_language_preference";

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      if (savedLang && dictionaries[savedLang]) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const currentDict = dictionaries[language] || dictionaries.en;
    return currentDict[key] || dictionaries.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
