import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || `http://localhost/v1/practice`,
});

interface EditorState {
  selectedLanguage: string;
  userCode: string;
  userInput: string;

  output: string;
  isRunning: boolean;

  setLanguage: (lang: string) => void;
  setCode: (code: string) => void;
  setUserInput: (input: string) => void;

  runCode: () => Promise<void>;
}

const templates: Record<string, string> = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`,

  python: `print("Hello World")`,

  javascript: `console.log("Hello World")`,
};

const editorStore = create<EditorState>((set, get) => ({
  selectedLanguage: "cpp",
  userCode: templates["cpp"],
  userInput: "",
  output: "",
  isRunning: false,

  setLanguage: (lang) =>
    set({
      selectedLanguage: lang,
      userCode: templates[lang] || "",
    }),

  setCode: (code) => set({ userCode: code }),

  setUserInput: (input) => set({ userInput: input }),

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
}));

export default editorStore;