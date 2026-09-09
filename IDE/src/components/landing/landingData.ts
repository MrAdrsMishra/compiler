export type Language = {
  name: string
  short: string
  description: string
}

export type Feature = {
  title: string
  description: string
}

export type AccessFlow = {
  step: number
  title: string
  description: string
}

export type Benefit = {
  title: string
  description: string
}

export type CodeSnippet = {
  id: string
  title: string
  language: string
  langKey: string
  code: string
  description: string
}

export type FAQItem = {
  question: string
  answer: string
}

export const languages: Language[] = [
  {
    name: "C",
    short: "C",
    description: "Core systems programming and data structures.",
  },
  {
    name: "C++",
    short: "C++",
    description: "Competitive programming and DSA practice.",
  },
  {
    name: "Java",
    short: "Java",
    description: "Backend, enterprise, and interview prep.",
  },
  {
    name: "Python",
    short: "Py",
    description: "Data science, automation, and scripts.",
  },
  {
    name: "JavaScript",
    short: "JS",
    description: "Web development and quick prototyping.",
  },
  {
    name: "Go",
    short: "Go",
    description: "Backend services and system tools.",
  },
  {
    name: "Rust",
    short: "Rs",
    description: "Safe and concurrent systems programming.",
  },
  {
    name: "TypeScript",
    short: "TS",
    description: "Typed JavaScript for scalable applications.",
  },
  {
    name: "C#",
    short: "C#",
    description: "Modern .NET language for apps and services.",
  },
  {
    name: "PHP",
    short: "PHP",
    description: "Server-side scripting for web backends.",
  },
  {
    name: "Ruby",
    short: "Rb",
    description: "Developer-friendly language for rapid apps.",
  },
  {
    name: "Kotlin",
    short: "Kt",
    description: "Concise JVM language for backend and Android.",
  },
  {
    name: "Swift",
    short: "Sw",
    description: "Fast, safe language for Apple ecosystems.",
  },
  {
    name: "R",
    short: "R",
    description: "Statistical computing and data analysis.",
  },
  {
    name: "Bash",
    short: "Sh",
    description: "Shell scripting for automation tasks.",
  },
]

export const provides: Feature[] = [
  {
    title: "Instant Code Execution",
    description: "Write code and run it immediately. No setup or installations.",
  },
  {
    title: "Professional IDE",
    description: "Monaco editor with syntax highlighting, themes, and full-featured workspace.",
  },
  {
    title: "Real Output & Metrics",
    description: "See results instantly with execution time and memory usage tracking.",
  },
]

export const features: Feature[] = [
  {
    title: "Unlimited Free Runs",
    description: "Compile and run your code as many times as you want. No daily limits.",
  },
  {
    title: "15 Compilers & Runtimes",
    description: "Top languages for interviews, backend, scripting, and data workflows in one IDE.",
  },
  {
    title: "Real-time Feedback",
    description: "Get instant stdout output and error diagnostics as you code.",
  },
  {
    title: "REST API Integration",
    description: "Integrate multi-language execution into your own web apps and educational tools.",
  },
  {
    title: "Mobile Friendly",
    description: "Responsive vertical layout adapts perfectly for phones and tablets.",
  },
  {
    title: "Customizable Themes",
    description: "Choose from Dracula, Monokai, VS Code Light, Solarized, and High Contrast.",
  },
]

export const accessFlow: AccessFlow[] = [
  {
    step: 1,
    title: "Open RunMe",
    description: "No account, credentials, or sign-up needed. Just launch your browser.",
  },
  {
    step: 2,
    title: "Select Language",
    description: "Pick from 15 options including C/C++, Java, Python, TypeScript, Go, Rust, and more.",
  },
  {
    step: 3,
    title: "Write Code",
    description: "Enjoy our Monaco editor with bracket matching, syntax highlighting, and themes.",
  },
  {
    step: 4,
    title: "Run & Benchmark",
    description: "Click 'Run Code' or press Ctrl+Enter. View output and execution time instantly.",
  },
  {
    step: 5,
    title: "Share & Build",
    description: "Test algorithms, prototype ideas, or hook up the REST API.",
  },
]

export const apiBenefits: Benefit[] = [
  {
    title: "High Concurrency",
    description: "Isolated worker threads handle multiple simultaneous code execution requests.",
  },
  {
    title: "REST Endpoints",
    description: "Clean JSON POST endpoints for submitting source code and stdin payloads.",
  },
  {
    title: "Strict Sandboxing",
    description: "Resource limits on memory, CPU time, and process creation prevent runaway code.",
  },
  {
    title: "Fast Execution SLA",
    description: "Optimized container pre-warming provides sub-500ms execution start times.",
  },
  {
    title: "Detailed Metrics",
    description: "Track precise memory consumption, wall time, and compiler exit status code.",
  },
  {
    title: "Zero Setup Overhead",
    description: "No infrastructure maintenance required for host servers or GCC/JVM compilers.",
  },
]

export const codeSnippets: CodeSnippet[] = [
  {
    id: "cpp",
    title: "C++ QuickSort Algorithm",
    language: "C++",
    langKey: "cpp",
    description: "High-speed divide-and-conquer sorting algorithm in C++20.",
    code: `#include <iostream>
#include <vector>

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }
        std::swap(arr[i + 1], arr[high]);
        int pi = i + 1;

        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    std::vector<int> data = {64, 34, 25, 12, 22, 11, 90};
    quickSort(data, 0, data.size() - 1);
    std::cout << "Sorted Array: ";
    for (int n : data) std::cout << n << " ";
    std::cout << "\\n";
    return 0;
}`,
  },
  {
    id: "python",
    title: "Python Data Processing",
    language: "Python",
    langKey: "python",
    description: "Functional mapping and list comprehension for data analysis.",
    code: `def analyze_scores(scores):
    passing = [s for s in scores if s >= 70]
    average = sum(passing) / len(passing) if passing else 0
    return {
        "total_students": len(scores),
        "passing_count": len(passing),
        "average_score": round(average, 2)
    }

scores = [88, 92, 54, 73, 95, 61, 100, 79]
result = analyze_scores(scores)
print("Analysis Results:")
for key, val in result.items():
    print(f" - {key}: {val}")`,
  },
  {
    id: "java",
    title: "Java Object-Oriented Design",
    language: "Java",
    langKey: "java",
    description: "Clean object creation, polymorphism, and stream filtering.",
    code: `import java.util.Arrays;
import java.util.List;

public class Main {
    static class Developer {
        String name;
        String language;
        Developer(String n, String l) { name = n; language = l; }
    }

    public static void main(String[] args) {
        List<Developer> devs = Arrays.asList(
            new Developer("Adarsh", "Java"),
            new Developer("Sarah", "Python"),
            new Developer("Alex", "C++")
        );

        devs.stream()
            .forEach(d -> System.out.println(d.name + " builds in " + d.language));
    }
}`,
  },
  {
    id: "go",
    title: "Go Concurrency & Channels",
    language: "Go",
    langKey: "go",
    description: "Lightweight goroutines and thread-safe channel communication.",
    code: `package main

import (
	"fmt"
	"time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
	for j := range jobs {
		fmt.Printf("Worker %d processing job %d\\n", id, j)
		time.Sleep(time.Millisecond * 50)
		results <- j * 2
	}
}

func main() {
	jobs := make(chan int, 5)
	results := make(chan int, 5)

	for w := 1; w <= 2; w++ {
		go worker(w, jobs, results)
	}

	for j := 1; j <= 5; j++ {
		jobs <- j
	}
	close(jobs)

	for a := 1; a <= 5; a++ {
		fmt.Printf("Result: %d\\n", <-results)
	}
}`,
  },
  {
    id: "javascript",
    title: "JavaScript Async Flow",
    language: "JavaScript",
    langKey: "javascript",
    description: "Asynchronous promise handling and clean ES6 syntax.",
    code: `const fetchUserData = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, username: "dev_coder", status: "Active" });
    }, 100);
  });
};

async function main() {
  console.log("Fetching user metrics...");
  const user = await fetchUserData(402);
  console.log("User Loaded:", JSON.stringify(user, null, 2));
}

main();`,
  },
]

export const faqs: FAQItem[] = [
  {
    question: "Is RunMe completely free to compile and run code?",
    answer: "Yes, RunMe is 100% free with unlimited browser code runs. There are no daily limits, paywalls, or mandatory sign-ups.",
  },
  {
    question: "Which programming languages and compilers are supported?",
    answer: "RunMe currently supports 15 popular languages including C (GCC), C++ (G++20), Java (OpenJDK), Python 3, JavaScript (Node.js), TypeScript, Go, Rust, C#, PHP, Ruby, Kotlin, Swift, R, and Bash shell scripts.",
  },
  {
    question: "How fast is code execution on RunMe?",
    answer: "Code compilation starts almost instantly (under 500ms). Our sandbox servers pre-warm container runtimes to provide immediate stdout output and execution wall-time metrics.",
  },
  {
    question: "Can I provide standard input (stdin) to interactive programs?",
    answer: "Yes! The IDE workspace includes a dedicated Stdin (Program Input) box where you can pass single or multi-line data before hitting 'Run Code'.",
  },
  {
    question: "Is my code secure when compiling online?",
    answer: "Yes, all source code executions run inside isolated, ephemeral sandbox containers with automatic memory, CPU time, and network security restrictions.",
  },
  {
    question: "Can I integrate the RunMe compiler engine into my own web app?",
    answer: "Yes, our REST API allows developers, coding bootcamps, and educational platforms to execute code remotely and fetch JSON output results.",
  },
]
