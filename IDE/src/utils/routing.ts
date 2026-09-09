export interface LanguageRoute {
  key: string;
  slug: string;
  name: string;
  title: string;
  description: string;
}

export const LANGUAGE_ROUTES: Record<string, LanguageRoute> = {
  c: {
    key: "c",
    slug: "online_c_compiler",
    name: "C",
    title: "Online C Compiler - Write, Run & Debug C Code Online | RunMe",
    description: "Execute C programs online with GCC compiler. Practice pointers, memory allocation, and data structures with real-time stdout and metrics.",
  },
  cpp: {
    key: "cpp",
    slug: "online_cpp_compiler",
    name: "C++",
    title: "Online C++ Compiler - Run C++20 Code Online | RunMe",
    description: "Write and execute C++ programs online using G++20 compiler. Perfect for competitive programming, STL practice, and DSA problem solving.",
  },
  java: {
    key: "java",
    slug: "online_java_compiler",
    name: "Java",
    title: "Online Java Compiler - Run & Test Java Programs | RunMe",
    description: "Compile and execute Java code in browser with OpenJDK. Test OOP classes, streams, and algorithms with zero local SDK installation.",
  },
  python: {
    key: "python",
    slug: "online_python_compiler",
    name: "Python",
    title: "Online Python Compiler - Run Python 3 Code Online | RunMe",
    description: "Run Python 3 scripts online instantly. Test data structures, algorithms, math calculations, and string processing with instant stdout results.",
  },
  javascript: {
    key: "javascript",
    slug: "online_javascript_compiler",
    name: "JavaScript",
    title: "Online JavaScript Compiler - Execute JS Code Online | RunMe",
    description: "Run JavaScript code online with Node.js engine. Test async functions, ES6+ syntax, arrays, and algorithms in browser.",
  },
  typescript: {
    key: "typescript",
    slug: "online_typescript_compiler",
    name: "TypeScript",
    title: "Online TypeScript Compiler - Compile TS to JS Online | RunMe",
    description: "Write, type check, and execute TypeScript code online. Test interfaces, generics, and modern TS features in browser.",
  },
  go: {
    key: "go",
    slug: "online_go_compiler",
    name: "Go",
    title: "Online Go Compiler - Run Golang Code Online | RunMe",
    description: "Compile and run Golang programs online. Test goroutines, channels, structs, and Go standard library functions instantly.",
  },
  rust: {
    key: "rust",
    slug: "online_rust_compiler",
    name: "Rust",
    title: "Online Rust Compiler - Run Rust Code Online | RunMe",
    description: "Compile and execute Rust programs online with rustc. Test ownership, borrowing, structs, and safe systems code.",
  },
  csharp: {
    key: "csharp",
    slug: "online_csharp_compiler",
    name: "C#",
    title: "Online C# Compiler - Run .NET C# Code Online | RunMe",
    description: "Write and run C# programs online. Test LINQ queries, OOP classes, and .NET logic directly in your browser.",
  },
  php: {
    key: "php",
    slug: "online_php_compiler",
    name: "PHP",
    title: "Online PHP Compiler - Execute PHP Scripts Online | RunMe",
    description: "Run PHP scripts online. Test server-side functions, array transformations, and string handling instantly.",
  },
  ruby: {
    key: "ruby",
    slug: "online_ruby_compiler",
    name: "Ruby",
    title: "Online Ruby Compiler - Run Ruby Code Online | RunMe",
    description: "Execute Ruby code online instantly. Test blocks, classes, and rapid scripts with real-time stdout output.",
  },
  kotlin: {
    key: "kotlin",
    slug: "online_kotlin_compiler",
    name: "Kotlin",
    title: "Online Kotlin Compiler - Run Kotlin Code Online | RunMe",
    description: "Compile and run Kotlin code online. Test concise JVM syntax, data classes, and functional operations.",
  },
  swift: {
    key: "swift",
    slug: "online_swift_compiler",
    name: "Swift",
    title: "Online Swift Compiler - Run Swift Code Online | RunMe",
    description: "Execute Swift programs online. Test Apple ecosystem logic, optionals, and safe Swift algorithms.",
  },
  r: {
    key: "r",
    slug: "online_r_compiler",
    name: "R",
    title: "Online R Compiler - Run R Scripts Online | RunMe",
    description: "Execute R statistical code online. Perform data calculations, vectors, and data frame operations in browser.",
  },
  bash: {
    key: "bash",
    slug: "online_bash_compiler",
    name: "Bash",
    title: "Online Bash Compiler - Run Shell Scripts Online | RunMe",
    description: "Run Bash shell scripts online. Test command pipe workflows, loops, and automation scripts.",
  },
};

/**
 * Get language key from path or slug string
 * Examples:
 *  "online_c_compiler" -> "c"
 *  "online_python_compiler" -> "python"
 *  "online-cpp-compiler" -> "cpp"
 *  "online_c++_compiler" -> "cpp"
 */
export function getLanguageKeyFromSlug(pathOrSlug: string): string | null {
  const normalized = pathOrSlug.trim().toLowerCase().replace(/^\/|\/$/g, "");
  if (!normalized) return null;

  for (const [key, route] of Object.entries(LANGUAGE_ROUTES)) {
    if (
      normalized === route.slug ||
      normalized === route.slug.replace(/_/g, "-") ||
      normalized === `online_${key}_compiler` ||
      normalized === `online-${key}-compiler` ||
      normalized === `online_${key === 'cpp' ? 'c++' : key}_compiler` ||
      normalized === key
    ) {
      return key;
    }
  }

  return null;
}

/**
 * Get slug for a given language key
 */
export function getSlugForLanguage(langKey: string): string {
  const route = LANGUAGE_ROUTES[langKey.toLowerCase()];
  return route ? route.slug : `online_${langKey}_compiler`;
}
