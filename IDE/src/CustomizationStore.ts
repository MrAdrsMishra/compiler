import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// SessionStorage helpers
const STORAGE_KEYS = {
  CODE: "editor_code",
  CODE_PREFIX: "editor_code_",
  INPUT: "editor_input",
  LANGUAGE: "editor_language",
  OPEN_LANGUAGES: "editor_open_languages",
  FULLSCREEN: "editor_fullscreen",
};

const saveToSession = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    console.warn("Failed to save to sessionStorage:", e);
  }
};

const removeFromSession = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.warn("Failed to remove from sessionStorage:", e);
  }
};

const loadFromSession = (key: string, fallback: string): string => {
  try {
    return sessionStorage.getItem(key) || fallback;
  } catch (e) {
    console.warn("Failed to load from sessionStorage:", e);
    return fallback;
  }
};

const saveJsonToSession = (key: string, value: string[]) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Failed to save JSON to sessionStorage:", e);
  }
};

const loadJsonFromSession = (key: string, fallback: string[]): string[] => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    console.warn("Failed to load JSON from sessionStorage:", e);
    return fallback;
  }
};

// LocalStorage helpers for fullscreen persistence
const loadFullscreenState = (): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FULLSCREEN);
    return raw === "true";
  } catch (e) {
    console.warn("Failed to load fullscreen state:", e);
    return false;
  }
};

const saveFullscreenState = (value: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FULLSCREEN, value.toString());
  } catch (e) {
    console.warn("Failed to save fullscreen state:", e);
  }
};

const getCodeStorageKey = (lang: string) => `${STORAGE_KEYS.CODE_PREFIX}${lang}`;

interface EditorState {
  selectedLanguage: string;
  openLanguages: string[];
  userCode: string;
  userInput: string;

  output: string;
  executionTime: string | null;
  memoryUsage: string | null;
  isRunning: boolean;
  theme: string;
  isFullscreen: boolean;
  setLanguage: (lang: string) => void;
  closeLanguage: (lang: string) => void;
  setTheme: (theme: string) => void;
  setCode: (code: string) => void;
  setUserInput: (input: string) => void;
  runCode: () => Promise<void>;
  toggleFullscreen: () => void;
}

const templates: Record<string, string> = {
  c: `#include <stdio.h>

int main() {
    printf("Hello World\n");
    return 0;
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,

  python: `print("Hello World")`,

  javascript: `console.log("Hello World")`,

  typescript: `console.log("Hello World")`,

  go: `package main

import "fmt"

func main() {
	fmt.Println("Hello World")
}`,

  rust: `fn main() {
    println!("Hello World");
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,

  csharp: `using System;

public class Program {
    public static void Main() {
        Console.WriteLine("Hello World");
    }
}`,

  php: `<?php
echo "Hello World\n";
?>`,

  ruby: `puts "Hello World"`,

  kotlin: `fun main() {
    println("Hello World")
}`,

  swift: `print("Hello World")`,

  r: `cat("Hello World\\n")`,

  bash: `echo "Hello World"`,

  // Keep golang alias for backward compatibility with older saved selections.
  golang: `package main

import "fmt"

func main() {
	fmt.Println("Hello World")
}`,
};

const useCustomizationStore = create<EditorState>((set, get) => {
  // Initialize with sessionStorage if available, otherwise use defaults
  const savedLanguage = loadFromSession(STORAGE_KEYS.LANGUAGE, "cpp");
  const normalizedLanguage = templates[savedLanguage] ? savedLanguage : "cpp";
  const perLanguageCodeKey = getCodeStorageKey(normalizedLanguage);
  const codeForSelectedLanguage = loadFromSession(
    perLanguageCodeKey,
    templates[normalizedLanguage] || templates["cpp"]
  );
  const legacyCode = loadFromSession(STORAGE_KEYS.CODE, "");
  if (!sessionStorage.getItem(perLanguageCodeKey) && legacyCode) {
    saveToSession(perLanguageCodeKey, legacyCode);
  }
  const savedCode = codeForSelectedLanguage || templates[normalizedLanguage] || templates["cpp"];
  const savedInput = loadFromSession(STORAGE_KEYS.INPUT, "");
  const savedOpenLanguages = loadJsonFromSession(STORAGE_KEYS.OPEN_LANGUAGES, [normalizedLanguage]);
  const openLanguages = Array.from(new Set([normalizedLanguage, ...savedOpenLanguages]));

  return {
    selectedLanguage: normalizedLanguage,
    openLanguages,
    userCode: savedCode,
    userInput: savedInput,
    output: "",
    executionTime: null,
    memoryUsage: null,
    isRunning: false,
    theme: "github",
    isFullscreen: loadFullscreenState(),
    setLanguage: (lang) => {
      const nextCode = loadFromSession(getCodeStorageKey(lang), templates[lang] || "");
      const currentOpenLanguages = get().openLanguages;
      const nextOpenLanguages = currentOpenLanguages.includes(lang)
        ? currentOpenLanguages
        : [...currentOpenLanguages, lang];

      saveToSession(STORAGE_KEYS.LANGUAGE, lang);
      saveJsonToSession(STORAGE_KEYS.OPEN_LANGUAGES, nextOpenLanguages);
      set({
        selectedLanguage: lang,
        openLanguages: nextOpenLanguages,
        userCode: nextCode,
      });
    },
    closeLanguage: (lang) => {
      const { selectedLanguage, openLanguages } = get();
      const nextOpenLanguages = openLanguages.filter((openLang) => openLang !== lang);

      removeFromSession(getCodeStorageKey(lang));

      if (nextOpenLanguages.length === 0) {
        const fallbackLanguage = "cpp";
        const fallbackCode = templates[fallbackLanguage] || "";

        saveToSession(STORAGE_KEYS.LANGUAGE, fallbackLanguage);
        saveJsonToSession(STORAGE_KEYS.OPEN_LANGUAGES, [fallbackLanguage]);

        set({
          selectedLanguage: fallbackLanguage,
          openLanguages: [fallbackLanguage],
          userCode: fallbackCode,
        });
        return;
      }

      saveJsonToSession(STORAGE_KEYS.OPEN_LANGUAGES, nextOpenLanguages);

      if (selectedLanguage === lang) {
        const fallbackLanguage = nextOpenLanguages[nextOpenLanguages.length - 1];
        const fallbackCode = loadFromSession(getCodeStorageKey(fallbackLanguage), templates[fallbackLanguage] || "");

        saveToSession(STORAGE_KEYS.LANGUAGE, fallbackLanguage);

        set({
          selectedLanguage: fallbackLanguage,
          openLanguages: nextOpenLanguages,
          userCode: fallbackCode,
        });
        return;
      }

      set({ openLanguages: nextOpenLanguages });
    },
    setTheme: (theme) => set({ theme }),
    setCode: (code) => {
      const { selectedLanguage, openLanguages } = get();
      saveToSession(getCodeStorageKey(selectedLanguage), code);

      if (!openLanguages.includes(selectedLanguage)) {
        const nextOpenLanguages = [...openLanguages, selectedLanguage];
        saveJsonToSession(STORAGE_KEYS.OPEN_LANGUAGES, nextOpenLanguages);
        set({ userCode: code, openLanguages: nextOpenLanguages });
        return;
      }

      set({ userCode: code });
    },

    setUserInput: (input) => {
      saveToSession(STORAGE_KEYS.INPUT, input);
      set({ userInput: input });
    },

    runCode: async () => {
      const { selectedLanguage, userCode, userInput } = get();

      set({ isRunning: true });

      try {
        const res = await api.post("/run-code", {
          selectedLanguage,
          userCode,
          userInput,
        });

        const data = res.data.data;

        set({
          output:
            data.stdout ||
            data.stderr ||
            data.compile_output ||
            "No Output",
          executionTime: data.time ?? null,
          memoryUsage: data.memory !== null && data.memory !== undefined ? `${data.memory} MB` : '0',
          isRunning: false,
        });
      } catch (err: any) {
        set({
          output:
            err?.response?.data?.message ||
            err?.message ||
            "Execution Failed",
          isRunning: false,
        });
      }
    },
    toggleFullscreen: () => {
      const currentState = get().isFullscreen;
      const newState = !currentState;
      saveFullscreenState(newState);
      set({ isFullscreen: newState });
    },
  };
});

export default useCustomizationStore;